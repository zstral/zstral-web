'use client';

import * as React from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import Backgrounds from "@/components/Backgrounds";

import BubbleEffect from "@/components/animation/BubbleEffect";

export interface TechStackItem {
  logoUrl: string;
  alt: string | undefined;
  name?: string;
}

interface TechStackGridProps {
  items: TechStackItem[];
}

function BackgroundSvg() {
  return (
    <Backgrounds
      className="absolute w-[90vw] h-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none select-none"
      src="/assets/dlight-d.svg"
      lightSrc="/assets/dlight-l.svg"
      alt="Background Decorative"
      width={1000}
      height={1000}
      priority
    />
  );
}

function ItemName({ item }: { item: TechStackItem }) {
  if (!item.name) return null;
  return (
    <span className="mt-2 text-center text-xs md:text-sm text-[#929292] light:text-[#555555] group-hover:text-[#ededed] light:group-hover:text-[#111111] transition-colors whitespace-nowrap">
      {item.name}
    </span>
  );
}

function ItemStackGrid({
  item,
  index,
}: {
  item: TechStackItem;
  index: number;
}) {
  return (
    <BubbleEffect
      index={index}
      className="flex flex-col items-center w-[50px] lg:w-[3.5rem] group cursor-pointer select-none"
      bubbleClassName="relative w-full aspect-square filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] group-hover:drop-shadow-[0_8px_24px_rgba(255,255,255,0.25)] light:group-hover:drop-shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-all duration-300"
      footer={<ItemName item={item} />}
    >
      <Image
        src={item.logoUrl}
        alt={item.alt || item.name || ""}
        fill
        style={{ objectFit: "contain" }}
        sizes="(max-width: 640px) 50px, (max-width: 768px) 50px, (max-width: 1024px) 50px, (max-width: 1280px) 3.5rem"
      />
    </BubbleEffect>
  );
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

function calculateDistribution(total: number, cols: number) {
  const distribution = [];
  let remaining = total;
  while (remaining > 0) {
    const count = Math.min(remaining, cols);
    distribution.push(count);
    remaining -= count;
  }
  return distribution;
}

export default function TechStackGrid({
  items,
}: TechStackGridProps): React.JSX.Element {
  const [cols, setCols] = React.useState(7);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCols(4);
      } else if (window.innerWidth < 1024) {
        setCols(5);
      } else {
        setCols(7);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const rows = React.useMemo(() => {
    const distribution = calculateDistribution(items.length, cols);
    let start = 0;
    return distribution.map((count) => {
      const chunk = items.slice(start, start + count);
      start += count;
      return chunk;
    });
  }, [items, cols]);

  let globalIndex = 0;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerVariants}
      className="relative items-center w-full flex flex-col gap-8 md:gap-10 py-6"
    >
      <BackgroundSvg />
      {rows.map((rowItems, rIdx) => (
        <div
          key={rIdx}
          className="flex flex-wrap justify-center gap-10 sm:gap-14 md:gap-14 lg:gap-18"
        >
          {rowItems.map((item) => {
            const currentIndex = globalIndex++;
            return (
              <ItemStackGrid
                key={currentIndex}
                item={item}
                index={currentIndex}
              />
            );
          })}
        </div>
      ))}
    </motion.div>
  );
}
