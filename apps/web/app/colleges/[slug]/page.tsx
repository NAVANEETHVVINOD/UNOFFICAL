import { NewspaperCard, RetroButton, Badge, Tape, Sticker, EventRow, Marquee } from '../../components/ui/NewspaperUI';
import Doodle from '../../components/ui/Doodle';
import Link from 'next/link';

interface PageProps {
    params: {
        slug: string;
    };
}

export default function CollegeHome({ params }: PageProps) {
    const { slug } = params;
    const collegeName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <div className="space-y-8">
            {/* Top Section: Breaking News & Quick Stats */}
            <div className="grid md:grid-cols-12 gap-8">
                {/* Main News Column */}
                <div className="md:col-span-8">
                    <NewspaperCard variant="default" className="h-full p-8 relative">
                        <Tape className="absolute -top-3 left-1/2 -translate-x-1/2" />
                        <div className="border-b-4 border-black pb-4 mb-6 flex justify-between items-end">
                            <div>
                                <Badge className="mb-2">HEADLINES</Badge>
                                <h2 className="font-display text-4xl font-black">THE DAILY {collegeName.toUpperCase()}</h2>
                            </div>
                            <span className="font-serif italic text-gray-500">Vol. 42 • {new Date().toLocaleDateString()}</span>
                        </div>

                        {/* Featured Article */}
                        <div className="mb-8 group cursor-pointer">
                            <div className="h-64 bg-gray-200 rounded-xl mb-4 overflow-hidden relative border-2 border-black">
                                <img
                                    src="/doodles/header-vangof.jpg"
                                    alt="Featured"
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <Badge className="absolute bottom-4 left-4 bg-accent-pink text-white border-white">FEATURED</Badge>
                            </div>
                            <h3 className="font-display text-3xl font-bold mb-2 group-hover:underline decoration-4 decoration-accent-yellow">
                                Annual Tech Symposium Announced: "Chaos Theory"
                            </h3>
                            <p className="font-serif text-lg text-gray-600 leading-relaxed">
                                The computer science department has officially announced the dates for this year's symposium.
                                Expect 24-hour hackathons, robot wars, and enough caffeine to kill a horse.
                                Registration opens next Monday.
                            </p>
                        </div>

                        {/* Smaller News Items */}
                        <div className="grid md:grid-cols-2 gap-6 pt-6 border-t-2 border-dashed border-gray-300">
                            <div>
                                <h4 className="font-bold text-xl mb-2">Library Hours Extended</h4>
                                <p className="text-sm text-gray-600">
                                    Due to upcoming exams, the central library will remain open 24/7 starting this Friday.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-xl mb-2">New Canteen Menu?</h4>
                                <p className="text-sm text-gray-600">
                                    Rumors of "edible food" being added to the menu are currently unverified. Stay tuned.
                                </p>
                            </div>
                        </div>
                    </NewspaperCard>
                </div>

                {/* Sidebar: Stats & Quick Links */}
                <div className="md:col-span-4 space-y-6">
                    {/* Stats Card */}
                    <NewspaperCard variant="curved" className="bg-accent-blue text-white p-6 relative overflow-hidden">
                        <Doodle src="/doodles/sparkle.svg" className="absolute top-2 right-2 w-12 h-12 text-white opacity-50" />
                        <h3 className="font-display text-2xl font-black mb-4">CAMPUS PULSE</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-white/20 pb-2">
                                <span className="font-serif italic">Active Students</span>
                                <span className="font-pixel text-xl">1,240</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/20 pb-2">
                                <span className="font-serif italic">Clubs</span>
                                <span className="font-pixel text-xl">24</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/20 pb-2">
                                <span className="font-serif italic">Events Today</span>
                                <span className="font-pixel text-xl">3</span>
                            </div>
                        </div>
                    </NewspaperCard>

                    {/* Notice Board */}
                    <NewspaperCard className="p-6 bg-[#fffdf0] relative">
                        <Sticker className="-top-3 -right-3 bg-red-500 text-white" rotate={10}>URGENT</Sticker>
                        <h3 className="font-bold text-xl mb-4 border-b-2 border-black pb-2">NOTICE BOARD</h3>
                        <ul className="space-y-3 list-disc list-inside text-sm font-serif">
                            <li>Submit assignment #3 by Friday</li>
                            <li>Lost: Blue water bottle (Reward: High five)</li>
                            <li>Guest Lecture: AI Ethics @ 2PM</li>
                            <li>Club registrations closing soon</li>
                        </ul>
                    </NewspaperCard>
                </div>
            </div>

            {/* Marquee Separator */}
            <div className="-mx-4 md:-mx-8 transform rotate-1">
                <div className="bg-accent-yellow py-3 border-y-4 border-black">
                    <Marquee speed={40}>
                        <span className="font-bold text-xl mx-8 uppercase">/// Upcoming Events ///</span>
                        <span className="font-serif italic text-xl mx-8">Don't miss out!</span>
                        <span className="font-bold text-xl mx-8 uppercase">/// Hackathon 2024 ///</span>
                        <span className="font-serif italic text-xl mx-8">Register Now</span>
                        <span className="font-bold text-xl mx-8 uppercase">/// Music Fest ///</span>
                        <span className="font-serif italic text-xl mx-8">Tickets on sale</span>
                    </Marquee>
                </div>
            </div>

            {/* Events & Clubs Grid */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Upcoming Events */}
                <NewspaperCard className="p-0 overflow-hidden">
                    <div className="bg-black text-white p-4 flex justify-between items-center">
                        <h3 className="font-display text-2xl font-bold">UPCOMING EVENTS</h3>
                        <Link href={`/colleges/${slug}/events`}>
                            <RetroButton variant="secondary" className="scale-75 origin-right">View All</RetroButton>
                        </Link>
                    </div>
                    <div className="p-4 space-y-2">
                        <EventRow
                            date="OCT 24"
                            title="Intro to React Workshop"
                            time="2:00 PM"
                            icon="/doodles/computer.svg"
                            color="bg-accent-blue"
                        />
                        <EventRow
                            date="OCT 26"
                            title="Halloween Party"
                            time="8:00 PM"
                            icon="/doodles/ghost.svg"
                            color="bg-accent-pink"
                        />
                        <EventRow
                            date="NOV 01"
                            title="Career Fair 2024"
                            time="10:00 AM"
                            icon="/doodles/briefcase.svg"
                            color="bg-accent-yellow"
                        />
                    </div>
                </NewspaperCard>

                {/* Featured Clubs */}
                <NewspaperCard className="p-8 bg-white relative">
                    <Tape className="absolute -top-3 right-12 rotate-45" />
                    <h3 className="font-display text-2xl font-bold mb-6">FEATURED CLUBS</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-xl border-2 border-black hover:-translate-y-1 transition-transform cursor-pointer">
                            <div className="w-10 h-10 bg-accent-purple rounded-full mb-3 border-2 border-black"></div>
                            <h4 className="font-bold">Robotics Club</h4>
                            <p className="text-xs text-gray-500 mt-1">Building the future, one servo at a time.</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border-2 border-black hover:-translate-y-1 transition-transform cursor-pointer">
                            <div className="w-10 h-10 bg-accent-green rounded-full mb-3 border-2 border-black"></div>
                            <h4 className="font-bold">Eco Warriors</h4>
                            <p className="text-xs text-gray-500 mt-1">Making the campus greener.</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border-2 border-black hover:-translate-y-1 transition-transform cursor-pointer">
                            <div className="w-10 h-10 bg-accent-pink rounded-full mb-3 border-2 border-black"></div>
                            <h4 className="font-bold">Drama Society</h4>
                            <p className="text-xs text-gray-500 mt-1">All the world's a stage.</p>
                        </div>
                        <Link href={`/colleges/${slug}/clubs`} className="bg-gray-50 p-4 rounded-xl border-2 border-black hover:-translate-y-1 transition-transform cursor-pointer flex items-center justify-center">
                            <span className="font-bold text-gray-400">View All +</span>
                        </Link>
                    </div>
                </NewspaperCard>
            </div>
        </div>
    );
}
