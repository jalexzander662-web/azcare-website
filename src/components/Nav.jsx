import { useEffect, useRef, useState } from 'react'
import { LOGO, NAV_LINKS, PHONE, PHONE_HREF, WA_URL } from '../data/links'
import './shell.css'

// Fixed nav + mobile drawer (hand port of ds/Nav.js with fixed always on).
export default function Nav({ cartCount = 0, onBook, onCart, onLink }) {
  const [open, setOpen] = useState(false)
  const [sc, setSc] = useState(false)
  const drawer = useRef(null)
  const burger = useRef(null)

  useEffect(() => {
    const h = () => setSc(window.scrollY > 40)
    h()
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  // drawer closes on outside click and Escape
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (drawer.current && !drawer.current.contains(e.target) && !(burger.current && burger.current.contains(e.target))) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('click', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const go = (l) => (e) => {
    e.preventDefault()
    setOpen(false)
    onLink && onLink(l)
  }

  return (
    <>
      <nav className={'az-nav az-nav--fixed' + (sc ? ' is-scrolled' : '')}>
        <a className="az-nav__logo" href="#" onClick={go('Home')}>
          <img src={LOGO} alt="AZ Care.pk" />
        </a>
        <ul className="az-nav__links">
          {NAV_LINKS.map((l) => (
            <li key={l.label} className={l.children ? 'has-dd' : ''}>
              <a href="#" onClick={go(l.label)}>
                {l.label}
                {l.children && <i className="fa-solid fa-chevron-down az-nav__caret" />}
              </a>
              {l.children && (
                <div className="az-nav__dd">
                  <div className="az-nav__ddbox">
                    {l.children.map((c) => (
                      <a key={c.label} href="#" onClick={go(c.label)}>
                        {c.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="az-nav__right">
          <a href={PHONE_HREF} className="az-btn az-btn--call">
            <i className="fa-solid fa-phone" /> {PHONE}
          </a>
          <button type="button" className="az-btn az-btn--primary az-btn--sm" onClick={onBook}>
            Book Now
          </button>
          <button type="button" className="az-btn az-btn--cart" onClick={onCart} aria-label="Open cart">
            <i className="fa-solid fa-cart-shopping" />
            <span>Cart</span>
            {cartCount > 0 && <span className="az-btn__badge">{cartCount}</span>}
          </button>
        </div>
        <button ref={burger} type="button" className="az-nav__burger" onClick={() => setOpen(true)} aria-label="Menu" aria-expanded={open}>
          <span />
          <span />
          <span />
        </button>
      </nav>
      <div ref={drawer} className={'az-mobile' + (open ? ' is-open' : '')}>
        <button type="button" className="az-mobile__close" onClick={() => setOpen(false)} aria-label="Close menu">
          {'✕'}
        </button>
        {NAV_LINKS.map((l) => (
          <a key={l.label} href="#" onClick={go(l.label)}>
            {l.label}
          </a>
        ))}
        <div className="az-mobile__contact">
          <a href={WA_URL} target="_blank" rel="noreferrer" className="az-mc az-mc--wa">
            <i className="fa-brands fa-whatsapp" />
            WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}
