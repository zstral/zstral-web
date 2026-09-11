import Image from "next/image";
import BrandBadge from "@/components/BrandBadge";
import { TechStackItem } from "./TechStackGrid";
import { GraduationCap, MapPin, Mail } from "lucide-react";
import { Github } from "./icon/Github";
import { Linkedin } from "./icon/Linkedin";

interface UserCardProps {
  title: string;
  description: string;
  stack: TechStackItem[];
}

export default function UserCard({ title, description, stack }: UserCardProps) {
  return (
    <div className="w-full max-w-4xl p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl bg-[#000000cc] light:bg-[#30303033] backdrop-blur-[4px] border border-[#111111] light:border-[#c0c0c0] transition-all duration-300">
      <div className="flex flex-col md:flex-row items-stretch gap-8 md:gap-10">
        <div className="w-full sm:w-64 md:w-64 shrink-0 flex flex-col">
          <BrandBadge className="h-full" />
        </div>

        <div className="flex flex-col flex-1 gap-5 w-full text-center md:text-left">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#f3f3f3] light:text-[#111111] tracking-tight">
              {title}
            </h1>
            <p className="text-sm md:text-base text-neutral-400 light:text-neutral-600 font-normal">
              Analista Programador &middot; Desarrollador Fullstack
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs text-neutral-300 light:text-neutral-700">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 light:bg-black/5 border border-white/10 light:border-black/10">
              <GraduationCap size={14} className="text-neutral-400" />
              Duoc UC
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 light:bg-black/5 border border-white/10 light:border-black/10">
              <MapPin size={14} className="text-neutral-400" />
              Santiago, Chile
            </span>
          </div>

          <p className="text-sm md:text-base text-neutral-300 light:text-neutral-700 leading-relaxed font-light whitespace-pre-line">
            {description}
          </p>

          <div className="flex flex-col gap-3 pt-2">
            <h3 className="text-xs uppercase tracking-wider text-neutral-400 light:text-neutral-500 font-mono">
              Tecnologías frecuentes
            </h3>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              {stack.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 light:bg-black/5 border border-white/10 light:border-black/10 hover:border-white/30 light:hover:border-black/30 transition-colors"
                >
                  <div className="relative w-4 h-4 sm:w-5 sm:h-5 shrink-0">
                    <Image
                      src={item.logoUrl}
                      alt={item.alt || ""}
                      fill
                      className="object-contain"
                    />
                  </div>
                  {item.alt && (
                    <span className="text-xs font-normal text-neutral-200 light:text-neutral-800">
                      {item.alt}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3 pt-4 border-t border-white/10 light:border-black/10">
            <a
              href="https://www.linkedin.com/in/zstral"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full border border-[#4B4B4B] light:border-[#c0c0c0] text-[#ededed] light:text-[#111111] hover:border-white hover:text-white light:hover:border-black light:hover:text-black hover:bg-white/5 transition-all"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://www.github.com/zstral"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full border border-[#4B4B4B] light:border-[#c0c0c0] text-[#ededed] light:text-[#111111] hover:border-white hover:text-white light:hover:border-black light:hover:text-black hover:bg-white/5 transition-all"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href="mailto:rafaelfernandezgalleguillos@outlook.com"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full border border-[#4B4B4B] light:border-[#c0c0c0] text-[#ededed] light:text-[#111111] hover:border-white hover:text-white light:hover:border-black light:hover:text-black hover:bg-white/5 transition-all"
            >
              <Mail size={14} />
              <span>Contacto</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
