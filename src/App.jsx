import { useCallback, useEffect, useRef, useState } from 'react'
import CartDrawer from './ds/CartDrawer'
import WAFloat from './ds/WAFloat'
import Preloader from './components/Preloader'
import ScrollProgress from './components/ScrollProgress'
import Topbar from './components/Topbar'
import Nav from './components/Nav'
import Hero from './components/Hero'
import TrustStrip from './components/TrustStrip'
import Services from './components/Services'
import ServiceDetail from './components/ServiceDetail'
import Shop from './components/Shop'
import ProductDetail from './components/ProductDetail'
import Gallery from './components/Gallery'
import Process from './components/Process'
import Faq from './components/Faq'
import Counters from './components/Counters'
import Reviews from './components/Reviews'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import BookingModal from './components/BookingModal'
import OrderSheet from './components/OrderSheet'
import { CATALOG, SERVICES } from './data/services'
import { fetchProducts, postBooking, postOrder } from './lib/sheet'
import { normalizeProducts } from './lib/products'
import { buildOrder, newOrderId, subtotal } from './lib/order'
import { track } from './lib/pixels'
import { reducedMotion } from './lib/motion'
import { revealService, scrollToId } from './lib/scroll'

const pageFromHash = () => (window.location.hash === '#products' ? 'products' : 'home')

