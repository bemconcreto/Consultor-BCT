/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bc: {
          light: "#d9d9d6",
          dark: "#101820",
          brown: "#7a5d53",
          brown2: "#624b43",
          brown3: "#56423b",
          brown4: "#4c3b34",
        },
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
};