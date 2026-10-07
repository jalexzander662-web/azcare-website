// Props: {}
import { useEffect, useState } from 'react'
import { reducedMotion } from '../lib/motion'

export default function BackToTop() {
  const [on, setOn] = useState(false)

  useEffect(() => {
    const onScroll = () => setOn(window.scrollY > 300)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goTop = () => window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' })

  return (
    <button type="button" data-r="totop" data-on={on ? '1' : '0'} onClick={goTop} aria-label="Back to top" title="Back to top">
      <i className="fa-solid fa-arrow-up" />
    </button>
  )
}
