"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: "/", label: "Inicio" },
  { href: "/projects", label: "Proyectos" },
  { href: "/about", label: "Sobre mí" },
];

function getElementLuminance(el: Element): number | null {
  const bg = window.getComputedStyle(el).backgroundColor;
  if (!bg) return null;
  const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return null;
  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
  if (a < 0.2) return null;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export default function Navbar(): React.JSX.Element {
  const navRef = React.useRef<HTMLElement>(null);
  const itemRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);
  const [isDarkList, setIsDarkList] = React.useState<boolean[]>([true, true, true]);
  const pathname = usePathname();

  React.useEffect(() => {
    let ticking = false;

    const checkLuminance = () => {
      const isLightMode = document.documentElement.classList.contains("light");
      const defaultDark = !isLightMode;

      const results = itemRefs.current.map((item) => {
        if (!item || !navRef.current) return defaultDark;
        const rect = item.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const elements = document.elementsFromPoint(x, y);
        for (const el of elements) {
          if (navRef.current.contains(el)) continue;
          let current: Element | null = el;
          while (current && current !== document.body && current !== document.documentElement) {
            const lum = getElementLuminance(current);
            if (lum !== null) {
              return lum <= 0.5;
            }
            current = current.parentElement;
          }
        }
        return defaultDark;
      });

      setIsDarkList(results);
      ticking = false;
    };

    const handleUpdate = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkLuminance);
        ticking = true;
      }
    };

    handleUpdate();
    window.addEventListener("scroll", handleUpdate, { passive: true });
    window.addEventListener("resize", handleUpdate, { passive: true });

    const observer = new MutationObserver(handleUpdate);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("scroll", handleUpdate);
      window.removeEventListener("resize", handleUpdate);
      observer.disconnect();
    };
  }, [pathname]);

  return (
    <nav
      ref={navRef}
      className="fixed place-self-center p-[5px] inset-x-0 bottom-10 w-[70%] md:w-[50%] lg:w-[40%] mx-auto bg-[#0000004D] light:bg-[#50505007] border border-[#4D4D4D] light:border-[#929292] backdrop-blur-sm rounded-full z-50 transition-colors duration-300"
    >
      <ul className="flex justify-between gap-4 md:gap-10 w-full font-light text-xs sm:text-sm md:text-sm">
        {NAV_ITEMS.map((item, index) => {
          const isDark = isDarkList[index] ?? true;
          return (
            <Link
              key={item.href}
              href={item.href}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="w-full"
            >
              <li className="navbar-button">
                <span
                  className={`transition-colors duration-200 select-none ${
                    isDark ? "text-white" : "text-[#111111]"
                  }`}
                >
                  {item.label}
                </span>
              </li>
            </Link>
          );
        })}
      </ul>
    </nav>
  );
}