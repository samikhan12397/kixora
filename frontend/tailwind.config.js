/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0E11",
        ink2: "#14181D",
        paper: "#EDEAE3",
        steel: "#8A8F98",
        steeldim: "#4A4F58",
        volt: "#C8FF00",
        signal: "#FF4D23",
      },
      fontFamily: {
        display: ["'Bebas Neue'", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
