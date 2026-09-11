"use client";

import * as React from "react";

export interface AdaptiveBackdropOptions {
  /** Opacidad del fondo en modo oscuro estándar (0.0 a 1.0). Default: 0.45 */
  darkOpacity?: number;
  /** Opacidad del fondo translúcido en modo claro / fondos blancos (0.0 a 1.0). Default: 0.80 */
  lightOpacity?: number;
  /** Intensidad del tinte cromático / hue sutil (0.0 a 1.0). Default: 0.25 */
  hueIntensity?: number;
  /** Umbral de luminancia a partir del cual se considera fondo brillante (0.0 a 1.0). Default: 0.5 */
  brightnessThreshold?: number;
  /** Desenfoque base en px. Default: 16 */
  baseBlur?: number;
  /** Número de puntos de muestreo a lo largo del ancho del elemento. Default: 5 */
  samplePointsCount?: number;
}

export interface RgbColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface AdaptiveBackdropState {
  /** Nivel de luminancia promedio detectado debajo del componente (0.0 = negro, 1.0 = blanco puro) */
  luminance: number;
  /** Booleano que indica si el fondo sobrepasó el umbral de brillo */
  isBright: boolean;
  /** Booleano que indica si el entorno está en modo claro global */
  isLightMode: boolean;
  /** Color cromático promedio detectado debajo */
  dominantColor: RgbColor;
  /** Array de colores detectados por punto de muestreo */
  sampledColors: RgbColor[];
  /** Estilos CSS en línea listos para aplicar a cualquier contenedor */
  style: React.CSSProperties;
}

/**
 * Parsea cadenas de color CSS (rgb, rgba, hex, named) a formato RGBA normalizado.
 */
function parseCssColorToRgba(colorStr: string): RgbColor | null {
  if (!colorStr || colorStr === "transparent" || colorStr === "inherit") return null;

  // Formato rgb / rgba
  const rgbMatch = colorStr.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/
  );
  if (rgbMatch) {
    return {
      r: Math.round(parseFloat(rgbMatch[1])),
      g: Math.round(parseFloat(rgbMatch[2])),
      b: Math.round(parseFloat(rgbMatch[3])),
      a: rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1,
    };
  }

  // Formato Hex #RGB o #RRGGBB o #RRGGBBAA
  if (colorStr.startsWith("#")) {
    let hex = colorStr.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex.split("").map((c) => c + c).join("");
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a = hex.length >= 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
      return { r, g, b, a: isNaN(a) ? 1 : a };
    }
  }

  return null;
}

/**
 * Calcula la luminancia relativa según el estándar W3C (WCAG 2.1).
 * Devuelve un valor entre 0 (negro absoluto) y 1 (blanco puro).
 */
function calculateRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Hook universal y reactivo que detecta la luminancia y la mezcla de colores reales
 * presentes debajo de cualquier elemento flotante (Navbar, Topbar, Modales), creando
 * un gradiente y un tinte (hue) sutil que se propaga armónicamente con el entorno.
 */
