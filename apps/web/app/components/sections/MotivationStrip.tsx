"use client"

import Container from "../ui/Container"

export default function MotivationStrip() {
    const quotes = [
        "Hakuna Matata!",
        "Keep calm and code on.",
        "Coffee + Code = DRUGS",
        "Namaste Bitches"
    ]

    return (
        <section className="relative py-16 md:py-24 overflow-hidden">
            <Container>
                <div className="flex flex-col items-center text-center gap-8">
                    {/* Decorative wave */}
                    <svg className="w-16 h-8 text-ink/20" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M0 10 Q 25 0, 50 10 T 100 10" />
                    </svg>

                    {/* Main motto - faded */}
                    <div className="relative">
                        <p className="font-display text-5xl sm:text-6xl md:text-7xl text-ink/5 leading-tight pointer-events-none select-none">
                            LINK.
                            <br />
                            LEARN.
                            <br />
                            LIVE.
                        </p>
                    </div>

                    {/* Subtitle */}
                    <p className="max-w-md text-sm md:text-base text-ink/70 font-serif italic">
                        Your campus, but with less confusion, more connections, and just the right amount of drama.
                    </p>

                    {/* Fun quotes carousel effect */}
                    <div className="flex flex-wrap justify-center gap-3 mt-4">
                        {quotes.map((quote, i) => (
                            <span
                                key={i}
                                className="px-3 py-1 bg-white border-2 border-black text-xs md:text-sm font-bold shadow-[2px_2px_0_#000] rotate-[-2deg] hover:rotate-[2deg] transition-transform"
                            >
                                {quote}
                            </span>
                        ))}
                    </div>

                    {/* Pagination dots */}
                    <div className="flex gap-2 mt-4">
                        {[0, 1, 2, 3].map((dot) => (
                            <div
                                key={dot}
                                className={`w-2 h-2 rounded-full ${dot === 0 ? 'bg-ink' : 'bg-ink/20'}`}
                            />
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    )
}
