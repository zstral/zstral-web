"use client";

import * as React from "react";
import Image from "next/image";
import { Moon, Sun, Mail } from "lucide-react";
import { Github } from "./icon/Github";
import { Linkedin } from "./icon/Linkedin";
import { useTheme } from "next-themes";

export function Topbar(): React.JSX.Element {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    return (
        <div className="fixed place-self-center top-0 z-50 w-full">
            <div className="absolute inset-0 backdrop-blur-xl [mask-image:linear-gradient(to_top,transparent_0%,rgba(0,0,0,0.05)_10%,rgba(0,0,0,0.35)_25%,rgba(0,0,0,0.85)_50%,rgba(0,0,0,0.95)_60%,rgba(0,0,0,0.99)_75%,black_100%)] -z-10" />
            <div className="flex justify-between p-10">

                <div className="flex items-center gap-6">
                    <Image
                        src="/assets/logos/logo-zstral.svg"
                        alt="Zstral"
                        width={118}
                        height={25}
                        priority
                        className="light:hidden"
                    />
                    <Image
                        src="/assets/logos/logo-zstral-b.svg"
                        alt="Zstral"
                        width={118}
                        height={25}
                        priority
                        className="hidden light:block"
                    />

                    <button
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        className="cursor-pointer"
                    >
                        {mounted && theme === "light" ? <Moon strokeWidth={1}/> : <Sun strokeWidth={1}/>}
                    </button>
                </div>

                <div className="flex gap-4">
                    <button>
                        <a
                            href="https://www.linkedin.com/in/zstral"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Linkedin />
                        </a>
                    </button>
                    <button>
                        <a
                            href="https://www.github.com/zstral"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github />
                        </a>
                    </button>
                    <button>
                        <a
                            href="mailto:rafaelfernandezgalleguillos@outlook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Mail strokeWidth={1} />
                        </a>
                    </button>   
                </div>
                
            </div>
        </div>
    )
}