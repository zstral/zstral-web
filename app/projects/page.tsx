import Card from "@/components/Card";
import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import { SquareTerminal } from "lucide-react";

import { DataService } from "@/services/DataService";

const service = new DataService();

const cardItem = "projects.json";
const cards = await service.getCardItem(cardItem);

const carouselItem = "carousel_proj.json";
const carouselItems = await service.getCarouselItem(carouselItem);

export default function Projects() {
    return (
        <div className="relative">
            <div>
                <div className="absolute top-[6.5rem] left-0 w-[50vw] aspect-[2/1] bg-[url(/assets/hlight.svg)] bg-contain bg-no-repeat z-[-1]" />
            </div>
            <section className="flex flex-col pt-40 pb-20 gap-5">
                <h1 className="flex items-center gap-4">Proyectos <SquareTerminal size={30} strokeWidth={1} /> </h1>
                <p>Una selección de proyectos que demuestran mi experiencia en el desarrollo de software, abarcando diversas tecnologías y soluciones.</p>
            </section>
            <section className="pb-20">
                <Carousel items={carouselItems} />
            </section>
            <section>
                <Card cards={cards} />
            </section>
            <Footer />
            <div className="absolute bottom-0 left-0 w-full h-[100vh] bg-[url(/assets/vectorholeb.svg)] bg-cover bg-no-repeat z-[-1]" />
        </div>
    )
}