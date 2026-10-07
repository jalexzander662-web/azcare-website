import { rs, waLink } from '../lib/products'

// object-fit: cover for roughly-square or wide images, contain for tall ones (the design's fillProdBg)
const fit = (img) => {
  if (img && img.naturalWidth) img.style.setProperty('object-fit', img.naturalWidth / img.naturalHeight >= 0.9 ? 'cover' : 'contain', 'important')
}

export const pbg = (image) => (image ? `url(${JSON.stringify(image)})` : undefined)

export function FitImg(props) {
  return <img ref={fit} onLoad={(e) => fit(e.currentTarget)} {...props} />
}

export default function ProductCard({ product: p, onOpen, onAdd }) {
  const priced = p.price !== null
  return (
    <div data-r="pwrap">
      <div
        className="az-prod"
        style={{ height: '100%', cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        onClick={() => onOpen(p)}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
            e.preventDefault()
            onOpen(p)
          }
        }}
        aria-label={p.name + ' — details'}
      >
        <div className="az-prod__img" style={{ '--pbg': pbg(p.image) }}>
          <FitImg src={p.image || undefined} alt={p.name} loading="lazy" />
        </div>
        <div className="az-prod__body">
          <div className="az-prod__name">{p.name}</div>
          {p.size && (
            <div style={{ fontFamily: 'var(--font-sub)', fontSize: '.74rem', fontWeight: 600, letterSpacing: '.6px', textTransform: 'uppercase', color: 'var(--acc3)', margin: '-.1rem 0 .4rem' }}>{p.size}</div>
          )}
          <div className="az-prod__price">{priced ? rs(p.price) : 'Price on WhatsApp'}</div>
          {priced ? (
            <button
              type="button"
              className="az-btn az-btn--primary az-btn--xs"
              style={{ width: '100%' }}
              onClick={(e) => {
                e.stopPropagation()
                onAdd(p)
              }}
            >
              <i className="fa-solid fa-cart-shopping"></i> ADD TO CART
            </button>
          ) : (
            <a
              className="az-btn az-btn--secondary az-btn--xs"
              href={waLink(p.name + ' order karna hai')}
              target="_blank"
              rel="noopener"
              style={{ width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem' }}
              onClick={(e) => e.stopPropagation()}
            >
              <i className="fa-brands fa-whatsapp"></i> ORDER via WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
