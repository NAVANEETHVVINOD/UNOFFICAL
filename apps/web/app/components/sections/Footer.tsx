"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-white pt-20 pb-10 relative overflow-hidden border-t-4 border-black">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h2
              className="text-4xl font-black mb-6"
              style={{
                fontFamily: "'Permanent Marker', cursive",
                background:
                  "linear-gradient(135deg, #FF6B6B 0%, #FFD93D 50%, #6BCB77 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              LINKER
            </h2>
            <p className="text-xl text-gray-600 font-hand max-w-md">
              The ultimate digital notebook for your campus life. Connect,
              organize, and thrive! 🌟
            </p>
          </div>

          <div>
            <h3 className="font-black text-xl mb-6 font-hand">Quick Links</h3>
            <ul className="space-y-4 font-body text-gray-600">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-500 hover:underline decoration-wavy"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-500 hover:underline decoration-wavy"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-500 hover:underline decoration-wavy"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-500 hover:underline decoration-wavy"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-black text-xl mb-6 font-hand">Legal Stuff</h3>
            <ul className="space-y-4 font-body text-gray-600">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-500 hover:underline decoration-wavy"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-500 hover:underline decoration-wavy"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-500 hover:underline decoration-wavy"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-gray-300 pt-8 text-center">
          <p className="font-hand text-gray-500">
            © 2025 LINKER (MEC-UNOFFICALS). Made with ❤️ and ☕️ by students,
            for students.
          </p>
        </div>
      </div>
    </footer>
  );
}
