/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#caa0a2", // استخدام المتغير هنا
        secondary: "#e4d1d4",
        accent: "#f2e3e5",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        Shadows: ["Merienda", "sans-serif"],
      },
    },
  },
  plugins: [],
};
