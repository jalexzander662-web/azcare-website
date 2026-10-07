// Props: { service: object, onClose: () => void, onBook: () => void }  (App owns Escape + scroll lock)
export default function ServiceDetail({ service, onClose, onBook }) {
  const car = service.cat === 'Car Detailing'
  return (
    <div className="az-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="az-detail" role="dialog" aria-modal="true" aria-label={service.name}>
        <button type="button" className="az-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <button type="button" data-r="mclose" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="az-detail__grid">
          <div className="az-detail__img" data-svc="1" style={{ '--pbg': 'url(' + service.img + ')' }}>
            <img src={service.img} alt={service.name} />
          </div>
          <div className="az-detail__info">
            <div className="az-detail__brand">{'AZ Care.pk — Professional ' + service.cat}</div>
            <h2 className="az-detail__title">{service.name}</h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '.92rem',
                lineHeight: 1.65,
                color: 'var(--text-soft)',
                margin: '.25rem 0 .75rem',
                textWrap: 'pretty',
              }}
            >
              {service.desc}
            </p>
            <div className="az-detail__rating">
              ★★★★★ <span>4.9 / 5.0 &nbsp;|&nbsp; 500+ Bookings</span>
            </div>
            <span className="az-tag az-tag--red">Limited Time Offer</span>
            <div className="az-detail__price">
              <small>Service Price</small>
              <strong>{service.price}</strong>
              <p>
                {car
                  ? 'Price may vary by vehicle size. Quantity select karein — total form mein khud calculate hoga.'
                  : 'Quantity / size select karein — total price booking form mein khud calculate hogi.'}
              </p>
              <div className="ok">✔ Available in Karachi &nbsp;—&nbsp; Same Day Booking</div>
            </div>
            <button type="button" className="az-btn az-btn--solid az-btn--block" onClick={onBook} style={{ minHeight: 48, cursor: 'pointer' }}>
              BOOK NOW →
            </button>
            <hr />
            <h4>About this Service</h4>
            <ul>
              {(service.about || []).map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
