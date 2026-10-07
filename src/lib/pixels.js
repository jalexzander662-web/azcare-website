// Meta Pixel + TikTok Pixel conversion events. Both base scripts live in index.html; every call is guarded so a
// blocked/ad-blocked pixel can never break checkout.
const EVENTS = {
  // our name: [Meta standard event, TikTok standard event]
  Lead: ['Lead', 'SubmitForm'],
  AddToCart: ['AddToCart', 'AddToCart'],
  Purchase: ['Purchase', 'PlaceAnOrder'],
}

export function track(event, data = {}) {
  const [meta, tiktok] = EVENTS[event]
  const params = { currency: 'PKR', ...data }
  try {
    window.fbq && window.fbq('track', meta, params)
  } catch (_) {}
  try {
    window.ttq && window.ttq.track(tiktok, params)
  } catch (_) {}
}
