/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      black: "#181818",
      white: "#ffffff",
      primary: {
        300: "#7B283C",
        400: "#672333",
        500: "#602433"
      },
      grey: {
        200: "#FAFAFA",
        300: "#DFDFDF",
        400: "#8A8A8A",
        500: "#666666"
      },
      green: {
        300: "#EBFFEB",
        400: "#11A111"
      },
      red: {
        300: "#AF1320",
        400: "#FFF0F1"
      }
    }
  },
  plugins: [require("tailwindcss-animated")]
};
