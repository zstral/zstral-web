import * as React from "react";
import Image from "next/image";

interface AvatarProps {
    src: string;
    alt: string | undefined;
}

export default function Avatar({ src, alt }: AvatarProps): React.JSX.Element {
    return (
        <div className="relative w-full h-full">
            <Image
                className="object-cover object-center rounded-[10px]"
                src={src}
                alt={alt || ""}
                fill
                sizes="(max-width: 768px) 5rem, 200px"
            />
        </div>
    );
}