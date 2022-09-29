import { defineConfig } from 'cypress';

export default defineConfig({
  env: {
    baseUrl: 'http://127.0.0.1:4200'
  },
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
