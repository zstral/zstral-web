import * as React from 'react'
import Link from 'next/link'

export default function Navbar(): React.JSX.Element {
    return (
        <nav className="fixed place-self-center p-[5px] inset-x-0 bottom-10 w-xl
                        bg-[#0000004D] border border-[#4D4D4D] backdrop-blur-sm
                        rounded-full"
            >
            <ul className="flex justify-between gap-10 font-extralight text-sm text-white">
                <Link href="/">
                    <li className="navbar-button">Inicio</li>
                </Link>
                <Link href="/projects">
                    <li className="navbar-button">Proyectos</li>
                </Link>
                <Link href="/about">
                    <li className="navbar-button">Sobre mí</li>
                </Link>
            </ul>
        </nav>
    )
}