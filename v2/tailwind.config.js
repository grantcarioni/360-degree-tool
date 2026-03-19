/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["DM Sans", "sans-serif"],
        ui: ["DM Sans", "sans-serif"],
        body: ["Lora", "serif"],
      },
      colors: {
        background: "#f2f4f5",
        foreground: "#253746",
        ni: {
          charcoal: "#253746",
          carmine: "#A4343A",
          surface: "#f2f4f5",
        }
      }
    },
  },
  plugins: [],
}
