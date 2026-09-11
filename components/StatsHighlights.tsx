"use client";

import * as React from "react";
import { FolderGit2, Cpu, Award, Sparkles } from "lucide-react";

export type StatIconType =
  | "projects"
  | "tech"
  | "certifications"
  | "experience"
  | "default";

export interface StatItem {
  value?: number;
  prefix?: string;
  suffix?: string;
  title?: string; // Compatibilidad hacia atrás (ej: "05+")
  subtitle: string;
  icon?: StatIconType;
  href?: string;
}

export interface StatsHighlightsProps {
  stats: StatItem[];
  className?: string;
}

function getStatIcon(icon?: StatIconType) {
  const iconProps = {
    size: 22,
    strokeWidth: 1.5,
    className: "text-neutral-400 light:text-neutral-500 group-hover:text-neutral-200 light:group-hover:text-neutral-800 transition-colors duration-300",
  };
  switch (icon) {
    case "projects":
      return <FolderGit2 {...iconProps} />;
    case "tech":
      return <Cpu {...iconProps} />;
    case "certifications":
      return <Award {...iconProps} />;
    default:
      return <Sparkles {...iconProps} />;
  }
}

function parseStatValue(stat: StatItem): {
  num: number;
  prefix: string;
  suffix: string;
} {
  if (typeof stat.value === "number") {
    return {
      num: stat.value,
      prefix: stat.prefix || "",
      suffix: stat.suffix || "",
    };
  }

  // Compatibilidad hacia atrás: extraer número de `title` si existe (ej: "05+" o "10+")
  const raw = stat.title || "0";
  const match = raw.match(/^([^0-9]*)(\d+)(.*)$/);
  if (match) {
    const [, pre, digits, suf] = match;
    const num = parseInt(digits, 10);
    const hasLeadingZero = digits.startsWith("0") && digits.length > 1;
    return {
      num: isNaN(num) ? 0 : num,
      prefix: stat.prefix || (hasLeadingZero && !pre ? "0" : pre),
      suffix: stat.suffix || suf,
    };
  }

  return { num: 0, prefix: stat.prefix || "", suffix: stat.suffix || "" };
}

function AnimatedCounter({
  target,
  prefix = "",
  suffix = "",
  duration = 1600,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = React.useState(0);
  const elementRef = React.useRef<HTMLSpanElement>(null);
  const startedRef = React.useRef(false);

  React.useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;

          const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches;
          if (prefersReduced || target === 0) {
            setCount(target);
            return;
          }

          let startTime: number | null = null;
          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Curva Ease-Out exponencial para desaceleración suave
            const easeProgress = 1 - Math.pow(2, -10 * progress);
            const currentVal = Math.round(easeProgress * target);
            setCount(currentVal);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCount(target);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  const displayVal =
    prefix === "0" && count < 10 && count > 0 ? `0${count}` : `${count}`;

  return (
    <span ref={elementRef} className="tabular-nums">
      {prefix !== "0" && prefix}
      {displayVal}
      {suffix}
    </span>
  );
}

export default function StatsHighlights({
  stats,
  className = "",
}: StatsHighlightsProps): React.JSX.Element {
  if (!stats || stats.length === 0) return <></>;

  return (
    <div className={`w-full max-w-4xl mx-auto px-4 ${className}`}>
      {/* Opción A: Barra cápsula flotante ultra-translúcida */}
      <div className="backdrop-blur-md bg-black/15 light:bg-white/20 border border-white/10 light:border-black/10 rounded-3xl p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)] light:shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all duration-300">
        <dl className="flex flex-col md:flex-row items-stretch justify-around divide-y md:divide-y-0 md:divide-x divide-white/10 light:divide-black/10">
          {stats.map((stat, index) => {
            const { num, prefix, suffix } = parseStatValue(stat);

            const content = (
              <div className="flex-1 flex flex-col items-center justify-center py-4 md:py-2 md:px-6 group cursor-default">
                {/* Icono sutil directo */}
                {stat.icon && (
                  <div className="mb-2">
                    {getStatIcon(stat.icon)}
                  </div>
                )}

                {/* Número monocromático y animación de conteo */}
                <dd className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-mono tracking-tight bg-gradient-to-b from-white via-neutral-100 to-neutral-400 light:from-neutral-900 light:via-neutral-800 light:to-neutral-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                  <AnimatedCounter
                    target={num}
                    prefix={prefix}
                    suffix={suffix}
                  />
                </dd>

                {/* Subtítulo semántico */}
                <dt className="text-xs md:text-sm text-[#a3a3a3] light:text-[#525252] font-light mt-2 text-center group-hover:text-white light:group-hover:text-black transition-colors">
                  {stat.subtitle}
                </dt>
              </div>
            );

            if (stat.href) {
              return (
                <a
                  key={index}
                  href={stat.href}
                  className="flex-1 block focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-2xl"
                >
                  {content}
                </a>
              );
            }

            return <React.Fragment key={index}>{content}</React.Fragment>;
          })}
        </dl>
      </div>
    </div>
  );
}
