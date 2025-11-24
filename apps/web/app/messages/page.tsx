"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Container from '../components/ui/Container';
import { NewspaperCard, RetroButton, Badge, Tape } from '../components/ui/NewspaperUI';
import Doodle from '../components/ui/Doodle';
import DashboardNavbar from '../components/ui/DashboardNavbar';

// Mock data for conversations
const MOCK_CONVERSATIONS = [
    {
        id: '1',
        user: {
            name: 'Alex Johnson',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
            college: 'Engineering College'
        },
        lastMessage: 'Is the drafter still available?',
        timestamp: '2 mins ago',
        unread: 2
    },
    {
        id: '2',
        user: {
            name: 'Sarah Smith',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            college: 'Arts College'
        },
        lastMessage: 'Thanks for the notes!',
        timestamp: '1 hour ago',
        unread: 0
    },
    {
        id: '3',
        user: {
            name: 'Robotics Club Lead',
            avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Robotics',
            college: 'Engineering College'
        },
        lastMessage: 'Meeting is rescheduled to 5 PM.',
        timestamp: 'Yesterday',
        unread: 0
    }
];

export default function MessagesPage() {
    return (
        <div className="min-h-screen bg-[#f0f0f0]">
            <DashboardNavbar />
            <Container className="py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="font-display text-4xl font-black">MESSAGES</h1>
                            <p className="font-serif text-gray-600">Slide into DMs (Professionally, please).</p>
                        </div>
                        <RetroButton className="bg-black text-white">NEW MESSAGE</RetroButton>
                    </div>

                    <div className="grid gap-4">
                        {MOCK_CONVERSATIONS.map((conv) => (
                            <Link href={`/messages/${conv.id}`} key={conv.id}>
                                <NewspaperCard className="p-4 hover:bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer bg-[#fffdf0] flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-full border-2 border-black overflow-hidden bg-gray-200">
                                            <img src={conv.user.avatar} alt={conv.user.name} className="w-full h-full object-cover" />
                                        </div>
                                        {conv.unread > 0 && (
                                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent-pink border-2 border-black rounded-full flex items-center justify-center text-xs font-bold text-white">
                                                {conv.unread}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-lg">{conv.user.name}</h3>
                                            <span className="text-xs font-mono text-gray-500">{conv.timestamp}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 font-serif line-clamp-1">
                                            {conv.unread > 0 ? <strong>{conv.lastMessage}</strong> : conv.lastMessage}
                                        </p>
                                        <div className="mt-2">
                                            <Badge className="text-[10px] py-0 px-2 bg-gray-100 border-gray-400 text-gray-600">
                                                {conv.user.college}
                                            </Badge>
                                        </div>
                                    </div>
                                </NewspaperCard>
                            </Link>
                        ))}
                    </div>

                    {MOCK_CONVERSATIONS.length === 0 && (
                        <div className="text-center py-20">
                            <Doodle src="/doodles/sad-face.svg" className="w-32 h-32 mx-auto mb-6 opacity-50" />
                            <h3 className="font-bold text-2xl mb-2">No Messages Yet</h3>
                            <p className="text-gray-600">It's quiet... too quiet.</p>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}
