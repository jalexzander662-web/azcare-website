import { FitImg, pbg } from './ProductCard'
import { rs, waLink } from '../lib/products'

export default function ProductDetail({ product: p, onClose, onAdd }) {
  const priced = p.price !== null
  return (
    <div
      className="az-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="az-detail" role="dialog" aria-modal="true" aria-label={p.name}>
        <button type="button" className="az-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <button type="button" data-r="mclose" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="az-detail__grid">
          <div
            className="az-detail__img az-prod__img"
            style={{ '--pbg': pbg(p.image), minHeight: '360px', height: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <FitImg src={p.image || undefined} alt={p.name} style={{ width: '100%', height: '100%', maxHeight: '520px', objectFit: 'contain', objectPosition: 'center' }} />
          </div>
          <div className="az-detail__info">
            <div className="az-detail__brand">AZ Care.pk — Shop</div>
            <h2 className="az-detail__title">{p.name}</h2>
            {p.size && (
              <div style={{ fontFamily: 'var(--font-sub)', fontSize: '.8rem', fontWeight: 600, letterSpacing: '.6px', textTransform: 'uppercase', color: 'var(--acc3)' }}>{p.size}</div>
            )}
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '.92rem', lineHeight: 1.65, color: 'var(--text-soft)', margin: '.25rem 0 .75rem', textWrap: 'pretty' }}>{p.desc}</p>
            <div className="az-detail__rating">
              ★★★★★ <span>4.9 / 5.0 &nbsp;|&nbsp; Verified Quality</span>
            </div>
            <div className="az-detail__price">
              <small>Price</small>
              <strong>{priced ? rs(p.price) : 'Price on WhatsApp'}</strong>
              <p>{priced ? 'Cart mein add karein ya WhatsApp par order karein.' : 'Price ke liye WhatsApp par order karein.'}</p>
              <div className="ok">✔ Delivery in Karachi &nbsp;—&nbsp; Eco-friendly &amp; Safe</div>
            </div>
            {priced && (
              <button type="button" className="az-btn az-btn--solid az-btn--block" onClick={onAdd} style={{ minHeight: '48px', cursor: 'pointer' }}>
                <i className="fa-solid fa-cart-shopping"></i> ADD TO CART
              </button>
            )}
            <a
              className="az-btn az-btn--secondary az-btn--block"
              href={waLink(p.name + ' order karna hai')}
              target="_blank"
              rel="noopener"
              style={{ minHeight: '48px', marginTop: '.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem' }}
            >
              <i className="fa-brands fa-whatsapp"></i> ORDER via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
