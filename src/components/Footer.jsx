// Props: { onServiceLink: (label: string) => void, onSectionLink: (id: string) => void }
// Hand port of src/ds/Footer.js + the design's social bounce / magnet / service-preview effects (page-script.js 284-405).
import { useEffect } from 'react'
import { reducedMotion } from '../lib/motion'
import { SOCIALS, PHONE, PHONE_HREF, EMAIL, WA_URL, LOGO } from '../data/links'
import { FOOTER_SERVICES } from '../data/site'

const AREAS = [{ name: 'Karachi', primary: true }, { name: 'Lahore' }, { name: 'Islamabad' }]
const QUICK = [['How It Works', 'process'], ['Reviews', 'reviews'], ['Our Work', 'gallery'], ['FAQ', 'faq'], ['Contact', 'contact']]
// design order + icons; href resolved from links.js
const FOOT_SOCIALS = [
  ['whatsapp', 'fa-brands fa-whatsapp'],
  ['facebook', 'fa-brands fa-facebook-f'],
  ['instagram', 'fa-brands fa-instagram'],
  ['youtube', 'fa-brands fa-youtube'],
  ['tiktok', 'fa-brands fa-tiktok'],
  ['phone', 'fa-solid fa-phone'],
]
const SOCIAL_HREF = Object.fromEntries(SOCIALS.map(s => [s[0], s[1]]))
SOCIAL_HREF.phone = PHONE_HREF

const PREVIEW = {
  'sofa cleaning': '/img/services/sofa-cleaning.webp',
  'carpet cleaning': '/img/services/floor-cleaning.webp',
  'mattress cleaning': '/img/services/mattress-cleaning.webp',
  'car detailing': '/img/car/car-wash.webp',
  'solar panel cleaning': '/img/services/solar-panel-cleaning.webp',
  'office cleaning': '/img/services/office-cleaning.webp',
  'kitchen cleaning': '/img/services/kitchen-cleaning.webp',
  'laundry': '/img/laundry/wash-fold.webp',
  'floor cleaning': '/img/services/floor-cleaning.webp',
  'fumigation': '/img/services/fumigation.webp',
}

const BOUNCE = [
  { transform: 'translateY(-220px) scale(.9, 1.1)', opacity: 0, offset: 0, easing: 'cubic-bezier(.55,0,1,.45)' },
  { transform: 'translateY(0) scale(1.25, .7)', opacity: 1, offset: 0.3, easing: 'cubic-bezier(.2,.6,.4,1)' },
  { transform: 'translateY(-90px) scale(.92, 1.1)', opacity: 1, offset: 0.5, easing: 'cubic-bezier(.55,0,1,.45)' },
  { transform: 'translateY(0) scale(1.15, .82)', opacity: 1, offset: 0.66, easing: 'cubic-bezier(.2,.6,.4,1)' },
  { transform: 'translateY(-34px) scale(.97, 1.04)', opacity: 1, offset: 0.79, easing: 'cubic-bezier(.55,0,1,.45)' },
  { transform: 'translateY(0) scale(1.07, .93)', opacity: 1, offset: 0.89, easing: 'cubic-bezier(.2,.6,.4,1)' },
  { transform: 'translateY(-10px)', opacity: 1, offset: 0.95, easing: 'cubic-bezier(.55,0,1,.45)' },
  { transform: 'translateY(0) scale(1)', opacity: 1, offset: 1 },
]

// bounce-in of the social icons each time the box scrolls into view
function bounce() {
  const anims = []
  const play = box => [...box.querySelectorAll('a')].forEach((a, i) => {
    anims.push(a.animate(BOUNCE, { duration: 1500, delay: i * 120, fill: 'backwards' }))
  })
  let inV = false
  let raf = 0
  const check = () => {
    const box = document.querySelector('.az-footer__soc')
    if (!box) return
    const r = box.getBoundingClientRect()
    const v = r.height > 0 && r.top < window.innerHeight - 20 && r.bottom > 20
    if (v && !inV) {
      anims.splice(0).forEach(an => an.cancel())
      play(box)
    }
    inV = v
  }
  const chk = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(check) }
  window.addEventListener('scroll', chk, { passive: true })
  window.addEventListener('resize', chk)
  const t = setInterval(check, 400)
  return () => {
    window.removeEventListener('scroll', chk)
    window.removeEventListener('resize', chk)
    clearInterval(t)
    cancelAnimationFrame(raf)
    anims.forEach(an => an.cancel())
  }
}

