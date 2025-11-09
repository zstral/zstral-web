'use client'
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export interface CarouselItem {
  imgSrc: string;
  imgAlt: string | undefined;
}

interface CarouselProps {
  items: CarouselItem[];
}

function CarouselSlide({ item }: { item: CarouselItem }) {
  return (
    <div className="min-w-full h-64 items-center justify-center">
      <Image
        src={item.imgSrc}
        alt={item.imgAlt || ""}
        width={1100}
        height={1100}
        quality={100}
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
}

function CarouselButton({ onClick, position, children }: {
  onClick: () => void;
  position: "left" | "right";
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 ${position === "left" ? "left-2" : "right-2"} 
                 transform -translate-y-1/2 bg-[#00000066] backdrop-blur 
                 text-white px-2 py-2 rounded-full cursor-pointer`}
    >
      {children}
    </button>
  );
}

function CarouselDot({ active }: { active: boolean }) {
  return (
    <span
      className={`h-3 w-3 rounded-full ${active ? "bg-white" : "bg-gray-400"}`}
    />
  );
}

function CarouselDots({ count, current }: { count: number; current: number; }) {
  return (
    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
      {Array.from({ length: count }).map((_, index) => (
        <CarouselDot key={index} active={index === current} />
      ))}
    </div>
  );
}

export default function CustomCarousel({ items }: CarouselProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + items.length) % items.length);

  const nextSlide = () =>
    setCurrent((prev) => (prev + 1) % items.length);

  return (
    <div className="relative w-full h-64 overflow-hidden rounded-lg place-self-center">

      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((item, index) => (
          <CarouselSlide key={index} item={item} />
        ))}
      </div>

      <CarouselButton onClick={prevSlide} position="left">
        <ChevronLeft />
      </CarouselButton>
      <CarouselButton onClick={nextSlide} position="right">
        <ChevronRight />
      </CarouselButton>

      <CarouselDots count={items.length} current={current} />
    </div>
  );
}
