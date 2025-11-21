"use client"

import Container from '../../components/ui/Container';
import { NewspaperCard, RetroButton, Tape } from '../../components/ui/NewspaperUI';
import Doodle from '../../components/ui/Doodle';
import { PageTransition } from '../../providers/AnimationProvider';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <PageTransition>
      <Container>
        <div className="min-h-screen flex items-center justify-center py-12">
          <div className="w-full max-w-md relative">
            <Tape className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10" />
            <NewspaperCard className="border-4 p-8 relative bg-yellow-50">
              <div className="absolute -left-10 top-1/2 hidden md:block">
                <Doodle src="/doodles/megaphone.svg" className="w-20 h-20 transform -rotate-12" />
              </div>

              <h1 className="h1-display text-center mb-2">JOIN US</h1>
              <p className="text-center font-hand text-gray-600 mb-8">Become a part of the chaos.</p>

              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-sm uppercase mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full border-2 border-black p-3 font-body focus:outline-none focus:ring-4 focus:ring-accent-blue/50 bg-white"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-sm uppercase mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full border-2 border-black p-3 font-body focus:outline-none focus:ring-4 focus:ring-accent-blue/50 bg-white"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-sm uppercase mb-2">College Email</label>
                  <input
                    type="email"
                    className="w-full border-2 border-black p-3 font-body focus:outline-none focus:ring-4 focus:ring-accent-blue/50 bg-white"
                    placeholder="you@college.edu"
                  />
                </div>

                <div>
                  <label className="block font-bold text-sm uppercase mb-2">Password</label>
                  <input
                    type="password"
                    className="w-full border-2 border-black p-3 font-body focus:outline-none focus:ring-4 focus:ring-accent-blue/50 bg-white"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-start gap-2 mt-2">
                  <input type="checkbox" className="mt-1 w-4 h-4 border-2 border-black rounded-none text-black focus:ring-0" />
                  <p className="text-xs text-gray-600">I agree to not post boring stuff and to respect the vibe.</p>
                </div>

                <RetroButton className="w-full py-3 text-lg bg-black text-white hover:bg-gray-900">PRINT ID CARD</RetroButton>
              </form>

              <div className="mt-6 text-center border-t-2 border-black pt-4 border-dashed">
                <p className="font-body text-sm">
                  Already have an ID? <Link href="/login" className="font-bold underline hover:text-accent-blue">Login here.</Link>
                </p>
              </div>
            </NewspaperCard>
          </div>
        </div>
      </Container>
    </PageTransition>
  );
}