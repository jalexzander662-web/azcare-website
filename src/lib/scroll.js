// Smooth in-page navigation. Sections mount/unmount with the page, so every helper polls for its target.
const HEADER = 70

// jump to #id (retrying for up to ~2s while the section mounts), then settle with a smooth scroll
export function scrollToId(id) {
  let n = 0
  const go = () => {
    const el = document.getElementById(id)
    if (!el) {
      if (n++ < 40) setTimeout(go, 50)
      return
    }
    const y = () => el.getBoundingClientRect().top + window.scrollY - HEADER
    window.scrollTo({ top: y(), behavior: 'auto' })
    setTimeout(() => window.scrollTo({ top: y(), behavior: 'smooth' }), 120)
  }
  setTimeout(go, 60)
}

const cardByName = (name) =>
  [...document.querySelectorAll('[data-r="grid"] .az-srv')].find((c) => {
    const t = c.querySelector('.az-srv__title')
    return t && t.textContent.trim().toLowerCase() === name
  })

// centre a service card in the viewport and flash a ring around it (footer links → service)
export function revealService(name) {
  const go = (n) => {
    const el = cardByName(name)
    if (!el) return n < 20 ? setTimeout(() => go(n + 1), 60) : scrollToId('services')
    const y = () => el.getBoundingClientRect().top + window.scrollY - Math.max(90, (window.innerHeight - el.offsetHeight) / 2)
    window.scrollTo({ top: y(), behavior: 'auto' })
    setTimeout(() => window.scrollTo({ top: y(), behavior: 'auto' }), 150)
    el.style.transition = 'box-shadow .3s ease, border-color .3s ease'
    el.style.boxShadow = '0 0 0 3px #1e90ff, 0 0 32px rgba(30,144,255,.7)'
    el.style.borderColor = '#1e90ff'
    setTimeout(() => {
      el.style.boxShadow = ''
      el.style.borderColor = ''
    }, 2200)
  }
  setTimeout(() => go(0), 120)
}
