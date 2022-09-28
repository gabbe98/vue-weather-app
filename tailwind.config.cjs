/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue, js, jsx}"],
  theme: {
    extend: {
      fontFamily: {
        GilroyLight: [
          "Gilroy-light",
          "Avenir",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        GilroyBold: [
          "Gilroy-bold",
          "Avenir",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
