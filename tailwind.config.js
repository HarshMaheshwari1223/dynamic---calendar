/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: {
          50: "#f8f7f4",
          100: "#eeeae0",
          200: "#d8d0bc",
          300: "#bfb09a",
          400: "#a48e76",
          500: "#8a7260",
          600: "#6e5a4c",
          700: "#54443a",
          800: "#3c302a",
          900: "#261e1a",
        },
        azure: {
          400: "#38b2f0",
          500: "#1a9edc",
          600: "#0e85c4",
          700: "#0a6fa8",
        },
        cream: "#f9f6f0",
      },
      boxShadow: {
        calendar:
          "0 20px 60px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.6)",
        "calendar-hover":
          "0 32px 80px rgba(0,0,0,0.18), 0 12px 32px rgba(0,0,0,0.12)",
        page: "4px 0 20px rgba(0,0,0,0.06)",
      },
      animation: {
        "page-flip": "pageFlip 0.5s ease-in-out",
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.35s ease-out",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        pageFlip: {
          "0%": { transform: "rotateY(0deg)", opacity: 1 },
          "50%": { transform: "rotateY(-90deg)", opacity: 0 },
          "51%": { transform: "rotateY(90deg)", opacity: 0 },
          "100%": { transform: "rotateY(0deg)", opacity: 1 },
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
