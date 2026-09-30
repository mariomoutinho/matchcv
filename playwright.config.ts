import { defineConfig } from "@playwright/test";
export default defineConfig({
  workers: 2,
  timeout: 60000,
  expect: { timeout: 15000 },
  testDir: "./e2e",
  use: { baseURL: "http://127.0.0.1:4173", headless: true },
  webServer: {
    command: "npm run preview -- --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { viewport: { width: 320, height: 780 } } },
  ],
});
