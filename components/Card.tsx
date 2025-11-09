'use client';

import Image from "next/image";
import Tilt from "react-parallax-tilt";

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
}

interface CardContentProps {
  title?: string;
  description: string;
  link?: string;
}

function CardImage({ imgSrc, imgAlt, width = 300, height = 160 }: CardImageProps) {
  return (
    <Image
      src={imgSrc}
      alt={imgAlt || ""}
      width={width}
      height={height}
      quality={40}
      loading="lazy"
      className="object-cover"
    />
  );
}

function CardButton({ link }: { link?: string }) {
  if (!link) return null;

  return (
    <div className="flex justify-end mt-8">
      <button>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-sm rounded-full 
                     border border-[#c5c5c5] text-[#949494] font-normal 
                     hover:bg-[#c5c5c5] hover:text-[#000000] transition-colors"
        >
          Ver
        </a>
      </button>
    </div>
  );
}

function CardContent({ title, description, link }: CardContentProps) {
  return (
    <div className="flex flex-col p-4">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      <p className="mt-2 text-xs text-gray-300 whitespace-pre-line">{description}</p>
      <CardButton link={link} />
    </div>
  );
}

function CardWrapper({ card, className }: { card: CardItem; className?: string }) {
  return (
    <Tilt
      glareEnable
      glareBorderRadius="0.5rem"
      glareMaxOpacity={0.2}
      glarePosition="top"
      glareReverse
      scale={1.08}
      tiltReverse
      tiltMaxAngleX={10}
      tiltMaxAngleY={8}
    >
      <div
        className={`bg-[#000000cc] rounded-lg overflow-hidden w-full lg:max-w-64 backdrop-blur-[4px] border border-[#111111] ${className || ""}`}
      >
        <CardImage imgSrc={card.imgSrc} imgAlt={card.imgAlt} width={card.width} height={card.height} />
        <CardContent title={card.title} description={card.description} link={card.link} />
      </div>
    </Tilt>
  );
}

export default function Card({ cards, wrapperClassName }: CustomCardProps) {
  return (
    <div className="flex flex-wrap justify-center items-start gap-10">
      {cards.map((card, index) => (
        <CardWrapper key={index} card={card} className={wrapperClassName} />
      ))}
    </div>
  );
}
