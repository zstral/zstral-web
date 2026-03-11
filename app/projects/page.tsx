import Card from "@/components/Card";
import Carousel from "@/components/Carousel";
import Background from "@/components/Backgrounds";
import Footer from "@/components/Footer";
import AnimatableLight from "@/components/animation/AnimatableLight";
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
            <section className="relative flex flex-col pt-30 md:pt-40 pb-10 md:pb-20 gap-5">
                <AnimatableLight className="absolute top-[6.5rem] left-0 w-[50vw] aspect-[2/1] z-[-1]">
                    <Background
                        className="object-contain object-left-top"
                        src="/assets/hlight.svg"
                        lightSrc="/assets/hlight.svg"
                        alt="Background Decorative"
                        fill
                        priority
                    />
                </AnimatableLight>
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
            <div className="absolute bottom-0 left-0 w-full h-full -z-10">
                <Background
                    className="object-bottom object-contain"
                    src="/assets/vectorholeb-d.svg"
                    lightSrc="/assets/vectorholeb-l.svg"
                    alt="Background Decorative"
                    fill
                    priority
                />
            </div>
        </div>
    )
}