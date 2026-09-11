import * as React from "react";
import Image from "next/image";
import { Layers, Server, ShieldCheck, Code2, Cpu, Database, GitBranch, Terminal, Sparkles, LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  layers: Layers,
  server: Server,
  "shield-check": ShieldCheck,
  shield: ShieldCheck,
  code: Code2,
  cpu: Cpu,
  database: Database,
  git: GitBranch,
  terminal: Terminal,
  sparkles: Sparkles,
};

export interface FocusAreaItem {
  title?: string;
  description: string;
  icon?: string;
  imgSrc?: string;
  imgAlt?: string;
}

interface FocusAreasProps {
  items: FocusAreaItem[];
}

export default function FocusAreas({ items }: FocusAreasProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 w-full max-w-4xl mx-auto">
      {items.map((item, index) => {
        const IconComponent = item.icon ? ICON_MAP[item.icon] : null;

        return (
          <div
            key={index}
            className="group relative flex flex-col gap-4 p-6 rounded-2xl 
                       bg-[#000000cc] light:bg-[#30303033] backdrop-blur-[4px] 
                       border border-[#111111] light:border-[#c0c0c0] 
                       hover:border-[#333333] light:hover:border-[#999999] 
                       transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-11 h-11 rounded-xl bg-white/5 light:bg-black/5 border border-white/10 light:border-black/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
              {IconComponent ? (
                <IconComponent className="w-5 h-5 text-neutral-200 light:text-neutral-800" strokeWidth={1.5} />
              ) : item.imgSrc ? (
                <Image
                  src={item.imgSrc}
                  alt={item.imgAlt || item.title || ""}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              {item.title && (
                <h4 className="text-base font-semibold text-[#f3f3f3] light:text-[#111111] tracking-tight">
                  {item.title}
                </h4>
              )}
              <p className="text-xs sm:text-sm text-neutral-400 light:text-neutral-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

