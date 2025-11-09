import UserCard from "@/components/UserCard";
import Card from "@/components/Card";
import { DataService } from "@/services/DataService";

const service = new DataService();

const techStackItems = "tech_stack_user.json";
const techStack = await service.getTechStack(techStackItems);

const cardItem = "user_info.json";
const cards = await service.getCardItem(cardItem);

export default function About() {
  return (
    <>
      <div className="absolute w-full min-h-full bg-[url(/assets/vectorhole.svg)] bg-cover bg-no-repeat bg-center bg-fixed" />
      <div className="absolute w-full min-h-full bg-[url(/assets/sphere.svg)] bg-top bg-no-repeat bg-fixed" />
      <section className="flex flex-col items-center justify-center gap-5 pt-26 pb-30">
        <UserCard
          title="Rafael Fernández"
          description={`Formado en Duoc UC como Analista Programador.\nComprometido con el aprendizaje constante y la excelencia técnica.
                        Busco siempre crear soluciones que aporten un valor real, optimicen procesos y mejoren la experiencia de los usuarios.`}
          stack={techStack}
        />
        <Card cards={cards} wrapperClassName="flex justify-center items-center p-5 h-20" />
      </section>
    </>
  );
}