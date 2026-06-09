import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    const observe = () => {
      document.querySelectorAll('.rv, .rvl, .rvr').forEach(el => obs.observe(el));
    };
    observe();
    // The count-up animations rewrite textContent every ~16ms, which fires a flood
    // of childList mutations. Coalesce them into at most one re-scan per frame so we
    // don't thrash the main thread re-querying the whole document hundreds of times.
    let scheduled = false;
    const mo = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; observe(); });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { obs.disconnect(); mo.disconnect(); };
  }, []);
}
