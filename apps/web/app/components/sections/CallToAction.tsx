"use client";

import { motion } from "framer-motion";
import {
  NotebookPage,
  NotebookCard,
  NotebookTitle,
  NotebookText,
  NotebookButton,
} from "../ui/NotebookUI";
import {
  HeartDoodle,
  StarDoodle,
  SparklesDoodle,
} from "../doodles/CollegeDoodles";

export default function CallToAction() {
  return (
    <NotebookPage
      withMargin
      className="bg-gradient-to-br from-accent-blue to-accent-blue-dark text-white"
    >
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <NotebookCard className="text-center bg-white/10 backdrop-blur-sm border-white/20">
            <NotebookTitle className="text-4xl md:text-5xl mb-6 text-white">
              Let's Make College Fun Again
            </NotebookTitle>
            <NotebookText className="text-xl mb-12 max-w-2xl mx-auto text-white/90">
              Join our community of students making campus life more creative,
              connected, and collaborative.
            </NotebookText>

            <div className="flex flex-wrap justify-center gap-6">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95, rotate: 0 }}
              >
                <NotebookButton className="bg-white text-accent-blue hover:bg-accent-yellow">
                  Get Started
                  <motion.span
                    className="inline-block ml-2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <HeartDoodle className="w-6 h-6" />
                  </motion.span>
                </NotebookButton>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.95, rotate: 0 }}
              >
                <NotebookButton className="bg-transparent border-2 border-white hover:bg-white/10">
                  Contribute
                  <motion.span
                    className="inline-block ml-2"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 5, repeat: Infinity }}
                  >
                    <StarDoodle className="w-6 h-6" />
                  </motion.span>
                </NotebookButton>
              </motion.div>
            </div>

            {/* Decorative elements */}
            <motion.div
              className="absolute -left-8 -top-8"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity }}
            >
              <StarDoodle className="w-16 h-16 text-yellow-300" />
            </motion.div>
            <motion.div
              className="absolute -right-8 -bottom-8"
              animate={{ scale: [1, 1.2, 1], rotate: [0, -360] }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              <SparklesDoodle className="w-16 h-16 text-yellow-300" />
            </motion.div>
          </NotebookCard>
        </motion.div>
      </div>
    </NotebookPage>
  );
}
