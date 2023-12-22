/** @type {import('tailwindcss').Config} */
export default {
  darkMode: false,
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FAF5FF",
          100: "#E9D8FD",
          200: "#D6BCFA",
          300: "#B794F4",
          400: "#9F7AEA",
          500: "#805AD5",
          600: "#6B46C1",
          700: "#553C9A",
          800: "#44337A",
          900: "#322659",
        },
      }
    },
  },
  plugins: [
      require('@tailwindcss/forms')
  ],
}