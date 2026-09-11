import Card from "@/components/Card";
import Background from "@/components/Backgrounds";
import Footer from "@/components/Footer";
import TunelWebGPU from "@/components/TunelWebGPU";
import AnimatableLight from "@/components/animation/AnimatableLight";
import { SquareTerminal } from "lucide-react";

import { DataService } from "@/services/DataService";

const service = new DataService();

const cardItem = "projects.json";
const cards = await service.getCardItem(cardItem);

export default function Projects() {
    return (
        <div className="relative min-h-screen">
            <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none select-none overflow-hidden">
                <TunelWebGPU />
            </div>
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
            <section className="pb-20 md:pb-28">
                <Card cards={cards} />
            </section>
            <Footer />
        </div>
    )
}