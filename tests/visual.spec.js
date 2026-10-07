import { test, expect } from '@playwright/test';
import { SECTIONS, prepare, maskFor, freezeTimers, topClip, hideFixed } from './helpers.js';

test.describe('@visual', () => {
  test.setTimeout(60000);
  for (const { id, name } of SECTIONS) {
    test(`visual ${name}`, async ({ page }) => {
      await freezeTimers(page);
      await page.goto('/');
      await page.locator('#' + id).waitFor({ state: 'attached' });
      await prepare(page);
      await hideFixed(page, id);
      const clip = id === 'top' ? await topClip(page) : null;
      if (clip) await expect(page).toHaveScreenshot(id + '.png', { clip, mask: maskFor(page) });
      else await expect(page.locator('#' + id)).toHaveScreenshot(id + '.png', { mask: maskFor(page) });
    });
  }
});
