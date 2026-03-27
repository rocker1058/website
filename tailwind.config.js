/** @type {import('tailwindcss').Config} */
export default {
  content: ["./client/index.html", "./client/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 50: "#f5f3ff", 100: "#ede9fe", 200: "#ddd6fe", 300: "#c4b5fd", 400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed", 700: "#5b21b6", 800: "#4a1185", 900: "#3a0960", 950: "#2a0845" },
        gold: { 300: "#e2c97e", 400: "#d4b85c", 500: "#c9a83a" },
      },
      fontFamily: { heading: ["'Cormorant Garamond'", "serif"], body: ["'Source Sans 3'", "sans-serif"] },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
