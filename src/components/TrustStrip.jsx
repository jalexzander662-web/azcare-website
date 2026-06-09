const trustItems = [
  { img: '/LOGOS/Verified Staff.png', title: 'Verified Staff', sub: 'Background checked professionals' },
  { img: '/LOGOS/Eco-Friendly.png', title: 'Eco-Friendly', sub: 'Safe for kids & pets' },
  { img: '/LOGOS/Punctual.jpg', title: 'Punctual', sub: 'Always on time' },
  { img: '/LOGOS/Satisfaction Guarantee.jpg', title: 'Satisfaction Guarantee', sub: 'Free redo if not satisfied' },
  { img: '/LOGOS/No Hidden Charges.jpg', title: 'No Hidden Charges', sub: 'Transparent pricing' },
];

export default function TrustStrip() {
  return (
    <div className="trust-strip">
      <div className="trust-inner">
        {trustItems.map((item) => (
          <div className="titem rv" key={item.title}>
            <div className="titem-icon">
              <img src={item.img} alt={item.title} loading="lazy" decoding="async" />
            </div>
            <div className="titem-text">
              <strong>{item.title}</strong>
              <span>{item.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
