import { useEffect, useRef, useState } from 'react'
import './commerce.css'

const fmt = (n) => 'Rs. ' + n.toLocaleString('en-PK')

function parse(price) {
  const p = String(price || '')
  const n = Number((p.match(/[\d,]+/) || ['0'])[0].replace(/,/g, '')) || 0
  const unit = (p.split('/')[1] || '').trim()
  return { n, unit, from: /starting/i.test(p) }
}

const stepBtn = { width: '42px', height: '42px', border: 'none', background: 'rgba(255,255,255,.05)', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
const alertStyle = { fontFamily: 'var(--font-sub)', fontSize: '.8rem', color: '#ff9b9b' }

export default function BookingForm({ mode, selected, catalog, onSubmit, onClose }) {
  const cat = catalog || []
  const modal = mode === 'modal'
  const uid = useRef(1)
  const prevSel = useRef(selected)
  const [unlock, setUnlock] = useState(false)
  const [lines, setLines] = useState(() => [{ id: 0, key: selected || '', qty: 1 }])
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState(false)
  const [failed, setFailed] = useState(false)

  // a new `selected` while mounted re-seeds (and re-locks) the first line
  useEffect(() => {
    if (prevSel.current !== selected && selected) {
      setUnlock(false)
      setLines((ls) => [{ ...ls[0], key: selected, qty: 1 }, ...ls.slice(1)])
    }
    prevSel.current = selected
  }, [selected])

  const upd = (id, fn) => {
    setErr(false)
    setLines((ls) => ls.map((l) => (l.id === id ? fn(l) : l)))
  }

  const submit = async (e) => {
    e.preventDefault()
    const picked = lines.filter((l) => l.key)
    if (!picked.length) return setErr(true)
    const fd = Object.fromEntries(new FormData(e.currentTarget).entries())
    const services = picked.map((l) => {
      const it = cat.find((c) => c.key === l.key) || {}
      return { key: l.key, name: it.name, qty: l.qty, price: it.price }
    })
    setSending(true)
    setFailed(false)
    try {
      await onSubmit({ ...fd, services, service: services.map((s) => s.name + ' × ' + s.qty).join(', ') })
      setDone(true)
    } catch (_) {
      setFailed(true)
    } finally {
      setSending(false)
    }
  }

  const afterDone = () => {
    if (modal && onClose) onClose()
    setDone(false)
    setErr(false)
    setFailed(false)
    setUnlock(false)
    setLines([{ id: uid.current++, key: '', qty: 1 }])
  }

  const groups = []
  cat.forEach((c) => {
    let g = groups.find((x) => x.label === c.cat)
    if (!g) groups.push((g = { label: c.cat || 'Services', items: [] }))
    g.items.push(c)
  })

  let total = 0
  let from = false
  let any = false
  const rows = lines.map((l) => {
    const it = cat.find((c) => c.key === l.key)
    const pr = parse(it && it.price)
    const has = !!it
    const line = pr.n * l.qty
    const locked = l.id === 0 && !!selected && !unlock && l.key === selected && has
    if (has) {
      any = true
      total += line
      from = from || pr.from || !pr.n
    }
    const u = pr.unit || 'Qty'
    const sq = /sq ?ft/i.test(pr.unit)
    const max = sq ? 100 : 99999
    const shown = l.txt !== undefined ? l.txt : String(l.qty)
    return (
      <div key={l.id} style={{ display: 'flex', flexDirection: 'column', gap: '.6rem', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.09)', borderRadius: '12px', padding: '.75rem' }}>
        <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
          <select
            aria-label="Service"
            required
            value={l.key}
            onChange={(e) => {
              const v = e.target.value
              upd(l.id, (x) => ({ ...x, key: v, qty: 1 }))
            }}
            className="azc-sel"
            style={{ flex: 1, minWidth: 0, minHeight: '48px', background: 'var(--surface-field)', border: '1px solid var(--border-field)', borderRadius: 'var(--radius-sm)', padding: '.75rem 1rem', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: '.9rem', outline: 'none', cursor: 'pointer' }}
          >
            <option value="" style={{ background: 'var(--navy)' }}>
              -- Select a Service --
            </option>
            {(locked ? [{ label: it.cat || 'Services', items: [it] }] : groups).map((g) => (
              <optgroup key={g.label} label={g.label} style={{ background: 'var(--navy)' }}>
                {g.items.map((o) => (
                  <option key={o.key} value={o.key} style={{ background: 'var(--navy)' }}>
                    {o.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {locked && (
            <button
              type="button"
              onClick={() => setUnlock(true)}
              className="azc-lnk"
              style={{ flexShrink: 0, minHeight: '44px', padding: '0 .6rem', background: 'none', border: 'none', color: 'var(--acc3)', fontFamily: 'var(--font-sub)', fontSize: '.8rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Change
            </button>
          )}
          {lines.length > 1 && (
            <button
              type="button"
              aria-label="Remove service"
              onClick={() => setLines((ls) => ls.filter((x) => x.id !== l.id))}
              className="azc-rm"
              style={{ flexShrink: 0, width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,.14)', background: 'transparent', color: 'rgba(240,246,255,.7)', cursor: 'pointer', fontSize: '1rem' }}
            >
              ✕
            </button>
          )}
        </div>
        {has && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,.14)', borderRadius: '50px', overflow: 'hidden' }}>
                <button type="button" aria-label="Decrease" onClick={() => upd(l.id, (x) => ({ ...x, txt: undefined, qty: Math.max(1, x.qty - 1) }))} className="azc-step" style={stepBtn}>
                  −
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  aria-label="Quantity"
                  value={shown}
                  onChange={(e) => {
                    const t = String(e.target.value).replace(/\D/g, '').slice(0, 5)
                    const n = parseInt(t, 10)
                    upd(l.id, (x) => ({ ...x, txt: n > max ? String(max) : t, qty: n > 0 ? Math.min(max, n) : x.qty }))
                  }}
                  onBlur={() => upd(l.id, (x) => ({ ...x, txt: undefined }))}
                  onFocus={(e) => e.target.select()}
                  className="azc-qty"
                  style={{ width: Math.max(52, 20 + shown.length * 11) + 'px', height: '42px', boxSizing: 'border-box', textAlign: 'center', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: 'var(--font-sub)', fontWeight: 600, fontSize: '.92rem', padding: 0 }}
                />
                <button type="button" aria-label="Increase" onClick={() => upd(l.id, (x) => ({ ...x, txt: undefined, qty: Math.min(max, x.qty + 1) }))} className="azc-step" style={stepBtn}>
                  +
                </button>
              </div>
              <span style={{ fontFamily: 'var(--font-sub)', fontSize: '.78rem', color: 'var(--gray)' }}>
                {pr.unit ? (l.qty === 1 || /ft$/i.test(u) ? u : u + (/s$/i.test(u) ? '' : 's')) : 'Qty'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '.1rem' }}>
              <span style={{ fontFamily: 'var(--font-sub)', fontSize: '.72rem', color: 'var(--gray)' }}>{it.price}</span>
              <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '.95rem', color: '#FFC107', whiteSpace: 'nowrap' }}>{pr.n ? fmt(line) : 'On visit'}</span>
            </div>
          </div>
        )}
      </div>
    )
  })

  if (done)
    return (
      <div style={{ color: 'var(--white)', fontFamily: 'var(--font-body)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: modal ? 'var(--bk-px, 2.5rem)' : '0' }}>
          <div className="az-ok">✅ Shukriya! Apki booking request send ho gai. Hum 30 minute mein contact karenge.</div>
          <button type="button" className="az-btn az-btn--primary az-btn--md az-btn--block" style={{ minHeight: '48px' }} onClick={afterDone}>
            {modal ? 'CLOSE' : 'BOOK ANOTHER SERVICE'}
          </button>
        </div>
      </div>
    )

  return (
    <div style={{ color: 'var(--white)', fontFamily: 'var(--font-body)' }}>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="az-row2">
          <div className="az-field">
            <label htmlFor="bk-name">Your Name *</label>
            <input id="bk-name" name="name" placeholder="e.g. Ahmed Khan" required autoComplete="name" />
          </div>
          <div className="az-field">
            <label htmlFor="bk-phone">Phone / WhatsApp *</label>
            <input id="bk-phone" name="phone" type="tel" inputMode="tel" placeholder="0322-XXXXXXX" required autoComplete="tel" />
          </div>
        </div>
        <div className="az-field" style={{ gap: '.6rem' }}>
          <label>Service Required *</label>
          {rows}
          <button
            type="button"
            onClick={() => setLines((ls) => [...ls, { id: uid.current++, key: '', qty: 1 }])}
            className="azc-lnk"
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '.45rem', minHeight: '44px', padding: '0 .25rem', background: 'none', border: 'none', color: 'var(--acc3)', fontFamily: 'var(--font-sub)', fontSize: '.82rem', fontWeight: 600, cursor: 'pointer' }}
          >
            <i className="fa-solid fa-plus"></i> Add another service
          </button>
        </div>
        <div className="az-row2">
          <div className="az-field">
            <label htmlFor="bk-area">Your Area in Karachi</label>
            <input id="bk-area" name="area" placeholder="e.g. DHA, Gulshan, Clifton, PECHS..." />
          </div>
          <div className="az-field">
            <label htmlFor="bk-time">Preferred Date &amp; Time</label>
            <input id="bk-time" name="preferred_time" placeholder="e.g. Kal subah, Saturday afternoon..." />
          </div>
        </div>
        <div className="az-field">
          <label htmlFor="bk-msg">Address / Message (Optional)</label>
          <textarea id="bk-msg" name="message" rows={3} placeholder="Ghar ka address ya koi details yahan likhein..."></textarea>
        </div>
        <div
          style={{
            position: modal ? 'sticky' : 'static',
            bottom: 0,
            zIndex: 2,
            margin: modal ? '0 calc(-1 * var(--bk-px, 2.5rem))' : '.25rem 0 0',
            padding: modal ? '1rem var(--bk-px, 2.5rem) var(--bk-px, 2.5rem)' : '1rem 1.1rem',
            background: modal ? 'var(--navy)' : 'rgba(30,144,255,.08)',
            borderTop: modal ? '1px solid rgba(255,255,255,.1)' : 'none',
            borderRadius: modal ? '0' : '12px',
            boxShadow: modal ? 'none' : 'inset 0 0 0 1px rgba(30,144,255,.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '.8rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem' }}>
            <span style={{ fontFamily: 'var(--font-sub)', fontSize: '.85rem', color: 'rgba(240,246,255,.7)', whiteSpace: 'nowrap', flexShrink: 0 }}>Estimated Total</span>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 'clamp(.95rem,4.4vw,1.25rem)', lineHeight: 1.2, color: 'var(--acc3)', textAlign: 'right', minWidth: 0 }}>
              {any ? fmt(total) + (from ? '+' : '') : 'Service select karein'}
            </span>
          </div>
          {err && (
            <div role="alert" style={alertStyle}>
              Kam az kam ek service select karein.
            </div>
          )}
          {failed && (
            <div role="alert" style={alertStyle}>
              Request send nahi ho saka. Please WhatsApp karein: 0322-2468123
            </div>
          )}
          <button
            type="submit"
            className="az-btn az-btn--primary az-btn--md az-btn--block"
            style={{ minHeight: '50px', flexShrink: 0, padding: '.85rem 1rem', fontSize: 'clamp(.74rem,3.5vw,.95rem)', letterSpacing: '.4px', lineHeight: 1.25, whiteSpace: 'normal', textAlign: 'center' }}
            disabled={sending}
          >
            {sending ? 'Sending...' : 'SEND BOOKING REQUEST ✉'}
          </button>
        </div>
      </form>
    </div>
  )
}
