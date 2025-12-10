"use client";

export default function NewsTicker() {
    const news = [
        "🎓 Exam schedule released for S5",
        "🏆 Football team wins finals!",
        "📢 IEEE Workshop tomorrow @ 4PM",
        "🍜 Canteen closed for renovation",
    ];

    return (
        <div className="bg-black text-white border-thick border-black shadow-neo overflow-hidden h-40 relative">
            <div className="bg-accent-green text-black px-2 py-1 font-pixel font-bold text-center border-b-2 border-white/20">
                CAMPUS RADAR
            </div>

            {/* CRT Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,3px_100%]"></div>

            <div className="h-full overflow-hidden relative">
                <div className="animate-marquee-vertical space-y-4 p-4">
                    {[...news, ...news].map((item, i) => (
                        <div key={i} className="font-mono text-sm text-crt-green border-b border-white/10 pb-2">
                            <span className="mr-2 opacity-50">{`>`}</span>
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
