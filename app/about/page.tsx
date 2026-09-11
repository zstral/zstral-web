import UserCard from "@/components/UserCard";
import FocusAreas from "@/components/FocusAreas";
import Backgrounds from "@/components/Backgrounds";
import Footer from "@/components/Footer";
import { User } from "lucide-react";
import { DataService } from "@/services/DataService";

const service = new DataService();

const techStackItems = "tech_stack_user.json";
const techStack = await service.getTechStack(techStackItems);

const focusAreasItem = "user_info.json";
const focusAreas = await service.getFocusAreas(focusAreasItem);

export default function About() {
  return (
    <div className="relative w-full min-h-screen">
      <div className="fixed inset-0 w-full h-full -z-10 select-none pointer-events-none">
        <Backgrounds
          className="object-contain"
          src="/assets/vectorhole-d.svg"
          lightSrc="/assets/vectorhole-l.svg"
          alt="Background SVG"
          fill
          priority
        />
      </div>
      <div className="relative w-full z-10">
        <section className="relative flex flex-col pt-30 md:pt-40 pb-8 md:pb-12 gap-5">
          <h1 className="flex items-center gap-4">
            Sobre mí <User size={30} strokeWidth={1} />
          </h1>
          <p className="text-neutral-400 light:text-neutral-600 max-w-2xl">
            Conoce más sobre mi perfil profesional, trayectoria formativa, tecnologías de especialización y principios de desarrollo.
          </p>
        </section>

        <section className="flex justify-center w-full pb-12 md:pb-16">
          <UserCard
            title="Rafael Fernández"
            description={`Formado en Duoc UC como Analista Programador con sólida base en ingeniería de software.\nComprometido con el aprendizaje constante y la excelencia técnica.\nBusco crear soluciones que aporten valor real, optimicen procesos y brinden una experiencia de usuario impecable.`}
            stack={techStack}
          />
        </section>

        <section className="flex flex-col gap-6 pb-20 md:pb-28">
          <h3 className="text-center font-semibold text-xl text-[#929292]">
            Áreas de enfoque
          </h3>
          <FocusAreas items={focusAreas} />
        </section>

        <Footer />
      </div>
    </div>
  );
}