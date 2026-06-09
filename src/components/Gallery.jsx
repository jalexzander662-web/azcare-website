import { useState, useEffect, useRef } from 'react';

const slides = [
  { img: '/Sofa befor & after.webp', label: 'Sofa Cleaning — Before & After' },
  { img: '/office before after.webp', label: 'Office Cleaning — Before & After' },
  { img: '/Mattres Befor & after.webp', label: 'Mattress Cleaning — Before & After' },
  { img: '/Car befor & after.webp', label: 'Car Cleaning — Before & After' },
];

export default function Gallery() {
  const [cur, setCur] = useState(0);
  const timerRef = useRef(null);

  const goTo = (idx) => setCur((idx + slides.length) % slides.length);

  useEffect(() => {
    timerRef.current = setInterval(() => setCur(c => (c + 1) % slides.length), 4000);
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div id="gallery">
      <div className="sec" style={{background:'#07111f'}}>
        <div className="sec-inner">
          <div className="sec-head rv">
            <div className="sec-tag">Our Work</div>
            <h2 className="sec-title">Real <em>Transformations</em></h2>
            <p className="sec-sub">See the incredible difference a professional AZ Care clean makes. Real results from Karachi homes.</p>
          </div>

          <div className="ba-slider-wrap rv">
            <div className="ba-slider-track" style={{transform:`translateX(-${cur * 100}%)`}}>
              {slides.map((s, i) => (
                <div className="ba-slide" key={i}>
                  <img src={s.img} alt={s.label} loading="lazy" decoding="async" />
                  <div className="ba-slide-label">{s.label}</div>
                </div>
              ))}
            </div>
            <button className="ba-btn ba-prev" onClick={() => goTo(cur - 1)}><i className="fa-solid fa-chevron-left"></i></button>
            <button className="ba-btn ba-next" onClick={() => goTo(cur + 1)}><i className="fa-solid fa-chevron-right"></i></button>
          </div>
          <div className="ba-dots">
            {slides.map((_, i) => (
              <button key={i} className={`ba-dot${i === cur ? ' active' : ''}`} onClick={() => goTo(i)}></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
