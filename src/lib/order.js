// Cart + checkout form → the exact `createOrder` payload the Apps Script expects (see lib/sheet.js).
export const DELIVERY = 150

export const newOrderId = () => 'AZ-' + Math.floor(100000 + Math.random() * 900000)

export const subtotal = (cart) => cart.reduce((a, i) => a + i.price * i.quantity, 0)

const line = (street, city, postal) => `${street}, ${city}${postal ? ' ' + postal : ''}`

// form = the OrderSheet fields: contact, firstName, lastName, address, city, postal, phone,
//        pay ('cod'|'bank'), bill ('same'|'diff'), billAddress, billCity, billPostal
export function buildOrder(cart, form, orderId) {
  const f = (k) => String(form[k] ?? '').trim()
  let address = line(f('address'), f('city'), f('postal'))
  if (form.bill === 'diff') address += ' | Billing: ' + line(f('billAddress'), f('billCity'), f('billPostal'))
  const items =
    cart.map((i) => `${i.name} (x${i.quantity})`).join(', ') +
    ` | Delivery Rs ${DELIVERY} | ${form.pay === 'bank' ? 'Bank Deposit' : 'COD'} | Contact: ${f('contact')}`
  return {
    orderId,
    name: `${f('firstName')} ${f('lastName')}`.trim(),
    address,
    phone: f('phone'),
    items,
    totalPrice: subtotal(cart) + DELIVERY,
  }
}
