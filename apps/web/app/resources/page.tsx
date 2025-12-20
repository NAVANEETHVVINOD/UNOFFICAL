"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { BookOpen, Search, Download, ExternalLink, FileText, Video, Link as LinkIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import CategoryRibbon from "../components/CategoryRibbon";
import ArcMenu from "../components/navigation/ArcMenu";

// Mock Data for Resources
const resources = [
    {
        id: 1,
        title: "Data Structures & Algorithms Notes",
        type: "pdf",
        category: "Computer Science",
        author: "Sarah J.",
        downloads: 1240,
        size: "2.4 MB"
    },
    {
        id: 2,
        title: "Calculus II Previous Year Papers",
        type: "pdf",
        category: "Mathematics",
        author: "Admin",
        downloads: 850,
        size: "5.1 MB"
    },
    {
        id: 3,
        title: "Introduction to Psychology Video Lectures",
        type: "video",
        category: "Psychology",
        author: "Prof. Williams",
        views: 530,
        duration: "12h 30m"
    },
    {
        id: 4,
        title: "React.js complete roadmap",
        type: "link",
        category: "Web Development",
        author: "DevCommunity",
        clicks: 2100
    },
    {
        id: 5,
        title: "Organic Chemistry Cheat Sheet",
        type: "pdf",
        category: "Chemistry",
        author: "Mike R.",
        downloads: 3200,
        size: "1.2 MB"
    }
];

const categories = ["All", "Computer Science", "Mathematics", "Psychology", "Web Development", "Chemistry", "Economics"];

export default function ResourcesPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredResources = resources.filter(res => {
        const matchesCategory = activeCategory === "All" || res.category === activeCategory;
        const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            res.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-paper dark:bg-dark-bg relative transition-colors duration-300">
            {/* Background Pattern */}
            <div className="fixed inset-0 pointer-events-none z-0 top-16 md:top-20">
                <div className="absolute inset-0 opacity-40 bg-grid dark:opacity-20" />
            </div>

            <Navbar />

            <div className="relative z-10 max-w-[1400px] mx-auto px-4 lg:px-6 pt-24 md:pt-36">

                {/* Navigation */}
                <div className="flex gap-6 pt-4">
                    {/* Sidebar Placeholder or Hidden on Desktop if simplistic */}
                    <div className="hidden lg:block w-[280px] flex-shrink-0">
                        <div className="sticky top-24">
                            <div className="bg-paper border-2 border-ink shadow-neo p-4 rounded-card-lg mb-4">
                                <h3 className="font-display text-lg font-bold mb-2 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-accent-purple" />
                                    Library
                                </h3>
                                <p className="text-sm text-neutral-600">
                                    Access thousands of study materials shared by students and faculty.
                                </p>
                            </div>
                        </div>
                    </div>

                    <main className="flex-1 min-w-0 pb-32 lg:pb-8">
                        <CategoryRibbon />

                        <div className="mt-8 mb-8">
                            <h1 className="font-display text-3xl font-black text-ink mb-2">Student Resources</h1>
                            <p className="text-neutral-500">Find notes, papers, and guides to ace your exams.</p>
                        </div>

                        {/* Search & Filter */}
                        <div className="bg-paper border-2 border-ink shadow-neo rounded-card-lg p-4 mb-8">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                    <input
                                        type="text"
                                        placeholder="Search for resources..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-neutral-50 border-2 border-neutral-200 rounded-lg focus:border-ink focus:outline-none transition-colors"
                                    />
                                </div>
                                <Link href="/resources/upload">
                                    <button className="btn-neo bg-primary text-ink px-6 py-2 font-bold flex items-center gap-2 whitespace-nowrap justify-center">
                                        <Sparkles className="w-4 h-4" />
                                        Upload Resource
                                    </button>
                                </Link>
                            </div>

                            {/* Category Tags */}
                            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all whitespace-nowrap ${activeCategory === cat
                                            ? 'bg-accent-purple text-white border-ink shadow-neo-sm'
                                            : 'bg-white border-neutral-200 text-neutral-600 hover:border-ink'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Resources Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredResources.map((res) => (
                                <motion.div
                                    key={res.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -4 }}
                                    className="bg-paper border-2 border-ink rounded-xl p-4 shadow-neo hover:shadow-neo-lg transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`w-10 h-10 rounded-lg border-2 border-ink flex items-center justify-center ${res.type === 'pdf' ? 'bg-accent-coral/20 text-accent-coral' :
                                            res.type === 'video' ? 'bg-accent-blue/20 text-accent-blue' :
                                                'bg-accent-mint/20 text-accent-mint'
                                            }`}>
                                            {res.type === 'pdf' && <FileText className="w-5 h-5" />}
                                            {res.type === 'video' && <Video className="w-5 h-5" />}
                                            {res.type === 'link' && <LinkIcon className="w-5 h-5" />}
                                        </div>
                                        <span className="text-xs font-mono bg-neutral-100 px-2 py-1 rounded border border-neutral-200">
                                            {res.category}
                                        </span>
                                    </div>

                                    <h3 className="font-display text-lg font-bold leading-tight mb-1 group-hover:text-accent-purple transition-colors">
                                        {res.title}
                                    </h3>
                                    <p className="text-xs text-neutral-500 mb-4">By {res.author}</p>

                                    <div className="flex items-center justify-between text-xs font-medium text-neutral-600 border-t border-neutral-100 pt-3">
                                        <span>
                                            {res.type === 'pdf' ? res.size : res.type === 'video' ? res.duration : 'Link'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            {res.type === 'pdf' ? <Download className="w-3 h-3" /> : <ExternalLink className="w-3 h-3" />}
                                            {res.downloads || res.views || res.clicks} {res.type === 'pdf' ? 'Downloads' : res.type === 'video' ? 'Views' : 'Clicks'}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </main>
                </div>
            </div>

            <ArcMenu onCompose={() => { }} />
        </div>
    );
}
