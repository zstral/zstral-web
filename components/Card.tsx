'use client';

import Image from "next/image";
import Tilt from "react-parallax-tilt";
import { ArrowUpRight } from "lucide-react";

export interface CardItem {
  imgSrc: string;
  imgAlt?: string;
  title?: string;
  description: string;
  link?: string;
  width?: number;
  height?: number;
}

interface CustomCardProps {
  cards: CardItem[];
  wrapperClassName?: string;
}

interface CardImageProps {
  imgSrc: string;
  imgAlt?: string;
  width?: number;
  height?: number;
  title?: string;
}

function CardImage({ imgSrc, imgAlt, width, height, title }: CardImageProps) {
  if (width && height) {
    return (
      <div className="shrink-0 flex items-center justify-center">
        <Image
          src={imgSrc}
          alt={imgAlt || title || ""}
          width={width}
          height={height}
          quality={80}
          loading="lazy"
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[16/10] overflow-hidden bg-black/30 border-b border-[#262626] light:border-[#e5e5e5]">
      <Image
        src={imgSrc}
        alt={imgAlt || title || ""}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
        quality={85}
        loading="lazy"
        className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
      />
    </div>
  );
}

function CardButton({ link }: { link?: string }) {
  if (!link) return null;

  return (
    <div className="flex justify-end pt-3 mt-auto border-t border-[#262626]/60 light:border-[#e5e5e5]/60">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-full 
                   border border-[#4B4B4B] light:border-[#c0c0c0] text-[#ededed] light:text-[#111111] 
                   hover:border-white hover:text-white light:hover:border-black light:hover:text-black 
                   hover:bg-white/5 light:hover:bg-black/5 transition-all duration-200"
      >
        <span>Ver proyecto</span>
        <ArrowUpRight size={14} className="shrink-0" />
      </a>
    </div>
  );
}

function CardWrapper({ card, className }: { card: CardItem; className?: string }) {
  const isCompact = Boolean(card.width && card.height);

  return (
    <Tilt
      glareEnable
      glareBorderRadius={isCompact ? "0.75rem" : "1rem"}
      glareMaxOpacity={0.15}
      glarePosition="all"
      glareReverse
      scale={isCompact ? 1.05 : 1.02}
      tiltReverse
      tiltMaxAngleX={isCompact ? 10 : 5}
      tiltMaxAngleY={isCompact ? 8 : 5}
      className={isCompact ? "" : "h-full w-full max-w-[420px]"}
    >
      <div
        className={
          className ||
          `group relative flex flex-col h-full w-full rounded-2xl overflow-hidden 
           bg-[#000000cc] light:bg-[#30303033] backdrop-blur-[4px] 
           border border-[#111111] light:border-[#c0c0c0] 
           hover:border-[#333333] light:hover:border-[#999999] 
           transition-all duration-300`
        }
      >
        <CardImage
          imgSrc={card.imgSrc}
          imgAlt={card.imgAlt}
          width={card.width}
          height={card.height}
          title={card.title}
        />
        <div className={`flex flex-col flex-1 justify-between ${isCompact ? "p-4" : "p-5 md:p-6 gap-4"}`}>
          <div>
            {card.title && (
              <h3 className="text-base md:text-lg font-semibold text-[#f3f3f3] light:text-[#111111] tracking-tight">
                {card.title}
              </h3>
            )}
            <p className="mt-2 text-xs md:text-sm text-[#929292] light:text-[#555555] leading-relaxed whitespace-pre-line">
              {card.description}
            </p>
          </div>
          <CardButton link={card.link} />
        </div>
      </div>
    </Tilt>
  );
}

export default function Card({ cards, wrapperClassName }: CustomCardProps) {
  return (
    <div className="flex flex-wrap justify-center items-stretch gap-6 md:gap-8 w-full max-w-6xl mx-auto">
      {cards.map((card, index) => (
        <CardWrapper key={index} card={card} className={wrapperClassName} />
      ))}
    </div>
  );
}