export default function App() {
  const [page, setPage] = useState(pageFromHash)
  const [tab, setTab] = useState('home') // services tab: home | car | laundry
  const [svcSkip, setSvcSkip] = useState(0) // bump → Services shows its intro animation in its final state
  const [cart, setCart] = useState([]) // {id (=product key), name, image, price, quantity}
  const [cartOpen, setCartOpen] = useState(false) // DS drawer (only reachable while the cart is empty)
  const [order, setOrder] = useState(null) // null | 'form' | 'sent'
  const [book, setBook] = useState(null) // null = closed, '' = open, 'key' = open with that service
  const [detail, setDetail] = useState(null) // service shown in ServiceDetail
  const [pdetail, setPdetail] = useState(null) // product shown in ProductDetail
  const [products, setProducts] = useState([])
  const [productsState, setProductsState] = useState('loading') // loading | ready | error
  const [preDone, setPreDone] = useState(false)
  const [reduced] = useState(reducedMotion) // read once, like the design

  // handlers that re-enter themselves via setTimeout must see current state, not their render's closure
  const pageRef = useRef(page)
  pageRef.current = page
  const onLinkRef = useRef()

  useEffect(() => {
    fetchProducts()
      .then((rows) => {
        setProducts(normalizeProducts(rows))
        setProductsState('ready')
      })
      .catch((err) => {
        console.error('Failed to load products:', err)
        setProductsState('error')
      })
  }, [])

  // hash routing: `#products` is the shop, anything else is home
  useEffect(() => {
    const onHash = () => {
      const p = pageFromHash()
      if (p !== pageRef.current) {
        setPage(p)
        window.scrollTo(0, 0)
      }
    }
    window.addEventListener('popstate', onHash)
    window.addEventListener('hashchange', onHash)
    return () => {
      window.removeEventListener('popstate', onHash)
      window.removeEventListener('hashchange', onHash)
    }
  }, [])

  // every overlay locks page scroll; Escape closes the top-most one
  const overlay = order !== null || pdetail || book !== null || detail || cartOpen
  useEffect(() => {
    if (!overlay) return
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [overlay])
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (order) setOrder(null)
      else if (cartOpen) setCartOpen(false)
      else if (pdetail) setPdetail(null)
      else if (book !== null) setBook(null)
      else if (detail) setDetail(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [order, cartOpen, pdetail, book, detail])

  const goPage = useCallback((next, keepScroll) => {
    if (pageRef.current !== next) {
      try {
        history.pushState(null, '', next === 'products' ? '#products' : window.location.pathname + window.location.search)
      } catch (_) {}
    }
    setPage(next)
    setCartOpen(false)
    if (!keepScroll) window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const skipSvc = () => setSvcSkip((n) => n + 1)

  // after switching back to home, wait for the sections to mount before acting
  const whenHome = (fn) => {
    if (pageRef.current !== 'home') {
      goPage('home', true)
      setTimeout(fn, 120)
    } else fn()
  }

  const onLink = (label) => {
    if (!['Process', 'Reviews', 'FAQ', 'Contact', 'Home'].includes(label)) skipSvc()
    if (label === 'Products') return goPage('products')
    if (pageRef.current !== 'home') {
      goPage('home', true)
      return setTimeout(() => onLinkRef.current(label), 80)
    }
    if (label === 'Services') return scrollToId('services')
    const t = { 'HOME SERVICES': 'home', 'CAR DETAILING': 'car', LAUNDRY: 'laundry' }[label]
    if (t) {
      setTab(t)
      return scrollToId('services')
    }
    const id = { Process: 'process', Reviews: 'reviews', FAQ: 'faq', Contact: 'contact' }[label]
    if (id) return scrollToId(id)
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }
  onLinkRef.current = onLink

  // footer "Our Services" links: pick the tab, then scroll to + flash the matching card
  const onServiceLink = (label) => {
    const nm = label.trim().toLowerCase()
    let t = nm === 'car detailing' ? 'car' : nm === 'laundry' ? 'laundry' : null
    let card = null
    if (!t)
      for (const k of ['home', 'car', 'laundry'])
        if (SERVICES[k].some((x) => x.name.toLowerCase() === nm)) {
          t = k
          card = nm
          break
        }
    if (!t) return
    whenHome(() => {
      skipSvc()
      setTab(t)
      setDetail(null)
      if (card) revealService(card)
      else scrollToId('services')
    })
  }
  const onSectionLink = (id) => whenHome(() => scrollToId(id))

  // ---- cart ----
  const addToCart = (p) => {
    if (!p.price) return // "Price on WhatsApp" products never enter the cart
    setCart((c) =>
      c.some((i) => i.id === p.key)
        ? c.map((i) => (i.id === p.key ? { ...i, quantity: i.quantity + 1 } : i))
        : [...c, { id: p.key, name: p.name, image: p.image, price: p.price, quantity: 1 }]
    )
    setCartOpen(false)
    setOrder('form')
    track('AddToCart', { content_type: 'product', content_name: p.name, value: p.price })
  }
  const setQty = (id, n) =>
    setCart((c) => (n <= 0 ? c.filter((i) => i.id !== id) : c.map((i) => (i.id === id ? { ...i, quantity: n } : i))))

  const cartCount = cart.reduce((a, i) => a + i.quantity, 0)
  const openCart = () => (cart.length ? setOrder('form') : setCartOpen(true))
  const checkout = () => {
    setCartOpen(false)
    setOrder(cart.length ? 'form' : null)
  }

  // ---- submissions (both resolve on success and throw on a network failure; the forms show the error) ----
  const submitBook = async (data) => {
    await postBooking({
      name: data.name,
      phone: data.phone,
      service: data.service,
      area: data.area || '',
      preferred_time: data.preferred_time || '',
      message: data.message || '',
    })
    track('Lead', { content_name: data.service })
  }
  const submitOrder = async (form) => {
    const payload = buildOrder(cart, form, newOrderId())
    await postOrder(payload)
    track('Purchase', { content_type: 'product', content_name: payload.items, value: payload.totalPrice })
    setCart([])
    setOrder('sent')
  }

  const orderOpen = order === 'sent' || (order === 'form' && cart.length > 0)
  const home = page === 'home'

  return (
    <div
      data-page-root="1"
      style={{ '--topbar-h': '36px', background: 'var(--dark)', color: 'var(--white)', fontFamily: 'var(--font-body)', overflowX: 'clip', position: 'relative' }}
    >
      {!reduced && !preDone && <Preloader seconds={1.2 * (window.innerWidth <= 768 ? 0.85 : 1)} onDone={() => setPreDone(true)} />}
      <ScrollProgress />

      <div data-screen-label="01 Topbar + Nav" id="top" style={{ position: 'relative', zIndex: 'auto' }}>
        <Topbar />
        <Nav cartCount={cartCount} onBook={() => setBook('')} onCart={openCart} onLink={onLink} />
      </div>

      {home && (
        <>
          <Hero onBook={() => setBook('')} onExplore={() => { skipSvc(); scrollToId('services') }} onProducts={() => onLink('Products')} />
          <TrustStrip />
          <Services tab={tab} onTab={setTab} skipToken={svcSkip} onOpen={setDetail} onBook={setBook} />
          <Gallery />
          <Process />
          <Faq />
          <Counters />
          <Reviews />
          <Contact catalog={CATALOG} onSubmit={submitBook} />
        </>
      )}
      {!home && (
        <Shop products={products} state={productsState} onOpen={setPdetail} onAdd={addToCart} onHome={() => goPage('home')} />
      )}

      <Footer onServiceLink={onServiceLink} onSectionLink={onSectionLink} />

      <BackToTop />
      <WAFloat />

      {book !== null && <BookingModal selected={book} catalog={CATALOG} onSubmit={submitBook} onClose={() => setBook(null)} />}
      {orderOpen && (
        <OrderSheet
          cart={cart}
          sent={order === 'sent'}
          subtotal={subtotal(cart)}
          onQty={setQty}
          onRemove={(id) => setQty(id, 0)}
          onClose={() => setOrder(null)}
          onSubmit={submitOrder}
        />
      )}
      {pdetail && (
        <ProductDetail
          product={pdetail}
          onClose={() => setPdetail(null)}
          onAdd={() => {
            const p = pdetail
            setPdetail(null)
            addToCart(p)
          }}
        />
      )}
      {detail && (
        <ServiceDetail
          service={detail}
          onClose={() => setDetail(null)}
          onBook={() => {
            setBook(detail.key)
            setDetail(null)
          }}
        />
      )}
      <CartDrawer open={cartOpen} items={cart} onClose={() => setCartOpen(false)} onQty={setQty} onRemove={(id) => setQty(id, 0)} onCheckout={checkout} />
    </div>
  )
}
