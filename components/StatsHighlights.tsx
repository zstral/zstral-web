import * as React from "react";

export interface StatItem {
    title: string;
    subtitle: string;
}

interface StatsHighlightsProps {
    stats: StatItem[];
}

function StatTitle({ title }: { title: string }) {
    return <h1 className="font-bold">{title}</h1>;
}

function StatSubtitle({ subtitle }: { subtitle: string }) {
    return <p className="font-light text-base md:text-xl">{subtitle}</p>;
}

function StatBlock({ stat }: { stat: StatItem }) {
    return (
        <div className="md:w-1/4">
            <StatTitle title={stat.title} />
            <StatSubtitle subtitle={stat.subtitle} />
        </div>
    );
}

export default function StatsHighlights({ stats }: StatsHighlightsProps): React.JSX.Element {
    return (
        <div className="flex flex-col md:flex-row justify-center text-center items-center gap-16 md:gap-32 text-[#ffffffb3] light:text-[#000000b3]">
            {stats.map((stat, index) => (
                <StatBlock key={index} stat={stat} />
            ))}
        </div>
    );
}
