"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    School,
    Calendar,
    ShoppingBag,
    MessageCircle,
    Menu,
    X
} from "lucide-react";

const NAV_ITEMS = [
    { id: 'feed', label: 'Home', href: '/dashboard', icon: Home, color: 'bg-accent-yellow' },
    { id: 'campus', label: 'Campus', href: '/my-college', icon: School, color: 'bg-accent-blue' },
    { id: 'events', label: 'Events', href: '/events', icon: Calendar, color: 'bg-accent-red' },
    { id: 'market', label: 'Market', href: '/marketplace', icon: ShoppingBag, color: 'bg-accent-pink' },
    { id: 'messages', label: 'Messages', href: '/messages', icon: MessageCircle, color: 'bg-accent-purple' },
];

export default function OrbitNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Mobile Dock View
    const MobileDock = () => (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
            <div className="bg-white border-thick border-black rounded-full shadow-neo flex justify-around items-center p-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.id} href={item.href}>
                            <div className={`p-2 rounded-full transition-colors ${isActive ? item.color : 'hover:bg-gray-100'}`}>
                                <item.icon className="w-5 h-5 text-black" />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );

    // Desktop Orbit Wheel
    const DesktopOrbit = () => (
        <div className="hidden md:block fixed bottom-8 left-8 z-orbitnav">
            <div className="relative w-16 h-16">

                {/* Main Toggle Button */}
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute z-50 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-neo-lg hover:shadow-neo transition-shadow"
                >
                    {isOpen ? <X className="w-8 h-8" /> : <div className="w-8 h-8 flex items-center justify-center font-black text-xl">L</div>}
                </motion.button>

                {/* Orbiting Items */}
                <AnimatePresence>
                    {isOpen && NAV_ITEMS.map((item, index) => {
                        const angle = index * (100 / (NAV_ITEMS.length - 1)); // Spread across arc
                        // Calculate position on a quarter circle (bottom-left origin)
                        // Actually let's do a semi-circle or just fan out upwards/rightwards

                        // Let's do a "fan" out to top-right
                        const radius = 100;
                        const rad = ((index * 15) - 15) * (Math.PI / 180); // -15 to +something degrees

                        // Simple vertical stack or fan?
                        // "Circular wheel" implies radial.
                        // Let's place them in a radial arc around the button.

                        const fanAngle = -15 + (index * 45);

                        // Let's use simpler relative positioning for now: Stack expanding upwards

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                                animate={{
                                    opacity: 1,
                                    x: 20 + (index * 60),
                                    y: - (index % 2 === 0 ? 10 : 0),
                                    scale: 1
                                }}
                                exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="absolute left-4 top-2 pointer-events-auto"
                            >
                                <Link href={item.href}>
                                    <motion.div
                                        className={`
                                            w-14 h-14 rounded-full border-2 border-black flex items-center justify-center 
                                            shadow-neo hover:scale-110 transition-transform ${item.color}
                                            tooltip-trigger group
                                        `}
                                        whileHover={{ y: -5 }}
                                    >
                                        <item.icon className="w-6 h-6 text-black" />

                                        {/* Label Tooltip */}
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap font-bold">
                                            {item.label}
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );

    return (
        <>
            <MobileDock />
            <DesktopOrbit />
        </>
    );
}
