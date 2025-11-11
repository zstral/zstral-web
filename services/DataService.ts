import { TimelineItem } from "@/components/Timeline";
import { StatItem } from "@/components/StatsHighlights";
import { TechStackItem } from "@/components/TechStackGrid";
import { CardItem } from "@/components/Card";
import { CarouselItem } from "@/components/Carousel";

export class DataService {
    
    private async get<T>(fileName: string): Promise<T> {
        const res = await fetch(`${fileName}`, {
            cache: "no-store",
        });
        if (!res.ok) {
            const exception = await res.text();
            throw new Error(`Error al obtener ${fileName}: ${res.status} - ${exception} `);
        }
        return res.json() as Promise<T>;
    }

    public getStats(): Promise<StatItem[]> {
        return this.get<StatItem[]>("stats.json");
    }

    public getTimeline(): Promise<TimelineItem[]> {
        return this.get<TimelineItem[]>("timeline.json");
    }

    public getTechStack(file: string): Promise<TechStackItem[]> {
        return this.get<TechStackItem[]>(file);
    }

    public getCardItem(file: string): Promise<CardItem[]> {
        return this.get<CardItem[]>(file);
    }

    public getCarouselItem(file: string): Promise<CarouselItem[]> {
        return this.get<CarouselItem[]>(file);
    }

}