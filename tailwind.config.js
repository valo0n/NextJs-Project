/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paradox: {
          bg: "#181826",      // Sfond kryesor
          dark: "#0f0f0f",    // Banner i errët
          purple: "#3f32dc",  // Purple/blue gradient start
          pink: "#cf35d2",    // Pink gradient end (border ngjyra)
          glow: "#cf35d2",    // Glow purple
        },
      },
    },
  },
  plugins: [],
};
