"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { CollegeDoodles, SparklesDoodle } from "../doodles/CollegeDoodles"
import { ArrowRightDoodle, PlayDoodle, CalendarDoodle, GroupDoodle, ShoppingBagDoodle } from "../doodles/AppDoodles"
import { Tape } from "../ui/Tape"

export default function HeroSection() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden">
      <CollegeDoodles />

      <div className="container mx-auto px-6 z-10 relative">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8"
          >
            <SparklesDoodle className="w-5 h-5" />
            <span className="font-black text-lg font-body text-gray-800">Where College Life Comes Alive!</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 relative"
          >
            <div
              className="text-6xl md:text-8xl lg:text-9xl font-black leading-none"
              style={{
                fontFamily: "'Permanent Marker', cursive",
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,0.2))',
                transform: 'rotate(-2deg)',
              }}
            >
              MEC-UNOFFICALS
            </div>

            {/* Underline scribble */}
            <motion.svg
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8"
              viewBox="0 0 500 30"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            >
              <motion.path
                d="M 10 15 Q 125 5, 250 15 T 490 15"
                stroke="#FFD93D"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
            </motion.svg>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-4xl font-bold text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-hand"
          >
            Your <span className="relative inline-block">
              all-in-one
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-3 bg-yellow-300 -z-10"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </span> digital notebook for{' '}
            <span className="text-blue-600">events</span>,{' '}
            <span className="text-purple-600">clubs</span>,{' '}
            <span className="text-green-600">notes</span> &{' '}
            <span className="text-red-600">campus life</span>! 📚✨
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
          >
            <motion.button
              className="group relative px-10 py-5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-black text-xl rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black overflow-hidden font-hand"
              whileHover={{ scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Your Journey
                <ArrowRightDoodle className="w-6 h-6 group-hover:translate-x-2 transition-transform" stroke="white" />
              </span>
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
                style={{ opacity: 0.3 }}
              />
            </motion.button>

            <motion.button
              className="px-10 py-5 bg-white text-gray-800 font-black text-xl rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black flex items-center gap-2 font-hand"
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Watch Demo</span>
              <PlayDoodle className="w-6 h-6 text-gray-800" stroke="currentColor" />
            </motion.button>
          </motion.div>

          {/* Floating Preview Cards */}
          <motion.div
            style={{ y }}
            className="relative w-full max-w-5xl mx-auto h-96 perspective-1000 hidden md:block"
          >
            {/* Events Card */}
            <motion.div
              className="absolute left-0 top-0 w-72 bg-white rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black"
              style={{ transform: 'rotate(-6deg)' }}
              animate={{
                y: [0, -20, 0],
                rotate: [-6, -8, -6]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Tape className="-top-4 left-1/2 -translate-x-1/2" />
              <div className="absolute -top-4 right-4 w-16 h-8 bg-yellow-300 rotate-12 opacity-60" />
              <CalendarDoodle className="w-12 h-12 text-blue-500 mb-4" stroke="currentColor" />
              <h3 className="font-black text-2xl mb-2 font-hand">
                Events
              </h3>
              <p className="text-gray-600 font-bold font-body">Never miss a campus happening!</p>
            </motion.div>

            {/* Community Card */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 top-10 w-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] border-4 border-black z-10"
              animate={{
                y: [0, -25, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute -top-3 left-6 w-20 h-6 bg-white opacity-80 -rotate-6" />
              <GroupDoodle className="w-14 h-14 text-white mb-4" stroke="white" />
              <h3 className="font-black text-3xl mb-2 text-white font-hand">
                Community
              </h3>
              <p className="text-white font-bold text-lg font-body">Connect, collaborate, celebrate!</p>
            </motion.div>

            {/* Marketplace Card */}
            <motion.div
              className="absolute right-0 top-0 w-72 bg-white rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black"
              style={{ transform: 'rotate(6deg)' }}
              animate={{
                y: [0, -18, 0],
                rotate: [6, 8, 6]
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <Tape className="-top-4 left-1/2 -translate-x-1/2" />
              <div className="absolute -top-3 left-8 w-12 h-8 bg-red-400 rotate-45 opacity-60" />
              <ShoppingBagDoodle className="w-12 h-12 text-green-500 mb-4" stroke="currentColor" />
              <h3 className="font-black text-2xl mb-2 font-hand">
                Marketplace
              </h3>
              <p className="text-gray-600 font-bold font-body">Buy, sell, exchange!</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}