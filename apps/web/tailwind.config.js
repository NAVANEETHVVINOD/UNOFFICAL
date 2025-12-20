/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core Retro Palette - Paper tones instead of pure white
        ink: "#1A1A1A",           // Soft black for reduced eye strain
        "ink-light": "#4A4A4A",   // Gray for secondary text
        paper: "#FDF6E3",         // Warm cream (main background)
        "paper-light": "#FAF3E0", // Lighter cream
        "paper-dark": "#F5ECD7",  // Slightly darker cream
        "input-bg": "#FAF8F5",    // Muted input background

        // Dark Mode Colors - Professional Black & Yellow
        dark: {
          bg: "#121212",          // Rich dark gray background (not pure black)
          surface: "#1E1E1E",     // Slightly lighter surface
          elevated: "#2D2D2D",    // Elevated elements
          border: "#333333",      // Subtle borders
          "border-bright": "#4D4D4D", // Brighter borders
          text: "#E0E0E0",        // Primary text (off-white)
          "text-muted": "#A0A0A0", // Secondary text
          "text-subtle": "#666666", // Tertiary text
          input: "#1E1E1E",       // Input background
          hover: "#2D2D2D",       // Hover state
        },

        // Primary Yellow - The star of the show
        primary: {
          DEFAULT: "#FFEB3B",
          50: "#FFFDE7",
          100: "#FFF9C4",
          200: "#FFF59D",
          300: "#FFF176",
          400: "#FFEE58",
          500: "#FFEB3B",
          600: "#FDD835",
          700: "#FBC02D",
          800: "#F9A825",
          900: "#F57F17",
        },
        // Accent Colors
        accent: {
          yellow: "#FFEB3B",
          coral: "#FF6B6B",
          mint: "#4ECDC4",
          blue: "#45B7D1",
          purple: "#9B59B6",
          pink: "#FF69B4",
          orange: "#FF8C42",
          green: "#2ECC71",
          red: "#E74C3C",
        },
        // Neutral grays
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#EEEEEE",
          300: "#E0E0E0",
          400: "#BDBDBD",
          500: "#9E9E9E",
          600: "#757575",
          700: "#616161",
          800: "#424242",
          900: "#212121",
        },
        crt: {
          green: "#00ff41",
          black: "#0d1117",
        },
        // Hover colors - accessible alternatives to bright yellow
        hover: {
          primary: "#E6D435",    // Darker yellow for hover states
          muted: "#D4C92F",      // Even more muted yellow
          dark: "#C4B82A",       // Dark yellow for active states
        }
      },
      fontFamily: {
        display: ["'Outfit'", "system-ui", "sans-serif"],
        body: ["'Outfit'", "sans-serif"],
        pixel: ["'VT323'", "monospace"],
        serif: ["'Playfair Display'", "serif"],
        hand: ["'Caveat'", "cursive"],
        marker: ["'Permanent Marker'", "cursive"],
        mono: ["'JetBrains Mono'", "'VT323'", "monospace"],
      },
      boxShadow: {
        // Neo-brutalist shadows
        neo: "4px 4px 0px 0px #0a0a0a",
        "neo-lg": "6px 6px 0px 0px #0a0a0a",
        "neo-xl": "8px 8px 0px 0px #0a0a0a",
        "neo-sm": "2px 2px 0px 0px #0a0a0a",
        // Yellow accent shadows
        "neo-yellow": "4px 4px 0px 0px #FFEB3B",
        "neo-yellow-lg": "6px 6px 0px 0px #FFEB3B",
        // Dark mode shadows - yellow glow
        "neo-dark": "4px 4px 0px 0px #FFEB3B",
        "neo-dark-lg": "6px 6px 0px 0px #FFEB3B",
        "neo-dark-sm": "2px 2px 0px 0px #FFEB3B",
        // Glow shadows for dark mode
        "glow-sm": "0 0 10px rgba(255, 235, 59, 0.3)",
        "glow-md": "0 0 20px rgba(255, 235, 59, 0.4)",
        "glow-lg": "0 0 30px rgba(255, 235, 59, 0.5)",
        // Soft shadows for cards
        soft: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "soft-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        // Glow effects
        "glow-yellow": "0 0 20px rgba(255, 235, 59, 0.5)",
        "glow-white": "0 0 20px rgba(255, 255, 255, 0.5)",
      },
      borderWidth: {
        thick: "4px",
        card: "3px",
        DEFAULT: "2px",
      },
      borderRadius: {
        'retro': '0px',
        'retro-sm': '4px',
        'retro-md': '8px',
        'retro-lg': '12px',
        // Card-specific rounded corners
        'card': '12px',
        'card-lg': '16px',
        'card-xl': '20px',
      },
      zIndex: {
        navbar: "50",
        floating: "45",
        orbitnav: "40",
        tickers: "30",
        feed: "20",
        cards: "20",
        modal: "100",
        toast: "110",
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "float-slow": "float 6s ease-in-out infinite",
        wiggle: "wiggle 0.4s ease-in-out",
        "wiggle-slow": "wiggle 2s ease-in-out infinite",
        "tilt-in": "tiltIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
        "slide-down": "slideDown 0.4s ease-out forwards",
        "scale-in": "scaleIn 0.3s ease-out forwards",
        "spin-slow": "spin 12s linear infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "border-dance": "borderDance 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
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
          "from": { opacity: "0", transform: "translateY(20px)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "from": { opacity: "0" },
          "to": { opacity: "1" },
        },
        slideUp: {
          "from": { opacity: "0", transform: "translateY(100%)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "from": { opacity: "0", transform: "translateY(-100%)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "from": { opacity: "0", transform: "scale(0.9)" },
          "to": { opacity: "1", transform: "scale(1)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        borderDance: {
          "0%, 100%": { borderColor: "#FFEB3B" },
          "33%": { borderColor: "#FF6B6B" },
          "66%": { borderColor: "#4ECDC4" },
        },
      },
      backgroundImage: {
        'grid-pattern': `
          linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)
        `,
        'dots-pattern': 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)',
        // Subtle dot pattern for main content background
        'dots-subtle': 'radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        // Dark mode patterns
        'grid-dark': `
          linear-gradient(to right, rgba(255,235,59,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,235,59,0.05) 1px, transparent 1px)
        `,
        'dots-dark': 'radial-gradient(circle, rgba(255,235,59,0.08) 1px, transparent 1px)',
        'dots-dark-subtle': 'radial-gradient(circle, rgba(255,235,59,0.04) 1px, transparent 1px)',
        // Yellow gradient for dark mode accents
        'gradient-yellow': 'linear-gradient(135deg, #FFEB3B 0%, #FBC02D 50%, #F9A825 100%)',
        'gradient-yellow-dark': 'linear-gradient(135deg, #F9A825 0%, #F57F17 100%)',
      },
      backgroundSize: {
        'grid': '24px 24px',
        'dots': '16px 16px',
        'dots-subtle': '20px 20px',
      },
    },
  },
  plugins: [],
};

