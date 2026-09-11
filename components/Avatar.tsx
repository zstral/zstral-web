import * as React from "react";
import Image from "next/image";

interface AvatarProps {
  src: string;
  alt?: string;
  className?: string;
}

export default function Avatar({ src, alt, className = "" }: AvatarProps): React.JSX.Element {
  return (
    <div className={`relative w-full h-full rounded-2xl overflow-hidden border border-[#4B4B4B]/50 light:border-[#c0c0c0] shadow-xl ${className}`}>
      <Image
        className="object-cover object-center"
        src={src}
        alt={alt || ""}
        fill
        sizes="(max-width: 768px) 120px, 260px"
        priority
      />
    </div>
  );
}