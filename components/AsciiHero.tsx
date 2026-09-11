"use client";

import * as React from "react";

const RAMP = "0123456789ABCDEF";
const LOGO_SRC = "/assets/logos/logo-zstral.svg";

const CELL_H = 12;
const FRAME_MS = 1000 / 24;
const FLOOR = 0.15;
const GRAIN = 0.04;
const GLOW_EASE = 0.16;

function measureCellWidth(sample: HTMLElement): number {
  const probe = document.createElement("span");
  probe.textContent = "0".repeat(50);
  probe.style.cssText = "position:absolute;visibility:hidden;white-space:pre;";
  sample.appendChild(probe);
  const width = probe.getBoundingClientRect().width / 50;
  probe.remove();
  return width;
}

export default function AsciiHero(): React.JSX.Element {
  const sectionRef = React.useRef<HTMLElement>(null);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const grainRef = React.useRef<HTMLPreElement>(null);
  const paintRef = React.useRef<HTMLPreElement>(null);
  const glowRef = React.useRef<HTMLPreElement>(null);

  React.useEffect(() => {
    const wrap = wrapRef.current;
    const grain = grainRef.current;
    const paint = paintRef.current;
    const glow = glowRef.current;
    if (!wrap || !grain || !paint || !glow) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cellW = 7.2;
    let cols = 0;
    let rows = 0;
    let placed = { x: 0, y: 0, w: 0, h: 0 };
    let ready = false;

    const img = new Image();

    const layout = () => {
      const { width, height } = wrap.getBoundingClientRect();
      if (!width || !height) return;

      cols = Math.max(1, Math.ceil(width / cellW));
      rows = Math.max(1, Math.ceil(height / CELL_H));
      canvas.width = cols;
      canvas.height = rows;

      const natW = img.naturalWidth || 118;
      const natH = img.naturalHeight || 25;
      const targetW = Math.min(width * 0.78, 850);
      const scale = targetW / natW;
      const w = natW * scale;
      const h = natH * scale;

      placed = {
        x: Math.max(10, (width - w) * 0.68),
        y: Math.max(40, (height - h) * 0.32),
        w,
        h,
      };

      paint.style.backgroundSize = `${w}px ${h}px`;
      paint.style.backgroundPosition = `${placed.x}px ${placed.y}px`;
    };

    img.onload = () => {
      ready = true;
      layout();
    };
    img.src = LOGO_SRC;

    let frame = 0;
    let last = 0;
    let raf = 0;

    const render = (time: number) => {
      raf = requestAnimationFrame(render);
      if (time - last < FRAME_MS) return;
      last = time;
      if (!cols || !rows) return;

      frame += 1;

      ctx.clearRect(0, 0, cols, rows);
      if (ready) {
        ctx.drawImage(
          img,
          placed.x / cellW,
          placed.y / CELL_H,
          placed.w / cellW,
          placed.h / CELL_H
        );
      }

      const data = ctx.getImageData(0, 0, cols, rows).data;
      const seed = reduced ? 0 : frame;
      const sweepY = reduced ? -1e4 : ((frame * 0.8) % (rows + 120)) - 60;

      let out = "";
      for (let y = 0; y < rows; y += 1) {
        const sweep = Math.exp(-((y - sweepY) ** 2) / 300) * 0.08;
        for (let x = 0; x < cols; x += 1) {
          const i = (y * cols + x) * 4;
          const alpha = data[i + 3] / 255;
          const lum =
            ((data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) /
              255) *
            alpha;

          let h = (x * 374761393 + y * 668265263 + seed * 1274126177) | 0;
          h = Math.imul(h ^ (h >>> 13), 1274126177);
          const noise =
            (((h ^ (h >>> 16)) >>> 0) / 4294967295 - 0.5) * GRAIN * 2;

          const v = FLOOR + (1 - FLOOR) * lum + noise + sweep;
          const idx = Math.round(v * 15);
          out += RAMP[idx < 0 ? 0 : idx > 15 ? 15 : idx];
        }
        out += "\n";
      }

      grain.textContent = out;
      paint.textContent = out;
      glow.textContent = out;

      if (reduced) cancelAnimationFrame(raf);
    };

    const observer = new ResizeObserver(layout);
    observer.observe(wrap);

    const start = () => {
      cellW = measureCellWidth(grain) || cellW;
      layout();
      raf = requestAnimationFrame(render);
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(start);
    } else {
      start();
    }

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      img.onload = null;
    };
  }, []);

  React.useEffect(() => {
    const section = sectionRef.current;
    const wrap = wrapRef.current;
    if (!section || !wrap) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let raf = 0;

    const write = () => {
      wrap.style.setProperty("--glow-x", `${current.x}px`);
      wrap.style.setProperty("--glow-y", `${current.y}px`);
    };

    const tick = () => {
      current.x += (target.x - current.x) * GLOW_EASE;
      current.y += (target.y - current.y) * GLOW_EASE;
      write();
      raf = requestAnimationFrame(tick);
    };

    const track = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      target.x = event.clientX - rect.left;
      target.y = event.clientY - rect.top;
    };

    const enter = (event: PointerEvent) => {
      track(event);
      current.x = target.x;
      current.y = target.y;
      write();
      wrap.style.setProperty("--glow-o", "1");
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const leave = () => {
      wrap.style.setProperty("--glow-o", "0");
      cancelAnimationFrame(raf);
      raf = 0;
    };

    section.addEventListener("pointerenter", enter);
    section.addEventListener("pointermove", track);
    section.addEventListener("pointerleave", leave);

    return () => {
      section.removeEventListener("pointerenter", enter);
      section.removeEventListener("pointermove", track);
      section.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex h-[100svh] w-full items-end overflow-hidden px-0"
    >
      <div
        ref={wrapRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 isolate select-none light:invert"
      >
        <pre ref={grainRef} className="ascii-layer ascii-grain absolute inset-0" />
        <pre
          ref={paintRef}
          className="ascii-layer ascii-paint absolute inset-0"
          style={{ backgroundImage: `url(${LOGO_SRC})` }}
        />
        <pre ref={glowRef} className="ascii-layer ascii-glow absolute inset-0" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/70 to-transparent" />

      <div className="relative z-10 w-full px-10 pb-44 md:px-20 md:pb-32">
        <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.28em] text-[#00FF90]">
          Rafael Fernández
        </p>
        <h1 className="mt-4 max-w-4xl text-3xl md:text-6xl font-extralight leading-[1.08] tracking-tight">
          Construyendo software integral, eficiente y escalable
        </h1>
        <p className="mt-6 max-w-lg text-sm md:text-base font-light text-[#929292]">
          Analista Programador | Desarrollador Fullstack.
        </p>
      </div>
    </section>
  );
}

