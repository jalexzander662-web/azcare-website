// The Google Apps Script pipeline (products sheet, bookings sheet, orders sheet). One place, exact wire format.
// Do NOT change the request shape: `text/plain` keeps these CORS "simple" requests (no preflight) and the key
// order below is what the script has always received.
export const SHEET_URL =
  'https://script.google.com/macros/s/AKfycbwLU7x56fRc5YBnca91B4JOPneelUS2ruD1JFX8Nyk4vclCyzd69AjeXqXtgY5WxhUh/exec'

const post = (body) =>
  fetch(SHEET_URL, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
  })

// GET → raw sheet rows. Throws when the payload is not the expected `{status:'success', data:[...]}`.
export async function fetchProducts() {
  const json = await (await fetch(SHEET_URL)).json()
  if (json.status === 'success' && Array.isArray(json.data)) return json.data
  throw new Error('unexpected products payload')
}

export const postBooking = ({ name, phone, service, area, preferred_time, message }) =>
  post({ action: 'createBooking', name, phone, service, area, preferred_time, message })

export const postOrder = ({ orderId, name, address, phone, items, totalPrice }) =>
  post({ action: 'createOrder', orderId, name, address, phone, items, totalPrice })
