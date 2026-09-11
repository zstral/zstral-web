"use client";

import * as React from "react";
import { Terminal } from "lucide-react";

interface DevTerminalProps {
  className?: string;
}

export default function DevTerminal({ className = "" }: DevTerminalProps): React.JSX.Element {
  return (
    <div
      className={`relative flex flex-col justify-between w-full h-full min-h-[190px] md:min-h-[220px] rounded-2xl 
                 bg-[#0a0a0a]/90 light:bg-[#f5f5f5]/90 
                 border border-[#262626] light:border-[#dcdcdc] 
                 shadow-xl shadow-black/40 overflow-hidden font-mono select-none ${className}`}
    >
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#141414] light:bg-[#ebebeb] border-b border-[#262626] light:border-[#dcdcdc]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80" />
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 light:text-neutral-600">
          <Terminal size={11} />
          <span>dev.ts</span>
        </div>
      </div>

      <div className="p-3.5 text-[11px] sm:text-xs leading-relaxed flex flex-col gap-1 text-neutral-300 light:text-neutral-700">
        <div className="text-neutral-400">
          <span className="text-purple-400 light:text-purple-600">const</span>{" "}
          <span className="text-blue-400 light:text-blue-600">developer</span> = &#123;
        </div>
        <div className="pl-3">
          <span className="text-neutral-400">name:</span>{" "}
          <span className="text-emerald-400 light:text-emerald-600">&apos;Rafael F.&apos;</span>,
        </div>
        <div className="pl-3">
          <span className="text-neutral-400">role:</span>{" "}
          <span className="text-emerald-400 light:text-emerald-600">&apos;Fullstack&apos;</span>,
        </div>
        <div className="pl-3">
          <span className="text-neutral-400">focus:</span>{" "}
          <span className="text-emerald-400 light:text-emerald-600">&apos;.NET &middot; React&apos;</span>,
        </div>
        <div className="pl-3">
          <span className="text-neutral-400">location:</span>{" "}
          <span className="text-emerald-400 light:text-emerald-600">&apos;Chile&apos;</span>
        </div>
        <div className="text-neutral-400">&#125;;</div>
      </div>

      <div className="px-3.5 py-1.5 bg-[#141414]/50 light:bg-[#ebebeb]/50 border-t border-[#262626]/50 light:border-[#dcdcdc]/50 flex items-center justify-between text-[10px] text-neutral-400">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          online
        </span>
        <span className="font-mono text-[9px] text-neutral-500">utf-8</span>
      </div>
    </div>
  );
}
