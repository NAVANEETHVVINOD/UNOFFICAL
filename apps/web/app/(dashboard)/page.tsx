"use client"

import { motion } from "framer-motion"

const Stats = ({ label, value }: { label: string; value: string }) => (
  <motion.div 
    className="bg-white p-6 rounded-lg border-2 border-[#93B5C6] relative"
    whileHover={{ y: -5 }}
    transition={{ duration: 0.2 }}
  >
    <div className="absolute -top-3 -right-2 w-8 h-12 bg-[#D0D3D4] rounded-b transform rotate-12" />
    <div className="relative">
      <h3 className="font-['Kalam'] text-[#2C3E50] text-lg mb-2">{label}</h3>
      <p className="font-['Permanent_Marker'] text-3xl text-[#E74C3C]">{value}</p>
    </div>
  </motion.div>
)

const UpcomingEvent = ({ 
  title, 
  date, 
  time, 
  location 
}: { 
  title: string
  date: string
  time: string
  location: string
}) => (
  <motion.div 
    className="flex items-start space-x-4 p-4 bg-white rounded-lg border-2 border-[#93B5C6]"
    whileHover={{ x: 5 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex-shrink-0 w-12 h-12 bg-[#2C3E50] rounded-lg flex items-center justify-center text-white font-['Permanent_Marker']">
      {date.split(" ")[0]}<br/>{date.split(" ")[1]}
    </div>
    <div>
      <h4 className="font-['Permanent_Marker'] text-[#2C3E50]">{title}</h4>
      <p className="font-['Kalam'] text-gray-600 text-sm">{time} • {location}</p>
    </div>
  </motion.div>
)

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="bg-white p-6 rounded-lg border-2 border-[#93B5C6] relative">
        <motion.h2 
          className="text-2xl font-['Permanent_Marker'] text-[#2C3E50] mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome back, Student!
        </motion.h2>
        <p className="font-['Kalam'] text-gray-600">Here's what's happening in your college community.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Stats label="Active Clubs" value="12" />
        <Stats label="Events This Week" value="5" />
        <Stats label="Study Groups" value="8" />
        <Stats label="Marketplace Items" value="24" />
      </div>

      {/* Upcoming Events */}
      <div>
        <h3 className="text-xl font-['Permanent_Marker'] text-[#2C3E50] mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          <UpcomingEvent
            title="Tech Club Meetup"
            date="Nov 5"
            time="3:00 PM"
            location="Room 101"
          />
          <UpcomingEvent
            title="Study Group: Advanced Math"
            date="Nov 6"
            time="4:30 PM"
            location="Library"
          />
          <UpcomingEvent
            title="Campus Art Exhibition"
            date="Nov 7"
            time="1:00 PM"
            location="Art Gallery"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-6 bg-white rounded-lg border-2 border-[#93B5C6] text-left relative group"
        >
          <div className="absolute -top-3 -right-2 w-8 h-12 bg-[#D0D3D4] rounded-b transform rotate-12" />
          <div className="relative">
            <h4 className="font-['Permanent_Marker'] text-[#2C3E50] mb-2">Join a Club</h4>
            <p className="font-['Kalam'] text-gray-600 text-sm">Explore and join student clubs that match your interests</p>
            <svg className="w-6 h-6 text-[#E74C3C] mt-4 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-6 bg-white rounded-lg border-2 border-[#93B5C6] text-left relative group"
        >
          <div className="absolute -top-3 -right-2 w-8 h-12 bg-[#D0D3D4] rounded-b transform rotate-12" />
          <div className="relative">
            <h4 className="font-['Permanent_Marker'] text-[#2C3E50] mb-2">Create Study Group</h4>
            <p className="font-['Kalam'] text-gray-600 text-sm">Start a study group for your current courses</p>
            <svg className="w-6 h-6 text-[#E74C3C] mt-4 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-6 bg-white rounded-lg border-2 border-[#93B5C6] text-left relative group"
        >
          <div className="absolute -top-3 -right-2 w-8 h-12 bg-[#D0D3D4] rounded-b transform rotate-12" />
          <div className="relative">
            <h4 className="font-['Permanent_Marker'] text-[#2C3E50] mb-2">List Item</h4>
            <p className="font-['Kalam'] text-gray-600 text-sm">Sell or exchange items in the marketplace</p>
            <svg className="w-6 h-6 text-[#E74C3C] mt-4 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </motion.button>
      </div>
    </div>
  )
}