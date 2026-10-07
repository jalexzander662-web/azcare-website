import { useRef, useState } from 'react'
import Section from '../ds/Section'
import StatCounter from '../ds/StatCounter'
import { COUNTERS } from '../data/site'
import { reducedMotion } from '../lib/motion'
import { useInView } from '../hooks/useReveal'

export default function Counters() {
  const ref = useRef(null)
  const [animate] = useState(() => !reducedMotion())
  const seen = useInView(ref, true).phase === 'in'

  return (
    <div data-screen-label="08 Counters" id="counters" ref={ref}>
      <Section tone="band">
        <div data-r="counters">
          {COUNTERS.map((c, i) =>
            seen ? (
              <StatCounter key={i} value={c[0]} label={c[1]} animate={animate} />
            ) : (
              <div key={i} className="az-stat">
                <span className="az-stat__val">0</span>
                <span className="az-stat__lbl">{c[1]}</span>
              </div>
            )
          )}
        </div>
      </Section>
    </div>
  )
}
