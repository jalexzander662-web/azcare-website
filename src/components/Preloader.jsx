// Preloader (design class PL). Only mounted when motion is not reduced, so the design's `reduced` branches are gone.
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { LOGO } from '../data/links'

const MSG = ['Equipment tayyar ho raha hai', 'Eco-friendly products load ho rahe hain', 'Team raaste mein hai', 'Safai Aisi Jo Nazar Aaye']
const C = 'cubic-bezier(.76,0,.24,1)'
const N = 5
const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const rnd = (i) => {
  const x = Math.sin(i * 127.1 + 31.7) * 43758.5453
  return x - Math.floor(x)
}
const mono = { fontFamily: "'Poppins',sans-serif", fontSize: '.7rem', fontWeight: 600, letterSpacing: '.28em', textTransform: 'uppercase', color: 'rgba(240,246,255,.55)' }
const FONTS = ['Montserrat', 'Poppins']

const letters = (txt, base) =>
  txt.split('').map((ch, i) => (
    <span key={i} style={{ display: 'inline-block', whiteSpace: 'pre', animation: 'azPreLetter .6s cubic-bezier(.16,1,.3,1) ' + (base + i * 0.025) + 's both' }}>
      {ch}
    </span>
  ))

export default function Preloader({ seconds, onDone }) {
  const [p, setP] = useState(0)
  const [phase, setPhase] = useState('load') // load | out | done
  const [fr, setFr] = useState(() => !document.fonts) // fonts ready
  const live = useRef({}) // live values for the timers
  const prevOv = useRef('')
  live.current.onDone = onDone
  live.current.seconds = seconds

  // lock scroll + flag <html> before first paint (the design did this in the constructor)
  useLayoutEffect(() => {
    const de = document.documentElement
    prevOv.current = de.style.overflow
    de.setAttribute('data-az-pre', '')
    de.style.overflow = 'hidden'
    return () => {
      de.removeAttribute('data-az-pre')
      de.style.overflow = prevOv.current || ''
    }
  }, [])

  useEffect(() => {
    const de = document.documentElement
    let dead = false
    let exiting = false
    let loaded = document.readyState !== 'loading'
    let t0 = performance.now()
    let ready = !document.fonts
    let v = 0
    let lastT = 0
    let shown = 0
    let raf = 0
    const timers = []

    if (document.fonts) {
      const wait = new Promise((r) => {
        const go = () => {
          if (dead) return r()
          Promise.all([document.fonts.load("800 48px 'Montserrat'"), document.fonts.load("600 16px 'Poppins'")]).then(
            () => (FONTS.every((fm) => [...document.fonts].some((f) => f.family.replace(/["']/g, '') === fm && f.status === 'loaded')) ? r() : setTimeout(go, 60)),
            () => setTimeout(go, 60)
          )
        }
        go()
      })
      Promise.race([wait, new Promise((r) => setTimeout(r, 500))]).then(() => {
        if (!dead) {
          ready = true
          setFr(true)
          t0 = performance.now()
        }
      })
    }

    const onLoad = () => { loaded = true }
    window.addEventListener('load', onLoad)
    document.addEventListener('DOMContentLoaded', onLoad)
    timers.push(setTimeout(onLoad, 700))

    const exit = () => {
      if (exiting) return
      exiting = true
      clearInterval(fb)
      cancelAnimationFrame(raf)
      timers.push(setTimeout(() => setPhase('out'), 80))
      timers.push(setTimeout(() => {
        de.removeAttribute('data-az-pre')
        de.style.overflow = prevOv.current || ''
      }, 320))
      timers.push(setTimeout(() => {
        setPhase('done')
        live.current.onDone && live.current.onDone()
      }, 900))
    }

    const dur = (live.current.seconds || 2.6) * 1000
    const tick = (now) => {
      if (dead) return
      const k = ready ? Math.min(1, (now - t0) / dur) : 0
      const target = loaded ? ease(k) : Math.min(ease(k), 0.9)
      const dt = Math.min(1000, now - (lastT || now))
      lastT = now
      v += (target - v) * (1 - Math.exp(-dt / 110))
      if (target >= 1 && v > 0.985) v = 1
      if (Math.round(v * 100) !== Math.round(shown * 100)) {
        shown = v
        setP(v)
      }
      if (v >= 1) return exit()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const fb = setInterval(() => {
      if (dead || exiting) return clearInterval(fb)
      cancelAnimationFrame(raf)
      tick(performance.now())
    }, 250)

    return () => {
      dead = true
      cancelAnimationFrame(raf)
      clearInterval(fb)
      timers.forEach(clearTimeout)
      document.removeEventListener('DOMContentLoaded', onLoad)
      window.removeEventListener('load', onLoad)
    }
  }, [])

  if (phase === 'done') return null
  const out = phase === 'out'
  const pct = Math.round(p * 100)
  const fade = (dy, dl) => ({ opacity: out ? 0 : 1, transform: out ? 'translateY(' + dy + 'px)' : 'translateY(0)', transition: 'opacity .45s ease ' + dl + 's, transform .6s ' + C + ' ' + dl + 's' })
  const colStyle = (i) => ({ position: 'absolute', top: 0, bottom: 0, left: (i * 100) / N + '%', width: 'calc(' + 100 / N + '% + 1px)' })
  const digs = String(pct).padStart(2, '0').split('')
  const mi = Math.min(3, Math.floor(p * 4))

  return (
    <div
      role="progressbar"
      aria-label="Loading AZ Care.pk"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{ position: 'fixed', inset: 0, zIndex: 3000, overflow: 'hidden', pointerEvents: out ? 'none' : 'auto', color: '#f0f6ff' }}
    >
      {Array.from({ length: N }, (_, i) => {
        const d = i * 0.07
        return [
          <div key={'a' + i} style={{ ...colStyle(i), background: 'linear-gradient(180deg,#0b1e3d,#1e90ff)', transform: out ? 'translateY(-100%)' : 'translateY(0)', transition: 'transform .95s ' + C + ' ' + (d + 0.14) + 's', opacity: 1 }} />,
          <div key={'b' + i} style={{ ...colStyle(i), background: '#060f1e', transform: out ? 'translateY(-101%)' : 'translateY(0)', transition: 'transform .95s ' + C + ' ' + d + 's', opacity: 1 }}>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 2, background: '#00c4ff', boxShadow: out ? '0 4px 18px rgba(0,196,255,.8)' : 'none' }} />
          </div>,
        ]
      })}
      <div style={{ position: 'absolute', inset: 0, opacity: fr ? 1 : 0, transition: 'opacity .6s' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity: out ? 0 : 1, transform: out ? 'scale(1.15)' : 'none', transition: 'opacity .5s ease, transform .9s ' + C }}>
          {Array.from({ length: 18 }, (_, i) => {
            const sz = 6 + rnd(i) * 26
            return (
              <span
                key={i}
                style={{
                  position: 'absolute',
                  bottom: -40,
                  left: rnd(i + 50) * 100 + '%',
                  width: sz,
                  height: sz,
                  borderRadius: '50%',
                  border: '1px solid rgba(160,220,255,.35)',
                  background: 'radial-gradient(circle at 32% 30%,rgba(255,255,255,.55) 0 12%,rgba(0,196,255,.10) 30%,transparent 70%)',
                  boxShadow: 'inset 0 0 6px rgba(0,196,255,.25)',
                  '--sx': (rnd(i + 90) - 0.5) * 80 + 'px',
                  animation: 'azBubble ' + (5 + rnd(i + 20) * 5) + 's linear ' + -rnd(i + 70) * 9 + 's infinite',
                }}
              />
            )
          })}
        </div>
      </div>
      <div style={{ opacity: fr ? 1 : 0, transition: 'opacity .35s', position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 'clamp(1.25rem,3vw,2.5rem)', boxSizing: 'border-box', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 55% 45% at 50% 46%,rgba(30,144,255,.20) 0%,transparent 70%)', opacity: out ? 0 : 1, transition: 'opacity .5s' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,.07) 1px,transparent 1px)', backgroundSize: '28px 28px', maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%,#000 30%,transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%,#000 30%,transparent 80%)', opacity: out ? 0 : 1, transition: 'opacity .5s' }} />
        <div style={{ ...fade(-16, 0), position: 'relative', display: 'flex', justifyContent: 'space-between', gap: '1rem', ...mono }}>
          <span>{letters('AZ Care.pk', 0.1)}</span>
          <span>{letters('Karachi · Pakistan', 0.2)}</span>
        </div>
        <div style={{ ...fade(-24, 0.04), position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.1rem', textAlign: 'center' }}>
          <div style={{ position: 'relative', padding: '.25rem .5rem', transform: out ? 'scale(1.08)' : 'none', filter: out ? 'blur(8px)' : 'none', transition: 'transform .7s ' + C + ', filter .5s ease' }}>
            <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 'clamp(150px,22vw,250px)', aspectRatio: '1', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}>
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(30,144,255,.14)' }} />
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', animation: 'azPreOrbit 3.2s linear infinite' }}>
                <span style={{ position: 'absolute', top: -3, left: '50%', marginLeft: -3, width: 6, height: 6, borderRadius: '50%', background: '#00c4ff', boxShadow: '0 0 12px 2px rgba(0,196,255,.8)' }} />
              </span>
              <span style={{ position: 'absolute', inset: '-14px', borderRadius: '50%', animation: 'azPreOrbit 5.5s linear infinite reverse' }}>
                <span style={{ position: 'absolute', bottom: -2, left: '50%', marginLeft: -2, width: 4, height: 4, borderRadius: '50%', background: '#1e90ff', boxShadow: '0 0 10px rgba(30,144,255,.9)' }} />
              </span>
            </span>
            <div style={{ position: 'relative', animation: 'azPreWipe 1.1s cubic-bezier(.16,1,.3,1) .1s both' }}>
              <img src={LOGO} alt="AZ Care.pk" style={{ height: 'clamp(56px,9vw,92px)', width: 'auto', display: 'block', filter: 'drop-shadow(0 0 24px rgba(30,144,255,.35))' }} />
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(105deg,transparent 40%,rgba(255,255,255,.95) 50%,transparent 60%)',
                  backgroundSize: '250% 100%',
                  WebkitMaskImage: 'url(' + LOGO + ')',
                  maskImage: 'url(' + LOGO + ')',
                  WebkitMaskSize: '100% 100%',
                  maskSize: '100% 100%',
                  animation: 'azPreSweep 2.6s ease-in-out 1s infinite',
                }}
              />
            </div>
          </div>
          <div style={{ ...mono, color: 'rgba(240,246,255,.7)', letterSpacing: '.32em', animation: 'azPreIn .9s cubic-bezier(.16,1,.3,1) .25s both' }}>{'“Pakistan Walon Ki Pehli Choice”'}</div>
        </div>
        <div style={{ ...fade(-36, 0.08), position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem 2rem' }}>
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 'clamp(4.5rem,14vw,10.5rem)', lineHeight: 1, letterSpacing: '-.04em', color: '#f0f6ff', fontVariantNumeric: 'tabular-nums', display: 'flex', alignItems: 'flex-start', marginBottom: '-.12em' }}>
            <span style={{ display: 'flex' }}>
              {digs.map((dg, i) => {
                const fromR = digs.length - 1 - i
                return (
                  <span key={['u', 't', 'h'][fromR]} style={{ display: 'inline-block', height: '1em', overflow: 'hidden', position: 'relative', transform: out ? 'translateY(-70%)' : 'none', opacity: out ? 0 : 1, transition: 'transform .6s ' + C + ' ' + i * 0.06 + 's, opacity .4s ease ' + i * 0.06 + 's' }}>
                    <span style={{ display: 'flex', flexDirection: 'column', transform: 'translateY(' + -Number(dg) + 'em)', transition: 'transform .55s cubic-bezier(.16,1,.3,1)' }}>
                      {'0123456789'.split('').map((n) => (
                        <span key={n} style={{ height: '1em', lineHeight: '1em' }}>{n}</span>
                      ))}
                    </span>
                  </span>
                )
              })}
            </span>
            <span style={{ fontSize: '.32em', marginTop: '.18em', marginLeft: '.12em', color: '#00c4ff', letterSpacing: 0 }}>%</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.55rem', paddingBottom: '.6rem', maxWidth: '22rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', ...mono }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00c4ff', boxShadow: '0 0 10px #00c4ff', animation: 'azPrePulse 1.2s ease-in-out infinite' }} />
              Loading
            </div>
            <div key={'m' + mi} style={{ fontFamily: "'Poppins',sans-serif", fontStyle: 'italic', fontSize: 'clamp(.95rem,1.6vw,1.15rem)', color: '#f0f6ff', textWrap: 'pretty', animation: 'azPreMsg .55s cubic-bezier(.16,1,.3,1) both' }}>
              {MSG[mi] + (pct < 100 ? '…' : '')}
            </div>
            <div style={{ display: 'flex', gap: '.35rem' }}>
              {[0, 1, 2, 3].map((k) => (
                <span key={k} style={{ height: 3, width: 26, borderRadius: 3, background: k <= mi ? 'linear-gradient(90deg,#1e90ff,#00c4ff)' : 'rgba(255,255,255,.12)', boxShadow: k <= mi ? '0 0 8px rgba(0,196,255,.5)' : 'none', transition: 'background .4s, box-shadow .4s' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: 'rgba(30,144,255,.12)', opacity: out ? 0 : 1, transition: 'opacity .3s' }}>
        <div style={{ position: 'absolute', inset: 0, transformOrigin: 'left center', transform: 'scaleX(' + p + ')', background: 'linear-gradient(90deg,#0066cc,#1e90ff 45%,#00c4ff)', boxShadow: '0 0 12px rgba(0,196,255,.7)' }} />
      </div>
    </div>
  )
}
