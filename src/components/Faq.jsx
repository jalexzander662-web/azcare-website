import { useRef, useState } from 'react'
import Section from '../ds/Section'
import FaqItem from '../ds/FaqItem'
import { FAQS } from '../data/site'
import { reducedMotion, sp } from '../lib/motion'
import { WSTEP, headStyle, splitWords, useInView, wordStyle } from '../hooks/useReveal'

const WHISPER = 'Aap ke sawal, hamare seedhe aur saaf jawab.'
const GAP = 0.1 // faqGap
const BATCH = 1 // faqBatch: one at a time

export default function Faq() {
  const ref = useRef(null)
  const [red] = useState(reducedMotion)
  const [open, setOpen] = useState(null)
  const { phase, dir } = useInView(ref)
  const on = phase === 'in'
  const up = dir === 'up'

  const nF = FAQS.length
  const words = splitWords(WHISPER)
  const nW = words.length
  const qSteps = Math.ceil(nF / BATCH) * GAP
  const hDelay = up ? qSteps + nW * WSTEP * 0.6 + 0.1 : 0
  const wBase = up ? qSteps : 0.3
  const qBase = up ? 0 : 0.3 + nW * WSTEP + 0.1

  return (
    <div data-screen-label="07 Common Questions" id="faq" ref={ref}>
      <Section tone="alt">
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div className="az-sec-head az-sec-head--center" style={{ marginBottom: 'var(--sp-8)' }}>
            <div style={headStyle(red, on, up, hDelay)}>
              <div className="az-tag">FAQ</div>
              <h2 className="az-sec-title">Common <em>Questions</em></h2>
            </div>
            <p
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0 .32em',
                margin: '1.1rem auto 0',
                maxWidth: '34rem',
                fontSize: '1.08rem',
                lineHeight: 1.6,
                fontStyle: 'italic',
                letterSpacing: '.2px',
              }}
            >
              {words.map((t, j) => (
                <span key={j} style={wordStyle(red, on, up, wBase + (up ? nW - 1 - j : j) * WSTEP)}>{t}</span>
              ))}
            </p>
          </div>
          <div style={{ display: 'grid', gap: 'var(--gap-stack)' }}>
            {FAQS.map((f, i) => {
              const order = up ? nF - 1 - i : i
              const delay = qBase + Math.floor(order / BATCH) * GAP
              const st = red
                ? { opacity: 1, transform: 'none', transition: 'none' }
                : on
                  ? { opacity: 1, transform: 'translateY(0)', transition: sp(`opacity .5s ease ${delay}s, transform .5s ease ${delay}s`) }
                  : { opacity: 0, transform: 'translateY(' + (up ? -30 : 30) + 'px)', transition: 'none' }
              return (
                <div key={i} style={st}>
                  <FaqItem q={f[0]} a={f[1]} open={open === i} onToggle={() => setOpen((p) => (p === i ? null : i))} />
                </div>
              )
            })}
          </div>
        </div>
      </Section>
    </div>
  )
}
