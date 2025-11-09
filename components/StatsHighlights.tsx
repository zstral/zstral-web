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
    return <p className="font-light">{subtitle}</p>;
}

function StatBlock({ stat }: { stat: StatItem }) {
    return (
        <div className="w-1/4">
            <StatTitle title={stat.title} />
            <StatSubtitle subtitle={stat.subtitle} />
        </div>
    );
}

export default function StatsHighlights({ stats }: StatsHighlightsProps): React.JSX.Element {
    return (
        <div className="flex justify-center text-center items-center gap-32 text-[#ffffffb3]">
            {stats.map((stat, index) => (
                <StatBlock key={index} stat={stat} />
            ))}
        </div>
    );
}
