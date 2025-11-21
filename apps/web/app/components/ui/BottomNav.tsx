import React from 'react';
import Doodle from './Doodle';

export default function BottomNav() {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black p-2 md:hidden z-50 shadow-[0px_-4px_0px_0px_rgba(0,0,0,0.1)]">
            <div className="flex justify-around items-center">
                <button className="flex flex-col items-center gap-1 p-2">
                    <Doodle src="/doodles/sparkle.svg" className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase">Home</span>
                </button>
                <button className="flex flex-col items-center gap-1 p-2 opacity-50 hover:opacity-100">
                    <Doodle src="/doodles/calendar.svg" className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase">Events</span>
                </button>
                <div className="relative -top-6">
                    <button className="w-14 h-14 bg-accent-yellow border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <span className="text-2xl font-bold">+</span>
                    </button>
                </div>
                <button className="flex flex-col items-center gap-1 p-2 opacity-50 hover:opacity-100">
                    <Doodle src="/doodles/group.svg" className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase">Clubs</span>
                </button>
                <button className="flex flex-col items-center gap-1 p-2 opacity-50 hover:opacity-100">
                    <div className="w-6 h-6 bg-black rounded-full border border-black"></div>
                    <span className="text-[10px] font-bold uppercase">Profile</span>
                </button>
            </div>
        </div>
    );
}
