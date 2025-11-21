"use client"

import { useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { MenuDoodle, XDoodle } from "../doodles/AppDoodles"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { scrollY } = useScroll()

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: useTransform(scrollY, [0, 100], ['rgba(255, 254, 240, 0)', 'rgba(255, 254, 240, 0.95)'])
        }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="font-black text-3xl cursor-pointer"
              style={{
                fontFamily: "'Permanent Marker', cursive",
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 50%, #6BCB77 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
              }}
              whileHover={{ scale: 1.05, rotate: -2 }}
            >
              LINKER
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {['Features', 'Events', 'Clubs', 'Marketplace', 'About'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-700 font-bold hover:text-blue-600 transition-colors relative group font-hand text-lg"
                  whileHover={{ y: -2 }}
                >
                  {item}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-1 bg-yellow-400 origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              ))}

              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-black rounded-2xl shadow-lg relative overflow-hidden font-hand"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Get Started</span>
                <motion.div
                  className="absolute inset-0 bg-white opacity-0"
                  whileHover={{ opacity: 0.2 }}
                />
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? <XDoodle className="w-8 h-8" /> : <MenuDoodle className="w-8 h-8" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-40 md:hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {['Features', 'Events', 'Clubs', 'Marketplace', 'About'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-3xl font-black text-gray-800 font-hand"
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.1, x: 10 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}