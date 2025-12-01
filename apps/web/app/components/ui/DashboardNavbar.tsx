"use client";

import Link from "next/link";
import { useState } from "react";
import { RetroButton } from "./NewspaperUI";
import { useAuth } from "../../context/AuthContext";

export default function DashboardNavbar() {
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="relative mb-12 border-b-2 border-black pb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl group-hover:rotate-12 transition-transform">
              L
            </div>
            <span className="font-pixel text-2xl tracking-widest hidden md:block">
              LINKER_OS
            </span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/dashboard">
            <RetroButton variant="ghost">Dashboard</RetroButton>
          </Link>
          <Link href="/marketplace">
            <RetroButton variant="ghost">Market</RetroButton>
          </Link>
          <Link href="/notes">
            <RetroButton variant="ghost">Notes</RetroButton>
          </Link>
          <Link href="/messages">
            <RetroButton variant="ghost">Messages</RetroButton>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/profile">
            <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-black overflow-hidden hover:scale-105 transition-transform">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Alex`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
          <button
            onClick={logout}
            className="hidden md:block font-mono text-sm hover:underline text-red-600"
          >
            [LOGOUT]
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="space-y-1.5">
              <span
                className={`block w-6 h-0.5 bg-black transition-transform ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-black transition-opacity ${isMenuOpen ? "opacity-0" : ""}`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-black transition-transform ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-2 border-black z-50 p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-2">
          <div className="flex flex-col gap-2">
            <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
              <RetroButton className="w-full justify-start">
                Dashboard
              </RetroButton>
            </Link>
            <Link href="/marketplace" onClick={() => setIsMenuOpen(false)}>
              <RetroButton className="w-full justify-start">Market</RetroButton>
            </Link>
            <Link href="/notes" onClick={() => setIsMenuOpen(false)}>
              <RetroButton className="w-full justify-start">Notes</RetroButton>
            </Link>
            <Link href="/messages" onClick={() => setIsMenuOpen(false)}>
              <RetroButton className="w-full justify-start">
                Messages
              </RetroButton>
            </Link>
            <div className="h-px bg-gray-200 my-2"></div>
            <button
              onClick={logout}
              className="text-left font-mono text-red-600 py-2 px-4 hover:bg-red-50"
            >
              [LOGOUT]
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
