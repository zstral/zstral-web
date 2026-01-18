"use client";

import * as React from "react";
import { Moon, Sun, Mail } from "lucide-react";
import { Github } from "./icon/Github";
import { Linkedin } from "./icon/Linkedin";
import { useTheme } from "next-themes";

export function Topbar(): React.JSX.Element {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    return (
        <div className="fixed place-self-center top-0 z-10 w-full">
            <div className="flex justify-between p-10">

                <button 
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="cursor-pointer"
                >
                    {mounted && theme === "light" ? <Moon strokeWidth={1}/> : <Sun strokeWidth={1}/>}
                </button>

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