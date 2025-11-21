"use client"

import { motion } from "framer-motion"
import { NotebookPage, NotebookCard, NotebookTitle, NotebookText, NotebookButton } from "../ui/NotebookUI"
import { RobotDoodle, BulbDoodle, SparklesDoodle, StarDoodle } from "../doodles/CollegeDoodles"

const messages = [
  {
    question: "How's my CGPA looking?",
    answer: "You're doing great! Current CGPA is 8.5. Want some study tips to boost it further?"
  },
  {
    question: "Any photography clubs on campus?",
    answer: "Yes! The Lens Club meets every Thursday. They're having a workshop this weekend."
  },
  {
    question: "Help me plan my semester?",
    answer: "Let's break it down: Classes, club activities, and study groups - I'll help you balance it all."
  }
]

const chatBubbleVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.5
    }
  })
}

export default function AIAssistantSection() {
  return (
    <NotebookPage withLines>
      <div className="max-w-7xl mx-auto px-4 py-20">
        <NotebookTitle className="text-center mb-16">Your AI Study Buddy</NotebookTitle>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Demo Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <NotebookCard className="transform rotate-[-1deg] overflow-hidden">
              <div className="relative">
                <div className="bg-accent-blue/10 p-4 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <RobotDoodle className="w-8 h-8" />
                    <NotebookText className="font-semibold">AI Assistant</NotebookText>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className="space-y-3">
                      <motion.div
                        className="flex items-start gap-3 justify-end"
                        variants={chatBubbleVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={index * 2}
                      >
                        <StarDoodle className="w-6 h-6" />
                        <div className="bg-accent-blue text-white rounded-lg p-3">
                          <NotebookText>{message.question}</NotebookText>
                        </div>
                      </motion.div>

                      <motion.div
                        className="flex items-start gap-3"
                        variants={chatBubbleVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={index * 2 + 1}
                      >
                        <div className="bg-accent-blue/10 rounded-lg p-3">
                          <NotebookText>{message.answer}</NotebookText>
                        </div>
                        <SparklesDoodle className="w-6 h-6" />
                      </motion.div>
                    </div>
                  ))}
                </div>

                <motion.div 
                  className="absolute -right-4 -bottom-4"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BulbDoodle className="w-12 h-12" />
                </motion.div>
              </div>
            </NotebookCard>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <NotebookCard className="transform rotate-[1deg]">
              <NotebookTitle className="text-2xl mb-4">24/7 Learning Support</NotebookTitle>
              <div className="space-y-4">
                {[
                  "Instant answers to your academic questions",
                  "Step-by-step problem-solving guidance",
                  "Custom study plans and resources"
                ].map((feature, index) => (
                  <motion.div 
                    key={feature}
                    className="flex items-start gap-3"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-accent-blue">✓</span>
                    <NotebookText>{feature}</NotebookText>
                  </motion.div>
                ))}
              </div>
            </NotebookCard>

            <NotebookCard className="transform rotate-[-0.5deg] bg-gradient-to-br from-accent-blue to-accent-blue-dark text-white">
              <NotebookTitle className="text-2xl mb-4 text-white">Smart Features</NotebookTitle>
              <div className="space-y-4">
                {[
                  "Natural language processing for human-like interactions",
                  "Personalized learning paths based on your progress",
                  "Multi-subject expertise and cross-discipline connections"
                ].map((feature, index) => (
                  <motion.div 
                    key={feature}
                    className="bg-white/10 p-3 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <NotebookText className="text-white/90">{feature}</NotebookText>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="absolute -left-4 top-0"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <RobotDoodle className="w-12 h-12" />
              </motion.div>
            </NotebookCard>
          </motion.div>
        </div>

        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <NotebookButton>
            Start Learning with AI
            <motion.span 
              className="inline-block ml-2"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <SparklesDoodle className="w-6 h-6" />
            </motion.span>
          </NotebookButton>
        </motion.div>
      </div>
    </NotebookPage>
  )
}