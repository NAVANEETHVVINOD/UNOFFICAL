"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionContainer from "../layout/SectionContainer";
import ContentWrapper from "../layout/ContentWrapper";
import { NotebookTitle, NotebookText, NotebookCard } from "../ui/NotebookUI";
import { SparklesDoodle, BulbDoodle } from "../doodles/CollegeDoodles";

const faqs = [
  {
    question: "How does the AI study assistant work?",
    answer:
      "Our AI assistant uses natural language processing to understand your questions and provide personalized help. It can explain concepts, solve problems step-by-step, and adapt to your learning style.",
  },
  {
    question: "Can I use this platform for any subject?",
    answer:
      "Yes! Our platform supports a wide range of subjects including Mathematics, Sciences, Computer Programming, Languages, and more. The AI assistant is trained on diverse educational content.",
  },
  {
    question: "How do study groups work?",
    answer:
      "You can create or join study groups based on your courses, interests, or study goals. Groups can share notes, schedule virtual study sessions, and collaborate on projects.",
  },
  {
    question: "Is there a mobile app available?",
    answer:
      "Yes, we have mobile apps for both iOS and Android platforms. You can sync your study materials and access all features on the go.",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <SectionContainer id="faq">
      <ContentWrapper size="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <NotebookTitle>Frequently Asked Questions</NotebookTitle>
          <NotebookText className="text-lg mt-4">
            Find answers to common questions about our platform
          </NotebookText>
        </motion.div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <NotebookCard
                className={`transform ${index % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"}`}
              >
                <button
                  className="w-full text-left p-6 flex justify-between items-start"
                  onClick={() =>
                    setActiveIndex(activeIndex === index ? null : index)
                  }
                >
                  <NotebookText className="font-semibold pr-8">
                    {faq.question}
                  </NotebookText>
                  <motion.div
                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeIndex === index ? (
                      <BulbDoodle className="w-6 h-6" />
                    ) : (
                      <SparklesDoodle className="w-6 h-6" />
                    )}
                  </motion.div>
                </button>

                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <NotebookText className="text-gray-600">
                          {faq.answer}
                        </NotebookText>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </NotebookCard>
            </motion.div>
          ))}
        </div>
      </ContentWrapper>
    </SectionContainer>
  );
}
