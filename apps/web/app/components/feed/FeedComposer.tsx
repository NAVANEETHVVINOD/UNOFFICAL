"use client";

import { useAuth } from "../../context/AuthContext";
import { ImageIcon, Calendar, BarChart2, Briefcase } from "lucide-react";

export default function FeedComposer() {
    const { user } = useAuth();

    const openModal = (type: 'TEXT' | 'POLL' | 'MARKET' | 'EVENT' = 'TEXT') => {
        document.dispatchEvent(new CustomEvent('open-create-modal', { detail: { type } }));
    };

    if (!user) return null;

    return (
        <div className="bg-white border-2 border-black rounded-xl p-4 shadow-neo mb-6">
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-black overflow-hidden flex-shrink-0 bg-gray-100">
                    <img
                        src={user.profile?.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.email}`}
                        alt="User"
                        className="w-full h-full object-cover"
                    />
                </div>
                <button
                    onClick={() => openModal('TEXT')}
                    className="flex-1 bg-gray-50 border-2 border-dashed border-gray-300 rounded-full px-6 text-left hover:bg-gray-100 hover:border-black transition-colors"
                >
                    <span className="font-medium text-gray-500">Start a post, {user.profile?.fullName?.split(' ')[0]}?</span>
                </button>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 px-2">
                <ActionButton icon={ImageIcon} label="Media" color="text-accent-blue" onClick={() => openModal('TEXT')} />
                <ActionButton icon={BarChart2} label="Poll" color="text-accent-pink" onClick={() => openModal('POLL')} />
                <ActionButton icon={Briefcase} label="Market" color="text-accent-green" onClick={() => openModal('MARKET')} />
                <ActionButton icon={Calendar} label="Event" color="text-accent-yellow" onClick={() => openModal('EVENT')} />
            </div>
        </div>
    );
}

function ActionButton({ icon: Icon, label, color, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
        >
            <Icon className={`w-5 h-5 ${color} group-hover:scale-110 transition-transform`} />
            <span className="font-bold text-sm text-gray-600 group-hover:text-black">{label}</span>
        </button>
    );
}
