import React, { useEffect, useState } from 'react';
import Doodle from './Doodle';

export function NewspaperCard({ children, className = '', noShadow = false, rotate = 0, variant = 'default' }: { children: React.ReactNode; className?: string; noShadow?: boolean; rotate?: number; variant?: 'default' | 'curved' | 'pixel' }) {
    const radius = variant === 'curved' ? 'rounded-[2.5rem]' : variant === 'pixel' ? 'rounded-none' : 'rounded-xl';

    return (
        <div
            className={`bg-white border-2 border-black transition-all duration-300 ${radius} ${noShadow ? '' : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5'} ${className}`}
            style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}
        >
            {children}
        </div>
    );
}

export function HangingCard({ children, className = '', rotate = 0 }: { children: React.ReactNode; className?: string; rotate?: number }) {
    const [delay, setDelay] = useState('0s');

    useEffect(() => {
        setDelay(`${Math.random() * 2}s`);
    }, []);

    return (
        <div className={`relative animate-swing ${className}`} style={{ animationDelay: delay }}>
            {/* Pin/Tape */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-4 h-4 bg-red-500 rounded-full border-2 border-black shadow-sm"></div>
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-black/20"></div>

            <div
                className={`bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-full`}
                style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}
            >
                {children}
            </div>
        </div>
    );
}

export function Marquee({ children, className = '', speed = 20, direction = 'left' }: { children: React.ReactNode; className?: string; speed?: number; direction?: 'left' | 'right' }) {
    return (
        <div className={`overflow-hidden whitespace-nowrap flex ${className}`}>
            <div className={`animate-marquee flex shrink-0 ${direction === 'right' ? 'animate-marquee-reverse' : ''}`} style={{ animationDuration: `${speed}s` }}>
                {children}
                {children}
            </div>
            <div className={`animate-marquee flex shrink-0 ${direction === 'right' ? 'animate-marquee-reverse' : ''}`} style={{ animationDuration: `${speed}s` }} aria-hidden="true">
                {children}
                {children}
            </div>
        </div>
    );
}

export function RetroButton({ children, onClick, className = '', variant = 'primary' }: { children: React.ReactNode; onClick?: () => void; className?: string; variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }) {
    const baseStyles = "px-8 py-3 font-bold text-sm uppercase tracking-wider border-2 border-black transition-all duration-200 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2 rounded-full";

    const variants = {
        primary: "bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:bg-gray-900",
        secondary: "bg-accent-yellow text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400",
        outline: "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50",
        ghost: "bg-transparent border-transparent shadow-none hover:bg-black/5 !px-4"
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}

export function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <span className={`inline-block px-4 py-1.5 border-2 border-black text-xs font-bold bg-accent-yellow shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-full ${className}`}>
            {children}
        </span>
    );
}

export function Staple({ className = '' }: { className?: string }) {
    return (
        <div className={`w-4 h-10 border-l-2 border-r-2 border-t-2 border-gray-400 rounded-t-md bg-transparent absolute -top-5 left-1/2 transform -translate-x-1/2 z-20 ${className}`} />
    );
}

export function Tape({ className = '' }: { className?: string }) {
    return (
        <div className={`w-32 h-8 bg-accent-yellow/50 backdrop-blur-sm transform -rotate-3 border-l-2 border-black/10 absolute -top-3 left-1/2 -translate-x-1/2 z-10 ${className}`} />
    );
}

export function EventRow({ date, title, time, icon, color = 'bg-accent-yellow' }: { date: string; title: string; time: string; icon: string; color?: string }) {
    return (
        <div className="flex items-center gap-6 py-6 border-b border-gray-100 hover:bg-gray-50 transition-colors group cursor-pointer px-6 first:rounded-t-[2rem] last:rounded-b-[2rem] last:border-b-0">
            <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center shrink-0 border border-black shadow-sm`}>
                <Doodle src={icon} className="w-6 h-6" />
            </div>
            <div className="w-32 shrink-0">
                <p className="font-bold text-sm">{date}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{time}</p>
            </div>
            <div className="flex-1">
                <h3 className="font-serif text-xl italic text-gray-800 group-hover:text-black transition-colors">{title}</h3>
            </div>
            <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                <span className="w-8 h-8 rounded-full border border-black flex items-center justify-center bg-white">→</span>
            </div>
        </div>
    );
}

export function Sticker({ children, className = '', rotate = 0 }: { children: React.ReactNode; className?: string; rotate?: number }) {
    return (
        <div
            className={`absolute z-30 inline-flex items-center justify-center px-3 py-1 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold text-xs uppercase tracking-wider ${className}`}
            style={{ transform: `rotate(${rotate}deg)` }}
        >
            {children}
        </div>
    );
}
