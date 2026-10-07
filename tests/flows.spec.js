// Behaviour / contract tests: products, booking, order, routing, drawer, modals, console, overflow, pixels.
//   npx playwright test flows                     -> builds + previews the site, runs on desktop/iphone/android/tablet
//   BASE_URL=https://host npx playwright test flows --grep @live   -> the "contract" subset against a deployed site
// Every network call is mocked: the Apps Script URL (GET products / POST booking+order), remote images and the
// third-party pixels/fonts. Nothing here talks to the internet.
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const FIX = JSON.parse(readFileSync(new URL('./fixtures/products.json', import.meta.url), 'utf8'));
const ROWS = FIX.data.filter((r) => String(r.name || '').trim());
const IMAGES = new Set(ROWS.map((r) => r.image));
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*' };
const WA_NUMBER = '923222468123';
const DELIVERY = 150;
const PRICE = 788; // every blank-id product the tests touch costs this

test.describe.configure({ timeout: 60_000 });

// ---------------------------------------------------------------------------------------------- mocks
// Records window.fbq / window.ttq calls into window.__px. The real snippets in index.html would replace the TikTok
// methods, so ttq is a Proxy that refuses to overwrite them; Meta's snippet bails out when window.fbq already exists.
const PIXEL_STUB = () => {
  const log = (window.__px = []);
  window.fbq = function () {
    log.push(['fbq', ...arguments]);
  };
  const LOCK = ['track', 'page', 'load', 'identify'];
  const stub = [];
  LOCK.forEach((m) => {
    stub[m] = function () {
      log.push(['ttq', m, ...arguments]);
    };
  });
  window.ttq = new Proxy(stub, {
    set(t, k, v) {
      if (!LOCK.includes(k)) t[k] = v;
      return true;
    },
  });
};

/**
 * Routes everything the page may request. Returns { posts, failPost } : posts = every POST sent to the script URL.
 * opts.pixels   stub fbq/ttq (read with px())
 * opts.assets   let Font Awesome / Google Fonts through (overflow test measures real icon widths)
 */
