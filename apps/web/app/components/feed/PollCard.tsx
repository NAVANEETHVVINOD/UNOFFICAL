"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

export default function PollCard({ poll }: { poll: any }) {
    const [votedOption, setVotedOption] = useState<string | null>(null);
    const [totalVotes, setTotalVotes] = useState(142); // Mock

    const options = [
        { id: 'opt1', label: 'Biriyani', votes: 45 },
        { id: 'opt2', label: 'Fried Rice', votes: 30 },
        { id: 'opt3', label: 'Mandhi', votes: 67 },
    ];

    const handleVote = (id: string) => {
        if (votedOption) return;
        setVotedOption(id);
        setTotalVotes(prev => prev + 1);
    };

    return (
        <div className="relative bg-accent-yellow/10 p-1">
            {/* Clipboard Clip */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-gray-800 rounded-b-lg border-2 border-white shadow-md z-10 flex items-center justify-center">
                <div className="w-16 h-1 bg-gray-600 rounded-full"></div>
            </div>

            <div className="bg-white border-2 border-black shadow-neo p-6 pt-8 mt-2">
                <h4 className="font-display font-black text-xl mb-4 text-center">
                    {poll?.question || "Best canteen food?"}
                </h4>

                <div className="space-y-3">
                    {options.map((opt) => {
                        const isSelected = votedOption === opt.id;
                        const percent = Math.round((opt.votes / totalVotes) * 100);

                        return (
                            <button
                                key={opt.id}
                                disabled={!!votedOption}
                                onClick={() => handleVote(opt.id)}
                                className={`
                                relative w-full text-left p-3 border-2 rounded-lg transition-all overflow-hidden
                                ${isSelected ? 'border-black bg-yellow-50' : 'border-gray-200 hover:border-black'}
                            `}
                            >
                                {/* Progress Bar Background */}
                                {votedOption && (
                                    <div
                                        className="absolute inset-0 bg-accent-yellow/30 transition-all duration-1000"
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                )}

                                <div className="relative z-10 flex items-center justify-between">
                                    <span className="font-bold font-display flex items-center gap-2">
                                        {isSelected ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Circle className="w-4 h-4 text-gray-400" />}
                                        {opt.label}
                                    </span>
                                    {votedOption && (
                                        <span className="font-mono text-sm font-bold">{percent}%</span>
                                    )}
                                </div>
                            </button>
                        )
                    })}
                </div>

                <div className="mt-4 text-center font-mono text-xs text-gray-500">
                    {totalVotes} students voted • Ends in 2h
                </div>
            </div>
        </div>
    );
}
