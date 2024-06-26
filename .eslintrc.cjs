/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-prettier/skip-formatting"
  ],
  overrides: [
    {
      files: [
        "cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}",
        "cypress.config.cjs",
        "cypress/support/**/*.{js,ts,jsx,tsx}"
      ],
      env: { "cypress/globals": true, node: true },
      plugins: ["cypress"],
      extends: ["plugin:cypress/recommended"]
    },
    {
      files: ["tailwind.config.js", "prettier.config.js"],
      env: {
        node: true
      }
    }
  ],
  parserOptions: {
    ecmaVersion: "latest"
  }
};
