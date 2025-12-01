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
  PencilDoodle,
  BulbDoodle,
  HeartDoodle,
  StarDoodle,
} from "../doodles/CollegeDoodles";

const stories = [
  {
    name: "Anjali Kumar",
    story: "Started the Photography Club and hosted our first exhibition!",
    impact: "50+ student photographers showcased their work",
  },
  {
    name: "Arun Patel",
    story: "Found my study group through Campus Connect",
    impact: "Improved grades by 15% through peer learning",
  },
  {
    name: "Lakshmi Menon",
    story: "Connected with alumni and landed my dream internship",
    impact: "Now mentoring 3 juniors",
  },
];

const StoryCard = ({
  story,
  index,
}: {
  story: (typeof stories)[0];
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.2 }}
  >
    <NotebookCard
      className={`transform ${index % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"} relative`}
    >
      <div className="relative">
        <NotebookTitle className="text-xl mb-2">{story.name}</NotebookTitle>
        <NotebookText className="mb-4">{story.story}</NotebookText>
        <motion.div
          className="bg-accent-blue/10 p-3 rounded"
          whileHover={{ scale: 1.02 }}
        >
          <NotebookText className="text-sm text-accent-blue">
            {story.impact}
          </NotebookText>
        </motion.div>
        <motion.div
          className="absolute -right-3 -bottom-3"
          animate={{ rotate: [0, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {index % 3 === 0 ? (
            <PencilDoodle />
          ) : index % 3 === 1 ? (
            <HeartDoodle />
          ) : (
            <StarDoodle />
          )}
        </motion.div>
      </div>
    </NotebookCard>
  </motion.div>
);

export default function CommunitySection() {
  return (
    <NotebookPage withMargin>
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <NotebookTitle className="mb-4">
            Made by Students, for Students
          </NotebookTitle>
          <NotebookText className="text-xl max-w-2xl mx-auto">
            Real stories from our college community. Each story is a new page in
            our shared notebook.
          </NotebookText>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <StoryCard key={story.name} story={story} index={index} />
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <NotebookButton>
            Add Your Story
            <motion.span
              className="inline-block ml-2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <StarDoodle className="w-6 h-6" />
            </motion.span>
          </NotebookButton>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -right-8 top-1/4"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <BulbDoodle className="w-16 h-16" />
        </motion.div>
      </div>
    </NotebookPage>
  );
}
