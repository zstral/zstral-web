import UserCard from "@/components/UserCard";
import Card from "@/components/Card";
import Backgrounds from "@/components/Backgrounds";
import Footer from "@/components/Footer";
import { DataService } from "@/services/DataService";

const service = new DataService();

const techStackItems = "tech_stack_user.json";
const techStack = await service.getTechStack(techStackItems);

const cardItem = "user_info.json";
const cards = await service.getCardItem(cardItem);

export default function About() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="fixed inset-0 w-full h-full -z-10">
        <Backgrounds
          className="object-contain"
          src="/assets/vectorhole-d.svg"
          lightSrc="/assets/vectorhole-l.svg"
          alt="Background SVG"
          fill
        />
      </div>
      <div className="fixed inset-0 w-full h-full -z-10 select-none pointer-events-none">
        <Backgrounds 
          className="object-contain object-top"
          src="/assets/sphere-d.svg"
          lightSrc="/assets/sphere-l.svg"
          alt="Sphere SVG"
          fill
        />
      </div>
      <div className="relative w-full h-full overflow-y-auto z-10">
        <section className="flex flex-col items-center justify-center gap-5 pt-30 md:pt-40 pb-10 md:pb-20 w-full">
          <UserCard
            title="Rafael Fernández"
            description={`Formado en Duoc UC como Analista Programador.\nComprometido con el aprendizaje constante y la excelencia técnica.
                          Busco siempre crear soluciones que aporten un valor real, optimicen procesos y mejoren la experiencia de los usuarios.`}
            stack={techStack}
          />
          <Card cards={cards} wrapperClassName="flex justify-center items-center p-5 h-20" />
        </section>
        <Footer />
      </div>
    </div>
  );
}