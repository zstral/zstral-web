"use client";

import * as React from "react";
import {
  CalendarDays,
  Award,
  Briefcase,
  GraduationCap,
  Code2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
} from "lucide-react";

export type TimelineIconType =
  | "calendar"
  | "briefcase"
  | "award"
  | "code"
  | "graduation"
  | "certificate"
  | "star";

export type TimelineStatusType = "completed" | "in-progress" | "current";

export interface TimelineLink {
  url: string;
  label?: string;
}

export interface TimelineItem {
  id?: string | number;
  time: string;
  title: string;
  subtitle?: string;
  body?: string;
  tags?: string[];
  link?: TimelineLink;
  icon?: TimelineIconType;
  status?: TimelineStatusType;
}

export interface TimelineProps {
  items: TimelineItem[];
  variant?: "vertical" | "horizontal" | "compact";
  className?: string;
  collapsible?: boolean;
  initialVisible?: number;
}

function getTimelineIcon(icon?: TimelineIconType) {
  const iconProps = { size: 16, className: "text-[#ededed] light:text-[#111111]" };
  switch (icon) {
    case "briefcase":
      return <Briefcase {...iconProps} />;
    case "graduation":
      return <GraduationCap {...iconProps} />;
    case "code":
      return <Code2 {...iconProps} />;
    case "award":
    case "certificate":
      return <Award {...iconProps} />;
    case "star":
      return <Sparkles {...iconProps} />;
    case "calendar":
    default:
      return <CalendarDays {...iconProps} />;
  }
}

