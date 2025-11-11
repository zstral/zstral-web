import fs from 'fs/promises';
import path from 'path';

import { TimelineItem } from "@/components/Timeline";
import { StatItem } from "@/components/StatsHighlights";
import { TechStackItem } from "@/components/TechStackGrid";
import { CardItem } from "@/components/Card";
import { CarouselItem } from "@/components/Carousel";

export class DataService {
    
    private async get<T>(fileName: string): Promise<T> {

         const filePath = path.join(process.cwd(), 'public', fileName);

        try {
            const fileData = await fs.readFile(filePath, 'utf8');
            const data = JSON.parse(fileData);
            return data as T;
        } catch (error) {
            console.error(`Error al leer o parsear el archivo ${fileName}:`, error);
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Error al obtener ${fileName}: ${message}`);
        }
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