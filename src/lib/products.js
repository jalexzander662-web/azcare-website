// Sheet rows → shop products. The sheet is hand-edited: `id` is usually "", `price` may be "" or text.
const num = (v) => {
  const n = Number(String(v ?? '').replace(/[^\d.]/g, ''))
  return Number.isFinite(n) && n > 0 ? n : null
}

// "(500 ml)", "(1 Litre)", "(1 Kg)" at the end of the description → size chip
const sizeOf = (desc) => (String(desc || '').match(/\((\d+(?:\.\d+)?\s*(?:ml|ltr|litres?|liters?|l|kg|g))\)/i) || [])[1] || ''

export const WA = '923222468123'
export const waLink = (text) => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`

export function normalizeProducts(rows) {
  return rows
    .filter((p) => p && String(p.name || '').trim())
    .map((p, i) => {
      const name = String(p.name).trim()
      return {
        // empty ids are the norm, so identity falls back to row position + name (never merge two blank-id rows)
        key: p.id !== '' && p.id != null ? 'id:' + p.id : 'row:' + i + ':' + name,
        name,
        image: p.image || '',
        desc: String(p.description || ''),
        size: sizeOf(p.description),
        price: num(p.price), // null = "Price on WhatsApp", can never enter the cart
      }
    })
}

export const rs = (n) => 'Rs. ' + n.toLocaleString('en-PK')