export function useAdaptiveBackdrop(
  targetRef: React.RefObject<HTMLElement | null>,
  options: AdaptiveBackdropOptions = {}
): AdaptiveBackdropState {
  const {
    darkOpacity = 0.45,
    lightOpacity = 0.80,
    hueIntensity = 0.25,
    brightnessThreshold = 0.5,
    baseBlur = 16,
    samplePointsCount = 5,
  } = options;

  const [state, setState] = React.useState<AdaptiveBackdropState>({
    luminance: 0,
    isBright: false,
    isLightMode: false,
    dominantColor: { r: 80, g: 80, b: 80, a: 1 },
    sampledColors: [],
    style: {
      backgroundColor: `rgba(0, 0, 0, ${darkOpacity})`,
      backdropFilter: `blur(${baseBlur}px)`,
      WebkitBackdropFilter: `blur(${baseBlur}px)`,
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "rgba(255, 255, 255, 0.2)",
      transition:
        "background 450ms cubic-bezier(0.4, 0, 0.2, 1), background-color 450ms cubic-bezier(0.4, 0, 0.2, 1), border-color 450ms ease, backdrop-filter 450ms ease, box-shadow 450ms ease",
    },
  });

  const checkLuminanceAndColors = React.useCallback(() => {
    const el = targetRef.current;
    if (!el || typeof window === "undefined") return;

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Verificar si el documento está en modo claro global
    const isGlobalLightMode =
      document.documentElement.classList.contains("light") ||
      document.body.classList.contains("light");

    const samplePoints: { x: number; y: number }[] = [];
    const step = rect.width / (samplePointsCount + 1);

    for (let i = 1; i <= samplePointsCount; i++) {
      samplePoints.push({
        x: rect.left + step * i,
        y: rect.top + rect.height / 2,
      });
    }

    let totalLuminance = 0;
    const sampledColors: RgbColor[] = [];
    let sumR = 0;
    let sumG = 0;
    let sumB = 0;

    for (const point of samplePoints) {
      if (
        point.x < 0 ||
        point.x > window.innerWidth ||
        point.y < 0 ||
        point.y > window.innerHeight
      ) {
        const defaultColor = isGlobalLightMode
          ? { r: 255, g: 255, b: 255, a: 1 }
          : { r: 25, g: 25, b: 25, a: 1 };
        sampledColors.push(defaultColor);
        continue;
      }

      // Obtener la pila de elementos debajo de las coordenadas
      const elementsUnderneath = document.elementsFromPoint(point.x, point.y);

      // Filtrar el elemento actual y sus descendientes
      const filteredElements = elementsUnderneath.filter(
        (target) => target !== el && !el.contains(target)
      );

      let pointColor: RgbColor | null = null;
      let pointLuminance = isGlobalLightMode ? 0.95 : 0.05;

      for (const target of filteredElements) {
        // 1. Muestreo de Canvas activo (ej: Vanta o Three.js)
        if (target.tagName === "CANVAS") {
          try {
            const canvas = target as HTMLCanvasElement;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            if (ctx) {
              const cRect = canvas.getBoundingClientRect();
              const cx = Math.floor(((point.x - cRect.left) / cRect.width) * canvas.width);
              const cy = Math.floor(((point.y - cRect.top) / cRect.height) * canvas.height);
              if (cx >= 0 && cx < canvas.width && cy >= 0 && cy < canvas.height) {
                const pixel = ctx.getImageData(cx, cy, 1, 1).data;
                if (pixel[3] > 10) {
                  pointColor = { r: pixel[0], g: pixel[1], b: pixel[2], a: pixel[3] / 255 };
                  pointLuminance = calculateRelativeLuminance(pixel[0], pixel[1], pixel[2]);
                  break;
                }
              }
            }
          } catch {
            // Ignorar excepciones de contexto
          }
        }

        // 2. Inspección recursiva de colores de fondo hacia arriba
        let curr: HTMLElement | null = target as HTMLElement;
        while (curr && curr !== document.documentElement) {
          const comp = window.getComputedStyle(curr);

          // Verificar color de fondo
          const bgRgba = parseCssColorToRgba(comp.backgroundColor);
          if (bgRgba && bgRgba.a && bgRgba.a > 0.08) {
            pointColor = bgRgba;
            pointLuminance = calculateRelativeLuminance(bgRgba.r, bgRgba.g, bgRgba.b);
            break;
          }

          // Verificar si tiene color de texto/acento con saturación cromática
          const textRgba = parseCssColorToRgba(comp.color);
          if (textRgba && textRgba.a && textRgba.a > 0.3) {
            const delta =
              Math.max(textRgba.r, textRgba.g, textRgba.b) -
              Math.min(textRgba.r, textRgba.g, textRgba.b);
            if (delta > 20) {
              pointColor = textRgba;
              pointLuminance = calculateRelativeLuminance(textRgba.r, textRgba.g, textRgba.b);
              break;
            }
          }

          // Verificar SVG fills/strokes
          const fillRgba = parseCssColorToRgba(comp.fill);
          if (fillRgba && fillRgba.a && fillRgba.a > 0.1) {
            pointColor = fillRgba;
            pointLuminance = calculateRelativeLuminance(fillRgba.r, fillRgba.g, fillRgba.b);
            break;
          }

          curr = curr.parentElement;
        }

        if (pointColor) break;

        // 3. Detección de imágenes o videos
        if (target.tagName === "IMG" || target.tagName === "VIDEO") {
          pointLuminance = Math.max(pointLuminance, 0.65);
          pointColor = isGlobalLightMode
            ? { r: 235, g: 235, b: 240, a: 1 }
            : { r: 45, g: 50, b: 60, a: 1 };
          break;
        }
      }

      const finalColor =
        pointColor ||
        (isGlobalLightMode
          ? { r: 255, g: 255, b: 255, a: 1 }
          : { r: 20, g: 20, b: 20, a: 1 });

      sampledColors.push(finalColor);
      totalLuminance += pointLuminance;
      sumR += finalColor.r;
      sumG += finalColor.g;
      sumB += finalColor.b;
    }

    const count = sampledColors.length || 1;
    const avgLuminance = totalLuminance / count;
    const isBright = avgLuminance >= brightnessThreshold || isGlobalLightMode;

    const dominantColor: RgbColor = {
      r: Math.round(sumR / count),
      g: Math.round(sumG / count),
      b: Math.round(sumB / count),
      a: 1,
    };

    // Construcción del gradiente cromático visible pero armónico
    const dynamicGradientStops = sampledColors
      .map((c, idx) => {
        const percentage = Math.round((idx / (sampledColors.length - 1)) * 100);
        return `rgba(${c.r}, ${c.g}, ${c.b}, ${hueIntensity}) ${percentage}%`;
      })
      .join(", ");

    let backgroundColor: string;
    let borderColor: string;
    let boxShadow: string;

    if (isGlobalLightMode) {
      // 🌟 Modo claro: Cristal frosted blanco con tinte ambiental y borde definido
      const baseAlpha = Math.min(lightOpacity + 0.08 * avgLuminance, 0.88);
      backgroundColor = `rgba(255, 255, 255, ${baseAlpha.toFixed(3)})`;
      borderColor = `rgba(${Math.max(dominantColor.r - 40, 0)}, ${Math.max(dominantColor.g - 40, 0)}, ${Math.max(dominantColor.b - 40, 0)}, 0.28)`;
      boxShadow = `0 10px 30px rgba(0, 0, 0, 0.08), 0 0 20px rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.20), inset 0 0 12px rgba(255, 255, 255, 0.6)`;
    } else if (isBright) {
      // 🌟 Modo oscuro sobre sección/imagen clara
      backgroundColor = "rgba(18, 18, 18, 0.65)";
      borderColor = `rgba(${Math.min(dominantColor.r + 40, 255)}, ${Math.min(dominantColor.g + 40, 255)}, ${Math.min(dominantColor.b + 40, 255)}, 0.40)`;
      boxShadow = `0 12px 36px rgba(0, 0, 0, 0.45), 0 0 24px rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.25), inset 0 0 14px rgba(255, 255, 255, 0.06)`;
    } else {
      // 🌟 Modo oscuro estándar: Cristal oscuro con borde visible y halo cromático
      backgroundColor = `rgba(0, 0, 0, ${darkOpacity.toFixed(3)})`;
      borderColor = `rgba(${Math.min(dominantColor.r + 60, 255)}, ${Math.min(dominantColor.g + 60, 255)}, ${Math.min(dominantColor.b + 60, 255)}, 0.30)`;
      boxShadow = `0 8px 28px rgba(0, 0, 0, 0.35), 0 0 20px rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.20), inset 0 0 10px rgba(255, 255, 255, 0.05)`;
    }

    setState({
      luminance: avgLuminance,
      isBright,
      isLightMode: isGlobalLightMode,
      dominantColor,
      sampledColors,
      style: {
        backgroundImage: `linear-gradient(90deg, ${dynamicGradientStops})`,
        backgroundColor,
        backdropFilter: `blur(${baseBlur}px)`,
        WebkitBackdropFilter: `blur(${baseBlur}px)`,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor,
        boxShadow,
        transition:
          "background-image 450ms cubic-bezier(0.4, 0, 0.2, 1), background-color 450ms cubic-bezier(0.4, 0, 0.2, 1), border-color 450ms ease, backdrop-filter 450ms ease, box-shadow 450ms ease",
      },
    });
  }, [
    targetRef,
    darkOpacity,
    lightOpacity,
    hueIntensity,
    brightnessThreshold,
    baseBlur,
    samplePointsCount,
  ]);

  React.useEffect(() => {
    let animationFrameId: number;

    const onScrollOrResize = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(checkLuminanceAndColors);
    };

    checkLuminanceAndColors();

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    const observer = new MutationObserver(onScrollOrResize);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
      childList: true,
      subtree: true,
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      observer.disconnect();
    };
  }, [checkLuminanceAndColors]);

  return state;
}
