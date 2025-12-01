"use client";

import { motion } from "framer-motion";
import {
  PencilDoodle,
  BookDoodle,
  CoffeeDoodle,
} from "../doodles/CollegeDoodles";
import {
  NotebookCard,
  NotebookTitle,
  NotebookText,
  NotebookButton,
} from "../ui/NotebookUI";
import SectionContainer from "../layout/SectionContainer";
import ContentWrapper from "../layout/ContentWrapper";

export default function AboutSection() {
  return (
    <SectionContainer id="about" withHeader>
      <ContentWrapper size="xl">
        <NotebookTitle className="text-center mb-16 text-4xl sm:text-5xl">
          About Us
        </NotebookTitle>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Page - The Problem */}
          <div className="relative">
            <NotebookCard className="transform hover:-rotate-2 transition-transform duration-300">
              <NotebookTitle className="text-2xl sm:text-3xl mb-8">
                Current Campus Challenges
              </NotebookTitle>

              <div className="space-y-6 sm:space-y-8">
                {[
                  "Information scattered across multiple platforms",
                  "Missing important events and deadlines",
                  "Difficulty finding study groups and resources",
                  "Limited interaction with AI learning tools",
                ].map((text, index) => (
                  <motion.div
                    key={text}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <span className="text-accent-red mt-1">✗</span>
                    <NotebookText className="text-lg sm:text-xl">
                      {text}
                    </NotebookText>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="absolute -right-4 -bottom-4 hidden sm:block"
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <PencilDoodle className="w-16 h-16" />
              </motion.div>
            </NotebookCard>
          </div>

          {/* Right Page - Our Solution */}
          <div className="relative mt-8 lg:mt-0">
            <NotebookCard className="transform hover:rotate-2 transition-transform duration-300 bg-gradient-to-br from-accent-blue to-accent-blue-dark text-white">
              <NotebookTitle className="text-2xl sm:text-3xl mb-8 text-white">
                Our Solution
              </NotebookTitle>

              <div className="space-y-6 sm:space-y-8">
                {[
                  {
                    title: "Smart Organization",
                    description:
                      "AI-powered tools to keep your academic life organized and efficient",
                  },
                  {
                    title: "Community Connection",
                    description:
                      "Connect with peers, join study groups, and share resources seamlessly",
                  },
                  {
                    title: "Learning Enhancement",
                    description:
                      "Interactive AI assistance to help you master any subject",
                  },
                ].map(({ title, description }, index) => (
                  <motion.div
                    key={title}
                    className="bg-white/10 rounded-lg p-4 sm:p-6 hover:bg-white/20 transition-colors duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <h4 className="font-patrick text-xl sm:text-2xl mb-2">
                      {title}
                    </h4>
                    <NotebookText className="text-white/90 text-lg">
                      {description}
                    </NotebookText>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="absolute -left-6 -top-6 hidden sm:block"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <BookDoodle className="w-16 h-16" />
              </motion.div>

              <motion.div
                className="absolute -right-6 -bottom-6 hidden sm:block"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <CoffeeDoodle className="w-16 h-16" />
              </motion.div>
            </NotebookCard>
          </div>
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <NotebookButton className="text-lg sm:text-xl">
            Learn More About Our Mission
          </NotebookButton>
        </motion.div>
      </ContentWrapper>
    </SectionContainer>
  );
}
