'use client';
import * as React from "react";
import Image from "next/image";
import Backgrounds from "@/components/Backgrounds";

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
            className="absolute w-[90vw] h-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10"
            src="/assets/dlight-d.svg"
            lightSrc="/assets/dlight-l.svg"
            alt="Background Decorative"
            width={1000}
            height={1000}
            priority
        />
    );
}

function ItemImage({ item }: { item: TechStackItem }) {
    return (
        <div className="relative w-full aspect-square">
            <Image
                src={item.logoUrl}
                alt={item.alt || ""}
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 640px) 50px, (max-width: 768px) 50px, (max-width: 1024px) 50px, (max-width: 1280px) 3rem"
            />
        </div>
    );
}

function ItemName({ item }: { item: TechStackItem }) {
    if (!item.name) return null;
    return (
        <span className="mt-2 text-center text-sm">{item.name}</span>
    );
}

function ItemStackGrid({ item }: { item: TechStackItem }) {
    return (
        <div className="flex flex-col items-center w-[50px] lg:w-[3rem]">
            <ItemImage item={item} />
            <ItemName item={item} />
        </div>
    );
}

function BodyStackGrid({ items }: { items: TechStackItem[] }) {
    return (
        <div
            className="flex flex-wrap justify-center gap-10 sm:gap-14 md:gap-14 lg:gap-18"
        >
            {items.map((item, index) => (
                <ItemStackGrid key={index} item={item} />
            ))}
        </div>
    );
}

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

export default function TechStackGrid({ items }: TechStackGridProps): React.JSX.Element {
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

    return (
        <div className="relative items-center w-full flex flex-col gap-6">
            <BackgroundSvg />
            {rows.map((rowItems, index) => (
                <BodyStackGrid key={index} items={rowItems} />
            ))}
        </div>
    );
}
