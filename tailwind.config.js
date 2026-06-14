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
          light: "#F7F8F9",
          dark: "#101820",
          brown: "#8D6E63",
          brown2: "#74584f",
          brown3: "#5c443d",
          brown4: "#44312c",
          gold: "#CBA35C",
        },
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
};