// magnet + tooltip label on the social icons near the pointer
function magnet() {
  const R = 80
  const E = 'transform .35s cubic-bezier(.16,1,.3,1), background .25s, box-shadow .3s'
  const reset = a => { a.style.transform = ''; a.style.background = ''; a.style.boxShadow = '' }
  const N = { facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube', google: 'Google', whatsapp: 'WhatsApp', tiktok: 'TikTok', phone: 'Call us' }
  const lb = document.createElement('div')
  lb.setAttribute('aria-hidden', 'true')
  lb.style.cssText = 'position:fixed;left:0;top:0;z-index:2500;pointer-events:none;opacity:0;padding:.35rem .8rem;border-radius:50px;background:var(--acc);color:#fff;font:600 .72rem/1 var(--font-sub);letter-spacing:1px;text-transform:uppercase;white-space:nowrap;box-shadow:0 8px 20px rgba(30,144,255,.4);transition:opacity .2s ease,transform .35s cubic-bezier(.16,1,.3,1)'
  document.body.appendChild(lb)
  const onMag = e => {
    if (e.pointerType === 'touch') return
    let hit = null
    const box = [...document.querySelectorAll('.az-footer__soc')].find(b => {
      const r = b.getBoundingClientRect()
      return e.clientX > r.left - 50 && e.clientX < r.right + 50 && e.clientY > r.top - 50 && e.clientY < r.bottom + 50
    })
    document.querySelectorAll('.az-footer__soc a').forEach(a => {
      if (!box || !box.contains(a)) { reset(a); return }
      const r = a.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const d = Math.hypot(dx, dy)
      a.style.transition = E
      if (d < R) {
        const k = 1 - d / R
        const on = d < r.width / 2
        a.style.transform = `translate(${dx * 0.45}px, ${dy * 0.45 - 6 - 6 * k}px) scale(${on ? 1.22 : 1.1})`
        a.style.background = on ? 'var(--acc)' : ''
        a.style.boxShadow = on ? '0 10px 28px rgba(30,144,255,.55)' : ''
        if (on) hit = a
      } else reset(a)
    })
    if (hit) {
      const r = hit.getBoundingClientRect()
      lb.textContent = N[hit.title] || hit.title || ''
      const w = lb.offsetWidth
      lb.style.opacity = '1'
      lb.style.transform = `translate(${r.left + r.width / 2 - w / 2}px, ${r.bottom + 14}px)`
    } else lb.style.opacity = '0'
  }
  document.addEventListener('pointermove', onMag, { passive: true })
  return () => {
    document.removeEventListener('pointermove', onMag)
    document.querySelectorAll('.az-footer__soc a').forEach(reset)
    lb.remove()
  }
}

// hover preview image card following the pointer over footer service links
function preview() {
  Object.values(PREVIEW).forEach(p => { const i = new Image(); i.src = p })
  const el = document.createElement('div')
  el.setAttribute('aria-hidden', 'true')
  el.style.cssText = 'position:fixed;left:0;top:0;width:220px;height:280px;border-radius:16px;overflow:hidden;pointer-events:none;z-index:2500;opacity:0;border:1px solid rgba(30,144,255,.35);box-shadow:0 24px 60px rgba(0,0,0,.55);background:#0b1e3d;transition:opacity .25s ease;will-change:transform'
  const img = document.createElement('img')
  img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;transform:scale(1.15);transition:transform .6s cubic-bezier(.16,1,.3,1)'
  el.appendChild(img)
  document.body.appendChild(el)
  let tx = 0, ty = 0, x = 0, y = 0, rot = 0, shown = false, raf = 0, cur = '', raf2 = 0
  const loop = () => {
    const px = x
    x += (tx - x) * 0.14
    y += (ty - y) * 0.14
    rot += ((x - px) * 0.9 - rot) * 0.15
    const r = Math.max(-14, Math.min(14, rot))
    el.style.transform = `translate(${x + 28}px, ${y - 140}px) rotate(${r}deg) scale(${shown ? 1 : 0.85})`
    if (shown || Math.abs(tx - x) > 0.5 || el.style.opacity !== '0') raf = requestAnimationFrame(loop)
    else raf = 0
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop) }
  const onPv = e => {
    if (e.pointerType === 'touch') return
    const a = e.target.closest && e.target.closest('.az-footer li a')
    const key = a && a.textContent.trim().toLowerCase()
    if (a && PREVIEW[key]) {
      tx = Math.min(e.clientX, window.innerWidth - 260)
      ty = Math.max(e.clientY, 150)
      if (!shown) { x = tx; y = ty }
      if (cur !== key) {
        cur = key
        img.src = PREVIEW[key]
        img.style.transform = 'scale(1.15)'
        cancelAnimationFrame(raf2)
        raf2 = requestAnimationFrame(() => { img.style.transform = 'scale(1)' })
      }
      shown = true
      el.style.opacity = '1'
      kick()
    } else if (shown) { shown = false; cur = ''; el.style.opacity = '0' }
  }
  const onScroll = () => { if (shown) { shown = false; el.style.opacity = '0' } }
  document.addEventListener('pointermove', onPv, { passive: true })
  document.addEventListener('scroll', onScroll, { passive: true })
  return () => {
    document.removeEventListener('pointermove', onPv)
    document.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(raf)
    cancelAnimationFrame(raf2)
    el.remove()
  }
}

