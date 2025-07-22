import * as React from "react";

interface StatItem {
    title: string
    subtitle: string
}

interface StatsHighlightsProps {
    stats: StatItem[]
}

export default function StatsHighlights({ stats }:StatsHighlightsProps): React.JSX.Element {
    return (
        <div className="flex justify-center text-center items-center gap-32 text-[#ffffffb3]">
            {stats.map((stat, index) => (
                <div key={index} className="w-1/4">
                    <h1 className="font-bold">{stat.title}</h1>
                    <p className="font-light">{stat.subtitle}</p>
                </div>
            ))}
        </div>
    )
}