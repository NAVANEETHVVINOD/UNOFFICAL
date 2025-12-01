"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Rahul Kumar",
    role: "CS Student",
    text: "LINKER changed how I experience college life! Found my coding club here! 💻",
    avatar: "🧑‍💻",
    color: "bg-blue-200",
  },
  {
    name: "Priya Sharma",
    role: "Club President",
    text: "Managing our club is so easy now. Events get 3x more attendance! 🎯",
    avatar: "👩‍🎓",
    color: "bg-pink-200",
  },
  {
    name: "Arjun Patel",
    role: "Engineering Junior",
    text: "Sold my old books, got notes for exams. This app is a lifesaver! 📖",
    avatar: "🧑‍🔧",
    color: "bg-green-200",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.h2
          className="text-6xl md:text-8xl font-black text-center mb-16"
          style={{
            fontFamily: "'Permanent Marker', cursive",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(3px 3px 0px rgba(0,0,0,0.1))",
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Students Love It! ❤️
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className={`${testimonial.color} p-8 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black relative`}
              style={{ transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)` }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ rotate: 0, scale: 1.05 }}
            >
              {/* Pin decoration */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-red-500 rounded-full border-4 border-black shadow-lg" />

              <div className="text-6xl mb-4">{testimonial.avatar}</div>
              <p className="text-xl font-bold mb-6 text-gray-800 font-hand">
                "{testimonial.text}"
              </p>
              <div>
                <div className="font-black text-lg font-body">
                  {testimonial.name}
                </div>
                <div className="text-gray-600 font-bold font-body">
                  {testimonial.role}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
