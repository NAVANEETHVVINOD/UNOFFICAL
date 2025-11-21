"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { NotebookDoodle } from "@/components/animations/Doodles"

const navigationItems = [
  { href: "/dashboard", label: "Home", icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )},
  { href: "/dashboard/clubs", label: "Clubs", icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )},
  { href: "/dashboard/events", label: "Events", icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )},
  { href: "/dashboard/marketplace", label: "Marketplace", icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )},
  { href: "/dashboard/study-materials", label: "Study Hub", icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )},
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#fff] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r-2 border-[#93B5C6] fixed h-full">
        <div className="p-4">
          <Link 
            href="/dashboard" 
            className="text-2xl font-['Permanent_Marker'] text-[#2C3E50] hover:text-[#E74C3C] transition-colors"
          >
            College Connect
          </Link>
        </div>
        
        <nav className="mt-8">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center px-4 py-2 text-[#2C3E50] hover:bg-[#93B5C6]/10 hover:text-[#E74C3C] transition-colors font-['Quicksand']"
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <NotebookDoodle />
        
        {/* Red margin line */}
        <div className="fixed left-[60px] top-0 bottom-0 w-0.5 bg-[#FF7F7F]" />
        
        {/* Top Header */}
        <header className="bg-white border-b-2 border-[#93B5C6] sticky top-0 z-50">
          <div className="flex items-center justify-between px-8 py-4">
            <h1 className="text-xl font-['Permanent_Marker'] text-[#2C3E50]">Dashboard</h1>
            
            <div className="flex items-center space-x-4">
              <button className="font-['Kalam'] text-[#2C3E50] hover:text-[#E74C3C] transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              
              <button className="font-['Quicksand'] bg-[#2C3E50] text-white px-4 py-2 rounded hover:bg-[#E74C3C] transition-colors">
                Profile
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}