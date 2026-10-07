import Section from '../ds/Section'
import TrustItem from '../ds/TrustItem'
import { TRUST } from '../data/site'

export default function TrustStrip() {
  return (
    <div data-screen-label="03 Trust strip" id="trust">
      <Section tone="trust">
        <div data-r="trust">
          <div data-r="trust-track">
            {TRUST.map((t) => (
              <TrustItem key={t.title} {...t} />
            ))}
            <div data-r="trust-dup" aria-hidden="true">
              {TRUST.map((t) => (
                <TrustItem key={t.title} {...t} />
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
