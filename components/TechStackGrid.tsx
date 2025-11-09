import * as React from "react";
import Image from "next/image";

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
        <object
            className="absolute w-[90vw] h-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            data="/assets/dlight.svg"
            type="image/svg+xml"
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
        <div className="flex flex-col items-center sm:w-[50px] md:w-[50px] lg:w-[3rem]">
            <ItemImage item={item} />
            <ItemName item={item} />
        </div>
    );
}

function BodyStackGrid({ rowIndex, items }: { rowIndex: number; items: TechStackItem[] }) {
    return (
        <div
            className={`flex flex-wrap justify-center gap-6 sm:gap-10 md:gap-14 lg:gap-18
            ${rowIndex % 2 !== 0 ? "ml-10 sm:ml-2" : ""}`}
        >
            {items.map((item, index) => (
                <ItemStackGrid key={index} item={item} />
            ))}
        </div>
    );
}

export default function TechStackGrid({ items }: TechStackGridProps): React.JSX.Element {
    
    const itemPerRow = [7, 6, 7];
    let start = 0;

    return (
        <div className="relative w-full flex flex-col gap-6">
            <BackgroundSvg />
            {itemPerRow.map((count, rowIndex) => {
                const rowItems = items.slice(start, start + count);
                start += count;
                return (
                    <BodyStackGrid
                        key={rowIndex}
                        rowIndex={rowIndex}
                        items={rowItems}
                    />
                );
            })}
        </div>
    );
}
