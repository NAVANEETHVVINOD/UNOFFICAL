"use client"

import Container from '../components/ui/Container';
import { NewspaperCard, RetroButton, Staple, EventRow } from '../components/ui/NewspaperUI';
import Doodle from '../components/ui/Doodle';
import { PageTransition } from '../providers/AnimationProvider';

export default function EventsPage() {
    return (
        <PageTransition>
            <Container>
                <div className="py-12">
                    {/* Header */}
                    <div className="mb-16 text-center relative">
                        <h1 className="font-display text-6xl font-black mb-4">CAMPUS EVENTS</h1>
                        <p className="font-serif text-2xl italic text-gray-600">"Be there or be... somewhere else."</p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 mb-12 justify-center">
                        {['All Events', 'Parties', 'Workshops', 'Sports', 'Chaos'].map((filter, i) => (
                            <button key={filter} className={`px-6 py-2 font-bold border-2 border-black transition-all hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${i === 0 ? 'bg-accent-yellow text-black' : 'bg-white hover:bg-gray-50'}`}>
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Featured Event */}
                    <div className="mb-16 relative">
                        <Staple />
                        <NewspaperCard className="p-0 overflow-hidden">
                            <div className="grid md:grid-cols-2">
                                <div className="bg-black text-white p-8 md:p-12 flex flex-col justify-center">
                                    <span className="font-pixel text-accent-yellow mb-4 text-xl">FEATURED_EVENT</span>
                                    <h2 className="font-display text-4xl md:text-5xl mb-6">FRESHERS' NIGHT 2024</h2>
                                    <p className="text-gray-300 mb-8 text-lg">
                                        The biggest night of the year is finally here. DJ, dance, and questionable food choices.
                                        Don't miss out on the chaos.
                                    </p>
                                    <RetroButton variant="secondary" className="self-start">GET TICKETS</RetroButton>
                                </div>
                                <div className="bg-gray-100 relative min-h-[300px] border-l-2 border-black">
                                    <Doodle src="/doodles/students-hero.svg" className="absolute inset-0 w-full h-full object-cover p-12 opacity-80" />
                                    <div className="absolute bottom-0 right-0 bg-accent-pink text-white px-6 py-3 font-bold border-t-2 border-l-2 border-black">
                                        NOV 24 • 6 PM
                                    </div>
                                </div>
                            </div>
                        </NewspaperCard>
                    </div>

                    {/* Event List */}
                    <div className="max-w-4xl mx-auto">
                        <h3 className="font-bold text-xl uppercase mb-6 border-b-2 border-black pb-2">Upcoming Schedule</h3>
                        <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                            <EventRow
                                date="Dec 01"
                                time="9:00 AM"
                                title="Hackathon: Code Chaos (24h)"
                                icon="/doodles/book.svg"
                                color="bg-accent-blue"
                            />
                            <EventRow
                                date="Dec 02"
                                time="4:00 PM"
                                title="Debate Club: Is Cereal Soup?"
                                icon="/doodles/megaphone.svg"
                                color="bg-accent-pink"
                            />
                            <EventRow
                                date="Dec 05"
                                time="2:00 PM"
                                title="Robotics Workshop: Building Bots"
                                icon="/doodles/group.svg"
                                color="bg-accent-purple"
                            />
                            <EventRow
                                date="Dec 10"
                                time="10:00 AM"
                                title="Campus Market Day"
                                icon="/doodles/shopping-bag.svg"
                                color="bg-accent-yellow"
                            />
                        </div>
                    </div>
                </div>
            </Container>
        </PageTransition>
    );
}
