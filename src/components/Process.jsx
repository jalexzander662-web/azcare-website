import { useRef, useState } from 'react'
import Section from '../ds/Section'
import { STEPS } from '../data/site'
import { reducedMotion, sp } from '../lib/motion'
import { WSTEP, headStyle, splitWords, useInView, wordStyle } from '../hooks/useReveal'

const WHISPER = 'Booking AZ Care is easy, fast and completely hassle-free.'

export default function Process() {
  const ref = useRef(null)
  const [red] = useState(reducedMotion)
  const { phase, dir } = useInView(ref)
  const on = phase === 'in'
  const up = dir === 'up'

  const pWords = splitWords(WHISPER)
  const pN = pWords.length
  const sw = STEPS.map((x) => splitWords(x.desc))
  const sdur = sw.map((w) => 0.65 + w.length * 0.045 + 0.1)
  const stepsT = sdur.reduce((a, b) => a + b, 0)
  const pBase = up ? 0 : 0.3 + pN * WSTEP + 0.1
  const pWBase = up ? stepsT : 0.3
  const pHD = up ? stepsT + pN * WSTEP * 0.6 + 0.1 : 0

  // reveal block for a step's number / title
  const rv = (d, y, fl) =>
    red
      ? { opacity: 1, transform: 'none', filter: 'none', transition: 'none' }
      : on
        ? { opacity: 1, transform: 'none', filter: 'blur(0)', transition: sp(`opacity .6s ease ${d}s, transform .6s ease ${d}s, filter .6s ease ${d}s`) }
        : { opacity: 0, transform: y, filter: 'blur(' + fl + 'px)', transition: 'none' }

  const sOrder = STEPS.map((_, i) => i)
  if (up) sOrder.reverse()
  const sStart = {}
  let acc = pBase
  sOrder.forEach((i) => {
    sStart[i] = acc
    acc += sdur[i]
  })

  return (
    <div data-screen-label="06 4 Simple Steps" id="process" ref={ref}>
      <Section>
        <div className="az-sec-head az-sec-head--center">
          <div style={headStyle(red, on, up, pHD)}>
            <div className="az-tag">How It Works</div>
            <h2 className="az-sec-title">4 Simple <em>Steps</em></h2>
          </div>
          <p style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 .32em', fontStyle: 'italic', letterSpacing: '.2px' }} className="az-sec-sub">
            {pWords.map((t, j) => (
              <span key={j} style={wordStyle(red, on, up, pWBase + (up ? pN - 1 - j : j) * WSTEP)}>{t}</span>
            ))}
          </p>
        </div>
        <div data-r="steps">
          <div
            data-r="steps-line"
            style={{
              position: 'absolute',
              top: 52,
              left: '12.5%',
              right: '12.5%',
              height: 1,
              background: 'linear-gradient(90deg,rgba(30,144,255,.45),rgba(0,196,255,.45),rgba(6,214,160,.45),rgba(255,209,102,.45))',
              pointerEvents: 'none',
              transformOrigin: (up ? 'right' : 'left') + ' center',
              transform: `scaleX(${on || red ? 1 : 0})`,
              transition: red || !on ? 'none' : sp(`transform ${Math.max(1, stepsT - 0.6)}s ease ${pBase}s`),
            }}
          />
          {STEPS.map((st, i) => {
            const t0 = sStart[i]
            const ws = sw[i]
            const n = ws.length
            const nmD = up ? t0 + n * 0.045 + 0.35 : t0
            const ttD = up ? t0 + n * 0.045 + 0.1 : t0 + 0.3
            return (
              <div key={st.n} data-r="step" data-c={st.n} style={{ position: 'relative' }}>
                <div className="az-step">
                  <div style={rv(nmD, 'scale(.6)', 6)}>
                    <div className="az-step__num">{st.n}</div>
                  </div>
                  <h3 style={rv(ttD, 'translateY(' + (up ? -14 : 14) + 'px)', 8)}>{st.title}</h3>
                  <p style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 .3em', fontStyle: 'italic' }}>
                    {ws.map((t, j) => (
                      <span key={j} style={wordStyle(red, on, up, up ? t0 + (n - 1 - j) * 0.045 : t0 + 0.6 + j * 0.045, 8)}>{t}</span>
                    ))}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </Section>
    </div>
  )
}
