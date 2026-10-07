import { useEffect, useRef } from 'react'

// Fixed 3px reading-progress bar with a glowing head.
export default function ScrollProgress() {
  const bar = useRef(null)
  const head = useRef(null)

  useEffect(() => {
    let raf = 0
    const upd = () => {
      const b = bar.current
      const hd = head.current
      if (!b) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      b.style.transform = `scaleX(${p})`
      if (hd) {
        hd.style.left = p * 100 + '%'
        hd.style.opacity = p > 0.002 && p < 0.998 ? '1' : '0'
      }
    }
    const chk = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(upd)
    }
    window.addEventListener('scroll', chk, { passive: true })
    window.addEventListener('resize', chk)
    const iv = setInterval(upd, 500)
    chk()
    return () => {
      cancelAnimationFrame(raf)
      clearInterval(iv)
      window.removeEventListener('scroll', chk)
      window.removeEventListener('resize', chk)
    }
  }, [])

  return (
    <div data-r="scroll-progress" aria-hidden="true" style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 400, pointerEvents: 'none', background: 'rgba(30,144,255,.1)' }}>
      <div ref={bar} style={{ position: 'absolute', inset: 0, transformOrigin: 'left center', transform: 'scaleX(0)', background: 'linear-gradient(90deg,var(--acc2),var(--acc) 45%,var(--acc3))', boxShadow: '0 0 10px rgba(30,144,255,.55)' }} />
      <div ref={head} style={{ position: 'absolute', top: -2, left: 0, width: 7, height: 7, marginLeft: -3.5, borderRadius: '50%', background: '#fff', boxShadow: '0 0 6px 2px rgba(0,196,255,.9),0 0 16px rgba(0,196,255,.6)', opacity: 0, transition: 'opacity .25s' }} />
    </div>
  )
}
