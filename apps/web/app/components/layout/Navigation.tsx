"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import { MenuDoodle, XDoodle } from "../doodles/AppDoodles";
import { useAuth } from "../../context/AuthContext";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      <motion.nav className="fixed top-0 left-0 right-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-ink/10">
        <div className="container mx-auto px-4 py-2 md:py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 md:h-10 md:w-10 flex items-center justify-center rounded-sm bg-accent-yellow shadow-[3px_3px_0_#000] border-2 border-black">
                <span className="font-display text-sm md:text-base">L</span>
              </div>
              <span className="font-display text-lg md:text-2xl">LINKER</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              {isAuthenticated &&
                ["Events", "Clubs", "Marketplace", "Notes"].map((item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    className="text-ink font-semibold hover:text-accent-blue transition-colors text-sm"
                  >
                    {item}
                  </Link>
                ))}
            </div>

            {/* Login/Logout Button */}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="rounded-full border-2 border-black bg-white px-4 py-1 text-xs md:px-6 md:py-2 md:text-sm font-bold text-black shadow-[2px_2px_0_#000] hover:translate-y-[-2px] hover:shadow-[3px_3px_0_#000] transition-all active:translate-y-[1px] active:shadow-[1px_1px_0_#000]"
              >
                LOGOUT
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-full border-2 border-black bg-black px-4 py-1 text-xs md:px-6 md:py-2 md:text-sm font-bold text-white shadow-[2px_2px_0_#000] hover:translate-y-[-2px] hover:shadow-[3px_3px_0_#000] transition-all active:translate-y-[1px] active:shadow-[1px_1px_0_#000]"
              >
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </motion.nav>
    </>
  );
}
