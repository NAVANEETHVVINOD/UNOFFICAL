"use client"

import Container from './components/ui/Container';
import { NewspaperCard, RetroButton, Badge, Staple, EventRow, Marquee, Tape, HangingCard, Sticker } from './components/ui/NewspaperUI';
import Doodle from './components/ui/Doodle';
import BottomNav from './components/ui/BottomNav';
import { PageTransition } from './providers/AnimationProvider';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <PageTransition>
      {/* Van Gogh Header Background - Full Width */}
      <div className="absolute top-0 left-0 w-full h-[80vh] overflow-hidden -z-10">
        <img
          src="/doodles/header-vangof.jpg"
          alt="Header Background"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/80 to-white"></div>
      </div>
      <Container>
        <div className="py-8 pb-24 md:pb-8">

          {/* Navbar */}
          <nav className="flex justify-between items-center mb-16 px-4">
            <div className="flex items-center gap-2 transform -rotate-2 hover:rotate-0 transition-transform cursor-pointer">
              <div className="w-12 h-12 bg-accent-yellow border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-black font-black text-2xl font-display">L</div>
              <span className="font-display font-black text-3xl tracking-wide text-black drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">LINKER</span>
            </div>
            <div className="hidden md:flex gap-2">
              <RetroButton variant="ghost">Events</RetroButton>
              <RetroButton variant="ghost">Clubs</RetroButton>
              <RetroButton variant="ghost">Market</RetroButton>
              <RetroButton variant="secondary" className="ml-2">Login</RetroButton>
            </div>
            {/* Mobile Profile Button */}
            <div className="md:hidden">
              <RetroButton variant="secondary" className="px-4 py-2 text-sm">
                Login
              </RetroButton>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="mb-32 relative">
            <div className="text-center max-w-4xl mx-auto relative z-40 px-4">

              <h1 className="text-4xl md:text-7xl leading-[0.9] mb-8 tracking-tight mx-auto max-w-3xl">
                <span className="font-pixel block text-gray-400 text-2xl md:text-4xl mb-4 tracking-widest uppercase">Link. Learn. Live.</span>
                <span className="font-display font-black block text-white drop-shadow-[4px_4px_0px_#FACC15] uppercase text-stroke-indigo text-stroke-2 md:text-stroke-3" style={{ WebkitTextStroke: '2px #4F46E5' }}>
                  Campus Chaos — Organized.
                </span>
              </h1>

              <p className="text-lg md:text-2xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed font-serif italic px-4">
                Finally, a place where chaos meets structure.
                <span className="bg-accent-yellow/30 px-2 rounded-md mx-1 not-italic font-bold">(Barely.)</span>
              </p>

              <div className="flex flex-col md:flex-row justify-center gap-4">
                <RetroButton variant="secondary" className="px-10 py-4 text-base shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1">
                  I'm in.
                </RetroButton>
                <RetroButton variant="outline" className="px-10 py-4 text-base">
                  Show me around.
                </RetroButton>
              </div>
            </div>

            {/* Left Card - Retro TV Style */}
            <div className="absolute top-12 -left-10 md:top-4 md:left-4 z-20 scale-[0.6] md:scale-100 origin-top-left">
              <HangingCard className="w-52 p-4 bg-gradient-to-br from-indigo-950 to-slate-900 text-white rotate-[-6deg] rounded-3xl shadow-xl border-2 border-indigo-800">
                <Sticker className="top-2 right-2 bg-accent-pink text-white" rotate={12}>LIVE</Sticker>
                <div className="border-4 border-white/10 rounded-2xl p-2 bg-black/40 backdrop-blur-sm">
                  {/* TV Screen */}
                  <div className="bg-white rounded-xl overflow-hidden border-2 border-white/20 relative">
                    <img
                      src="/doodles/welcome.jpg"
                      alt="Welcome"
                      className="w-full h-48 object-cover"
                      onError={(e) => console.error('Failed to load welcome:', e)}
                      onLoad={() => console.log('Welcome loaded')}
                    />
                    {/* TV Scanlines */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"></div>
                  </div>
                  {/* TV Base */}
                  <div className="h-2 bg-white/30 mt-2 rounded-full"></div>
                </div>
              </HangingCard>
            </div>

            {/* Right Card - CD Album Style */}
            <div className="absolute top-24 -right-10 md:top-32 md:right-4 z-20 scale-[0.6] md:scale-100 origin-top-right">
              <HangingCard className="w-48 p-4 bg-gradient-to-br from-gray-800 to-black text-white rotate-[6deg] border-4 border-accent-yellow animate-border-color relative overflow-visible rounded-3xl shadow-xl">
                <style jsx>{`
                  @keyframes border-color-change {
                    0% { border-color: #FACC15; } /* Yellow */
                    33% { border-color: #4F46E5; } /* Indigo */
                    66% { border-color: #F472B6; } /* Pink */
                    100% { border-color: #FACC15; } /* Yellow */
                  }
                  .animate-border-color {
                    animation: border-color-change 3s infinite linear;
                  }
                `}</style>
                <Sticker className="-bottom-3 -left-3 bg-accent-green text-black font-black" rotate={-5}>LIVE</Sticker>

                <div className="aspect-square rounded-full mb-3 overflow-hidden border-4 border-accent-yellow flex items-center justify-center relative shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                  {/* CD Image with Spin */}
                  <img
                    src="/doodles/CD.jpg"
                    alt="CD"
                    className="w-full h-full object-cover animate-spin-slow"
                    style={{ animationDuration: '8s' }}
                    onError={(e) => console.error('Failed to load CD:', e)}
                    onLoad={() => console.log('CD loaded')}
                  />
                  {/* Center Hole */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-black rounded-full border-2 border-white"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm font-pixel text-accent-yellow drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">GAME_ON.EXE</span>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </HangingCard>
            </div>
          </div>

          {/* Marquee Section */}
          <div className="mb-24 -mx-4 md:-mx-8 transform -rotate-1">
            <div className="bg-black py-4 border-y-4 border-accent-yellow shadow-xl">
              <Marquee speed={30}>
                <span className="text-white font-pixel text-3xl mx-8">/// BREAKING_NEWS: HACKATHON REGISTRATIONS OPEN ///</span>
                <span className="text-accent-yellow font-serif italic text-3xl mx-8">Don't miss out!</span>
                <span className="text-white font-pixel text-3xl mx-8">/// NEW_CLUB_ALERT: ROBOTICS ///</span>
                <span className="text-accent-blue font-serif italic text-3xl mx-8">Join the revolution</span>
                <span className="text-white font-pixel text-3xl mx-8">/// EXAM_SCHEDULE_RELEASED ///</span>
                <span className="text-accent-pink font-serif italic text-3xl mx-8">Panic mode: ON</span>
              </Marquee>
            </div>
          </div>

          {/* About Section */}
          <div className="grid md:grid-cols-12 gap-8 mb-24">
            <div className="md:col-span-7">
              <NewspaperCard variant="curved" className="h-full p-8 md:p-12 bg-white relative overflow-hidden">
                <Tape className="absolute -top-3 left-1/2 -translate-x-1/2" />
                <Badge className="mb-6">ABOUT LINKER</Badge>
                <h2 className="font-display text-4xl md:text-5xl font-black mb-6">
                  NOT JUST ANOTHER<br />
                  <span className="text-accent-blue">NOTICE BOARD.</span>
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  LINKER is a campus-wide digital platform that centralizes all student activities, academic resources, club operations, events, and campus interactions into one integrated system. It replaces scattered communication with a structured, accessible, role-based platform.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <h4 className="font-bold mb-1">Student Ecosystem</h4>
                    <p className="text-sm text-gray-500">Everything you need to survive college.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <h4 className="font-bold mb-1">Community Hub</h4>
                    <p className="text-sm text-gray-500">Connect, collaborate, and create.</p>
                  </div>
                </div>
              </NewspaperCard>
            </div>
            <div className="md:col-span-5 flex flex-col gap-6">
              <NewspaperCard variant="curved" className="flex-1 bg-accent-yellow p-8 flex flex-col justify-center relative overflow-hidden group">
                <Doodle src="/doodles/megaphone.svg" className="absolute -right-8 -bottom-8 w-48 h-48 opacity-20 group-hover:scale-110 transition-transform" />
                <h3 className="font-display text-6xl font-black mb-2">500+</h3>
                <p className="font-serif italic text-2xl">Students Connected</p>
              </NewspaperCard>
              <NewspaperCard variant="curved" className="flex-1 bg-black text-white p-8 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h3 className="font-pixel text-4xl mb-2 text-accent-pink">LIVE_FEED</h3>
                <p className="text-gray-400">Real-time updates from every club and department.</p>
              </NewspaperCard>
            </div>
          </div>

          {/* The Ecosystem (Roles) */}
          <div className="mb-32">
            <div className="text-center mb-12">
              <h2 className="font-display text-5xl font-black mb-4">THE ECOSYSTEM</h2>
              <p className="text-xl text-gray-600 font-serif italic">"A role for everyone."</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Student */}
              <NewspaperCard className="p-6 hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-accent-blue rounded-full flex items-center justify-center mb-4 border-2 border-black">
                  <Doodle src="/doodles/sparkle.svg" className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">STUDENTS</h3>
                <ul className="text-sm space-y-2 text-gray-600 list-disc list-inside">
                  <li>Access all events</li>
                  <li>Join clubs & communities</li>
                  <li>Download notes & papers</li>
                  <li>Buy/Sell in Marketplace</li>
                </ul>
              </NewspaperCard>

              {/* Teacher */}
              <NewspaperCard className="p-6 hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-accent-pink rounded-full flex items-center justify-center mb-4 border-2 border-black">
                  <Doodle src="/doodles/book.svg" className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">TEACHERS</h3>
                <ul className="text-sm space-y-2 text-gray-600 list-disc list-inside">
                  <li>Upload study materials</li>
                  <li>Post announcements</li>
                  <li>Manage department events</li>
                  <li>Approve student posts</li>
                </ul>
              </NewspaperCard>

              {/* Club Leader */}
              <NewspaperCard className="p-6 hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-accent-yellow rounded-full flex items-center justify-center mb-4 border-2 border-black">
                  <Doodle src="/doodles/group.svg" className="w-6 h-6 text-black" />
                </div>
                <h3 className="font-bold text-xl mb-2">CLUB LEADERS</h3>
                <ul className="text-sm space-y-2 text-gray-600 list-disc list-inside">
                  <li>Create & edit events</li>
                  <li>Manage club profile</li>
                  <li>Recruit members</li>
                  <li>Access event analytics</li>
                </ul>
              </NewspaperCard>

              {/* Admin */}
              <NewspaperCard className="p-6 hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4 border-2 border-black">
                  <Doodle src="/doodles/megaphone.svg" className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">ADMIN</h3>
                <ul className="text-sm space-y-2 text-gray-600 list-disc list-inside">
                  <li>Full moderation panel</li>
                  <li>Validate clubs & events</li>
                  <li>Manage user roles</li>
                  <li>System-wide settings</li>
                </ul>
              </NewspaperCard>
            </div>
          </div>

          {/* FEATURE 1: EVENTS SYSTEM */}
          <div className="mb-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <Badge className="mb-4 bg-accent-blue text-white border-black">MODULE_01</Badge>
                <h2 className="font-display text-5xl font-black mb-6">EVENTS SYSTEM</h2>
                <p className="text-xl text-gray-600 mb-8">
                  Never miss a beat. All college events in one place, automatically sorted and easy to join.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <span className="font-bold">Automatic sorting by date</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <span className="font-bold">Registration/RSVP system</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <span className="font-bold">Event details & attachments</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <span className="font-bold">Save & bookmark events</span>
                  </li>
                </ul>
                <RetroButton variant="secondary">Explore Events</RetroButton>
              </div>
              <div className="order-1 md:order-2">
                <NewspaperCard variant="curved" className="bg-accent-blue p-8 rotate-2 hover:rotate-0 transition-transform">
                  <div className="bg-white rounded-3xl p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-bold">UPCOMING_EVENTS</span>
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex gap-4">
                        <div className="w-12 h-12 bg-accent-yellow rounded-full flex items-center justify-center font-bold border border-black">24</div>
                        <div>
                          <h4 className="font-bold">Freshers' Night</h4>
                          <p className="text-xs text-gray-500">Auditorium • 6 PM</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex gap-4">
                        <div className="w-12 h-12 bg-accent-pink rounded-full flex items-center justify-center font-bold border border-black text-white">01</div>
                        <div>
                          <h4 className="font-bold">Code Chaos</h4>
                          <p className="text-xs text-gray-500">CS Lab • 9 AM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </NewspaperCard>
              </div>
            </div>
          </div>

          {/* FEATURE 2: CLUBS SYSTEM */}
          <div className="mb-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <NewspaperCard variant="curved" className="bg-accent-pink p-8 -rotate-2 hover:rotate-0 transition-transform">
                  <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
                    <div className="w-24 h-24 bg-black rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-accent-yellow">
                      <Doodle src="/doodles/group.svg" className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="font-display text-3xl font-black mb-2">ROBOTICS CLUB</h3>
                    <p className="text-sm text-gray-500 mb-6">Building the future, one bot at a time.</p>
                    <div className="flex justify-center gap-2">
                      <Badge className="bg-gray-100 border-gray-200">Tech</Badge>
                      <Badge className="bg-gray-100 border-gray-200">Workshop</Badge>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <RetroButton className="w-full" variant="outline">Join Club</RetroButton>
                    </div>
                  </div>
                </NewspaperCard>
              </div>
              <div>
                <Badge className="mb-4 bg-accent-pink text-white border-black">MODULE_02</Badge>
                <h2 className="font-display text-5xl font-black mb-6">CLUBS DIRECTORY</h2>
                <p className="text-xl text-gray-600 mb-8">
                  Find your tribe. A complete directory of all college clubs with profiles, announcements, and member listings.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <span className="font-bold">Club profiles & descriptions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <span className="font-bold">Club-specific announcements</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <span className="font-bold">Easy join requests</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <span className="font-bold">Member management for leaders</span>
                  </li>
                </ul>
                <RetroButton variant="secondary">Browse Clubs</RetroButton>
              </div>
            </div>
          </div>

          {/* FEATURE 3: ACADEMIC NOTES */}
          <div className="mb-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <Badge className="mb-4 bg-accent-yellow text-black border-black">MODULE_03</Badge>
                <h2 className="font-display text-5xl font-black mb-6">ACADEMIC NOTES</h2>
                <p className="text-xl text-gray-600 mb-8">
                  No more begging for notes. Access study materials, previous year papers, and resources organized by department.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <span className="font-bold">Department & semester organization</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <span className="font-bold">PDF viewer & download system</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <span className="font-bold">Teacher & student uploads</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <span className="font-bold">Previous year question papers</span>
                  </li>
                </ul>
                <RetroButton variant="secondary">Find Notes</RetroButton>
              </div>
              <div className="order-1 md:order-2">
                <NewspaperCard variant="curved" className="bg-accent-yellow p-8 rotate-2 hover:rotate-0 transition-transform">
                  <div className="bg-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 text-xs font-bold rounded-bl-xl">PDF</div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-300">
                        <Doodle src="/doodles/book.svg" className="w-6 h-6 opacity-50" />
                      </div>
                      <div>
                        <h4 className="font-bold">Physics_101_Notes.pdf</h4>
                        <p className="text-xs text-gray-500">Uploaded by Prof. Smith</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-100 rounded-full w-full"></div>
                      <div className="h-2 bg-gray-100 rounded-full w-5/6"></div>
                      <div className="h-2 bg-gray-100 rounded-full w-4/6"></div>
                    </div>
                    <div className="mt-6 flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400">2.4 MB</span>
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">↓</div>
                    </div>
                  </div>
                </NewspaperCard>
              </div>
            </div>
          </div>

          {/* FEATURE 4: MARKETPLACE */}
          <div className="mb-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <NewspaperCard variant="curved" className="bg-accent-purple p-8 -rotate-2 hover:rotate-0 transition-transform">
                  <div className="bg-white rounded-3xl p-6 shadow-lg">
                    <div className="aspect-video bg-gray-100 rounded-xl mb-4 relative overflow-hidden border border-gray-200">
                      <Doodle src="/doodles/shopping-bag.svg" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 opacity-20" />
                      <div className="absolute bottom-2 left-2 bg-white px-2 py-1 text-xs font-bold rounded border border-black">$15</div>
                    </div>
                    <h3 className="font-bold text-xl mb-1">Engineering Calculator</h3>
                    <p className="text-sm text-gray-500 mb-4">Used for 1 semester. Good condition.</p>
                    <RetroButton className="w-full text-sm" variant="secondary">Contact Seller</RetroButton>
                  </div>
                </NewspaperCard>
              </div>
              <div>
                <Badge className="mb-4 bg-accent-purple text-white border-black">MODULE_04</Badge>
                <h2 className="font-display text-5xl font-black mb-6">MARKETPLACE</h2>
                <p className="text-xl text-gray-600 mb-8">
                  Buy, sell, and exchange items within the campus. A secure environment for students to trade.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <span className="font-bold">Secure campus-only environment</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <span className="font-bold">Chat/contact system for sellers</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <span className="font-bold">Buy/sell books, lab coats, etc.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <span className="font-bold">Search & category filtering</span>
                  </li>
                </ul>
                <RetroButton variant="secondary">Visit Market</RetroButton>
              </div>
            </div>
          </div>

          {/* Upcoming Events List (Existing) */}
          <div className="max-w-5xl mx-auto mb-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-accent-pink rounded-full border-2 border-black flex items-center justify-center">
                <Doodle src="/doodles/calendar.svg" className="w-6 h-6 text-white" />
              </div>
              <h2 className="font-display text-4xl font-black">UPCOMING EVENTS</h2>
            </div>

            <NewspaperCard variant="curved" className="p-0" noShadow>
              <EventRow
                date="Dec 01"
                time="9:00 AM"
                title="Hackathon: Code Chaos (24h)"
                icon="/doodles/book.svg"
                color="bg-accent-blue"
              />
              <EventRow
                date="Dec 02"
                time="4:00 PM"
                title="Debate Club: Is Cereal Soup?"
                icon="/doodles/megaphone.svg"
                color="bg-accent-pink"
              />
              <EventRow
                date="Dec 05"
                time="2:00 PM"
                title="Robotics Workshop: Building Bots"
                icon="/doodles/group.svg"
                color="bg-accent-purple"
              />
              <EventRow
                date="Dec 10"
                time="10:00 AM"
                title="Campus Market Day"
                icon="/doodles/shopping-bag.svg"
                color="bg-accent-yellow"
              />
            </NewspaperCard>

            <div className="text-center mt-8">
              <RetroButton variant="outline">View Full Calendar</RetroButton>
            </div>
          </div>

        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </Container >
    </PageTransition >
  );
}
