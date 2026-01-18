'use client';
import * as React from "react";
import Image, { ImageProps } from "next/image";
import { useTheme } from "next-themes";

interface BackgroundProps extends Omit<ImageProps, 'src'> {
    src: string;
    lightSrc?: string;
}

export default function Backgrounds({ src, lightSrc, alt = "", ...props }: BackgroundProps) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    let finalSrc = src;

    if (resolvedTheme === 'light' && lightSrc) {
        finalSrc = lightSrc;
    }

    return (
        <Image
            src={finalSrc}
            alt={alt}
            {...props}
        />
    );
}
