import * as React from "react"
import Image from "next/image";

export interface TechStackItem {
    logoUrl: string;
    alt: string | undefined;
    name?: string;
}

interface TechStackGridProps {
    items: TechStackItem[];
}

export default function TechStackGrid({ items }: TechStackGridProps): React.JSX.Element {

    const itemPerRow = [7, 6, 7];
    let start = 0;

    return (
        <div className="flex flex-col gap-6">
            {itemPerRow.map((count, rowIndex) => {

                const rowItems = items.slice(start, start + count);
                start += count;

                return (
                <div
                    key={rowIndex}
                    className={`flex flex-wrap justify-center gap-6 sm:gap-10 md:gap-14 lg:gap-18
                    ${ rowIndex % 2 !== 0 ? "ml-10 sm:ml-2" : "" }`}
                >
                    {rowItems.map((item, index) => (
                    <div key={index} className="flex flex-col items-center sm:w-[50px] md:w-[50px] lg:w-[3rem]">
                        <div className="relative w-full aspect-square">
                            <Image
                                src={item.logoUrl}
                                alt={item.alt || ""}
                                fill
                                style={{ objectFit: "contain" }}
                                sizes="(max-width: 640px) 50px, (max-width: 768px) 50px, (max-width: 1024px) 50px, (max-width: 1280px) 3rem"
                            />
                        </div>
                        {item.name && (
                        <span className="mt-2 text-center text-sm">{item.name}</span>
                        )}
                    </div>
                    ))}
                </div>
                );
            })}
        </div>
    );
}