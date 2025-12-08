"use client";

import React, { useState } from "react";
import { NewspaperCard, RetroButton, Badge, Sticker, Tape, Marquee } from "./NewspaperUI";
import Doodle from "./Doodle";
import Link from "next/link";
import { api } from "../../../lib/api";

// --- Left Sidebar Components ---

export function MiniProfile({ user }: { user: any }) {
    if (!user) return null;
    const firstName = user.profile?.fullName?.split(" ")[0] || "Student";
    // Fallback to a generative avatar if none exists
    const avatarUrl = user.profile?.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.id}`;

    return (
        <NewspaperCard className="p-4 mb-6 relative" rotate={-1}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <Tape className="w-24 opacity-80" />
            </div>

            <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-100 p-1 border-2 border-black rotate-1 mb-3 shadow-sm">
                    <img
                        src={avatarUrl}
                        alt="Profile"
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                    />
                </div>

                <h3 className="font-display font-black text-xl uppercase">{firstName}</h3>
                <p className="font-mono text-xs text-gray-500 mb-2">{user.profile?.college?.name || "No Campus"}</p>

                <Badge className="bg-black text-white mb-3">LEVEL 1 STUDENT</Badge>

                <p className="text-center font-hand text-lg leading-tight text-gray-600 rotate-[-1deg]">
                    "{user.profile?.bio || "Running on caffeine & deadlines"}"
                </p>
            </div>
        </NewspaperCard>
    );
}

export function NavStack() {
    const navItems = [
        { label: "Feed", href: "/dashboard", icon: "megaphone.svg" },
        { label: "My College", href: "/my-college", icon: "building.svg" }, // Need to resolve slug dynamically in real app
        { label: "Events", href: "/events", icon: "calendar.svg" },
        { label: "Messages", href: "/messages", icon: "mail.svg" },
        { label: "Market", href: "/marketplace", icon: "shopping-bag.svg" },
        { label: "Notes", href: "/notes", icon: "book.svg" },
        { label: "Clubs", href: "/clubs", icon: "group.svg" },
    ];

    return (
        <div className="space-y-3 mb-8">
            {navItems.map((item) => (
                <Link href={item.href} key={item.label} className="block group">
                    <div className="flex items-center gap-3 px-4 py-2 hover:translate-x-1 transition-transform cursor-pointer">
                        <span className="w-6 h-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Doodle src={`/doodles/${item.icon}`} className="w-full h-full" />
                        </span>
                        <span className="font-bold text-lg uppercase tracking-wide group-hover:underline decoration-accent-yellow decoration-4 underline-offset-[-2px]">
                            {item.label}
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export function QuickActions({ onAction }: { onAction: (type: string) => void }) {
    return (
        <div className="border-t-4 border-black border-dashed pt-6 mt-6">
            <p className="font-mono text-xs mb-3 text-gray-500 uppercase text-center">Quick Actions</p>
            <div className="grid grid-cols-3 gap-2">
                <button onClick={() => onAction('post')} className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 bg-accent-yellow border-2 border-black rounded-full flex items-center justify-center shadow-neo-sm group-active:translate-y-0.5 group-active:shadow-none transition-all">
                        <span className="font-black text-xl">+</span>
                    </div>
                    <span className="font-bold text-[10px] uppercase">Post</span>
                </button>
                <button onClick={() => onAction('note')} className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 bg-accent-blue text-white border-2 border-black rounded-full flex items-center justify-center shadow-neo-sm group-active:translate-y-0.5 group-active:shadow-none transition-all">
                        <span className="font-black text-xs">↑</span>
                    </div>
                    <span className="font-bold text-[10px] uppercase">Upload</span>
                </button>
                <button onClick={() => onAction('event')} className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 bg-accent-pink text-white border-2 border-black rounded-full flex items-center justify-center shadow-neo-sm group-active:translate-y-0.5 group-active:shadow-none transition-all">
                        <span className="font-black text-xs">📅</span>
                    </div>
                    <span className="font-bold text-[10px] uppercase">Event</span>
                </button>
            </div>
        </div>
    )
}

// --- Main Feed Components ---

export function PollCard({ post }: { post: any }) {
    const isVoted = false; // TODO: Check if user voted
    const totalVotes = post.poll?.options?.reduce((acc: number, opt: any) => acc + (opt._count?.votes || 0), 0) || 0;
    const [votedOption, setVotedOption] = useState<string | null>(null);

    const handleVote = async (optionId: string) => {
        try {
            await api.votePoll(post.id, optionId);
            setVotedOption(optionId);
            // Optimize: Optimistically update UI
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <NewspaperCard className="mb-6 p-6" rotate={-0.5}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <Badge className="bg-accent-blue text-white mb-2">POLL</Badge>
                    <h3 className="font-display font-black text-xl">{post.poll?.question}</h3>
                </div>
                {!post.isAnonymous && (
                    <div className="text-right">
                        <span className="font-bold text-xs">{post.author?.profile?.fullName}</span>
                    </div>
                )}
            </div>

            <div className="space-y-3">
                {post.poll?.options?.map((option: any) => {
                    const percentage = totalVotes > 0 ? Math.round(((option._count?.votes || 0) / totalVotes) * 100) : 0;
                    return (
                        <div key={option.id} onClick={() => handleVote(option.id)} className="cursor-pointer relative border-2 border-black bg-white p-3 hover:bg-gray-50 transition-colors">
                            <div className="absolute top-0 left-0 h-full bg-accent-blue/20 transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                            <div className="relative z-10 flex justify-between font-bold text-sm">
                                <span>{option.text}</span>
                                <span>{percentage}%</span>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="mt-4 text-xs font-mono text-gray-500 text-right">
                {totalVotes} Votes • Ends {post.poll?.endDate ? new Date(post.poll.endDate).toLocaleDateString() : 'Never'}
            </div>
        </NewspaperCard>
    )
}

export function CollabCard({ post }: { post: any }) {
    return (
        <NewspaperCard className="mb-6 p-0 bg-yellow-50" rotate={0.5}>
            <div className="bg-black text-white p-3 px-6 flex justify-between items-center">
                <span className="font-mono text-xs uppercase tracking-widest text-accent-yellow">Collboration Call</span>
                <Doodle src="/doodles/idea.svg" className="w-6 h-6 invert" />
            </div>
            <div className="p-6">
                <h3 className="font-display font-black text-2xl uppercase mb-2">{post.title}</h3>
                <p className="font-serif text-lg mb-4">{post.content}</p>

                <div className="flex gap-2 mb-6">
                    <Badge className="bg-white">React</Badge>
                    <Badge className="bg-white">Backend</Badge>
                    <Badge className="bg-white">Design</Badge>
                </div>

                <RetroButton className="w-full">Message Lead</RetroButton>
            </div>
            <div className="bg-gray-100 p-2 text-center text-xs border-t-2 border-black">
                Posted by {post.isAnonymous ? "Anonymous" : post.author?.profile?.fullName}
            </div>
        </NewspaperCard>
    )
}

export function PostCard({ post }: { post: any }) {
    // Route to specialized cards
    if (post.type === 'POLL') return <PollCard post={post} />;
    if (post.type === 'COLLAB') return <CollabCard post={post} />;

    const isAnonymous = post.isAnonymous;
    const authorName = isAnonymous ? "Anonymous User" : (post.author?.profile?.fullName || "Student");
    const campus = post.college?.name || post.author?.profile?.college?.name || "Campus";
    const timeAgo = (date: any) => {
        const d = new Date(date);
        const now = new Date();
        const diff = (now.getTime() - d.getTime()) / 1000;
        if (diff < 60) return "Just now";
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    // Check if post is new (< 24h)
    const isNew = (new Date().getTime() - new Date(post.createdAt).getTime()) < 86400000;

    return (
        <NewspaperCard className="mb-6 p-0 overflow-visible group" rotate={Math.random() < 0.5 ? -0.5 : 0.5}>
            {isNew && <Sticker className="bg-accent-yellow -right-2 -top-2 rotate-12">NEW!</Sticker>}

            <div className="p-4 flex gap-3 items-start border-b border-gray-100 bg-gray-50/50">
                <div className={`w-10 h-10 rounded-full overflow-hidden border border-black shrink-0 ${isAnonymous ? 'bg-black' : 'bg-gray-200'}`}>
                    {isAnonymous ? (
                        <div className="w-full h-full flex items-center justify-center text-white text-xs font-mono">?</div>
                    ) : (
                        <img src={post.author?.profile?.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${post.authorId}`} alt="Avatar" className="w-full h-full object-cover" />
                    )}
                </div>
                <div>
                    <h4 className="font-bold text-sm leading-none">{authorName}</h4>
                    <p className="text-xs text-gray-500 font-mono mt-1">@{campus} • {timeAgo(post.createdAt)}</p>
                </div>
            </div>

            <div className="p-6">
                <p className="font-serif text-lg leading-relaxed text-gray-900 mb-4 whitespace-pre-wrap">
                    {post.content}
                </p>
                {post.imageUrl && (
                    <div className="border-4 border-white shadow-sm rotate-1 mb-4 bg-gray-200">
                        <img src={post.imageUrl} alt="Post Attachment" className="w-full h-auto max-h-96 object-cover" />
                    </div>
                )}
            </div>

            <div className="px-6 py-3 border-t-2 border-black bg-gray-50 flex justify-between items-center">
                <button className="flex items-center gap-2 font-bold text-sm uppercase hover:text-accent-pink transition-colors group/btn">
                    <span className="group-hover/btn:scale-125 transition-transform">💛</span>
                    <span>{post._count?.likes || 0} Likes</span>
                </button>
                <button className="flex items-center gap-2 font-bold text-sm uppercase hover:text-accent-blue transition-colors">
                    <span>💬</span>
                    <span>{post._count?.comments || 0} Comments</span>
                </button>
            </div>
        </NewspaperCard>
    )
}

