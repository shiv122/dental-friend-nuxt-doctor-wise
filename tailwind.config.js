/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F1917B",
        secondary: "#43A190",
        "yellow-base": "#FFD26D",
        "pink-base": "#DFA3AB",
        "nature-base": "#536c44",
      },
    },
  },
  plugins: [],
};
