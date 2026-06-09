import { reviews } from '../data/reviews';

export default function Reviews() {
  return (
    <div id="reviews" className="reviews-bg">
      <div className="sec">
        <div className="sec-inner">
          <div className="sec-head center rv">
            <div className="sec-tag">Customer Reviews</div>
            <h2 className="sec-title">What <em>Karachi</em> Says</h2>
            <p className="sec-sub">Real reviews from real customers — 5,000+ satisfied families across Karachi trust AZ Care.pk</p>
          </div>
          <div className="rev-grid">
            {reviews.map((r) => (
              <div key={r.name} className="rev-card rv">
                <div className="stars">★★★★★</div>
                <p className="rev-text">{r.text}</p>
                <div className="rev-author">
                  <div className="rev-av"><img src={r.img} alt={r.name} loading="lazy" decoding="async" /></div>
                  <div>
                    <div className="rev-name">{r.name}</div>
                    <div className="rev-loc">{r.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
