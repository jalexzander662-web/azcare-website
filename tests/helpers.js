export const SECTIONS = [
  ['top', 'topbar+nav'],
  ['hero', 'hero'],
  ['trust', 'trust'],
  ['services', 'services'],
  ['gallery', 'gallery'],
  ['process', 'process'],
  ['faq', 'faq'],
  ['counters', 'counters'],
  ['reviews', 'reviews'],
  ['contact', 'contact'],
  ['footer', 'footer'],
].map(([id, name]) => ({ id, name }));

const FREEZE_CSS =
  '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important;scroll-behavior:auto!important}';

// Call BEFORE page.goto. Carousels use slow setIntervals (4s slides, 2s reviews); stub only those (>=1000ms).
// The fast ones (hero count-up 16ms, process steps ~300ms, scroll progress 500ms) must keep running.
// (page.clock was avoided: pausing it also stalls rAF and the count-ups.)
export async function freezeTimers(page) {
  await page.addInitScript(() => {
    const real = window.setInterval.bind(window);
    window.setInterval = (fn, ms, ...a) => (ms >= 1000 ? 0 : real(fn, ms, ...a));
  });
}

// Fixed overlays (nav, WhatsApp, back-to-top) get stitched into the middle of tall element shots.
// Hide them for every section except top/hero, where they belong. Call after prepare().
export async function hideFixed(page, id) {
  if (id === 'top' || id === 'hero') return;
  await page.evaluate(() => {
    document.querySelectorAll('body *').forEach((e) => {
      if (getComputedStyle(e).position === 'fixed') e.style.setProperty('visibility', 'hidden', 'important');
    });
  });
}

// Makes the page deterministic: fonts, reveals, lazy images, then back to top.
export async function prepare(page) {
  await page.addStyleTag({ content: FREEZE_CSS });
  await page.evaluate(() => document.fonts.ready);
  // let the hero count-up (~2.2s) finish before anything else
  await page.waitForTimeout(2500);
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(innerHeight / 2));
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await wait(60);
    }
    scrollTo(0, document.documentElement.scrollHeight);
    await wait(150);
    // lazy images only start loading once near the viewport; make them eager now
    document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = 'eager'));
    await Promise.all(
      [...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })))
    );
    await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
    await document.fonts.ready;
    scrollTo(0, 0);
    await wait(150);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
}

// No masks: timers are frozen and reduced motion settles the canvas, counters and carousels deterministically,
// so every section is compared in full. (A mask would have to be applied to the design baseline too.)
export const maskFor = () => []

// On phones #top has zero height (topbar hidden, nav is position:fixed), so the element
// screenshot is impossible. Returns a viewport-top clip covering the nav, or null when #top is a normal box.
// Call after prepare() (page is scrolled to the top).
export async function topClip(page) {
  return page.evaluate(() => {
    const top = document.getElementById('top');
    if (top.getBoundingClientRect().height > 0) return null;
    let bottom = 0;
    top.querySelectorAll('*').forEach((e) => {
      const r = e.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && r.top < 200) bottom = Math.max(bottom, r.bottom);
    });
    return { x: 0, y: 0, width: innerWidth, height: Math.ceil(bottom) };
  });
}
