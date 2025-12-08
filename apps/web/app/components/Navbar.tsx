"use client";

import Link from "next/link";
import { RetroButton } from "./ui/NewspaperUI";

interface NavbarProps {
    showLinks?: boolean;
}

export default function Navbar({ showLinks = true }: NavbarProps) {
    return (
        <nav className="flex justify-between items-center mb-8 px-4 py-4 md:mb-12">
            <Link
                href="/"
                className="flex items-center gap-2 transform -rotate-2 hover:rotate-0 transition-transform cursor-pointer"
            >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-accent-yellow border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-black font-black text-xl md:text-2xl font-display">
                    L
                </div>
                <span className="font-display font-black text-2xl md:text-3xl tracking-wide text-black drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                    LINKER
                </span>
            </Link>

            <div className="flex gap-2">
                {showLinks && (
                    <div className="hidden md:flex gap-2">
                        {/* Links removed as per user request for landing page, but kept option if needed elsewhere */}
                    </div>
                )}

                <Link href="/login">
                    <RetroButton variant="secondary" className="ml-2 text-sm md:text-base px-4 py-2">
                        Login
                    </RetroButton>
                </Link>
                <Link href="/register">
                    <RetroButton variant="primary" className="ml-2 text-sm md:text-base px-4 py-2 hidden md:inline-flex">
                        Join Club
                    </RetroButton>
                </Link>
            </div>
        </nav>
    );
}
