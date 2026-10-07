// Visual regression: React build vs Claude Design page.
//   DESIGN_ONLY=1 npx playwright test design-shots   -> writes the expected images (tests/__baselines__/)
//   npx playwright test visual                        -> builds + previews our site (port 4173), compares
//   BASE_URL=http://host:port npx playwright test visual   -> compare against an already-running site
import { defineConfig, devices } from '@playwright/test';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// This machine only has a cached chromium_headless_shell whose revision may differ from what
// Playwright 1.63 expects; fall back to whatever is cached (a no-op when the expected one exists).
function cachedShell() {
  try {
    const root = join(process.env.LOCALAPPDATA || '', 'ms-playwright');
    for (const d of readdirSync(root).filter((n) => n.startsWith('chromium_headless_shell-'))) {
      const exe = join(root, d, 'chrome-headless-shell-win64', 'chrome-headless-shell.exe');
      if (existsSync(exe)) return exe;
    }
  } catch {}
}
const shell = cachedShell();
const launch = shell ? { launchOptions: { executablePath: shell } } : {};

// Every project is chromium (no webkit/firefox installed), even the phone ones.
const chromium = (device, viewport) => ({
  ...device,
  browserName: 'chromium',
  viewport,
  deviceScaleFactor: 1,
});

const needServer = !process.env.BASE_URL && !process.env.DESIGN_ONLY;

export default defineConfig({
  testDir: 'tests',
  snapshotPathTemplate: 'tests/__baselines__/{projectName}/{arg}{ext}',
  retries: 0,
  workers: 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.005, animations: 'disabled', caret: 'hide' },
  },
  use: {
    ...launch,
    baseURL: process.env.BASE_URL || 'http://localhost:4173',
    reducedMotion: 'reduce',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], browserName: 'chromium', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } },
    { name: 'iphone', use: chromium({ ...devices['iPhone 13'] }, { width: 390, height: 844 }) },
    { name: 'android', use: chromium({ ...devices['Pixel 5'] }, { width: 360, height: 760 }) },
    { name: 'tablet', use: { ...devices['Desktop Chrome'], browserName: 'chromium', viewport: { width: 768, height: 1024 }, deviceScaleFactor: 1 } },
  ],
  webServer: needServer
    ? {
        command: 'npm run build && npm run preview -- --port 4173',
        port: 4173,
        reuseExistingServer: true,
        timeout: 180000,
      }
    : undefined,
});
