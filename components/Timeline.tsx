import * as React from "react";
import { CalendarDays } from "lucide-react";

export interface TimelineItem {
    time: string;
    title: string;
    body: string;
}

interface TimelineProps {
    items: TimelineItem[];
}

export default function TimelineComponent({ items }:TimelineProps): React.JSX.Element {
    return (
            <div className="relative flex justify-center min-w-full space-x-12">
                {items.map((item, index) => (
                    <div key={index} className="relative w-full flex flex-col">
                        <div className="relative flex items-center w-full">
                            <div className="relative w-5 h-5 bg-[#ffffffcc] rounded-full">
                                <CalendarDays 
                                    color="#000000" size={16}
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                />
                            </div>
                            <div className="flex-1 h-[2px] bg-[#ffffff33] ml-2" />
                        </div>
                        <div className="mt-2 pl-2">
                            <p className="text-sm text-[#929292]">{item.time}</p>
                            <h3 className="text-xl font-semibold">{item.title}</h3>
                            <p className="text-sm text-[#929292] mt-1">{item.body}</p>
                        </div>
                    </div>
                ))}
            </div>
    )
}