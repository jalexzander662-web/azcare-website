import { test } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { SECTIONS, prepare, freezeTimers, topClip, hideFixed } from './helpers.js';

const DESIGN_URL = pathToFileURL(resolve('design-src/home.html')).href;

test.describe('@design', () => {
  test.setTimeout(120000);
  for (const { id, name } of SECTIONS) {
    test(`design ${name}`, async ({ page }, testInfo) => {
      await freezeTimers(page);
      await page.goto(DESIGN_URL);
      await page.locator('#top').waitFor({ state: 'attached', timeout: 60000 });
      await prepare(page);
      // page.css targets img[src*="floor-cleaning-2"] / "roof-cleaning"; the design page serves images as blob: URLs so
      // those rules never match there. Apply the designer's intent (same rules, keyed by alt) so the baseline matches.
      await page.addStyleTag({ content: '@media(max-width:768px){.az-srv__img img[alt="Floor Cleaning"]{object-position:60% 50%}.az-srv__img img[alt="Roof Cleaning"]{object-position:25% 50%}}' });
      await hideFixed(page, id);
      const clip = id === 'top' ? await topClip(page) : null;
      const opts = { animations: 'disabled', caret: 'hide' };
      const buf = clip ? await page.screenshot({ ...opts, clip }) : await page.locator('#' + id).screenshot(opts);
      const file = testInfo.snapshotPath(id + '.png');
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, buf);
    });
  }
});
