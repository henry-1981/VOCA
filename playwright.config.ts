import { defineConfig } from "playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://localhost:3000",
    viewport: { width: 1024, height: 768 }, // iPad landscape
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev",
    port: 3000,
    reuseExistingServer: true,
  },
  projects: [
    {
      name: "webkit",
      use: { browserName: "webkit" }, // Safari-like for iPad testing
    },
  ],
});
