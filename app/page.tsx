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
const techStackItems = "tech_stack.json";
const techStack = await service.getTechStack(techStackItems);

export default function Home() {
  return (
    <>
      <section className="pt-30 md:pt-40 pb-10 md:pb-20">
          <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 md:gap-10">
              <div className="flex flex-row md:flex-col justify-between items-center gap-6 w-full md:w-auto">
                <div className="space-y-4 md:space-y-6">
                  <h1>¡Hola, bienvenido! ☻</h1>
                  <p className="text-base md:text-xl">Mi nombre es <span className="font-semibold">Rafael Fernández</span> y soy <span className="text-[#00FF90]">Desarrollador Fullstack</span>.</p>
                  <p className="hidden md:block text-base md:text-xl font-light">
                    Analista Programador especializado en desarrollo Fullstack,
                    orientado a la producción de software integral, eficiente y escalable.
                  </p>
                </div>
                <div className="md:hidden p-2 border border-[#4B4B4B] rounded-[20px] w-25 h-25 shrink-0">
                  <Avatar
                    src="/assets/images/avatar.jpg"
                    alt="Rafael Fernández"
                  />
                </div>
              </div>
              <p className="md:hidden text-base font-light">
                Analista Programador especializado en desarrollo Fullstack,
                orientado a la producción de software integral, eficiente y escalable.
              </p>
            <div className="hidden md:block p-2 border border-[#4B4B4B] rounded-[20px] w-60 h-60 shrink-0">
              <Avatar
                src="/assets/images/avatar.jpg"
                alt="Rafael Fernández"
              />
            </div>
          </header>
      </section>
      <div className="relative w-[100%] h-[80vh]">
        <VantaCanvas className="absolute inset-0 z-0" />
        <div className="absolute flex justify-center inset-0 px-4 md:px-60 py-20 md:py-38 vignette-overlay">
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
