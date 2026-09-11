"use client";

import * as React from "react";
import Image from "next/image";
import { Sparkles, Code2 } from "lucide-react";

interface BrandBadgeProps {
  className?: string;
}

export default function BrandBadge({ className = "" }: BrandBadgeProps): React.JSX.Element {
  return (
    <div
      className={`group relative flex flex-col items-center justify-between w-full h-full min-h-[190px] md:min-h-[220px] rounded-2xl 
                 bg-[#0a0a0a]/90 light:bg-[#f5f5f5]/90 
                 border border-[#262626] light:border-[#dcdcdc] 
                 hover:border-[#4B4B4B] light:hover:border-[#b5b5b5] 
                 overflow-hidden select-none p-5 transition-all duration-300 ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(#333333_1px,transparent_1px)] light:bg-[radial-gradient(#cccccc_1px,transparent_1px)] [background-size:12px_12px] opacity-25 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between w-full text-[10px] text-neutral-400 light:text-neutral-500 font-mono">
        <span className="flex items-center gap-1">
          <Code2 size={12} className="text-neutral-400" />
          <span>DEV.ID</span>
        </span>
        <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-white/5 light:bg-black/5 border border-white/10 light:border-black/10">
          <Sparkles size={10} />
          v2.0
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-2 group-hover:scale-105 transition-transform duration-300">
        <div className="relative w-36 h-10">
          <Image
            src="/assets/logos/logo-zstral.svg"
            alt="Zstral"
            fill
            className="object-contain light:hidden filter drop-shadow-[0_0_12px_rgba(237,210,255,0.2)]"
          />
          <Image
            src="/assets/logos/logo-zstral-b.svg"
            alt="Zstral"
            fill
            className="object-contain hidden light:block filter drop-shadow-[0_0_12px_rgba(0,0,0,0.1)]"
          />
        </div>
        <span className="mt-2 text-[10px] tracking-[0.25em] uppercase font-mono text-neutral-400 light:text-neutral-600">
          Software Engineer
        </span>
      </div>

      <div className="relative z-10 flex items-center justify-between w-full pt-2 border-t border-white/10 light:border-black/10 text-[9px] font-mono text-neutral-400">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ONLINE
        </span>
        <span className="text-neutral-500">SANTIAGO &middot; CL</span>
      </div>
    </div>
  );
}