async function setup(page, baseURL, opts = {}) {
  const api = { posts: [], failPost: false };
  const base = new URL(baseURL || 'http://localhost:4173');
  if (opts.pixels) await page.addInitScript(PIXEL_STUB);
  await page.route('**/*', async (route) => {
    const req = route.request();
    const u = new URL(req.url());
    if (u.hostname === 'script.google.com') {
      if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
      if (req.method() === 'POST') {
        api.posts.push({ method: req.method(), contentType: req.headers()['content-type'], body: req.postData() });
        if (api.failPost) return route.abort('failed');
        return route.fulfill({ status: 200, headers: CORS, contentType: 'application/json', body: JSON.stringify({ status: 'success' }) });
      }
      return route.fulfill({ status: 200, headers: CORS, contentType: 'application/json', body: JSON.stringify(FIX) });
    }
    const type = req.resourceType();
    const foreign = u.hostname !== base.hostname;
    if (type === 'image' && (foreign || IMAGES.has(req.url()))) return route.fulfill({ status: 200, contentType: 'image/png', body: PNG });
    if (!foreign) return route.fallback();
    if (opts.assets && /(cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(u.hostname)) return route.fallback();
    if (type === 'stylesheet') return route.fulfill({ status: 200, contentType: 'text/css', body: '' });
    if (type === 'script') return route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
    return route.abort('failed'); // fonts, beacons, pixels: nothing to see
  });
  return api;
}

const px = (page) => page.evaluate(() => window.__px || []);
const fb = async (page, event) => (await px(page)).find((c) => c[0] === 'fbq' && c[1] === 'track' && c[2] === event);
const tt = async (page, event) => (await px(page)).find((c) => c[0] === 'ttq' && c[1] === 'track' && c[2] === event);

// ---------------------------------------------------------------------------------------------- page helpers
const burger = (page) => page.getByRole('button', { name: 'Menu', exact: true });

// clicks a top-level nav entry; on narrow viewports it opens the burger drawer first
async function clickNav(page, label) {
  if (await burger(page).isVisible()) {
    await burger(page).click();
    await page.locator('.az-mobile').getByRole('link', { name: label, exact: true }).click();
  } else {
    await page.locator('.az-nav__links').getByRole('link', { name: label, exact: true }).first().click();
  }
}

const cards = (page) => page.locator('#shop').getByRole('button', { name: / — details$/ });
const card = (page, name) => page.locator('#shop').getByRole('button', { name: `${name} — details`, exact: true });

async function gotoShop(page) {
  await page.goto('/#products');
  await expect(page.locator('#shop')).toBeVisible();
  await expect(cards(page)).toHaveCount(ROWS.length);
}

const orderDialog = (page) => page.getByRole('dialog', { name: 'Your cart and order form' });

// adds a priced product from the shop grid; the order sheet opens by itself
async function addProduct(page, name) {
  await card(page, name).getByRole('button', { name: /ADD TO CART/ }).click();
  await expect(orderDialog(page)).toBeVisible();
}

async function closeSheet(page) {
  await orderDialog(page).getByRole('button', { name: 'ADD MORE PRODUCTS' }).click();
  await expect(orderDialog(page)).toBeHidden();
}

// the booking form lives twice (inline #contact and the modal); labels share ids, so go by placeholder
async function fillBooking(scope) {
  await scope.getByPlaceholder(/Ahmed Khan/).fill('Ali Raza');
  await scope.getByPlaceholder(/0322-XXXXXXX/).fill('03001234567');
  const services = scope.getByRole('combobox', { name: 'Service' });
  await services.first().selectOption({ label: 'Sofa Cleaning' });
  await scope.getByRole('button', { name: 'Increase', exact: true }).first().click(); // qty 1 -> 2
  await scope.getByRole('button', { name: /Add another service/ }).click();
  await expect(services).toHaveCount(2);
  await services.nth(1).selectOption({ label: 'Car Wash' });
  await scope.getByPlaceholder(/DHA, Gulshan/).fill('DHA Phase 6');
  await scope.getByPlaceholder(/Kal subah/).fill('Saturday afternoon');
  await scope.getByPlaceholder(/Ghar ka address/).fill('House 5, Street 3');
}

const BOOKING = {
  action: 'createBooking',
  name: 'Ali Raza',
  phone: '03001234567',
  service: 'Sofa Cleaning × 2, Car Wash × 1',
  area: 'DHA Phase 6',
  preferred_time: 'Saturday afternoon',
  message: 'House 5, Street 3',
};

const send = (scope) => scope.getByRole('button', { name: /SEND BOOKING REQUEST/ });

function expectWire(post) {
  expect(post.method).toBe('POST');
  expect(post.contentType).toBe('text/plain;charset=utf-8');
}

async function fillOrder(dialog, f) {
  const tb = (n) => dialog.getByRole('textbox', { name: n, exact: true });
  await tb('Email or mobile phone number').fill(f.contact);
  await tb('First name (optional)').fill(f.first);
  await tb('Last name').fill(f.last);
  await tb('Address').fill(f.address);
  await tb('City').first().fill(f.city);
  await tb('Postal code (optional)').first().fill(f.postal);
  await tb('Phone').fill(f.phone);
}

const ORDER = { contact: '03001234567', first: 'Ali', last: 'Khan', address: 'House 12, Street 5', city: 'Karachi', postal: '75500', phone: '03001234567' };
const ORDER_KEYS = ['action', 'orderId', 'name', 'address', 'phone', 'items', 'totalPrice'];

// parses the order POST, checks the fixed parts of the wire format and hands back the body for the per-test fields
function readOrder(post) {
  expectWire(post);
  const body = JSON.parse(post.body);
  expect(Object.keys(body)).toEqual(ORDER_KEYS);
  expect(body.action).toBe('createOrder');
  expect(body.orderId).toMatch(/^AZ-\d{6}$/);
  expect(typeof body.totalPrice).toBe('number');
  expect(post.body).toBe(JSON.stringify(body)); // compact JSON, nothing reordered
  return body;
}

// ================================================================================================ 1 products
test('1 products render from the sheet, unpriced rows go to WhatsApp', { tag: '@live' }, async ({ page, baseURL }) => {
  await setup(page, baseURL);
  await gotoShop(page);
  const shop = page.locator('#shop');

  // blank-id rows are all there (the live sheet has 19 of them, two sharing a name with later rows)
  await expect(card(page, 'Car Care')).toBeVisible();
  await expect(card(page, 'Floor Cleaner')).toBeVisible();
  await expect(card(page, 'Car Care')).toContainText('Rs. 788');
  await expect(shop.getByRole('button', { name: 'Multi-Surface Cleaner — details', exact: true })).toHaveCount(2);
  // the name with glued digits ("...Cleaner1500") is still a card
  await expect(shop.getByRole('button', { name: /^Car Exterior Cleaner\d* — details$/ })).toHaveCount(1);

  // the one unpriced row
  const unpriced = card(page, 'Sofa/Carpet Mattress/Curtain Cleaner');
  await expect(unpriced).toBeVisible();
  await expect(unpriced).toContainText('Price on WhatsApp');
  await expect(unpriced.getByRole('button', { name: /ADD TO CART/ })).toHaveCount(0);
  const wa = unpriced.getByRole('link', { name: /ORDER via WhatsApp/ });
  await expect(wa).toBeVisible();
  await expect(wa).toHaveAttribute('href', new RegExp('^https://wa\\.me/' + WA_NUMBER));

  // priced rows have the cart button and no WhatsApp fallback
  await expect(card(page, 'Car Care').getByRole('button', { name: /ADD TO CART/ })).toBeVisible();
  await expect(card(page, 'Car Care').getByRole('link', { name: /ORDER via WhatsApp/ })).toHaveCount(0);

  // an empty price must never be shown as zero
  await expect(shop).not.toContainText(/Rs\.?\s*0(?![\d,.])/);
});

// ================================================================================================ 2 blank ids
test('2 blank-id products stay separate cart lines', { tag: '@live' }, async ({ page, baseURL }) => {
  await setup(page, baseURL);
  await gotoShop(page);
  const dialog = orderDialog(page);

  await addProduct(page, 'Car Care');
  await expect(dialog.getByRole('img', { name: 'Car Care', exact: true })).toHaveCount(1);
  await closeSheet(page);

  await addProduct(page, 'Floor Cleaner');
  await expect(dialog.getByRole('img', { name: 'Car Care', exact: true })).toHaveCount(1);
  await expect(dialog.getByRole('img', { name: 'Floor Cleaner', exact: true })).toHaveCount(1);
  await expect(dialog.getByRole('button', { name: 'Increase quantity' })).toHaveCount(2);
  await expect(dialog).toContainText(/Rs\.?\s*1,?726/); // 2 x 788 + 150

  // + on the first line: subtotal 788*2 + 788, total + delivery
  await dialog.getByRole('button', { name: 'Increase quantity' }).first().click();
  await expect(dialog).toContainText(/Rs\.?\s*2,?364/);
  await expect(dialog).toContainText(/Rs\.?\s*2,?514/);

  // - on the second line takes it to 0: the line goes, the other stays
  await dialog.getByRole('button', { name: 'Decrease quantity' }).last().click();
  await expect(dialog.getByRole('img', { name: 'Floor Cleaner', exact: true })).toHaveCount(0);
  await expect(dialog.getByRole('img', { name: 'Car Care', exact: true })).toHaveCount(1);
  await expect(dialog).toContainText(/Rs\.?\s*1,?726/);
});

// ================================================================================================ 3 booking
test('3a booking: inline contact form posts the exact payload', { tag: '@live' }, async ({ page, baseURL }) => {
  const api = await setup(page, baseURL);
  await page.goto('/');
  const form = page.locator('#contact');
  await fillBooking(form);
  await send(form).click();

  await expect.poll(() => api.posts.length).toBe(1);
  const [post] = api.posts;
  expectWire(post);
  const body = JSON.parse(post.body);
  expect(Object.keys(body)).toEqual(['action', 'name', 'phone', 'service', 'area', 'preferred_time', 'message']);
  expect(body).toEqual(BOOKING);
  expect(post.body).toBe(JSON.stringify(BOOKING));
  await expect(form.getByText(/Shukriya! Apki booking request send ho gai/)).toBeVisible();
});

test('3b booking: Book Now modal posts the exact payload', { tag: '@live' }, async ({ page, baseURL }) => {
  const api = await setup(page, baseURL);
  await page.goto('/');
  await page.locator('#hero').getByRole('button', { name: /BOOK YOUR SERVICE NOW/i }).click();
  const modal = page.getByRole('dialog', { name: 'Book our service' });
  await expect(modal).toBeVisible();
  await fillBooking(modal);
  await send(modal).click();

  await expect.poll(() => api.posts.length).toBe(1);
  expectWire(api.posts[0]);
  expect(api.posts[0].body).toBe(JSON.stringify(BOOKING));
  await expect(modal.getByText(/Shukriya! Apki booking request send ho gai/)).toBeVisible();
  await modal.getByRole('button', { name: 'CLOSE', exact: true }).click();
  await expect(modal).toBeHidden();
});

test('3c booking: a failed POST shows the alert and keeps the form', { tag: '@live' }, async ({ page, baseURL }) => {
  const api = await setup(page, baseURL);
  api.failPost = true;
  await page.goto('/');
  const form = page.locator('#contact');
  await fillBooking(form);
  await send(form).click();

  await expect(form.getByRole('alert')).toContainText(/Request send nahi ho saka/);
  expect(api.posts).toHaveLength(1);
  await expect(form.getByText(/Shukriya/)).toHaveCount(0);
  await expect(form.getByPlaceholder(/Ahmed Khan/)).toHaveValue('Ali Raza');
  await expect(form.getByPlaceholder(/Ghar ka address/)).toHaveValue('House 5, Street 3');
  await expect(send(form)).toBeEnabled();
});

// ================================================================================================ 4 order
test('4a order: COD payload, sent view, cart badge cleared', { tag: '@live' }, async ({ page, baseURL }) => {
  const api = await setup(page, baseURL);
  await gotoShop(page);
  await addProduct(page, 'Car Care');
  const dialog = orderDialog(page);
  await expect(page.locator('.az-btn__badge')).toHaveText('1');
  await expect(dialog.getByRole('radio', { name: /Cash on Delivery/ })).toBeChecked();
  await expect(dialog).toContainText(/Rs\.?\s*938/); // 788 + 150

  await fillOrder(dialog, ORDER);
  await dialog.getByRole('button', { name: 'COMPLETE ORDER' }).click();

  await expect.poll(() => api.posts.length).toBe(1);
  const body = readOrder(api.posts[0]);
  expect(body.name).toBe('Ali Khan');
  expect(body.address).toBe('House 12, Street 5, Karachi 75500');
  expect(body.phone).toBe('03001234567');
  expect(body.items).toBe('Car Care (x1) | Delivery Rs 150 | COD | Contact: 03001234567');
  expect(body.totalPrice).toBe(PRICE + DELIVERY);

  await expect(dialog.getByText(/Shukriya! Aap ka order mil gaya/)).toBeVisible();
  await expect(page.locator('.az-btn__badge')).toHaveCount(0);
  await dialog.getByRole('button', { name: /CONTINUE SHOPPING/ }).click();
  await expect(dialog).toBeHidden();
});

test('4b order: bank deposit + different billing address', { tag: '@live' }, async ({ page, baseURL }) => {
  const api = await setup(page, baseURL);
  await gotoShop(page);
  await addProduct(page, 'Car Care');
  await closeSheet(page);
  await addProduct(page, 'Floor Cleaner');
  const dialog = orderDialog(page);
  await dialog.getByRole('button', { name: 'Increase quantity' }).last().click(); // Floor Cleaner x2

  await fillOrder(dialog, { ...ORDER, contact: 'ali@example.com' });
  await dialog.getByRole('radio', { name: 'Bank Deposit' }).click();
  await expect(dialog.getByRole('radio', { name: 'Bank Deposit' })).toBeChecked();
  await dialog.getByRole('radio', { name: 'Use a different billing address' }).click();
  const tb = (n) => dialog.getByRole('textbox', { name: n, exact: true });
  await tb('Billing address').fill('Plot 9, Clifton');
  await tb('City').last().fill('Lahore');
  await tb('Postal code (optional)').last().fill('54000');
  await dialog.getByRole('button', { name: 'COMPLETE ORDER' }).click();

  await expect.poll(() => api.posts.length).toBe(1);
  const body = readOrder(api.posts[0]);
  expect(body.name).toBe('Ali Khan');
  expect(body.address).toBe('House 12, Street 5, Karachi 75500 | Billing: Plot 9, Clifton, Lahore 54000');
  expect(body.items).toBe('Car Care (x1), Floor Cleaner (x2) | Delivery Rs 150 | Bank Deposit | Contact: ali@example.com');
  expect(body.totalPrice).toBe(3 * PRICE + DELIVERY);
  await expect(dialog.getByText(/Shukriya! Aap ka order mil gaya/)).toBeVisible();
  await expect(page.locator('.az-btn__badge')).toHaveCount(0);
});

// ================================================================================================ 5 routing
const hash = (page) => page.evaluate(() => location.hash);

async function expectHome(page) {
  await expect(page.locator('#hero')).toBeVisible();
  await expect(page.locator('#services')).toBeAttached();
  await expect(page.locator('#shop')).toHaveCount(0);
}

test('5a routing: nav Products opens the shop, Back returns home', { tag: '@live' }, async ({ page, baseURL }) => {
  await setup(page, baseURL);
  await page.goto('/');
  await expectHome(page);
  await clickNav(page, 'Products');
  await expect(page.locator('#shop')).toBeVisible();
  await expect(page.locator('#hero')).toHaveCount(0);
  await expect.poll(() => hash(page)).toBe('#products');

  await page.goBack();
  await expectHome(page);
  expect(await hash(page)).toBe('');
  await page.goForward();
  await expect(page.locator('#shop')).toBeVisible();
  await expect.poll(() => hash(page)).toBe('#products');
});

test('5b routing: hero Products button opens the shop, breadcrumb Home returns', { tag: '@live' }, async ({ page, baseURL }) => {
  await setup(page, baseURL);
  await page.goto('/');
  await page.locator('#hero').getByRole('button', { name: /^Products/ }).click();
  await expect(page.locator('#shop')).toBeVisible();
  await expect.poll(() => hash(page)).toBe('#products');

  await page.goBack();
  await expectHome(page);
  await page.goForward();
  await expect(page.locator('#shop')).toBeVisible();
  await page.locator('#shop').getByRole('link', { name: 'Home', exact: true }).click();
  await expectHome(page);
  expect(await hash(page)).toBe('');
});

test('5c routing: direct load of /#products shows the shop', { tag: '@live' }, async ({ page, baseURL }) => {
  await setup(page, baseURL);
  await gotoShop(page);
  await expect(page.locator('#hero')).toHaveCount(0);
  expect(await hash(page)).toBe('#products');
});

// ================================================================================================ 6 mobile drawer
test('6 mobile drawer: burger, aria-expanded, Escape, outside click, one WhatsApp link', async ({ page, baseURL }, info) => {
  test.skip(info.project.name === 'desktop', 'the desktop nav has no drawer');
  await setup(page, baseURL);
  await page.goto('/');
  const drawer = page.locator('.az-mobile');
  const btn = burger(page);

  await expect(btn).toHaveAttribute('aria-expanded', 'false');
  await expect(drawer).not.toHaveClass(/is-open/);
  await btn.click();
  await expect(drawer).toHaveClass(/is-open/);
  await expect(btn).toHaveAttribute('aria-expanded', 'true');
  await expect(drawer.locator('a[href*="wa.me"]')).toHaveCount(1);
  await expect(drawer.getByRole('link', { name: /WhatsApp/ })).toHaveCount(1);

  await page.keyboard.press('Escape');
  await expect(drawer).not.toHaveClass(/is-open/);
  await expect(btn).toHaveAttribute('aria-expanded', 'false');

  await btn.click();
  await expect(drawer).toHaveClass(/is-open/);
  await page.mouse.click(4, 300); // left edge: outside the right-hand panel
  await expect(drawer).not.toHaveClass(/is-open/);
  await expect(btn).toHaveAttribute('aria-expanded', 'false');

  await btn.click();
  await drawer.getByRole('button', { name: 'Close menu' }).click();
  await expect(drawer).not.toHaveClass(/is-open/);
});

// ================================================================================================ 7 modals
const overflow = (page) => page.evaluate(() => document.documentElement.style.overflow);

// the first service card (Sofa Cleaning); a click near its top-left corner lands on the image overlay, not on BOOK NOW
const sofaCard = (page) =>
  page.locator('#services .az-srv').filter({ has: page.getByRole('img', { name: 'Sofa Cleaning', exact: true }) });

test('7a modals: service detail -> BOOK NOW preselects the service, Escape closes', async ({ page, baseURL }) => {
  await setup(page, baseURL);
  await page.goto('/');
  expect(await overflow(page)).toBe('');

  await sofaCard(page).click({ position: { x: 20, y: 20 } });
  const detail = page.getByRole('dialog', { name: 'Sofa Cleaning', exact: true });
  await expect(detail).toBeVisible();
  await expect(detail).toHaveClass(/az-detail/);
  expect(await overflow(page)).toBe('hidden');

  // Escape closes the detail and releases the scroll lock
  await page.keyboard.press('Escape');
  await expect(detail).toBeHidden();
  expect(await overflow(page)).toBe('');

  // detail -> BOOK NOW: detail is replaced by the booking modal, first line preselected and locked
  await sofaCard(page).click({ position: { x: 20, y: 20 } });
  await expect(detail).toBeVisible();
  await detail.getByRole('button', { name: /BOOK NOW/ }).click();
  await expect(detail).toBeHidden();
  const modal = page.getByRole('dialog', { name: 'Book our service' });
  await expect(modal).toBeVisible();
  expect(await overflow(page)).toBe('hidden');
  const select = modal.getByRole('combobox', { name: 'Service' });
  await expect(select).toHaveValue('Sofa Cleaning');
  await expect(select.locator('option')).toHaveCount(2); // placeholder + the locked service
  await expect(modal.getByRole('button', { name: 'Change' })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(modal).toBeHidden();
  expect(await overflow(page)).toBe('');
});

test('7b modals: product detail and order sheet lock scroll, Escape closes each', async ({ page, baseURL }) => {
  await setup(page, baseURL);
  await gotoShop(page);

  await card(page, 'Car Care').click({ position: { x: 20, y: 20 } });
  const detail = page.getByRole('dialog', { name: 'Car Care', exact: true });
  await expect(detail).toBeVisible();
  expect(await overflow(page)).toBe('hidden');
  await page.keyboard.press('Escape');
  await expect(detail).toBeHidden();
  expect(await overflow(page)).toBe('');

  await card(page, 'Car Care').click({ position: { x: 20, y: 20 } });
  await detail.getByRole('button', { name: /ADD TO CART/ }).click();
  await expect(detail).toBeHidden();
  await expect(orderDialog(page)).toBeVisible();
  expect(await overflow(page)).toBe('hidden');
  await page.keyboard.press('Escape');
  await expect(orderDialog(page)).toBeHidden();
  expect(await overflow(page)).toBe('');
});

// ================================================================================================ 8 console
for (const route of ['/', '/#products']) {
  test(`8 no console errors or page errors on ${route}`, { tag: '@live' }, async ({ page, baseURL }) => {
    const problems = [];
    page.on('pageerror', (e) => problems.push('pageerror: ' + e.message));
    page.on('console', (m) => {
      if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) problems.push('console.error: ' + m.text());
    });
    await setup(page, baseURL);
    await page.goto(route);
    if (route === '/#products') await expect(cards(page)).toHaveCount(ROWS.length);
    else await expect(page.locator('#contact')).toBeAttached();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500); // late effects (observers, timers)
    expect(problems).toEqual([]);
  });
}

