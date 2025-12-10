/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enable class-based dark mode for CRT
  theme: {
    extend: {
      colors: {
        ink: "#1a1a1a",
        paper: "#f7f1e3",
        retroAccent: "#d66b33",
        accent: {
          yellow: "#FFC567", // Senior UI Spec
          pink: "#FB7DA8",   // Senior UI Spec
          blue: "#058CD7",   // Senior UI Spec
          green: "#00995E",  // Senior UI Spec
          purple: "#552CB7", // Senior UI Spec
          red: "#FD5A46",    // Senior UI Spec
        },
        crt: {
          green: "#00ff41",
          black: "#0d1117",
        }
      },
      fontFamily: {
        display: ["'Nano Banan Pro'", "'Outfit'", "sans-serif"], // Updated Header Font
        body: ["'Outfit'", "sans-serif"],
        pixel: ["'VT323'", "monospace"],
        serif: ["'Playfair Display'", "serif"],
        hand: ["'Caveat'", "cursive"],
        marker: ["'Permanent Marker'", "cursive"],
      },
      boxShadow: {
        neo: "4px 4px 0px 0px rgba(0,0,0,1)",
        "neo-lg": "6px 6px 0px 0px rgba(0,0,0,1)",
        "neo-sm": "2px 2px 0px 0px rgba(0,0,0,1)",
        soft: "0px 4px 8px rgba(0,0,0,0.08)",
      },
      borderWidth: {
        thick: "4px",
        card: "3px",
      },
      zIndex: {
        navbar: "50",
        floating: "45",
        orbitnav: "40",
        tickers: "30",
        feed: "20",
        cards: "20",
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        wiggle: "wiggle 0.4s ease-in-out",
        "tilt-in": "tiltIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "spin-slow": "spin-slow 12s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-2deg)" },
          "75%": { transform: "rotate(2deg)" },
        },
        tiltIn: {
          "from": { opacity: "0", transform: "translateY(10px) rotate(-3deg)" },
          "to": { opacity: "1", transform: "translateY(0) rotate(0)" },
        },
        fadeUp: {
          "from": { opacity: "0", transform: "translateY(10px)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
        "spin-slow": {
          "from": { transform: "rotate(0deg)" },
          "to": { transform: "rotate(360deg)" },
        }
      }
    },
  },
  plugins: [],
};

