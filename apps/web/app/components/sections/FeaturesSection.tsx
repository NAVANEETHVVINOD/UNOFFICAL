"use client"

import { motion } from "framer-motion"
import { CalendarDoodle, GroupDoodle, ShoppingBagDoodle, ChatDoodle, AwardDoodle } from "../doodles/AppDoodles"
import { BookDoodle } from "../doodles/CollegeDoodles"
import { Tape } from "../ui/Tape"

const features = [
  {
    icon: CalendarDoodle,
    title: 'Event Hub',
    description: 'Discover & join campus events in real-time',
    color: 'from-blue-400 to-cyan-400',
    rotation: -2
  },
  {
    icon: GroupDoodle,
    title: 'Club Central',
    description: 'Find your tribe, join clubs that match your vibe',
    color: 'from-purple-400 to-pink-400',
    rotation: 2
  },
  {
    icon: BookDoodle,
    title: 'Notes Library',
    description: 'Share & access study materials instantly',
    color: 'from-green-400 to-teal-400',
    rotation: -1
  },
  {
    icon: ShoppingBagDoodle,
    title: 'Campus Mart',
    description: 'Buy, sell, exchange - sustainable student economy',
    color: 'from-orange-400 to-red-400',
    rotation: 1
  },
  {
    icon: ChatDoodle,
    title: 'Real-time Chat',
    description: 'Connect with peers, organize hangouts',
    color: 'from-yellow-400 to-amber-400',
    rotation: -2
  },
  {
    icon: AwardDoodle,
    title: 'Achievements',
    description: 'Earn badges, climb leaderboards, get recognized',
    color: 'from-indigo-400 to-purple-400',
    rotation: 2
  }
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-32 relative">
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-6xl md:text-8xl font-black mb-6"
            style={{
              fontFamily: "'Permanent Marker', cursive",
              background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(3px 3px 0px rgba(0,0,0,0.1))',
              transform: 'rotate(-1deg)'
            }}
          >
            Everything You Need!
          </motion.h2>
          <p className="text-2xl font-bold text-gray-600 font-hand">
            One platform. Infinite possibilities. 🚀
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className={`relative bg-gradient-to-br ${feature.color} p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black overflow-hidden group cursor-pointer`}
                  style={{ transform: `rotate(${feature.rotation}deg)` }}
                  whileHover={{
                    scale: 1.05,
                    rotate: 0,
                    transition: { duration: 0.2 }
                  }}
                >
                  {/* Decorative tape */}
                  <Tape className="-top-3 right-8 w-20 h-6 -rotate-12" />

                  {/* Icon */}
                  <motion.div
                    className="bg-white rounded-2xl w-16 h-16 flex items-center justify-center mb-6 shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-8 h-8 text-gray-800" stroke="currentColor" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-3xl font-black text-white mb-3 font-hand">
                    {feature.title}
                  </h3>
                  <p className="text-white/90 font-bold text-lg font-body">
                    {feature.description}
                  </p>

                  {/* Hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"
                  />
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}