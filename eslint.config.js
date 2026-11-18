const js = require("@eslint/js");
const globals = require("globals");
const pluginCypress = require("eslint-plugin-cypress");

module.exports = [
  {
    ignores: ["node_modules/", "cypress/screenshots/", "cypress/videos/", "cypress/downloads/"],
  },
  js.configs.recommended,
  {
    files: ["*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node,
    },
  },
  {
    ...pluginCypress.configs.recommended,
    files: ["cypress/**/*.js"],
    languageOptions: {
      ...pluginCypress.configs.recommended.languageOptions,
      sourceType: "module",
    },
    rules: {
      ...pluginCypress.configs.recommended.rules,
      "cypress/no-unnecessary-waiting": "error",
      "cypress/assertion-before-screenshot": "warn",
      "no-unused-expressions": "off",
    },
  },
];
