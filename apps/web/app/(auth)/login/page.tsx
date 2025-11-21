"use client"

import Container from '../../components/ui/Container';
import { NewspaperCard, RetroButton, Tape } from '../../components/ui/NewspaperUI';
import Doodle from '../../components/ui/Doodle';
import { PageTransition } from '../../providers/AnimationProvider';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <PageTransition>
      <Container>
        <div className="min-h-screen flex items-center justify-center py-12">
          <div className="w-full max-w-md relative">
            <Tape className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10" />
            <NewspaperCard className="border-4 p-8 relative">
              <div className="absolute -right-8 -top-8 hidden md:block">
                <Doodle src="/doodles/sparkle.svg" className="w-16 h-16" />
              </div>

              <h1 className="h1-display text-center mb-2">LOGIN</h1>
              <p className="text-center font-hand text-gray-600 mb-8">Welcome back, scholar.</p>

              <form className="space-y-6">
                <div>
                  <label className="block font-bold text-sm uppercase mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full border-2 border-black p-3 font-body focus:outline-none focus:ring-4 focus:ring-accent-yellow/50 bg-gray-50"
                    placeholder="you@college.edu"
                  />
                </div>

                <div>
                  <label className="block font-bold text-sm uppercase mb-2">Password</label>
                  <input
                    type="password"
                    className="w-full border-2 border-black p-3 font-body focus:outline-none focus:ring-4 focus:ring-accent-yellow/50 bg-gray-50"
                    placeholder="••••••••"
                  />
                </div>

                <RetroButton className="w-full py-3 text-lg">ENTER CAMPUS</RetroButton>
              </form>

              <div className="mt-6 text-center border-t-2 border-black pt-4 border-dashed">
                <p className="font-body text-sm">
                  New here? <Link href="/register" className="font-bold underline hover:text-accent-blue">Get your ID card.</Link>
                </p>
              </div>
            </NewspaperCard>
          </div>
        </div>
      </Container>
    </PageTransition>
  );
}