function StatusBadge({ status }: { status?: TimelineStatusType }) {
  if (!status) return null;

  const isCompleted = status === "completed";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        isCompleted
          ? "bg-white/5 border-white/20 text-[#ededed] light:bg-black/5 light:border-black/20 light:text-[#111111]"
          : "bg-white/5 border-white/10 text-neutral-400 light:bg-black/5 light:border-black/10 light:text-neutral-600"
      }`}
    >
      {isCompleted ? <CheckCircle2 size={12} /> : <Clock size={12} />}
      {isCompleted ? "Completado" : "En progreso"}
    </span>
  );
}



function TimelineTagsList({ tags }: { tags?: string[] }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {tags.map((tag, idx) => (
        <span
          key={idx}
          className="text-[11px] px-2 py-0.5 rounded-md bg-[#ffffff0a] light:bg-[#0000000a] text-[#a0a0a0] light:text-[#4a4a4a] border border-[#ffffff14] light:border-[#00000014]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function VerticalTimelineItem({
  item,
  isLast,
}: {
  item: TimelineItem;
  isLast: boolean;
}) {
  return (
    <li className="relative flex gap-6 group">
      <div className="relative flex flex-col items-center">
        <div className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-[#111111] light:bg-[#f5f5f5] border border-[#4B4B4B] light:border-[#c0c0c0] shadow-sm group-hover:border-white/80 light:group-hover:border-black/80 transition-colors shrink-0">
          {getTimelineIcon(item.icon)}
        </div>
        {!isLast && (
          <div className="w-[2px] flex-1 bg-gradient-to-b from-[#4B4B4B] via-[#4B4B4B]/40 to-transparent light:from-[#c0c0c0] light:via-[#c0c0c0]/40 my-2" />
        )}
      </div>

      <div className="flex-1 pb-10">
        <div className="p-5 rounded-2xl border border-[#262626] light:border-[#e5e5e5] hover:border-[#404040] light:hover:border-[#c0c0c0] transition-all duration-300">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <time className="text-xs font-mono tracking-wider text-[#929292] light:text-[#666666]">
              {item.time}
            </time>
            <StatusBadge status={item.status} />
          </div>

          <h4 className="mt-2 text-lg font-semibold text-[#f3f3f3] light:text-[#111111]">
            {item.title}
          </h4>
          {item.subtitle && (
            <p className="text-sm font-medium text-neutral-400 light:text-neutral-600 mt-0.5">
              {item.subtitle}
            </p>
          )}

          {item.body && (
            <p className="mt-2 text-sm text-[#929292] light:text-[#555555] leading-relaxed">
              {item.body}
            </p>
          )}

          <TimelineTagsList tags={item.tags} />
        </div>
      </div>
    </li>
  );
}

function HorizontalTimelineItem({
  item,
  isLast,
}: {
  item: TimelineItem;
  isLast: boolean;
}) {
  return (
    <div className="relative flex flex-col flex-1 min-w-[260px] group">
      <div className="flex items-center w-full mb-4">
        <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-transparent border border-[#4B4B4B] light:border-[#c0c0c0] group-hover:border-white/80 light:group-hover:border-black/80 transition-colors shrink-0">
          {getTimelineIcon(item.icon)}
        </div>
        {!isLast ? (
          <div className="flex-1 h-[2px] bg-[#4B4B4B] light:bg-[#c0c0c0] ml-2" />
        ) : (
          <div className="flex-1 h-[2px] bg-transparent ml-2" />
        )}
      </div>

      <div className="p-4 rounded-2xl border border-[#262626] light:border-[#e5e5e5] hover:border-[#404040] light:hover:border-[#c0c0c0] h-full flex flex-col justify-between transition-all duration-300">
        <div>
          <div className="flex items-center justify-between gap-2">
            <time className="text-xs font-mono text-[#929292] light:text-[#666666]">
              {item.time}
            </time>
            <StatusBadge status={item.status} />
          </div>
          <h4 className="mt-2 text-base font-semibold text-[#f3f3f3] light:text-[#111111]">
            {item.title}
          </h4>
          {item.subtitle && (
            <p className="text-xs font-medium text-neutral-400 light:text-neutral-600 mt-0.5">
              {item.subtitle}
            </p>
          )}
          {item.body && (
            <p className="mt-2 text-xs text-[#929292] light:text-[#555555] leading-relaxed line-clamp-3">
              {item.body}
            </p>
          )}
          <TimelineTagsList tags={item.tags} />
        </div>
      </div>
    </div>
  );
}

function CompactTimelineItem({ item }: { item: TimelineItem }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-[#262626] light:border-[#e5e5e5] last:border-none">
      <div className="mt-1 shrink-0">{getTimelineIcon(item.icon)}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between text-xs">
          <h5 className="font-semibold text-[#f3f3f3] light:text-[#111111]">
            {item.title}
          </h5>
          <time className="text-[#929292] light:text-[#666666] font-mono">
            {item.time}
          </time>
        </div>
        {item.subtitle && (
          <p className="text-xs text-neutral-400 light:text-neutral-600">
            {item.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export default function Timeline({
  items,
  variant = "vertical",
  className = "",
  collapsible = false,
  initialVisible = 3,
}: TimelineProps): React.JSX.Element {
  const [expanded, setExpanded] = React.useState(false);

  if (!items || items.length === 0) {
    return <div className="text-center text-sm text-[#929292] py-6">No hay elementos disponibles.</div>;
  }

  const visibleItems =
    collapsible && !expanded ? items.slice(0, initialVisible) : items;
  const hasMore = collapsible && items.length > initialVisible;

  return (
    <div className={`w-full ${className}`}>
      {variant === "vertical" && (
        <ol className="relative flex flex-col w-full">
          {visibleItems.map((item, index) => (
            <VerticalTimelineItem
              key={item.id ?? index}
              item={item}
              isLast={index === visibleItems.length - 1}
            />
          ))}
        </ol>
      )}

      {variant === "horizontal" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {visibleItems.map((item, index) => (
            <HorizontalTimelineItem
              key={item.id ?? index}
              item={item}
              isLast={index === visibleItems.length - 1}
            />
          ))}
        </div>
      )}

      {variant === "compact" && (
        <div className="flex flex-col w-full">
          {visibleItems.map((item, index) => (
            <CompactTimelineItem key={item.id ?? index} item={item} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#4B4B4B] light:border-[#c0c0c0] text-sm text-[#ededed] light:text-[#111111] hover:border-white hover:text-white light:hover:border-black light:hover:text-black transition-colors cursor-pointer"
          >
            <span>{expanded ? "Ver menos" : `Ver más (${items.length - initialVisible} más)`}</span>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}
