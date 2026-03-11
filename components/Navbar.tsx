import * as React from 'react'
import Link from 'next/link'

export default function Navbar(): React.JSX.Element {
    return (
        <nav className="fixed place-self-center p-[5px] inset-x-0 bottom-10 w-[70%] md:w-[50%] lg:w-[40%] mx-auto
                        bg-[#0000004D] light:bg-[#50505007] border border-[#4D4D4D] light:border-[#929292]
                        backdrop-blur-sm rounded-full"
            >
            <ul className="flex justify-between gap-4 md:gap-10 w-full font-extralight text-xs sm:text-sm md:text-sm text-white light:text-black">
                <Link href="/" className="w-full">
                    <li className="navbar-button">Inicio</li>
                </Link>
                <Link href="/projects" className="w-full">
                    <li className="navbar-button">Proyectos</li>
                </Link>
                <Link href="/about" className="w-full">
                    <li className="navbar-button">Sobre mí</li>
                </Link>
            </ul>
        </nav>
    )
}