"use client"

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '../../components/ui/Container';
import { NewspaperCard, RetroButton, Badge, Tape } from '../../components/ui/NewspaperUI';
import Doodle from '../../components/ui/Doodle';
import DashboardNavbar from '../../components/ui/DashboardNavbar';

interface Message {
    id: string;
    sender: 'me' | 'them';
    text: string;
    timestamp: string;
}

export default function ChatClient({ id }: { id: string }) {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'them', text: 'Hey! Is the drafter still available?', timestamp: '10:30 AM' },
        { id: '2', sender: 'me', text: 'Yes, it is! When can you pick it up?', timestamp: '10:32 AM' },
        { id: '3', sender: 'them', text: 'I can come by the canteen at 1 PM.', timestamp: '10:35 AM' },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg: Message = {
            id: Date.now().toString(),
            sender: 'me',
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, msg]);
        setNewMessage('');
    };

    return (
        <div className="min-h-screen bg-[#f0f0f0] flex flex-col">
            <DashboardNavbar />

            <Container className="flex-grow py-4 flex flex-col h-[calc(100vh-80px)]">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => router.back()} className="hover:-translate-x-1 transition-transform">
                        ← BACK
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-black overflow-hidden bg-gray-200">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg leading-none">Alex Johnson</h2>
                            <span className="text-xs text-gray-500 font-mono">Engineering College</span>
                        </div>
                    </div>
                </div>

                <NewspaperCard className="flex-grow flex flex-col p-0 overflow-hidden bg-white relative">
                    <Tape className="absolute top-2 left-1/2 -translate-x-1/2 z-10" />

                    {/* Messages Area */}
                    <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-[url('/doodles/grid.png')] bg-repeat">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] ${msg.sender === 'me'
                                        ? 'bg-accent-yellow rounded-tr-none'
                                        : 'bg-white rounded-tl-none'
                                        }`}
                                >
                                    <p className="font-serif text-sm md:text-base">{msg.text}</p>
                                    <p className="text-[10px] font-mono opacity-50 text-right mt-1">{msg.timestamp}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t-2 border-black bg-gray-50">
                        <form onSubmit={handleSend} className="flex gap-2">
                            <input
                                type="text"
                                className="flex-grow p-3 border-2 border-black rounded-lg font-serif focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <RetroButton type="submit" className="bg-black text-white px-6">
                                SEND
                            </RetroButton>
                        </form>
                    </div>
                </NewspaperCard>
            </Container>
        </div>
    );
}
