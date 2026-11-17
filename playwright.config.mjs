// Smoke tests on the built site: WebKit with iPhone/iPad emulation for every stop, Chromium for offline (Playwright's
// service-worker support is reliable only there). Real-device checks stay manual (see CLAUDE.md).
import { defineConfig, devices } from "@playwright/test";

const PORT = 8766;   // not the dev server's 8765, which serves the unbuilt source
const webkit = { testIgnore: /offline\.spec/ };

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 45_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL: `http://localhost:${PORT}/`, locale: "en-US", trace: "retain-on-failure" },   // hungarian.spec sets hu-HU
  webServer: { command: `node tools/build.mjs && python3 -m http.server ${PORT} -d _site`, url: `http://localhost:${PORT}/index.html`, stderr: "ignore", reuseExistingServer: !process.env.CI },
  projects: [
    { name: "iphone", use: devices["iPhone 15"], ...webkit },
    { name: "iphone-landscape", use: devices["iPhone 15 landscape"], ...webkit },
    { name: "ipad", use: devices["iPad Pro 11"], ...webkit },
    { name: "ipad-landscape", use: devices["iPad Pro 11 landscape"], ...webkit },
    { name: "chromium-offline", use: devices["Desktop Chrome"], testMatch: /offline\.spec/ },
  ],
});
