"use client";

import { motion } from "framer-motion";
import {
  GroupDoodle,
  CalendarDoodle,
  RocketDoodle,
} from "../doodles/AppDoodles";
import { BookDoodle, HeartDoodle } from "../doodles/CollegeDoodles";

const stats = [
  { value: "5000+", label: "Active Students", icon: GroupDoodle },
  { value: "100+", label: "Campus Clubs", icon: HeartDoodle },
  { value: "500+", label: "Events/Month", icon: RocketDoodle },
  { value: "1000+", label: "Notes Shared", icon: BookDoodle },
];

export default function StatsSection() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 rounded-3xl p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-4 border-black relative overflow-hidden">
          {/* Doodle decorations */}
          <div className="absolute top-4 right-4 text-6xl opacity-20">📚</div>
          <div className="absolute bottom-4 left-4 text-6xl opacity-20">🎉</div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex justify-center mb-4">
                    <Icon
                      className="w-12 h-12 text-gray-800"
                      stroke="currentColor"
                    />
                  </div>
                  <motion.div
                    className="text-5xl md:text-6xl font-black text-gray-900 mb-2 font-hand"
                    whileHover={{ scale: 1.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-lg font-bold text-gray-800 font-body">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