export default function Footer({ onServiceLink, onSectionLink }) {
  useEffect(() => {
    if (reducedMotion()) return
    const offs = [bounce(), magnet(), preview()]
    return () => offs.forEach(off => off())
  }, [])

  return (
    <div data-screen-label="11 Footer" id="footer" data-r="footer">
      <footer className="az-footer">
        <div className="az-footer__in">
          <div className="az-footer__brand">
            <img src={LOGO} alt="AZ Care.pk" />
            <p>Professional cleaning company. Eco-friendly, trusted, guaranteed.</p>
            <span className="az-footer__tag">"Where Cleanliness Meets Perfection"</span>
            <div className="az-footer__soc">
              {FOOT_SOCIALS.map(s => (
                <a
                  key={s[0]}
                  href={SOCIAL_HREF[s[0]]}
                  {...(s[0] === 'phone' ? {} : { target: '_blank', rel: 'noreferrer' })}
                  title={s[0]}
                  className="az-social az-social--footer"
                >
                  <i className={s[1]} />
                </a>
              ))}
            </div>
          </div>
          <hr />
          <div style={{ width: '100%' }}>
            <h4>Our Services</h4>
            <ul>
              {FOOTER_SERVICES.map(s => (
                <li key={s}>
                  <a href="#services" onClick={e => { e.preventDefault(); onServiceLink(s) }}>{s}</a>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ width: '100%' }}>
            <h4>Service Areas</h4>
            <div className="az-footer__areas">
              {AREAS.map(a => (
                <span key={a.name} className={'az-city' + (a.primary ? ' az-city--primary' : '')}>
                  <i className="fa-solid fa-location-dot" /> {a.name}
                  {a.primary && <em>Primary</em>}
                </span>
              ))}
            </div>
          </div>
          <div className="az-footer__row">
            <div>
              <h4>Quick Links</h4>
              <ul style={{ gap: 18 }}>
                {QUICK.map(q => (
                  <li key={q[1]}>
                    <a href={'#' + q[1]} onClick={e => { e.preventDefault(); onSectionLink(q[1]) }}>{q[0]}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Contact Info</h4>
              <ul style={{ gap: 18 }}>
                <li>
                  <a href={PHONE_HREF}>
                    <i className="fa-solid fa-phone" style={{ color: '#ef4444' }} /> {PHONE}
                  </a>
                </li>
                <li>
                  <a href={WA_URL}>
                    <i className="fa-brands fa-whatsapp" style={{ color: '#25d366' }} /> WhatsApp
                  </a>
                </li>
                <li>
                  <a href={'mailto:' + EMAIL}>
                    <i className="fa-solid fa-envelope" style={{ color: '#38bdf8' }} /> Email
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="az-footer__bar">
          <p>© 2026 AZ Care.pk — Professional Cleaning Services | All Rights Reserved</p>
          <span>Pakistan Walon Ki Pehli Choice</span>
        </div>
      </footer>
    </div>
  )
}
