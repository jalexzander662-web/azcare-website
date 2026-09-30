import { useEffect, useRef } from 'react';

function animCount(el, target, suffix) {
  const dur = 2200;
  const step = (target / dur) * 16;
  let cur = 0;
  const t = setInterval(() => {
    cur += step;
    if (cur >= target) { cur = target; clearInterval(t); }
    el.textContent = (target >= 1000 ? Math.floor(cur).toLocaleString() : Math.floor(cur)) + suffix;
  }, 16);
}

export default function Hero({ onBookClick, onExploreProducts }) {
  const statsRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!statsRef.current) return;
      statsRef.current.querySelectorAll('[data-t]').forEach(el => {
        const t = parseInt(el.dataset.t);
        const suffix = t >= 100 ? '+' : '';
        animCount(el, t, suffix);
      });
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="hero-inner">
        <div className="hero-tagline-top">Pakistan ka Bharosa · AZ Care.pk · 6 Years Experience</div>
        <h1>
          <span className="line-main">PROFESSIONAL CLEANING</span>
          <span className="line-accent">SERVICES IN Pakistan</span>
        </h1>
        <div className="hero-subhead">Safai Aisi Jo Nazar Aaye</div>
        <div className="hero-trust-line">Pakistan Walon Ki Pehli Choice</div>
        <div className="hero-where-line">"Where Cleanliness Meets Perfection"</div>
        
        {/* Hero 3 Action Buttons */}
        <div className="hero-btns">
          <button className="btn-hero-primary" onClick={onBookClick}>
            BOOK YOUR SERVICE NOW
          </button>
          <a href="#services" className="btn-hero-secondary">
            Explore Services →
          </a>
          <button 
            className="btn-hero-secondary" 
            onClick={onExploreProducts}
            style={{ cursor: 'pointer' }}
          >
            Products →
          </button>
        </div>

        <div className="hero-stats" ref={statsRef}>
          <div className="hstat"><span className="hstat-num" data-t="10000">0</span><span className="hstat-lbl">Cleaning Jobs Done</span></div>
          <div className="hstat-div"></div>
          <div className="hstat"><span className="hstat-num" data-t="5000">0</span><span className="hstat-lbl">Happy Customers</span></div>
          <div className="hstat-div"></div>
          <div className="hstat"><span className="hstat-num" data-t="11">0</span><span className="hstat-lbl">Services Offered</span></div>
          <div className="hstat-div"></div>
          <div className="hstat"><span className="hstat-num" data-t="6">0</span><span className="hstat-lbl">Years Experience</span></div>
        </div>
      </div>
      <div className="scroll-hint"><div className="scroll-line"></div><span>Scroll</span></div>
    </section>
  );
}