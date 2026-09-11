'use client';

import * as React from "react";
import Image from "next/image";
import { motion, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Github } from "@/components/icon/Github";

export interface CarouselItem {
  id?: string;
  imgSrc: string;
  imgAlt?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
  liveUrl?: string;
  githubUrl?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlayInterval?: number;
}

export default function CustomCarousel({
  items,
  autoPlayInterval = 5000,
}: CarouselProps): React.JSX.Element {
  const [current, setCurrent] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const [progressKey, setProgressKey] = React.useState(0);
  const total = items.length;

  // Auto-play con pausa en hover
  React.useEffect(() => {
    if (total <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
      setProgressKey((k) => k + 1);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [total, isHovered, autoPlayInterval, current]);

  const prevSlide = React.useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
    setProgressKey((k) => k + 1);
  }, [total]);

  const nextSlide = React.useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
    setProgressKey((k) => k + 1);
  }, [total]);

  const goToSlide = (index: number) => {
    setCurrent(index);
    setProgressKey((k) => k + 1);
  };

  // Manejador de gesto Drag/Swipe
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 40;
    if (info.offset.x > threshold) {
      prevSlide();
    } else if (info.offset.x < -threshold) {
      nextSlide();
    }
  };

  if (!items || items.length === 0) return <></>;

  // Cálculo de posición relativa para 3D Coverflow
  const getCardTransform = (index: number) => {
    let diff = (index - current) % total;
    if (diff < -Math.floor(total / 2)) diff += total;
    if (diff > Math.floor(total / 2)) diff -= total;

    if (diff === 0) {
      return {
        x: "0%",
        scale: 1,
        rotateY: 0,
        zIndex: 20,
        opacity: 1,
        filter: "blur(0px)",
        pointerEvents: "auto" as const,
      };
    }
    if (diff === -1 || (total === 2 && current === 1 && index === 0)) {
      return {
        x: "-36%",
        scale: 0.82,
        rotateY: 20,
        zIndex: 10,
        opacity: 0.5,
        filter: "blur(1.5px)",
        pointerEvents: "auto" as const,
      };
    }
    if (diff === 1 || (total === 2 && current === 0 && index === 1)) {
      return {
        x: "36%",
        scale: 0.82,
        rotateY: -20,
        zIndex: 10,
        opacity: 0.5,
        filter: "blur(1.5px)",
        pointerEvents: "auto" as const,
      };
    }
    return {
      x: diff < 0 ? "-65%" : "65%",
      scale: 0.65,
      rotateY: diff < 0 ? 30 : -30,
      zIndex: 0,
      opacity: 0,
      filter: "blur(6px)",
      pointerEvents: "none" as const,
    };
  };

  return (
    <div
      className="relative w-full max-w-6xl mx-auto select-none py-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Contenedor 3D con perspectiva y máscara de difuminado lateral */}
      <div
        className="relative w-full h-[360px] sm:h-[440px] md:h-[480px] lg:h-[520px] flex items-center justify-center overflow-hidden [perspective:1200px] [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]"
      >
        {items.map((item, index) => {
          const transform = getCardTransform(index);
          const isActive = index === current;

          return (
            <motion.div
              key={item.id ?? index}
              drag={isActive ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              animate={transform}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 24,
                mass: 0.8,
              }}
              onClick={() => {
                if (!isActive) goToSlide(index);
              }}
              className={`absolute w-[82%] sm:w-[72%] md:w-[62%] lg:w-[56%] aspect-[16/10] max-h-[92%] rounded-[20px] overflow-hidden border border-[#262626] light:border-[#e5e5e5] shadow-xl bg-neutral-950 light:bg-neutral-100 transition-colors ${
                isActive ? "cursor-grab active:cursor-grabbing border-[#4B4B4B] light:border-[#b5b5b5]" : "cursor-pointer hover:border-[#383838] light:hover:border-[#d0d0d0]"
              }`}
            >
              {/* Imagen del proyecto */}
              <div className="relative w-full h-full">
                <Image
                  src={item.imgSrc}
                  alt={item.imgAlt || item.title || "Project preview"}
                  fill
                  quality={90}
                  priority={index === 0}
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, 800px"
                />

                {/* Gradiente oscuro para garantizar legibilidad del texto */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

                {/* Contenido enriquecido sobre la tarjeta */}
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 flex flex-col justify-end text-left pointer-events-auto">
                  {/* Badges de tecnologías */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {item.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] md:text-xs px-2.5 py-0.5 rounded-full bg-black/60 light:bg-white/60 backdrop-blur-md border border-[#4B4B4B] light:border-[#d0d0d0] text-neutral-300 light:text-neutral-700 font-mono font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Título & Subtítulo */}
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                      {item.title || item.imgAlt}
                    </h3>
                    {item.subtitle && (
                      <span className="text-xs md:text-sm text-neutral-400 hidden sm:inline font-mono">
                        • {item.subtitle}
                      </span>
                    )}
                  </div>

                  {/* Descripción */}
                  {item.description && (
                    <p className="text-xs md:text-sm text-neutral-300 line-clamp-2 mt-1.5 max-w-2xl font-light leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Botones de acción CTA */}
                  <div className="flex items-center gap-3 mt-3.5">
                    {item.liveUrl && (
                      <a
                        href={item.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-lg shadow-white/10 transition-all cursor-pointer"
                      >
                        <span>Ver Demo</span>
                        <ExternalLink size={13} />
                      </a>
                    )}
                    {item.githubUrl && (
                      <a
                        href={item.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-[#4B4B4B] light:border-[#c0c0c0] backdrop-blur-md text-white text-xs font-medium transition-all cursor-pointer"
                      >
                        <div className="w-3.5 h-3.5 flex items-center justify-center">
                          <Github />
                        </div>
                        <span>Código</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Capa de atenuación para tarjetas laterales inactivas */}
                {!isActive && (
                  <div className="absolute inset-0 bg-black/40 light:bg-black/25 backdrop-blur-[1.5px] transition-opacity duration-300 pointer-events-none" />
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Difuminados de borde laterales para integración suave con el fondo */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 md:w-36 bg-gradient-to-r from-background via-background/60 to-transparent z-25" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 md:w-36 bg-gradient-to-l from-background via-background/60 to-transparent z-25" />

        {/* Botones de navegación laterales */}
        {total > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Slide anterior"
              className="absolute left-2 sm:left-4 z-30 p-2.5 rounded-full backdrop-blur-md bg-black/40 hover:bg-black/70 border border-[#4B4B4B] light:border-[#c0c0c0] text-white shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Siguiente slide"
              className="absolute right-2 sm:right-4 z-30 p-2.5 rounded-full backdrop-blur-md bg-black/40 hover:bg-black/70 border border-[#4B4B4B] light:border-[#c0c0c0] text-white shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Indicadores tipo Píldora con Barra de Progreso de Tiempo */}
      {total > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          {items.map((_, index) => {
            const isActive = index === current;
            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                aria-label={`Ir al slide ${index + 1}`}
                className={`relative h-2 rounded-full overflow-hidden transition-all duration-300 cursor-pointer ${
                  isActive ? "w-8 bg-white/20" : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              >
                {isActive && (
                  <motion.div
                    key={progressKey}
                    initial={{ width: "0%" }}
                    animate={{ width: isHovered ? "100%" : "100%" }}
                    transition={{
                      duration: isHovered ? 0 : autoPlayInterval / 1000,
                      ease: "linear",
                    }}
                    className="h-full bg-white light:bg-black rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
