/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      maxWidth: { "8xl": "81.25rem" },
      backgroundImage: {
        "straws-pattern": "url('/straws-pattern-light.jpg')"
      }
    },
    screens: {
      xs: "23.75em",
      sm: "40em",
      md: "48em",
      lg: "64em",
      xl: "80em",
      "2xl": "96em"
    },
    colors: {
      transparent: "transparent",
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
        300: "#FFF0F1",
        400: "#AF1320"
      }
    },
    fontFamily: {
      base: ["Nunito", "Arial", "Helvetica", "sans-serif"],
      accent: ["Montserrat", "Arial", "Helvetica", "sans-serif"]
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600
    },
    fontSize: {
      xs: "0.839rem",
      sm: "0.944rem",
      base: "1.0625rem",
      lg: "1.196rem",
      xl: "1.345rem",
      "2xl": "1.702rem",
      "3xl": "1.914rem",
      "4xl": "2.154rem",
      "5xl": "2.726rem",
      "6xl": "3.063rem"
    },
    spacing: {
      0: "0rem",
      1: "0.125rem",
      2: "0.25rem",
      3: "0.5rem",
      4: "0.75rem",
      5: "1rem",
      6: "1.5rem",
      7: "2rem",
      8: "2.5rem",
      9: "3rem",
      10: "4rem",
      11: "6rem",
      12: "8rem"
    }
  },
  corePlugins: {
    aspectRatio: false
  },
  plugins: [
    require("tailwindcss-animated"),
    require("tailwindcss-inner-border"),
    require("@tailwindcss/aspect-ratio")
  ]
};
