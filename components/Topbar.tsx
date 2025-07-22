import * as React from "react";
import { Moon, Mail } from "lucide-react";
import { Github } from "./icon/Github";
import { Linkedin } from "./icon/Linkedin";

export function Topbar(): React.JSX.Element {
    return (
        <div className="fixed place-self-center top-0 z-10 w-full">
            <div className="flex justify-between p-10">
                <div>
                    <Moon strokeWidth={1}/>
                </div>
                <div className="flex gap-4">
                    <Linkedin />
                    <Github />
                    <Mail strokeWidth={1} />
                </div>
            </div>
        </div>
    )
}