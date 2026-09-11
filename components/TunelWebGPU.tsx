"use client";

import * as React from "react";
import { useTheme } from "next-themes";

const CONFIG = {
  loop: 10, // segundos por ciclo
  turn: 90, // grados de giro por ciclo (se ajusta al sector más cercano)
  zoom: 0.3, // 0 = sin zoom · 0.30 = se acerca un 30 % de la distancia
  rings: 26, // anillos concéntricos
  merid: 48, // líneas radiales
  depth: 1.15, // profundidad del embudo
  camHeight: 3.0, // altura de la cámara sobre el plano
  weight: 1.15, // grosor de línea en píxeles CSS
  vignette: true, // degradados arriba y abajo
  mobileScale: 0.7, // densidad de malla bajo 700 px de ancho
  maxDPR: 2,
};

/* Constantes de forma: la garganta, el borde y el encuadre.
   Salieron de calzar la malla contra el SVG original. */
const RS = 1.25,
  RMAX = 11,
  EXPO = 1.5;
const CAMD = 11.0,
  TARGET_Y = -2.9,
  HFOV = 42,
  REF_ASPECT = 16 / 9;
const SEG_RING = 200,
  SEG_MER = 90;

type RGB = [number, number, number];
type Palette = { line: RGB; vignette: RGB };

// El degradado tira hacia el fondo de la página, no siempre a negro.
const DARK: Palette = { line: [0.914, 0.922, 0.937], vignette: [0, 0, 0] };
const LIGHT: Palette = { line: [0.055, 0.055, 0.055], vignette: [1, 1, 1] };

/* ---------- uniforms ----------
   Un solo búfer compartido por ambos pipelines. Los desplazamientos
   siguen las reglas de alineación de WGSL (vec3 alinea a 16). */
const U_VIEW = 0, // mat4x4  →  bytes   0
  U_PROJ = 16, //   mat4x4  →  bytes  64
  U_LINE = 32, //   vec3    →  bytes 128
  U_HALF = 35, //   f32     →  bytes 140
  U_VIG = 36, //    vec3    →  bytes 144
  U_NEAR = 39, //   f32     →  bytes 156
  U_VIEWPORT = 40, // vec2  →  bytes 160
  U_FAR = 42, //    f32     →  bytes 168
  U_FLOATS = 44; //           bytes 176 (múltiplo de 16)