export function EventTicket({ event }: { event: any }) {
    const date = new Date(event.startsAt);
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const day = date.getDate();

    return (
        <div className="mb-6 relative group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
            {/* Ripped Edge Top (CSS Mask or SVG would be better, but border-style is simple) */}
            <div className="bg-accent-red h-full w-full absolute top-1 left-1 rounded-xl bg-black/10 z-0"></div>

            <NewspaperCard className="relative z-10 flex flex-col md:flex-row min-h-[160px]" noShadow>
                {/* Left: Date Stub */}
                <div className="bg-black text-white p-4 md:w-32 flex flex-col items-center justify-center border-r-2 border-dashed border-gray-600 relative overflow-hidden">
                    <div className="w-4 h-4 bg-white rounded-full absolute -top-2 -right-2 border-2 border-black"></div>
                    <div className="w-4 h-4 bg-white rounded-full absolute -bottom-2 -right-2 border-2 border-black"></div>

                    <span className="text-xl font-mono">{month}</span>
                    <span className="text-5xl font-black text-accent-yellow font-display">{day}</span>
                    <span className="text-xs mt-2 text-gray-400">{date.getFullYear()}</span>
                </div>

                {/* Right: Info */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-white relative">
                    {/* Punch Hole */}
                    <div className="w-4 h-4 bg-gray-100 rounded-full absolute top-1/2 -left-2 -translate-y-1/2 border-2 border-black"></div>

                    <div>
                        <Badge className="bg-accent-pink text-white border-black mb-2 text-[10px]">EVENT</Badge>
                        <h3 className="font-display font-black text-2xl uppercase leading-none mb-2">{event.title}</h3>
                        <p className="font-mono text-xs text-gray-500 flex items-center gap-1">
                            📍 {event.venue || "TBA"} • 🕒 {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <RetroButton variant="primary" className="!px-6 !py-2 text-xs">I'm Going →</RetroButton>
                    </div>
                </div>
            </NewspaperCard>
        </div>
    )
}

// --- Right Sidebar Components ---

export function CollegeRadar() {
    return (
        <NewspaperCard className="bg-accent-yellow p-6 border-4 text-center group cursor-pointer hover:bg-yellow-400" rotate={2}>
            <Doodle src="/doodles/building.svg" className="w-16 h-16 mx-auto mb-2 opacity-80" />
            <h3 className="font-display font-black text-2xl uppercase mb-1">My Campus Hub</h3>
            <p className="font-hand text-lg leading-none mb-0">Tap to teleport →</p>
        </NewspaperCard>
    )
}

export function TrendingMarquee() {
    return (
        <div className="bg-black text-white py-2 font-mono text-xs border-2 border-black my-6 shadow-neo-sm transform -rotate-1 overflow-hidden">
            <Marquee speed={20}>
                📣 ROBOTICS_COMPETITION_REGISTRATION_OPEN  ///  🚨 EXAM_SCHEDULE_OUT_CHECK_NOTES  ///  🛒 SOMEONE_IS_SELLING_A_BIKE_FOR_$50 ///
            </Marquee>
        </div>
    )
}
