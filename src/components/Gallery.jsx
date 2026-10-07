import { useCallback, useEffect, useRef, useState } from 'react'
import Section from '../ds/Section'
import { SLIDES } from '../data/site'
import { reducedMotion, sp } from '../lib/motion'
import { WSTEP, headStyle, splitWords, useInView, wordStyle } from '../hooks/useReveal'

const WHISPER = 'See the incredible difference a professional AZ Care clean makes. Real results from Karachi homes.'
const SLIDE_MS = 4000
const N = SLIDES.length
const SLIDE_LIST = SLIDES.concat(SLIDES[0]) // extra copy of slide 0 so the loop is seamless

export default function Gallery() {
  const ref = useRef(null)
  const [red] = useState(reducedMotion)
  const { phase, dir } = useInView(ref)
  const on = phase === 'in'
  const up = dir === 'up'

  const [ba, setBa] = useState(0)
  const [snap, setSnap] = useState(false)
  const [dx, setDx] = useState(0)
  const [drag, setDrag] = useState(false)
  const flags = useRef({ drag, snap })
  flags.current = { drag, snap }
  const dragRef = useRef(null)
  const timer = useRef(0)

  const startTimer = useCallback(() => {
    clearInterval(timer.current)
    timer.current = setInterval(() => {
      if (!flags.current.drag && !flags.current.snap) setBa((b) => Math.min(b + 1, N))
    }, SLIDE_MS)
  }, [])
  useEffect(() => {
    startTimer()
    return () => clearInterval(timer.current)
  }, [startTimer])

  const onDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    dragRef.current = { x: e.clientX }
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch (_) {}
    setDrag(true)
    setDx(0)
  }
  const onMove = (e) => {
    const d = dragRef.current
    if (d) setDx(e.clientX - d.x)
  }
  const onUp = (e) => {
    const d = dragRef.current
    if (!d) return
    dragRef.current = null
    const m = e.clientX - d.x
    const step = m < -50 ? 1 : m > 50 ? -1 : 0
    setDrag(false)
    setDx(0)
    setBa((b) => (b + step + N) % N)
    if (step) startTimer()
  }
  const onEnd = (e) => {
    if (e.target === e.currentTarget && ba >= N) {
      setSnap(true)
      setBa(0)
      requestAnimationFrame(() => requestAnimationFrame(() => setSnap(false)))
    }
  }

  const words = splitWords(WHISPER)
  const n = words.length
  const bodyD = up ? 0 : 0.3 + n * WSTEP + 0.1
  const wB = up ? 0.5 : 0.3
  const headD = up ? 0.5 + n * WSTEP * 0.6 + 0.1 : 0
  const body = red
    ? { opacity: 1, transform: 'none', transition: 'none' }
    : on
      ? { opacity: 1, transform: 'translateY(0)', transition: sp(`opacity .7s ease ${bodyD}s, transform .7s ease ${bodyD}s`) }
      : { opacity: 0, transform: 'translateY(' + (up ? -30 : 30) + 'px)', transition: 'none' }

  return (
    <div data-screen-label="05 Real Transformations" id="gallery" ref={ref}>
      <Section tone="gallery">
        <div className="az-sec-head">
          <div style={headStyle(red, on, up, headD)}>
            <div className="az-tag">Our Work</div>
            <h2 className="az-sec-title">Real <em>Transformations</em></h2>
          </div>
          <p className="az-sec-sub" style={{ display: 'flex', flexWrap: 'wrap', gap: '0 .32em', fontStyle: 'italic', letterSpacing: '.2px' }}>
            {words.map((t, j) => (
              <span key={j} style={wordStyle(red, on, up, wB + (up ? n - 1 - j : j) * WSTEP)}>{t}</span>
            ))}
          </p>
        </div>
        <div style={body}>
          <div data-r="ba-wrap">
            <div
              className="az-ba"
              data-r="ba"
              style={{ touchAction: 'pan-y pinch-zoom', userSelect: 'none', cursor: 'grab' }}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            >
              <div
                className="az-ba__track"
                style={{ transform: `translateX(calc(${-ba * 100}% + ${dx}px))`, transition: drag || snap ? 'none' : 'transform .45s ease' }}
                onTransitionEnd={onEnd}
              >
                {SLIDE_LIST.map((sl, i) => (
                  <div key={i} className="az-ba__slide" style={{ aspectRatio: '8/3' }}>
                    <div
                      role="img"
                      aria-label={sl.label}
                      style={{ position: 'absolute', inset: 0, backgroundImage: `url("${sl.img}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                    <div className="az-ba__label">{sl.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="az-ba__dots" style={{ gap: 0, marginTop: '.3rem' }}>
            {SLIDES.map((sl, i) => (
              <button
                key={i}
                type="button"
                aria-label={sl.label}
                onClick={() => {
                  setBa(i)
                  startTimer()
                }}
                style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <span className={'az-ba__dot' + (i === ba % N ? ' is-active' : '')} />
              </button>
            ))}
          </div>
        </div>
      </Section>
    </div>
  )
}
