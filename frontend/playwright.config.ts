import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E configuration.
 * Runs against the local dev server (npm run dev @ port 3000).
 * Backend must be running for auth/listing flows.
 *

 */
export default defineConfig({
  testDir: './src/__tests__/e2e',
  fullyParallel: false,           // each story is sequential; avoids race conditions on shared backend
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],
  timeout: 30_000,

  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Keep the dev server running separately — we don't auto-start it here
  // because `npm run dev` is already running in the background.
});
