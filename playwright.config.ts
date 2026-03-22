import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env['BASE_URL'] ?? 'https://tdramashko.github.io/notabene';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  workers: 4,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      // Desktop: runs all test files
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // Mobile: only content, legal-pages, and mobile-specific tests
      // Navigation and i18n suites rely on the desktop nav bar which is hidden on mobile
      name: 'mobile',
      use: { browserName: 'chromium', ...devices['Pixel 7'] },
      testIgnore: ['**/01-navigation.spec.ts', '**/03-i18n.spec.ts'],
    },
  ],
});
