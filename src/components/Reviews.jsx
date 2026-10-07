import { useCallback, useEffect, useRef, useState } from 'react'
import Section from '../ds/Section'
import ReviewCard from '../ds/ReviewCard'
import { REVIEWS } from '../data/site'

const N = REVIEWS.length
const SLIDES = [...REVIEWS, ...REVIEWS, ...REVIEWS]
const REVIEW_MS = 2000
const visFor = () => {
  const w = window.innerWidth
  return w > 1024 ? 3 : w > 480 ? 2 : 1
}

export default function Reviews() {
  const [rev, setRev] = useState(N)
  const [anim, setAnim] = useState(true)
  const [dx, setDx] = useState(0)
  const [drag, setDrag] = useState(false)
  const [vis, setVis] = useState(visFor)

  // timers / listeners read these, never the render closure
  const revRef = useRef(N)
  const paused = useRef(false)
  const dragRef = useRef(null)
  const wrapT = useRef(0)
  const timer = useRef(0)

  const go = useCallback((i) => {
    revRef.current = i
    setRev(i)
    setAnim(true)
    clearTimeout(wrapT.current)
    wrapT.current = setTimeout(() => {
      let r = revRef.current
      if (r >= 2 * N) r -= N
      else if (r < N) r += N
      else return
      revRef.current = r
      setRev(r)
      setAnim(false)
      requestAnimationFrame(() => requestAnimationFrame(() => setAnim(true)))
    }, 400)
  }, [])

  const startTimer = useCallback(() => {
    clearInterval(timer.current)
    timer.current = setInterval(() => {
      if (!paused.current && !dragRef.current) go(revRef.current + 1)
    }, REVIEW_MS)
  }, [go])
  useEffect(() => {
    startTimer()
    return () => {
      clearInterval(timer.current)
      clearTimeout(wrapT.current)
    }
  }, [startTimer])

  useEffect(() => {
    const onResize = () => setVis(visFor())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const onDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    dragRef.current = { x: e.clientX }
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch (_) {}
    paused.current = true
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
    if (e.pointerType !== 'mouse') paused.current = false
    setDrag(false)
    setDx(0)
    if (step) {
      go(revRef.current + step)
      startTimer()
    }
  }

  const basis = 100 / vis + '%'

  return (
    <div data-screen-label="09 What Karachi Says" id="reviews">
      <Section>
        <div className="az-sec-head az-sec-head--center">
          <div className="az-tag">Customer Reviews</div>
          <h2 className="az-sec-title">What <em>Pakistan</em> Says</h2>
          <p className="az-sec-sub">Real reviews from real customers — 5,000+ satisfied families across Karachi trust AZ Care.pk</p>
        </div>
        <div
          data-r="rev-vp"
          style={{ overflow: 'hidden', padding: '8px 0 4px', touchAction: 'pan-y pinch-zoom', userSelect: 'none', cursor: 'grab' }}
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <div
            style={{
              display: 'flex',
              margin: '0 -.75rem',
              transform: `translateX(calc(${(-rev * 100) / vis}% + ${dx}px))`,
              transition: drag || !anim ? 'none' : 'transform .25s ease',
            }}
          >
            {SLIDES.map((r, i) => (
              <div
                key={i}
                data-r="rev-slide"
                style={{ flex: `0 0 ${basis}`, maxWidth: basis, padding: '0 .75rem', boxSizing: 'border-box', display: 'flex' }}
              >
                <ReviewCard text={r.text} name={r.name} location={r.location} img={r.img} />
              </div>
            ))}
          </div>
        </div>
        <div className="az-ba__dots" style={{ gap: 0, marginTop: '1rem' }}>
          {REVIEWS.map((r, i) => (
            <button
              key={i}
              type="button"
              aria-label={'Review by ' + r.name}
              onClick={() => {
                go(N + i)
                startTimer()
              }}
              style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              <span className={'az-ba__dot' + (i === rev % N ? ' is-active' : '')} />
            </button>
          ))}
        </div>
      </Section>
    </div>
  )
}
