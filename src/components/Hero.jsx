import DSHero from '../ds/Hero'
import { HERO_IMG } from '../data/links'

const TAGLINE = 'Pakistan ka Bharosa · AZ Care.pk · 6 Years Experience'

export default function Hero({ onBook, onExplore, onProducts }) {
  return (
    <div data-screen-label="02 Hero" id="hero">
      <DSHero tagline={TAGLINE} bgImage={HERO_IMG} animate onBook={onBook} onExplore={onExplore} onProducts={onProducts} />
    </div>
  )
}
