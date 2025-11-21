"use client"

import Container from '../components/ui/Container';
import { NewspaperCard, RetroButton, Tape } from '../components/ui/NewspaperUI';
import Doodle from '../components/ui/Doodle';
import { PageTransition } from '../providers/AnimationProvider';

export default function ClubsPage() {
    return (
        <PageTransition>
            <Container>
                <div className="py-12">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-4 border-black pb-6">
                        <div>
                            <h1 className="h1-display">CLUB DIRECTORY</h1>
                            <p className="h2-comic text-gray-600">Find your people.</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <RetroButton>Start a Club</RetroButton>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Club 1 */}
                        <div className="relative">
                            <Tape className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10" />
                            <NewspaperCard className="border-4">
                                <div className="flex gap-6 items-start">
                                    <div className="w-24 h-24 bg-black flex items-center justify-center shrink-0">
                                        <Doodle src="/doodles/group.svg" className="w-16 h-16 text-white" style={{ filter: 'invert(1)' }} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-2xl uppercase mb-2">The Tech Society</h3>
                                        <p className="font-body text-sm mb-4">
                                            We build apps, break servers, and sometimes fix them. Join us for weekly hack sessions.
                                        </p>
                                        <div className="flex gap-2">
                                            <span className="px-2 py-1 bg-gray-100 border border-black text-xs font-bold">CODING</span>
                                            <span className="px-2 py-1 bg-gray-100 border border-black text-xs font-bold">ROBOTICS</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <RetroButton className="text-sm">VIEW PROFILE</RetroButton>
                                </div>
                            </NewspaperCard>
                        </div>

                        {/* Club 2 */}
                        <div className="relative">
                            <NewspaperCard className="border-4 bg-accent-yellow/10">
                                <div className="flex gap-6 items-start">
                                    <div className="w-24 h-24 bg-white border-2 border-black flex items-center justify-center shrink-0">
                                        <Doodle src="/doodles/megaphone.svg" className="w-16 h-16" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-2xl uppercase mb-2">Drama Club</h3>
                                        <p className="font-body text-sm mb-4">
                                            Too much drama in your life? Put it on stage. Auditions open for "Hamlet: The Musical".
                                        </p>
                                        <div className="flex gap-2">
                                            <span className="px-2 py-1 bg-gray-100 border border-black text-xs font-bold">THEATRE</span>
                                            <span className="px-2 py-1 bg-gray-100 border border-black text-xs font-bold">ARTS</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <RetroButton className="text-sm bg-white text-black border-2 border-black">VIEW PROFILE</RetroButton>
                                </div>
                            </NewspaperCard>
                        </div>
                    </div>
                </div>
            </Container>
        </PageTransition>
    );
}
