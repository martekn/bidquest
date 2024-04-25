require("dotenv").config();

const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
    baseUrl: "http://localhost:4173"
  },
  env: {
    USER_NAME: process.env.USER_NAME,
    USER_EMAIL: process.env.USER_EMAIL,
    USER_PASSWORD: process.env.USER_PASSWORD,
    API_KEY: process.env.VITE_API_KEY
  }
});
