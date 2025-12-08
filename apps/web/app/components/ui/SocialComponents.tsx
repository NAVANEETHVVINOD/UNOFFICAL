"use client";

import React, { useState } from "react";
import { NewspaperCard, RetroButton, Badge, Sticker, Tape, Marquee } from "./NewspaperUI";
import Doodle from "./Doodle";
import Link from "next/link";
import { api } from "../../../lib/api";
import { Home, Building2, Calendar, ShoppingBag, Mail, BookOpen, Users } from "lucide-react";

// --- Left Sidebar Components ---

export function MiniProfile({ user }: { user: any }) {
    if (!user) return null;
    const firstName = user.profile?.fullName?.split(" ")[0] || "Student";
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

export function NavStack({ user }: { user?: any }) {
    const collegeSlug = user?.profile?.college?.slug;
    const collegeHref = collegeSlug ? `/colleges/${collegeSlug}` : '/onboarding';

    const navItems = [
        { label: "Home", href: "/dashboard", icon: Home },
        { label: "Campus", href: collegeHref, icon: Building2 },
        { label: "Events", href: "/events", icon: Calendar },
        { label: "Market", href: "/marketplace", icon: ShoppingBag },
        { label: "Messages", href: "/messages", icon: Mail },
        { label: "Notes", href: "/notes", icon: BookOpen },
        { label: "Clubs", href: "/clubs", icon: Users },
    ];

    return (
        <div className="space-y-2 mb-8">
            {navItems.map((item) => (
                <Link href={item.href} key={item.label} className="block group">
                    <div className="flex items-center gap-3 px-4 py-3 hover:translate-x-2 transition-transform cursor-pointer rounded-xl hover:bg-black hover:text-white border-2 border-transparent hover:border-black transition-colors">
                        <item.icon className="w-6 h-6 stroke-[2.5px]" />
                        <span className="font-bold text-lg uppercase tracking-wide">
                            {item.label}
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export function InlinePostCreate({ user, onClick }: { user: any, onClick: (type?: string) => void }) {
    return (
        <NewspaperCard className="mb-8 p-4 flex items-center gap-4" rotate={0}>
            <div className="w-12 h-12 rounded-full border-2 border-black overflow-hidden bg-gray-200 shrink-0 shadow-sm">
                <img src={user?.profile?.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.id}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <button
                onClick={() => onClick()}
                className="flex-1 text-left bg-gray-50 hover:bg-white border-2 border-gray-200 hover:border-black rounded-xl px-4 py-3 text-gray-500 font-bold transition-all"
            >
                Write something chaotic...
            </button>
            <div className="flex gap-1">
                <button onClick={() => onClick('MEDIA')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 font-bold text-lg" title="Upload Media">
                    📷
                </button>
                <button onClick={() => onClick('POLL')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 font-bold text-lg" title="Create Poll">
                    📊
                </button>
                <button onClick={() => onClick('COLLAB')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 font-bold text-lg" title="Collab Call">
                    🤝
                </button>
            </div>
        </NewspaperCard>
    )
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
                <button onClick={() => onAction('market')} className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 bg-green-400 text-black border-2 border-black rounded-full flex items-center justify-center shadow-neo-sm group-active:translate-y-0.5 group-active:shadow-none transition-all">
                        <span className="font-black text-xs">💰</span>
                    </div>
                    <span className="font-bold text-[10px] uppercase">Sell</span>
                </button>
                <button onClick={() => onAction('club')} className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 bg-purple-400 text-white border-2 border-black rounded-full flex items-center justify-center shadow-neo-sm group-active:translate-y-0.5 group-active:shadow-none transition-all">
                        <span className="font-black text-xs">🛡️</span>
                    </div>
                    <span className="font-bold text-[10px] uppercase">Club</span>
                </button>
            </div>
        </div>
    )
}

// --- Main Feed Components ---

export function PollCard({ post }: { post: any }) {
    const [optimisticOptions, setOptimisticOptions] = useState(post.poll?.options || []);
    const [optimisticTotalVotes, setOptimisticTotalVotes] = useState(
        post.poll?.options?.reduce((acc: number, opt: any) => acc + (opt._count?.votes || 0), 0) || 0
    );
    const [votedOption, setVotedOption] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleVote = async (optionId: string) => {
        if (votedOption || isSubmitting) return;

        setIsSubmitting(true);
        const previousOptions = [...optimisticOptions];
        const previousTotal = optimisticTotalVotes;

        setOptimisticOptions((prev: any) => prev.map((opt: any) => {
            if (opt.id === optionId) {
                return { ...opt, _count: { votes: (opt._count?.votes || 0) + 1 } };
            }
            return opt;
        }));
        setOptimisticTotalVotes((prev: number) => prev + 1);
        setVotedOption(optionId);

        try {
            await api.votePoll(post.id, optionId);
        } catch (e: any) {
            console.error(e);
            setOptimisticOptions(previousOptions);
            setOptimisticTotalVotes(previousTotal);
            setVotedOption(null);
            alert("Failed to record vote. You may have already voted.");
        } finally {
            setIsSubmitting(false);
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
                {optimisticOptions.map((option: any) => {
                    const percentage = optimisticTotalVotes > 0 ? Math.round(((option._count?.votes || 0) / optimisticTotalVotes) * 100) : 0;
                    const isSelected = votedOption === option.id;

                    return (
                        <div
                            key={option.id}
                            onClick={() => handleVote(option.id)}
                            className={`relative border-2 border-black p-3 transition-colors ${votedOption ? 'cursor-default' : 'cursor-pointer hover:bg-gray-50'} ${isSelected ? 'bg-blue-50' : 'bg-white'}`}
                        >
                            <div
                                className={`absolute top-0 left-0 h-full transition-all duration-500 ${isSelected ? 'bg-accent-blue/30' : 'bg-gray-200/50'}`}
                                style={{ width: `${percentage}%` }}
                            ></div>

                            <div className="relative z-10 flex justify-between font-bold text-sm">
                                <span className="flex items-center gap-2">
                                    {isSelected && <span>✅</span>}
                                    {option.text}
                                </span>
                                <span>{percentage}%</span>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="mt-4 text-xs font-mono text-gray-500 text-right">
                {optimisticTotalVotes} Votes • Ends {post.poll?.endDate ? new Date(post.poll.endDate).toLocaleDateString() : 'Never'}
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
            <div className="bg-accent-red h-full w-full absolute top-1 left-1 rounded-xl bg-black/10 z-0"></div>

            <NewspaperCard className="relative z-10 flex flex-col md:flex-row min-h-[160px]" noShadow>
                <div className="bg-black text-white p-4 md:w-32 flex flex-col items-center justify-center border-r-2 border-dashed border-gray-600 relative overflow-hidden">
                    <div className="w-4 h-4 bg-white rounded-full absolute -top-2 -right-2 border-2 border-black"></div>
                    <div className="w-4 h-4 bg-white rounded-full absolute -bottom-2 -right-2 border-2 border-black"></div>

                    <span className="text-xl font-mono">{month}</span>
                    <span className="text-5xl font-black text-accent-yellow font-display">{day}</span>
                    <span className="text-xs mt-2 text-gray-400">{date.getFullYear()}</span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between bg-white relative">
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
        <Link href="/colleges/my-college" className="block"> 
           <NewspaperCard className="bg-accent-yellow p-6 border-4 text-center group cursor-pointer hover:bg-yellow-400" rotate={2}>
            <Building2 className="w-16 h-16 mx-auto mb-2 opacity-80" strokeWidth={1.5} />
            <h3 className="font-display font-black text-2xl uppercase mb-1">My Campus Hub</h3>
            <p className="font-hand text-lg leading-none mb-0">Tap to teleport →</p>
        </NewspaperCard>
        </Link>
    )
}

export function LinkerNews() {
    const news = [
        { id: 1, title: "Campus Fest Announced!", tag: "OFFICIAL" },
        { id: 2, title: "Exam Dates Rescheduled", tag: "ACADEMIC" },
        { id: 3, title: "New Cafeteria Menu 🍔", tag: "LIFE" },
        { id: 4, title: "Robotics Club Wins Gold", tag: "CLUB" },
        { id: 5, title: "Lost ID Card Found @ Lib", tag: "LOST" },
    ];

    return (
        <NewspaperCard className="p-4 border-4 mb-6" rotate={1}>
            <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-2">
                <h3 className="font-display font-black text-xl uppercase">Linker News</h3>
                <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>
            </div>
            <div className="space-y-3">
                {news.map((item, i) => (
                    <div key={item.id} className="group cursor-pointer">
                        <div className="flex justify-between items-start">
                            <span className="text-gray-400 font-mono text-xs mr-2">0{i + 1}</span>
                            <p className="font-bold text-sm leading-tight hover:underline decoration-accent-yellow decoration-2 underline-offset-2 flex-1">
                                {item.title}
                            </p>
                        </div>
                        <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1 rounded ml-6 mt-1 inline-block">
                            #{item.tag}
                        </span>
                    </div>
                ))}
            </div>
            <button className="w-full mt-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors border-t-2 border-black pt-2">
                Read All Stories →
            </button>
        </NewspaperCard>
    )
}

export function TrendingMarquee() {
    return (
        <div className="bg-black text-white py-4 font-display text-lg tracking-wider border-y-4 border-black shadow-neo-sm overflow-hidden sticky z-40 top-[64px]">
            <Marquee speed={40}>
                 📢 CAMPUS_FEST_REGISTRATIONS_OPEN /// 🍔 FREE_PIZZA_AT_HACKATHON /// 🚨 EXAM_RESULTS_OUT /// 🎸 LIVE_MUSIC_TONIGHT
            </Marquee>
        </div>
    )
}
