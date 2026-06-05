export default function DetailModal({ open, onClose, service, brand }) {
  if (!open || !service) return null;

  return (
    <div className="detail-modal open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="detail-box">
        <button className="detail-close" onClick={onClose}>✕</button>
        <div className="detail-grid">
          <div className="detail-img-col">
            <img src={service.img} alt={service.name} />
          </div>
          <div className="detail-info-col">
            <div className="detail-brand">{brand || 'AZ Care.pk — Professional Services'}</div>
            <h2 className="detail-title">{service.name}</h2>
            <div className="detail-rating">★★★★★ <span>4.9 / 5.0 &nbsp;|&nbsp; 500+ Bookings</span></div>
            <div className="detail-badge">Limited Time Offer</div>
            <div className="detail-price-wrap">
              <div className="detail-price-label">Service Price</div>
              <div className="detail-price">{service.price}</div>
              <div className="detail-price-note">Price may vary by vehicle size. Free quote available on WhatsApp.</div>
              <div className="detail-avail">✔ Available in Karachi &nbsp;—&nbsp; Same Day Booking</div>
            </div>
            <a href={`https://wa.me/923222468123?text=${service.wa}`} target="_blank" rel="noreferrer" className="detail-book-btn">
              BOOK NOW via WhatsApp
            </a>
            <div className="detail-hr"></div>
            <div className="detail-about">
              <h4>About this Service</h4>
              <ul>
                {service.about?.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
