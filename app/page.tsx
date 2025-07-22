import Avatar from "@/components/Avatar";
import VantaCanvas from "@/components/VantaCanvas";
import StatsHighlights from "@/components/StatsHighlights";
import Timeline from "@/components/Timeline";

const stats = [
  { title: "05+", subtitle: "Cantidad de proyectos" },
  { title: "10+", subtitle: "Tecnologías utilizadas" },
  { title: "03", subtitle: "Certificaciones" },
]

const items = [
  {
    time: "Mayo 2024",
    title: "Python Essentials I",
    body: "Fundamentos del lenguaje Python, buenas prácticas, diseño, desarrollo y optimización de programas informáticos."
  },
  {
    time: "2023",
    title: "Segundo proyecto",
    body: "Mi segundo proyecto en Next.js"
  },
  {
    time: "2024",
    title: "Tercer proyecto",
    body: "Mi tercer proyecto en Next.js"
  },
]

export default function Home() {
  return (
    <>
      <section>
        <div className="space-y-10">
          <header className="flex justify-between items-center">
            <div className="flex flex-col space-y-5">
              <h1>¡Hola, bienvenido! ☻</h1>
              <p className="flex">Mi nombre es<span className="font-bold">&nbsp;Rafael Fernández</span>, soy
              <span className="text-[#00FF90]">&nbsp;Desarrollador Fullstack</span>.
              </p>
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
            <p className="font-light">
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
      
    </>
  )
}