// ================================================================================================ 9 overflow
test('9 no horizontal overflow at / and /#products', async ({ page, baseURL }) => {
  await setup(page, baseURL, { assets: true });
  const own = page.viewportSize().width;
  for (const width of new Set([own, 360, 390])) {
    await page.setViewportSize({ width, height: 800 });
    for (const route of ['/', '/#products']) {
      await page.goto('about:blank'); // a full load every time, not a hash change
      await page.goto(route);
      if (route === '/#products') await expect(cards(page)).toHaveCount(ROWS.length);
      await page.evaluate(() => document.fonts.ready);
      const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
      expect(m.sw, `${route} at ${width}px: scrollWidth ${m.sw} > innerWidth ${m.iw}`).toBeLessThanOrEqual(m.iw);
    }
  }
});

// ================================================================================================ 10 pixels
test('10a pixels: a booking fires Lead / SubmitForm', { tag: '@live' }, async ({ page, baseURL }) => {
  const api = await setup(page, baseURL, { pixels: true });
  await page.goto('/');
  const form = page.locator('#contact');
  await fillBooking(form);
  await send(form).click();
  await expect.poll(() => api.posts.length).toBe(1);
  await expect(form.getByText(/Shukriya/)).toBeVisible();

  expect(await fb(page, 'Lead')).toBeTruthy();
  expect(await tt(page, 'SubmitForm')).toBeTruthy();
});

