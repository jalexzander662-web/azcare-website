import { useState } from 'react'
import { DELIVERY } from '../lib/order'
import { rs } from '../lib/products'
import { WA_URL } from '../data/links'
import './commerce.css'

const KEYS = ['contact', 'firstName', 'lastName', 'address', 'city', 'postal', 'phone']

const readSaved = () => {
  try {
    const v = JSON.parse(localStorage.getItem('azOrderInfo') || 'null')
    return v ? { ...v, has: true } : { has: false }
  } catch (_) {
    return { has: false }
  }
}

const inp = { width: '100%', boxSizing: 'border-box', minHeight: '50px', background: 'var(--surface-field)', border: '1px solid var(--border-field)', borderRadius: 'var(--radius-sm)', padding: '.85rem 1.1rem', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: '.9rem', outline: 'none' }
const h4 = { fontFamily: 'var(--font-head)', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--white)', margin: 0 }
const sumRow = { display: 'flex', justifyContent: 'space-between', gap: '1rem', fontFamily: 'var(--font-sub)', fontSize: '.82rem', color: 'rgba(240,246,255,.7)' }
const qtyBtn = { width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(255,255,255,.18)', background: 'rgba(255,255,255,.06)', color: '#fff', cursor: 'pointer', fontSize: '.95rem', lineHeight: 1 }
const qHelp = { position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,246,255,.45)', fontSize: '.95rem' }

// one half of a payment / billing radio pair (the design's t(on) style helper)
function Radio({ on, first, label, onClick }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '.8rem',
        width: '100%',
        minHeight: '52px',
        padding: '.85rem 1.1rem',
        background: on ? 'rgba(30,144,255,.1)' : 'transparent',
        border: '1px solid ' + (on ? 'var(--acc)' : 'rgba(255,255,255,.12)'),
        borderRadius: first ? '12px 12px 0 0' : '0 0 12px 12px',
        marginTop: first ? undefined : '-1px',
        position: 'relative',
        zIndex: on ? 1 : 0,
        cursor: 'pointer',
        textAlign: 'left',
        color: '#fff',
        fontFamily: 'var(--font-sub)',
        fontSize: '.88rem',
        fontWeight: 500,
        transition: 'background .2s,border-color .2s',
      }}
    >
      <span style={{ width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, boxSizing: 'border-box', border: on ? '5px solid var(--acc)' : '1.5px solid rgba(255,255,255,.3)', background: on ? '#fff' : 'transparent' }}></span>
      <span>{label}</span>
    </button>
  )
}

