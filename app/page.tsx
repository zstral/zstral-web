import AsciiHero from "@/components/AsciiHero";
import VantaCanvas from "@/components/VantaCanvas";
import StatsHighlights from "@/components/StatsHighlights";
import Timeline from "@/components/Timeline";
import TechStackGrid from "@/components/TechStackGrid";

import { DataService } from "@/services/DataService";
import Footer from "@/components/Footer";

const service = new DataService();

const stats = await service.getStats();
const items = await service.getTimeline();
const techStackItems = "tech_stack.json";
const techStack = await service.getTechStack(techStackItems);

export default function Home() {
  return (
    <>
      <AsciiHero />
      <div className="relative w-full h-[80vh]">
        <VantaCanvas className="absolute inset-0 z-0" />
        <div className="absolute flex items-center justify-center inset-0 px-4 py-20 vignette-overlay">
          <StatsHighlights stats={stats} />
        </div>
      </div>
      <section>
        <h3 className="font-semibold text-xl pb-10 text-[#929292]">Certificaciones</h3>
        <Timeline items={items} variant="horizontal" />
      </section>
      <section className="pt-30">
        <h3 className="text-center font-semibold text-xl pb-10 text-[#929292]">Tecnologías</h3>
        <TechStackGrid items={techStack} />
      </section>
      <Footer />
    </>
  )
}
