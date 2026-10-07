// Motion helpers shared by every animated section (ported from the design's renderVals).
export const reducedMotion = () =>
  !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)

// The design compresses every authored transition delay/duration so reveals feel snappier — more so on phones.
const K = () => (window.innerWidth <= 768 ? 0.3 : 0.45)

// "opacity .6s ease .3s" → same string with each seconds value scaled by K
export const sp = (t) => t.replace(/(\d*\.?\d+)s\b/g, (_, n) => +(n * K()).toFixed(3) + 's')

// deep-apply sp() to every `tr` (transition) string in an object/array tree
export const fx = (o) =>
  o == null
    ? o
    : Array.isArray(o)
      ? o.map(fx)
      : typeof o === 'object' && !o.$$typeof
        ? Object.fromEntries(
            Object.entries(o).map(([k, v]) => [k, k === 'tr' && typeof v === 'string' ? sp(v) : v && typeof v === 'object' ? fx(v) : v])
          )
        : o

export const K_SCALE = K
