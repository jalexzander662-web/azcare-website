import { useEffect, useRef } from 'react'

// Canvas particle text "OUR SERVICES": rebuilds on resize, scatters when `play` turns on, repels from the pointer,
// and the rAF loop sleeps once everything has settled. Faithful port of the design's PT class.
export default function ParticleTitle({ play, reduced }) {
  const wrapRef = useRef(null)
  const cvRef = useRef(null)
  const engine = useRef(null)
  const live = useRef({ play, reduced })
  live.current = { play, reduced }
  const prevPlay = useRef(play)

  useEffect(() => {
    const wrap = wrapRef.current
    const m = { x: -9999, y: -9999 }
    let parts = []
    let running = false
    let dead = false
    let raf = 0
    let w = 0
    let H = 0
    let dpr = 1
    let s = 2

    const tick = () => {
      const cv = cvRef.current
      if (!cv) {
        running = false
        return
      }
      const ctx = cv.getContext('2d')
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, H)
      const R = 60
      const R2 = R * R
      let moving = 0
      let col = ''
      for (const p of parts) {
        const dx = p.tx - p.x
        const dy = p.ty - p.y
        p.vx += dx * 0.045
        p.vy += dy * 0.045
        const mx = p.x - m.x
        const my = p.y - m.y
        const d2 = mx * mx + my * my
        if (d2 < R2) {
          const dd = Math.sqrt(d2) || 1
          const f = ((R - dd) / R) * 5
          p.vx += (mx / dd) * f
          p.vy += (my / dd) * f
        }
        p.vx *= 0.84
        p.vy *= 0.84
        p.x += p.vx
        p.y += p.vy
        if (Math.abs(p.vx) + Math.abs(p.vy) > 0.04 || Math.abs(dx) + Math.abs(dy) > 0.25) moving++
        if (p.c !== col) {
          col = p.c
          ctx.fillStyle = col
        }
        ctx.fillRect(p.x, p.y, s, s)
      }
      if (moving || m.x > -999) raf = requestAnimationFrame(tick)
      else running = false
    }

    const kick = () => {
      if (!running && !dead) {
        running = true
        raf = requestAnimationFrame(tick)
      }
    }

    const build = () => {
      const cv = cvRef.current
      if (!wrap || !cv) return
      const cw = wrap.clientWidth
      if (!cw) return
      const oc = document.createElement('canvas')
      const o = oc.getContext('2d')
      let fs = Math.round(Math.min(64, Math.max(34, window.innerWidth * 0.05)))
      const a = 'OUR '
      const b = 'SERVICES'
      o.font = '800 ' + fs + 'px Montserrat, sans-serif'
      let tw = o.measureText(a + b).width
      if (tw > cw * 0.94) {
        fs = Math.floor((fs * cw * 0.94) / tw)
        o.font = '800 ' + fs + 'px Montserrat, sans-serif'
        tw = o.measureText(a + b).width
      }
      const h = Math.round(fs * 1.2)
      const pad = Math.round(fs * 0.8)
      const ch = h + pad * 2
      oc.width = cw
      oc.height = ch
      o.font = '800 ' + fs + 'px Montserrat, sans-serif'
      o.textBaseline = 'middle'
      const x0 = (cw - tw) / 2
      const wa = o.measureText(a).width
      o.fillStyle = '#f0f6ff'
      o.fillText(a, x0, ch / 2)
      o.fillStyle = '#1e90ff'
      o.fillText(b, x0 + wa, ch / 2)
      const d = o.getImageData(0, 0, cw, ch).data
      const gap = 2
      const pts = []
      for (let y = 0; y < ch; y += gap)
        for (let x = 0; x < cw; x += gap) {
          const i = (y * cw + x) * 4
          if (d[i + 3] > 140) pts.push({ tx: x, ty: y, c: d[i + 2] > 240 && d[i] < 120 ? '#1e90ff' : '#f0f6ff' })
        }
      pts.sort((p, q) => (p.c < q.c ? -1 : 1))
      const old = parts
      parts = pts.map((p, i) => {
        const q = old[i]
        return { ...p, x: q ? q.x : p.tx, y: q ? q.y : p.ty, vx: 0, vy: 0 }
      })
      dpr = Math.min(2, window.devicePixelRatio || 1)
      cv.width = cw * dpr
      cv.height = ch * dpr
      cv.style.width = cw + 'px'
      cv.style.height = ch + 'px'
      cv.style.margin = -pad + 'px 0'
      w = cw
      H = ch
      s = gap * 0.95
      kick()
    }

    const scatter = () => {
      if (live.current.reduced || !parts.length) return
      for (const p of parts) {
        p.x = Math.random() * w
        p.y = Math.random() * H
        p.vx = (Math.random() - 0.5) * 8
        p.vy = (Math.random() - 0.5) * 8
      }
      kick()
    }

    engine.current = {
      scatter,
      move: (e) => {
        const r = cvRef.current.getBoundingClientRect()
        m.x = e.clientX - r.left
        m.y = e.clientY - r.top
        kick()
      },
      leave: () => {
        m.x = -9999
        m.y = -9999
        kick()
      },
    }

    const ro = new ResizeObserver(build)
    ro.observe(wrap)
    const f = document.fonts && document.fonts.load ? document.fonts.load('800 48px Montserrat') : Promise.resolve()
    f.then(
      () => {
        if (dead) return
        build()
        if (live.current.play) scatter()
      },
      () => !dead && build()
    )

    return () => {
      dead = true
      ro.disconnect()
      cancelAnimationFrame(raf)
      engine.current = null
    }
  }, [])

  useEffect(() => {
    if (play && !prevPlay.current && engine.current) engine.current.scatter()
    prevPlay.current = play
  }, [play])

  return (
    <div ref={wrapRef} aria-hidden="true" style={{ width: '100%', position: 'relative' }}>
      <canvas
        ref={cvRef}
        onPointerMove={(e) => engine.current && engine.current.move(e)}
        onPointerLeave={() => engine.current && engine.current.leave()}
        onPointerCancel={() => engine.current && engine.current.leave()}
        style={{ display: 'block', touchAction: 'pan-y pinch-zoom' }}
      />
    </div>
  )
}
