/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1a1a1a',
        paper: '#f7f1e3',
        retroAccent: '#d66b33',
        accent: {
          yellow: '#FFD600',
          blue: '#2D5BFF',
          pink: '#FF2D88',
          purple: '#9D2DFF',
        }
      },
      fontFamily: {
        display: ["'Outfit'", "sans-serif"],
        body: ["'Outfit'", "sans-serif"],
        pixel: ["'VT323'", "monospace"],
        serif: ["'Playfair Display'", "serif"],
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px rgba(0,0,0,1)',
        'neo-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
        'neo-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
      }
    },
  },
  plugins: [],
}