const SHADER = /* wgsl */ `
struct Uniforms {
  view     : mat4x4<f32>,
  proj     : mat4x4<f32>,
  line     : vec3<f32>,
  halfPx   : f32,          // medio grosor en px de dispositivo
  vignette : vec3<f32>,
  near     : f32,          // rango del desvanecido por profundidad
  viewport : vec2<f32>,    // en píxeles de dispositivo
  far      : f32,
  pad      : f32,
};
@group(0) @binding(0) var<uniform> U : Uniforms;

struct LineOut {
  @builtin(position) pos : vec4<f32>,
  @location(0) side   : f32,   // distancia con signo al eje de la línea, en px
  @location(1) halfPx : f32,
  @location(2) fade   : f32,
};

@vertex
fn vsLine(
  @location(0) aA : vec3<f32>,      // extremo A del segmento (por instancia)
  @location(1) aB : vec3<f32>,      // extremo B del segmento (por instancia)
  @location(2) corner : vec2<f32>,  // x: 0=A 1=B · y: lado -1/+1
) -> LineOut {
  var out : LineOut;
  // Fuera del volumen de vista: el segmento se descarta al recortar.
  out.pos = vec4<f32>(0.0, 0.0, -2.0, 1.0);
  out.side = 0.0;
  out.halfPx = 0.0;
  out.fade = 0.0;

  let va = U.view * vec4<f32>(aA, 1.0);
  let vb = U.view * vec4<f32>(aB, 1.0);
  let za = -va.z;
  let zb = -vb.z;
  if (za < 0.08 || zb < 0.08) {     // segmento detrás de la cámara
    return out;
  }

  let ca = U.proj * va;
  let cb = U.proj * vb;
  let halfVp = U.viewport * 0.5;
  let sa = ca.xy / ca.w * halfVp;
  let sb = cb.xy / cb.w * halfVp;

  let d = sb - sa;
  let len = length(d);
  var nrm = vec2<f32>(0.0, 0.0);
  if (len > 1e-5) {
    nrm = vec2<f32>(-d.y, d.x) / len;
  }

  let t = clamp((mix(za, zb, corner.x) - U.near) / (U.far - U.near), 0.0, 1.0);
  let core = U.halfPx * (1.0 - 0.35 * t);   // las líneas lejanas adelgazan
  let grown = core + 1.0;                   // margen de 1 px para el suavizado

  let clip = mix(ca, cb, corner.x);
  let off = (nrm * corner.y * grown) / halfVp * clip.w;

  out.pos = vec4<f32>(clip.xy + off, clip.z, clip.w);
  out.side = corner.y * grown;
  out.halfPx = core;
  out.fade = 1.0 - 0.80 * t;
  return out;
}

@fragment
fn fsLine(f : LineOut) -> @location(0) vec4<f32> {
  let cov = clamp(f.halfPx - abs(f.side) + 0.5, 0.0, 1.0);  // antialiasing analítico
  let a = f.fade * cov;
  if (a <= 0.002) {
    discard;
  }
  return vec4<f32>(U.line * a, a);                            // alfa premultiplicado
}

@vertex
fn vsVignette(@builtin(vertex_index) i : u32) -> @builtin(position) vec4<f32> {
  let p = vec2<f32>(f32((i << 1u) & 2u), f32(i & 2u));
  return vec4<f32>(p * 2.0 - 1.0, 0.0, 1.0);
}

@fragment
fn fsVignette(@builtin(position) pos : vec4<f32>) -> @location(0) vec4<f32> {
  // Ojo: aquí el origen está arriba-izquierda, no abajo como en GLSL.
  let yTop = pos.y / U.viewport.y;
  let yBot = 1.0 - yTop;
  let a = max(pow(clamp((0.34 - yTop) / 0.34, 0.0, 1.0), 0.75),
              pow(clamp((0.42 - yBot) / 0.42, 0.0, 1.0), 0.75));
  return vec4<f32>(U.vignette * a, a);
}
`;

/* ---------- geometría: paraboloide de Flamm ----------
   Ya no depende del contexto gráfico, así que vive fuera del efecto. */
const buildSegments = (rings: number, merid: number) => {
  const zed = (r: number) => CONFIG.depth * Math.sqrt(RS * Math.max(r - RS, 0));
  const zmax = zed(RMAX);
  const radius = (u: number) => RS + (RMAX - RS) * Math.pow(u, EXPO);

  const count = (rings + 1) * SEG_RING + merid * SEG_MER;
  const data = new Float32Array(count * 6);
  let o = 0;
  const put = (
    ax: number, ay: number, az: number,
    bx: number, by: number, bz: number
  ) => {
    data[o++] = ax; data[o++] = ay; data[o++] = az;
    data[o++] = bx; data[o++] = by; data[o++] = bz;
  };

  for (let i = 0; i <= rings; i += 1) {
    const r = radius(i / rings),
      y = zed(r) - zmax;
    for (let k = 0; k < SEG_RING; k += 1) {
      const t0 = (2 * Math.PI * k) / SEG_RING,
        t1 = (2 * Math.PI * (k + 1)) / SEG_RING;
      put(
        r * Math.cos(t0), y, r * Math.sin(t0),
        r * Math.cos(t1), y, r * Math.sin(t1)
      );
    }
  }
  for (let m = 0; m < merid; m += 1) {
    const t = (2 * Math.PI * m) / merid,
      ct = Math.cos(t),
      st = Math.sin(t);
    for (let k = 0; k < SEG_MER; k += 1) {
      const r0 = radius(k / SEG_MER),
        r1 = radius((k + 1) / SEG_MER);
      put(
        r0 * ct, zed(r0) - zmax, r0 * st,
        r1 * ct, zed(r1) - zmax, r1 * st
      );
    }
  }

  return { data, count };
};

