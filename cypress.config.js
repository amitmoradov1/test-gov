const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://www.gov.il",
    viewportWidth: 1280,
    viewportHeight: 800,
      pageLoadTimeout: 120000, // 2 דקות
    defaultCommandTimeout: 30000, // 30 שניות
    requestTimeout: 30000,
    responseTimeout: 30000,
  },
});
