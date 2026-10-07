import Section from '../ds/Section'
import ProductCard from './ProductCard'
import { WA_URL } from '../data/links'

const msg = { gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', fontFamily: 'var(--font-body)', fontSize: '.95rem', lineHeight: 1.6, color: 'var(--gray)' }

export default function Shop({ products, state, onOpen, onAdd, onHome }) {
  return (
    <div data-screen-label="12 Products Page" id="shop" style={{ paddingTop: '3rem' }}>
      <Section tone="services">
        <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontFamily: 'var(--font-sub)', fontSize: '.8rem', color: 'var(--gray)', marginBottom: '1.5rem' }}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onHome()
            }}
            style={{ color: 'var(--acc3)', minHeight: '44px', display: 'inline-flex', alignItems: 'center' }}
          >
            Home
          </a>
          <span aria-hidden="true">›</span>
          <span style={{ color: 'var(--white)' }}>Products</span>
        </nav>
        <div className="az-sec-head az-sec-head--center">
          <div className="az-tag">AZ Care Shop</div>
          <h1 className="az-sec-title" style={{ margin: 0 }}>
            Shop <em>Products</em>
          </h1>
          <p className="az-sec-sub" style={{ maxWidth: '560px' }}>
            Wohi professional cleaning products jo hamari team use karti hai — ab aap ke ghar ke liye. Order cart se ya WhatsApp par.
          </p>
        </div>
        <div data-r="grid">
          {state === 'loading' && (
            <div role="status" style={msg}>
              Products load ho rahe hain…
            </div>
          )}
          {state === 'error' && (
            <div role="alert" style={msg}>
              Products abhi load nahi ho sake. Please dobara try karein ya WhatsApp par order karein:{' '}
              <a href={WA_URL} target="_blank" rel="noopener" style={{ color: 'var(--acc3)', textDecoration: 'underline' }}>
                WhatsApp 0322-2468123
              </a>
            </div>
          )}
          {state === 'ready' && products.length === 0 && <div style={msg}>Abhi koi product available nahi hai. Order ke liye WhatsApp par rabta karein.</div>}
          {state === 'ready' && products.map((p) => <ProductCard key={p.key} product={p} onOpen={onOpen} onAdd={onAdd} />)}
        </div>
      </Section>
    </div>
  )
}