/* El dispositivo y todo lo que cuelga de él. Se rehace entero si la
   GPU se pierde, por eso va agrupado. */
type Session = {
  device: GPUDevice;
  context: GPUCanvasContext;
  linePipe: GPURenderPipeline;
  vigPipe: GPURenderPipeline;
  bind: GPUBindGroup;
  uniform: GPUBuffer;
  corner: GPUBuffer;
  seg: GPUBuffer;
  segCount: number;
};

export default function TunelWebGPU({
  className = "",
}: {
  className?: string;
}): React.JSX.Element {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const paletteRef = React.useRef<Palette>(DARK);
  const redrawRef = React.useRef<(() => void) | null>(null);
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    paletteRef.current = resolvedTheme === "light" ? LIGHT : DARK;
    // Repinta por si el bucle está detenido (fuera de vista o reduced-motion).
    redrawRef.current?.();
  }, [resolvedTheme]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let session: Session | null = null;
    let disposed = false;
    let restarts = 0;

    /* ---------- matrices ---------- */
    const view = new Float32Array(16),
      proj = new Float32Array(16);
    const uni = new Float32Array(U_FLOATS);

    const setProjection = (w: number, h: number) => {
      const aspect = w / h;
      const vTan =
        Math.tan((HFOV * Math.PI) / 360) / Math.min(aspect, REF_ASPECT);
      const f = 1 / vTan,
        near = 0.05,
        far = 200;
      proj.fill(0);
      proj[0] = f / aspect;
      proj[5] = f;
      // z de 0 a 1: es lo que espera WebGPU (WebGL usaba -1 a 1).
      proj[10] = far / (near - far);
      proj[11] = -1;
      proj[14] = (far * near) / (near - far);
    };

    const setView = (angle: number, k: number) => {
      // la cámara orbita el eje y se acerca al objetivo; girar la cámara ==
      // girar la malla
      const ox = CAMD * Math.sin(angle),
        oy = CONFIG.camHeight - TARGET_Y,
        oz = CAMD * Math.cos(angle);
      const px = ox * k,
        py = TARGET_Y + oy * k,
        pz = oz * k;

      let fx = -px,
        fy = TARGET_Y - py,
        fz = -pz;
      let n = Math.hypot(fx, fy, fz);
      fx /= n; fy /= n; fz /= n;
      let rx = -fz,
        ry = 0,
        rz = fx;
      n = Math.hypot(rx, ry, rz);
      rx /= n; ry /= n; rz /= n;
      const ux = ry * fz - rz * fy,
        uy = rz * fx - rx * fz,
        uz = rx * fy - ry * fx;

      view[0] = rx; view[4] = ry; view[8] = rz;
      view[12] = -(rx * px + ry * py + rz * pz);
      view[1] = ux; view[5] = uy; view[9] = uz;
      view[13] = -(ux * px + uy * py + uz * pz);
      view[2] = -fx; view[6] = -fy; view[10] = -fz;
      view[14] = fx * px + fy * py + fz * pz;
      view[3] = 0; view[7] = 0; view[11] = 0; view[15] = 1;

      return Math.hypot(px, py - TARGET_Y, pz); // distancia al objetivo
    };

    /* ---------- densidad de malla ---------- */
    const density = { rings: CONFIG.rings, merid: CONFIG.merid };

    const resolveDensity = () => {
      const small = canvas.clientWidth < 700;
      const k = small ? CONFIG.mobileScale : 1;
      // los meridianos se redondean a múltiplo de 4 para que 90° siga cayendo
      // en un sector exacto
      density.rings = Math.max(8, Math.round(CONFIG.rings * k));
      density.merid = Math.max(12, Math.round((CONFIG.merid * k) / 4) * 4);
    };

    const uploadGeometry = (s: Session) => {
      const { data, count } = buildSegments(density.rings, density.merid);
      if (data.byteLength !== s.seg.size) {
        // el tamaño manda: en WebGPU el búfer es inmutable, se rehace
        s.seg.destroy();
        s.seg = s.device.createBuffer({
          size: data.byteLength,
          usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });
      }
      s.device.queue.writeBuffer(s.seg, 0, data);
      s.segCount = count;
    };

    /* ---------- tamaño ---------- */
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxDPR);
      const cap = session?.device.limits.maxTextureDimension2D ?? 4096;
      const w = Math.min(cap, Math.max(1, Math.round(canvas.clientWidth * dpr)));
      const h = Math.min(cap, Math.max(1, Math.round(canvas.clientHeight * dpr)));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      setProjection(w, h);

      const merid = density.merid,
        rings = density.rings;
      resolveDensity();
      if (session && (density.merid !== merid || density.rings !== rings))
        uploadGeometry(session);
    };

    /* ---------- cuadro ---------- */
    const render = (phase: number) => {
      const s = session;
      if (!s || !canvas.width || !canvas.height) return;

      // el giro se ajusta al múltiplo de sector más cercano: así el ciclo
      // empalma exacto
      const sector = 360 / density.merid;
      const turn = Math.round(CONFIG.turn / sector) * sector;
      const angle = ((turn * Math.PI) / 180) * phase;
      const k = 1 - CONFIG.zoom * 0.5 * (1 - Math.cos(2 * Math.PI * phase));

      const dist = setView(angle, k);
      const palette = paletteRef.current;

      uni.set(view, U_VIEW);
      uni.set(proj, U_PROJ);
      uni.set(palette.line, U_LINE);
      uni[U_HALF] = CONFIG.weight * dpr * 0.5;
      uni.set(palette.vignette, U_VIG);
      uni[U_NEAR] = dist * 0.3;
      uni[U_VIEWPORT] = canvas.width;
      uni[U_VIEWPORT + 1] = canvas.height;
      uni[U_FAR] = dist * 2.25;
      s.device.queue.writeBuffer(s.uniform, 0, uni);

      const encoder = s.device.createCommandEncoder();
      const pass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: s.context.getCurrentTexture().createView(),
            // transparente: compone sobre el fondo del tema
            clearValue: { r: 0, g: 0, b: 0, a: 0 },
            loadOp: "clear",
            storeOp: "store",
          },
        ],
      });
      pass.setPipeline(s.linePipe);
      pass.setBindGroup(0, s.bind);
      pass.setVertexBuffer(0, s.seg);
      pass.setVertexBuffer(1, s.corner);
      pass.draw(4, s.segCount);

      if (CONFIG.vignette) {
        pass.setPipeline(s.vigPipe);
        pass.draw(3);
      }
      pass.end();
      s.device.queue.submit([encoder.finish()]);
    };

    /* ---------- reloj y ahorro de energía ---------- */
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let phase = 0,
      last = 0,
      raf = 0,
      onScreen = true;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      phase = (phase + dt / CONFIG.loop) % 1;
      render(phase);
    };

    const start = () => {
      if (raf || reduced.matches || !session) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const shouldRun = () => onScreen && !document.hidden && !reduced.matches;
    const sync = () => (shouldRun() ? start() : stop());

    /* ---------- arranque ---------- */
    const boot = async () => {
      const adapter = await navigator.gpu?.requestAdapter({
        powerPreference: "high-performance",
      });
      const device = await adapter?.requestDevice();
      const context = canvas.getContext("webgpu");
      if (!device || !context) {
        return;
      }
      if (disposed) {
        device.destroy();
        return;
      }

      const format = navigator.gpu.getPreferredCanvasFormat();
      context.configure({ device, format, alphaMode: "premultiplied" });

      const shaders = device.createShaderModule({ code: SHADER });
      const layout = device.createBindGroupLayout({
        entries: [
          {
            binding: 0,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: { type: "uniform" },
          },
        ],
      });
      const pipeLayout = device.createPipelineLayout({
        bindGroupLayouts: [layout],
      });
      // alfa premultiplicado, igual que blendFunc(ONE, ONE_MINUS_SRC_ALPHA)
      const blend: GPUBlendState = {
        color: { srcFactor: "one", dstFactor: "one-minus-src-alpha" },
        alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha" },
      };

      const linePipe = device.createRenderPipeline({
        layout: pipeLayout,
        vertex: {
          module: shaders,
          entryPoint: "vsLine",
          buffers: [
            {
              arrayStride: 24,
              stepMode: "instance",
              attributes: [
                { shaderLocation: 0, offset: 0, format: "float32x3" },
                { shaderLocation: 1, offset: 12, format: "float32x3" },
              ],
            },
            {
              arrayStride: 8,
              stepMode: "vertex",
              attributes: [
                { shaderLocation: 2, offset: 0, format: "float32x2" },
              ],
            },
          ],
        },
        fragment: {
          module: shaders,
          entryPoint: "fsLine",
          targets: [{ format, blend }],
        },
        primitive: { topology: "triangle-strip" },
      });

      const vigPipe = device.createRenderPipeline({
        layout: pipeLayout,
        vertex: { module: shaders, entryPoint: "vsVignette" },
        fragment: {
          module: shaders,
          entryPoint: "fsVignette",
          targets: [{ format, blend }],
        },
        primitive: { topology: "triangle-list" },
      });

      const uniform = device.createBuffer({
        size: uni.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      const corner = device.createBuffer({
        size: 32,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      });
      device.queue.writeBuffer(
        corner,
        0,
        new Float32Array([0, -1, 0, 1, 1, -1, 1, 1])
      );
      const bind = device.createBindGroup({
        layout,
        entries: [{ binding: 0, resource: { buffer: uniform } }],
      });

      session = {
        device,
        context,
        linePipe,
        vigPipe,
        bind,
        uniform,
        corner,
        seg: device.createBuffer({
          size: 4,
          usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        }),
        segCount: 0,
      };

      /* la pérdida del dispositivo es normal al dormir el equipo o cambiar de
         GPU; se rehace todo */
      device.lost.then((info) => {
        if (disposed || info.reason === "destroyed") return;
        stop();
        session = null;
        if (restarts++ < 2) void boot();
      });

      resolveDensity();
      uploadGeometry(session);
      canvas.width = 0; // fuerza que el primer resize() aplique tamaño
      resize();

      render(phase); // primer cuadro antes de mostrar: nada de destello
      requestAnimationFrame(() => canvas.classList.add("opacity-100"));
      sync();
    };

    /* no gastar GPU si el fondo no está a la vista */
    const io = new IntersectionObserver(
      (e) => {
        onScreen = e[0].isIntersecting;
        sync();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    // El lienzo lo dimensiona su contenedor, no la ventana.
    const ro = new ResizeObserver(() => {
      resize();
      if (!raf) render(phase);
    });
    ro.observe(canvas);

    const onReduced = () => {
      stop();
      render(phase);
      sync();
    };

    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", onReduced);

    void boot();

    // Permite repintar el cuadro estático desde el efecto del tema.
    redrawRef.current = () => render(phase);

    return () => {
      disposed = true;
      redrawRef.current = null;
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", onReduced);
      // destroy() libera búferes y pipelines de una vez
      session?.context.unconfigure();
      session?.device.destroy();
      session = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block h-full w-full opacity-0 transition-opacity duration-700 ease-out ${className}`}
    />
  );
}
