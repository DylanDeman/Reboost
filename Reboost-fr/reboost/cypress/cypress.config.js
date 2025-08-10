const { defineConfig } = require('cypress')
const dotenv = require('dotenv');
dotenv.config();

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // Increase timeout for login operations
    defaultCommandTimeout: 10000,
    // Allow more time for page transitions
    pageLoadTimeout: 120000
  },
  env: {
    // Test user credentials
    username: 'Dylan De Man',
    password: '123456789',
  },
})