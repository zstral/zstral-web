"use client";

import * as React from "react";
import { useAdaptiveBackdrop, AdaptiveBackdropOptions } from "@/hooks/useAdaptiveBackdrop";

export interface AdaptiveContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  options?: AdaptiveBackdropOptions;
  children: React.ReactNode;
}

/**
 * Contenedor genérico reutilizable con fondo adaptativo inteligente.
 * Se oscurece automáticamente al pasar sobre elementos blancos o brillantes.
 */
export function AdaptiveContainer({
  as: Component = "div",
  options,
  className = "",
  style,
  children,
  ...props
}: AdaptiveContainerProps): React.JSX.Element {
  const containerRef = React.useRef<HTMLElement>(null);
  const { style: adaptiveStyle } = useAdaptiveBackdrop(containerRef, options);

  return (
    <Component
      ref={containerRef}
      style={{
        ...adaptiveStyle,
        ...style,
      }}
      className={`transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
