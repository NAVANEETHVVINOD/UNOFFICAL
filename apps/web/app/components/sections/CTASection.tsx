"use client"

import { motion } from "framer-motion"
import { ArrowRightDoodle } from "../doodles/AppDoodles"

export default function CTASection() {
    return (
        <section className="py-32 relative">
            <div className="container mx-auto px-6">
                <motion.div
                    className="max-w-5xl mx-auto bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-3xl p-16 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] border-4 border-black text-center relative overflow-hidden"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    {/* Decorative elements */}
                    <div className="absolute top-8 left-8 text-8xl opacity-20">🎓</div>
                    <div className="absolute bottom-8 right-8 text-8xl opacity-20">🚀</div>

                    <motion.h2
                        className="text-6xl md:text-8xl font-black text-white mb-6"
                        style={{ fontFamily: "'Permanent Marker', cursive" }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Ready to Start?
                    </motion.h2>

                    <p className="text-2xl text-white font-bold mb-12 font-hand">
                        Join thousands of students making the most of their campus life!
                    </p>

                    <motion.button
                        className="group relative px-12 py-6 bg-white text-black font-black text-2xl rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black overflow-hidden font-hand inline-flex items-center gap-3"
                        whileHover={{ scale: 1.05, rotate: -1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="relative z-10">Get Started Now</span>
                        <ArrowRightDoodle className="w-8 h-8 group-hover:translate-x-2 transition-transform" stroke="currentColor" />
                    </motion.button>
                </motion.div>
            </div>
        </section>
    )
}
