import * as React from "react";
import Image from "next/image";

interface AvatarProps {
    src: string;
    alt: string | undefined;
    size: number;
}

export default function Avatar({ src, alt, size }: AvatarProps): React.JSX.Element {
    return (
        <Image
            className="rounded-[10px]"
            src={src}
            alt={alt || ""}
            width={size}
            height={size}
        />
    );
}