test('10b pixels: add to cart fires AddToCart, an order fires Purchase / PlaceAnOrder with the total', { tag: '@live' }, async ({ page, baseURL }) => {
  const api = await setup(page, baseURL, { pixels: true });
  await gotoShop(page);
  await addProduct(page, 'Car Care');
  const add = await fb(page, 'AddToCart');
  expect(add).toBeTruthy();
  expect(await tt(page, 'AddToCart')).toBeTruthy();
  expect(add[3].value).toBe(PRICE);
  expect(await fb(page, 'Purchase')).toBeUndefined();

  const dialog = orderDialog(page);
  await fillOrder(dialog, ORDER);
  await dialog.getByRole('button', { name: 'COMPLETE ORDER' }).click();
  await expect.poll(() => api.posts.length).toBe(1);
  await expect(dialog.getByText(/Shukriya! Aap ka order mil gaya/)).toBeVisible();

  const total = PRICE + DELIVERY;
  const purchase = await fb(page, 'Purchase');
  const placed = await tt(page, 'PlaceAnOrder');
  expect(purchase).toBeTruthy();
  expect(placed).toBeTruthy();
  expect(purchase[3].value).toBe(total);
  expect(placed[3].value).toBe(total);
  expect(JSON.parse(api.posts[0].body).totalPrice).toBe(total);
});
