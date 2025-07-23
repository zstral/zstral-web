import Avatar from "@/components/Avatar";
import VantaCanvas from "@/components/VantaCanvas";
import StatsHighlights from "@/components/StatsHighlights";
import Timeline from "@/components/Timeline";
import TechStackGrid from "@/components/TechStackGrid";

import { DataService } from "@/services/DataService";
import Footer from "@/components/Footer";

  const service = new DataService();

  const stats = await service.getStats();
  const items = await service.getTimeline();
  const techStack = await service.getTechStack();

export default function Home() {
  return (
    <>
      <section className="pt-40 pb-20">
        <div className="space-y-10">
          <header className="flex justify-between items-center">
            <div className="flex flex-col space-y-5">
              <h1>¡Hola, bienvenido! ☻</h1>
              <div className="text-xl">
                <p>Mi nombre es <span className="font-semibold">Rafael Fernández</span> y soy <span className="text-[#00FF90]">Desarrollador Fullstack</span>.</p>
              </div>
            </div>
            <div className="p-2 border border-[#4B4B4B] rounded-[20px]">
              <Avatar
                src="/assets/images/avatar.jpg"
                alt="Rafael Fernández"
                size={80}
              />
            </div>
          </header>
          <aside>
            <p className="text-xl font-light">
              Analista Programador especializado en desarrollo Fullstack,
              orientado a la producción de software integral, eficiente y escalable.
            </p>
          </aside>
        </div>
      </section>
      <div className="relative w-full h-[80vh]">
        <VantaCanvas className="absolute inset-0 z-0" />
        <div className="absolute flex justify-center inset-0 px-60 py-38 vignette-overlay">
          <StatsHighlights stats={stats} />
        </div>
      </div>
      <section>
        <h3 className="font-semibold text-xl pb-10 text-[#929292]">Certificaciones</h3>
        <Timeline items={items} />
      </section>
      <section className="pt-30">
        <h3 className="text-center font-semibold text-xl pb-10 text-[#929292]">Tecnologías</h3>
        <TechStackGrid items={techStack} />
      </section>
      <Footer />
    </>
  )
}
