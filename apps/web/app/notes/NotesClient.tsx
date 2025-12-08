"use client";

import { useState } from "react";
import Container from "../components/ui/Container";
import {
  NewspaperCard,
  RetroButton,
  Badge,
  Tape,
} from "../components/ui/NewspaperUI";
import Doodle from "../components/ui/Doodle";
import { PageTransition } from "../providers/AnimationProvider";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NotesClient() {
  return (
    <PageTransition>
      <div className="bg-paper min-h-screen">
        {/* Texture Overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-5 z-50 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

        <Navbar showLinks={true} />

        <Container>
          <div className="py-8 min-h-screen">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12 text-center relative"
            >
              <Doodle
                src="/doodles/book.svg"
                className="w-24 h-24 absolute -top-12 left-1/4 -z-10 opacity-20 -rotate-12"
              />
              <h1 className="font-display text-5xl md:text-7xl font-black mb-4">
                ACADEMIC NOTES
              </h1>
              <p className="font-hand text-xl text-gray-600 max-w-2xl mx-auto">
                Knowledge wants to be free. (And so do you.)
              </p>
            </motion.div>

            {/* Coming Soon State */}
            <div className="max-w-2xl mx-auto text-center py-20">
              <NewspaperCard variant="curved" className="p-12 relative overflow-hidden">
                <Tape className="absolute -top-3 left-1/2 -translate-x-1/2" />

                <Doodle src="/doodles/sleeping.svg" className="w-32 h-32 mx-auto mb-6 opacity-80" />

                <h2 className="font-display text-4xl font-black mb-4">COMING SOON</h2>
                <p className="text-xl text-gray-600 mb-8 font-serif italic">
                  Our scribes are currently digitizing the sacred texts.
                  Check back later for exam implementations.
                </p>

                <div className="flex justify-center gap-4">
                  <Link href="/dashboard">
                    <RetroButton variant="outline">Back to Chaos</RetroButton>
                  </Link>
                  <RetroButton variant="primary">Notify Me</RetroButton>
                </div>
              </NewspaperCard>
            </div>

          </div>
        </Container>
      </div>
    </PageTransition>
  );
}
