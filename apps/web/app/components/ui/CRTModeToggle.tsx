"use client";

import { Monitor, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { RetroButton } from "./NewspaperUI";

export default function CRTModeToggle() {
    const [isCRT, setIsCRT] = useState(false);

    useEffect(() => {
        // Check local storage or default
        const saved = localStorage.getItem("linker-crt-mode") === "true";
        setIsCRT(saved);
    }, []);

    const toggleCRT = () => {
        const newState = !isCRT;
        setIsCRT(newState);
        if (newState) {
            document.documentElement.classList.add('crt-active');
            document.body.classList.add('crt-scanlines');
        } else {
            document.documentElement.classList.remove('crt-active');
            document.body.classList.remove('crt-scanlines');
        }
        localStorage.setItem("linker-crt-mode", String(newState));
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 hidden md:block">
            <RetroButton
                onClick={toggleCRT}
                variant="ghost"
                className={`
                p-2 rounded-full border-2 transition-all
                ${isCRT ? 'bg-black text-green-400 border-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'bg-white text-gray-500 border-gray-300 hover:border-black'}
            `}
                title={isCRT ? "Turn off Retro Mode" : "Turn on Retro Mode"}
                aria-label={isCRT ? "Disable CRT effect" : "Enable CRT effect"}
            >
                <Monitor className="w-5 h-5" aria-hidden="true" />

                {isCRT && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                )}
            </RetroButton>
        </div>
    );
}
