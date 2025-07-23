import { TimelineItem } from "@/components/Timeline";
import { StatItem } from "@/components/StatsHighlights";

export class DataService {

    // For production, change the baseUrl to the API endpoint.
    private baseUrl = "http://localhost:3000/data"

    private async get<T>(fileName: string): Promise<T> {
        const res = await fetch(`${this.baseUrl}/${fileName}`, {
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

}