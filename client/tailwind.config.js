/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "intro-gradient-orange":
          "linear-gradient(76deg, rgba(255, 197, 105, 0.62) 35.9%, rgba(217, 217, 217, 0.00) 94.95%)",
        "intro-gradient-blue":
          "linear-gradient(291deg, #639DCD 15.67%, rgba(217, 217, 217, 0.00) 81.59%)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
