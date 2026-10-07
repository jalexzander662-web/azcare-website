// Props: { tab: "home"|"car"|"laundry", onTab: (id) => void, skipToken: number, onOpen: (service) => void, onBook: (serviceKey: string) => void }
import { useEffect, useRef, useState } from 'react'
import Section from '../ds/Section'
import PageTabs from '../ds/PageTabs'
import ServiceCard from '../ds/ServiceCard'
import ParticleTitle from './ParticleTitle'
import { SERVICES, TABS } from '../data/services'
import { SVC_TEXT } from '../data/site'
import { reducedMotion, sp } from '../lib/motion'

const WORDS = SVC_TEXT.split(' ')
const hidden = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }

const cardPrice = (p) => {
  if (!/\|/.test(p)) return p
  const n = p
    .split('|')
    .map((t) => +t.replace(/[^\d]/g, '') || 0)
    .filter(Boolean)
  return n.length ? 'From Rs. ' + Math.min(...n).toLocaleString('en-US') : p
}

// the design keeps its intro state for the page's lifetime; Services remounts when the shop is left, so remember it here
let introDone = false

export default function Services({ tab, onTab, skipToken, onOpen, onBook }) {
  const [reduced] = useState(reducedMotion)
  const [svc, setSvc] = useState(reduced || introDone ? 2 : 0) // 0 idle, 1 head in view, 2 settled
  const [svcSkip, setSvcSkip] = useState(reduced)
  const svcNow = useRef(svc)
  const timer = useRef(0)
  const headRef = useRef(null)

  const go = (n) => {
    svcNow.current = n
    setSvc(n)
    if (n === 2) introDone = true
  }
  const skip = () => {
    if (svcNow.current < 2) {
      clearTimeout(timer.current)
      go(2)
      setSvcSkip(true)
    }
  }

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting || svcNow.current) return
          go(1)
          timer.current = setTimeout(() => go(2), 0)
        }),
      { rootMargin: '0px 0px 12% 0px' }
    )
    io.observe(headRef.current)
    return () => {
      io.disconnect()
      clearTimeout(timer.current)
    }
  }, [])

  useEffect(() => {
    if (skipToken > 0) skip()
  }, [skipToken])

  const list = SERVICES[tab] || []

  return (
    <div data-screen-label="04 Our Services" id="services">
      <Section tone="services">
        <div className="az-sec-head az-sec-head--center" ref={headRef}>
          <div className="az-tag">What We Offer</div>
          <h2 className="az-sec-title" style={{ position: 'relative' }}>
            <span style={hidden}>Our Services</span>
            <ParticleTitle play={svc >= 1} reduced={reduced} />
          </h2>
          <p
            className="az-sec-sub"
            aria-label="Professional cleaning, car detailing, laundry and quality products — all under one roof in Karachi."
            style={{ maxWidth: 560 }}
          >
            {WORDS.map((w, i) => {
              const d = i * 0.025
              return (
                <span
                  key={i}
                  aria-hidden="true"
                  style={{
                    display: 'inline-block',
                    marginRight: '.28em',
                    filter: svc >= 1 ? 'blur(0px)' : 'blur(10px)',
                    opacity: svc >= 1 ? 1 : 0,
                    transform: svc >= 1 ? 'translateY(0)' : 'translateY(-14px)',
                    transition: svc >= 1 && !svcSkip ? sp(`filter .4s ease ${d}s, opacity .4s ease ${d}s, transform .4s ease ${d}s`) : 'none',
                  }}
                >
                  {w}
                </span>
              )
            })}
          </p>
        </div>
        <div
          style={{
            marginBottom: 'var(--head-gap)',
            opacity: 1,
            transform: 'none',
            pointerEvents: 'auto',
            transition: 'opacity .35s ease, transform .35s ease',
          }}
        >
          <PageTabs tabs={TABS} active={tab} onChange={onTab} />
        </div>
        <div style={{ opacity: 1, transition: 'opacity .25s ease' }}>
          <div data-r="grid" data-tab={tab}>
            {list.map((s) => (
              <ServiceCard
                key={s.key}
                img={s.cardImg}
                category={s.cat}
                name={s.name}
                price={cardPrice(s.price)}
                onClick={() => onOpen(s)}
                onBook={() => onBook(s.key)}
              />
            ))}
          </div>
        </div>
      </Section>
    </div>
  )
}