export default function OrderSheet({ cart, sent, subtotal, onQty, onRemove, onClose, onSubmit }) {
  const [saved] = useState(readSaved)
  const [pay, setPay] = useState('cod')
  const [bill, setBill] = useState('same')
  const [sending, setSending] = useState(false)
  const [failed, setFailed] = useState(false)
  const count = cart.reduce((a, i) => a + i.quantity, 0)

  const submit = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const get = (k) => String(fd.get(k) || '')
    try {
      if (fd.get('saveInfo')) localStorage.setItem('azOrderInfo', JSON.stringify(Object.fromEntries(KEYS.map((k) => [k, get(k)]))))
      else localStorage.removeItem('azOrderInfo')
    } catch (_) {}
    setSending(true)
    setFailed(false)
    try {
      await onSubmit({
        ...Object.fromEntries(KEYS.map((k) => [k, get(k)])),
        pay,
        bill,
        billAddress: get('billAddress'),
        billCity: get('billCity'),
        billPostal: get('billPostal'),
      })
    } catch (_) {
      setFailed(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <div
      className="az-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      style={{ justifyContent: 'flex-end', alignItems: 'stretch', padding: 0 }}
    >
      <div
        className="az-book"
        role="dialog"
        aria-modal="true"
        aria-label="Your cart and order form"
        style={{ width: '100%', maxWidth: '440px', height: '100%', maxHeight: 'none', margin: 0, borderRadius: 0, overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', display: 'block' }}
      >
        <button type="button" className="az-close" aria-label="Close" onClick={onClose}>
          ✕
        </button>
        <h3>
          <i className="fa-solid fa-cart-shopping" style={{ color: 'var(--acc)', marginRight: '.5rem' }}></i>Your Cart ({count})
        </h3>
        {sent ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="az-ok">✅ Shukriya! Aap ka order mil gaya. Hum 30 minute mein confirm karne ke liye contact karenge.</div>
            <button type="button" className="az-btn az-btn--primary az-btn--md az-btn--block" style={{ minHeight: '48px' }} onClick={onClose}>
              CONTINUE SHOPPING →
            </button>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(30,144,255,.08)', border: '1px solid rgba(30,144,255,.25)', borderRadius: '12px', padding: '1rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
              <div style={{ fontFamily: 'var(--font-sub)', fontSize: '.72rem', fontWeight: 600, letterSpacing: '.8px', textTransform: 'uppercase', color: 'var(--acc3)' }}>Order Summary</div>
              {cart.map((it) => (
                <div key={it.id} style={{ display: 'grid', gridTemplateColumns: '48px minmax(0,1fr) auto', gap: '.8rem', alignItems: 'center' }}>
                  <div
                    role="img"
                    aria-label={it.name}
                    style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#071120', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: it.image ? `url(${JSON.stringify(it.image)})` : undefined }}
                  ></div>
                  <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
                    <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '.82rem', textTransform: 'uppercase', color: '#fff', textWrap: 'pretty' }}>{it.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                      <button type="button" aria-label="Decrease quantity" onClick={() => onQty(it.id, it.quantity - 1)} style={qtyBtn}>
                        −
                      </button>
                      <span style={{ minWidth: '20px', textAlign: 'center', fontFamily: 'var(--font-sub)', fontWeight: 600, fontSize: '.85rem', color: '#fff' }}>{it.quantity}</span>
                      <button type="button" aria-label="Increase quantity" onClick={() => onQty(it.id, it.quantity + 1)} style={qtyBtn}>
                        +
                      </button>
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '.9rem', color: '#FFC107', whiteSpace: 'nowrap' }}>{rs(it.price * it.quantity)}</div>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: '.7rem', display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
                <div style={sumRow}>
                  <span>Subtotal</span>
                  <span>{rs(subtotal)}</span>
                </div>
                <div style={sumRow}>
                  <span>Delivery Charges</span>
                  <span>{rs(DELIVERY)}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem' }}>
                <span style={{ fontFamily: 'var(--font-sub)', fontSize: '.85rem', color: 'rgba(240,246,255,.7)' }}>Total · {pay === 'cod' ? 'Cash on Delivery' : 'Bank Deposit'}</span>
                <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--acc3)' }}>{rs(subtotal + DELIVERY)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', marginTop: '.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem' }}>
                <h4 style={h4}>Contact</h4>
                <a href={WA_URL} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-sub)', fontSize: '.8rem', color: 'var(--acc3)', textDecoration: 'underline' }}>
                  Need help?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input className="azc-fld" name="contact" placeholder="Email or mobile phone number" aria-label="Email or mobile phone number" required defaultValue={saved.contact} style={inp} />
                <i className="fa-regular fa-circle-question" title="Order updates isi par bheji jayengi" style={qHelp}></i>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', marginTop: '.75rem' }}>
              <h4 style={h4}>Delivery</h4>
              <label style={{ position: 'relative', display: 'block', background: 'var(--surface-field)', border: '1px solid var(--border-field)', borderRadius: 'var(--radius-sm)', padding: '.5rem 2.5rem .55rem 1.1rem' }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-sub)', fontSize: '.7rem', color: 'rgba(240,246,255,.55)' }}>Country/Region</span>
                <select name="country" aria-label="Country/Region" style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: '.9rem', padding: 0, appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}>
                  <option style={{ background: 'var(--navy)' }}>Pakistan</option>
                </select>
                <i className="fa-solid fa-chevron-down" style={{ position: 'absolute', right: '1.1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '.7rem', color: 'rgba(240,246,255,.55)', pointerEvents: 'none' }}></i>
              </label>
              <div className="az-row2" style={{ gap: '.75rem' }}>
                <input className="azc-fld" name="firstName" placeholder="First name (optional)" aria-label="First name (optional)" defaultValue={saved.firstName} style={inp} />
                <input className="azc-fld" name="lastName" placeholder="Last name" aria-label="Last name" required defaultValue={saved.lastName} style={inp} />
              </div>
              <input className="azc-fld" name="address" placeholder="Address" aria-label="Address" required defaultValue={saved.address} style={inp} />
              <div className="az-row2" style={{ gap: '.75rem' }}>
                <input className="azc-fld" name="city" placeholder="City" aria-label="City" required defaultValue={saved.city} style={inp} />
                <input className="azc-fld" name="postal" placeholder="Postal code (optional)" aria-label="Postal code (optional)" inputMode="numeric" defaultValue={saved.postal} style={inp} />
              </div>
              <div style={{ position: 'relative' }}>
                <input className="azc-fld" name="phone" placeholder="Phone" aria-label="Phone" type="tel" required defaultValue={saved.phone} style={inp} />
                <i className="fa-regular fa-circle-question" title="Order confirm karne ke liye hum is number par call karenge" style={qHelp}></i>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '.6rem', cursor: 'pointer', fontFamily: 'var(--font-sub)', fontSize: '.84rem', color: 'rgba(240,246,255,.75)', minHeight: '32px' }}>
                <input type="checkbox" name="saveInfo" defaultChecked={saved.has} style={{ width: '18px', height: '18px', margin: 0, accentColor: 'var(--acc)', cursor: 'pointer' }} />
                <span>Save this information for next time</span>
              </label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', marginTop: '.75rem' }}>
              <h4 style={h4}>Delivery Charges</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', minHeight: '52px', boxSizing: 'border-box', padding: '.85rem 1.1rem', background: 'rgba(30,144,255,.1)', border: '1px solid var(--acc)', borderRadius: '12px' }}>
                <span style={{ fontFamily: 'var(--font-sub)', fontSize: '.88rem', fontWeight: 500, color: '#fff' }}>Standard</span>
                <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '.85rem', color: '#fff', whiteSpace: 'nowrap' }}>Rs. {DELIVERY}.00</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', marginTop: '.75rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
                <h4 style={h4}>Payment</h4>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '.8rem', color: 'var(--gray)' }}>All transactions are secure and encrypted.</span>
              </div>
              <div role="radiogroup" aria-label="Payment" style={{ display: 'flex', flexDirection: 'column' }}>
                <Radio first on={pay === 'cod'} label="Cash on Delivery (COD)" onClick={() => setPay('cod')} />
                <Radio on={pay === 'bank'} label="Bank Deposit" onClick={() => setPay('bank')} />
              </div>
              {pay === 'bank' && (
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '.8rem', lineHeight: 1.55, color: 'rgba(240,246,255,.75)', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)', borderRadius: '12px', padding: '.8rem 1rem' }}>
                  Order confirm hone par bank account details WhatsApp par bhej di jayengi.
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', marginTop: '.75rem' }}>
              <h4 style={h4}>Billing address</h4>
              <div role="radiogroup" aria-label="Billing address" style={{ display: 'flex', flexDirection: 'column' }}>
                <Radio first on={bill === 'same'} label="Same as shipping address" onClick={() => setBill('same')} />
                <Radio on={bill === 'diff'} label="Use a different billing address" onClick={() => setBill('diff')} />
              </div>
              {bill === 'diff' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                  <input className="azc-fld" name="billAddress" placeholder="Billing address" aria-label="Billing address" required style={inp} />
                  <div className="az-row2" style={{ gap: '.75rem' }}>
                    <input className="azc-fld" name="billCity" placeholder="City" aria-label="City" required style={inp} />
                    <input className="azc-fld" name="billPostal" placeholder="Postal code (optional)" aria-label="Postal code (optional)" inputMode="numeric" style={inp} />
                  </div>
                </div>
              )}
            </div>
            {failed && (
              <div role="alert" style={{ fontFamily: 'var(--font-sub)', fontSize: '.8rem', color: '#ff9b9b' }}>
                Order send nahi ho saka. Please WhatsApp karein: 0322-2468123
              </div>
            )}
            <button type="submit" className="az-btn az-btn--primary az-btn--md az-btn--block" style={{ minHeight: '52px', marginTop: '.5rem' }} disabled={sending}>
              {sending ? 'PLACING ORDER…' : 'COMPLETE ORDER'}
            </button>
            <button type="button" className="az-btn az-btn--secondary az-btn--md az-btn--block" style={{ minHeight: '48px' }} onClick={onClose}>
              ADD MORE PRODUCTS
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
