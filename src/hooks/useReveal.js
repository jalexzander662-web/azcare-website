// Shared scroll-reveal helpers for Gallery / Process / Faq / Counters (the design's whisper-reveal maths).
import { useEffect, useState } from 'react'
import { sp } from '../lib/motion'

export const BASE = 'rgba(240,246,255,.78)'
export const GLOW = '#00c4ff'
export const WSTEP = 0.07

export const splitWords = (s) => s.split(/\s+/).filter(Boolean)

// one passive scroll listener for the whole page, like the design's this.dir
let dir = 'down'
let lastY = 0
let bound = false
const bind = () => {
  if (bound) return
  bound = true
  lastY = window.scrollY
  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY
      if (y !== lastY) {
        dir = y > lastY ? 'down' : 'up'
        lastY = y
      }
    },
    { passive: true }
  )
}

// phase goes back to 'hidden' when the section leaves view (the reveal replays); dir is captured on entry.
// once=true: stays 'in' after the first intersection (Counters).
export function useInView(ref, once = false) {
  const [s, setS] = useState({ phase: 'hidden', dir: 'down' })
  useEffect(() => {
    bind()
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            setS((p) => (p.phase === 'in' ? p : { phase: 'in', dir }))
            if (once) io.disconnect()
          } else if (!once) setS((p) => (p.phase === 'hidden' ? p : { ...p, phase: 'hidden' }))
        }),
      { rootMargin: '0px 0px 12% 0px' }
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [ref, once])
  return s
}

// section heading block (tag + title)
export const headStyle = (red, on, up, d) =>
  red
    ? { opacity: 1, transform: 'none', filter: 'none', transition: 'none' }
    : on
      ? { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)', transition: sp(`opacity .7s ease ${d}s, transform .7s ease ${d}s, filter .7s ease ${d}s`) }
      : { opacity: 0, transform: 'translateY(' + (up ? -24 : 24) + 'px)', filter: 'blur(10px)', transition: 'none' }

// one whispered word; y = hidden-state offset
export const wordStyle = (red, on, up, d, y = 10) =>
  red
    ? { display: 'inline-block', opacity: 1, filter: 'none', transform: 'none', color: BASE, transition: 'none' }
    : on
      ? {
          display: 'inline-block',
          opacity: 1,
          filter: 'blur(0)',
          transform: 'translateY(0)',
          color: BASE,
          transition: sp(`opacity .6s ease ${d}s, filter .6s ease ${d}s, transform .6s ease ${d}s, color 1.1s ease ${d}s`),
        }
      : { display: 'inline-block', opacity: 0, filter: 'blur(8px)', transform: 'translateY(' + (up ? -y : y) + 'px)', color: GLOW, transition: 'none' }
