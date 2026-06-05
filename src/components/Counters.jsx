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

const counters = [
  { t: 10000, label: 'Cleaning Jobs Done' },
  { t: 5000, label: 'Happy Customers' },
  { t: 11, label: 'Services Offered' },
  { t: 6, label: 'Years Experience' },
];

export default function Counters() {
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !animated.current) {
          animated.current = true;
          ref.current?.querySelectorAll('[data-t]').forEach(el => {
            const t = parseInt(el.dataset.t);
            animCount(el, t, t >= 100 ? '+' : '');
          });
          obs.disconnect();
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -10px 0px' });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="counters-bg" ref={ref}>
      <div className="counters-grid rv">
        {counters.map((c) => (
          <div key={c.label}>
            <span className="cval" data-t={c.t}>0</span>
            <span className="clbl">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
