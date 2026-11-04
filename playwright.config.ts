import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  globalSetup: './e2e/global-setup.ts',
  use: { baseURL: 'http://localhost:3100' },
  webServer: {
    command: 'npm run dev -- -p 3100',
    url: 'http://localhost:3100',
    reuseExistingServer: true
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
