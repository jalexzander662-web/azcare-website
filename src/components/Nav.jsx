import { useEffect, useState } from 'react';

export default function Nav({
  onBookClick,
  onPageNav,
  cartItems = [],
  onRemoveFromCart,
  onUpdateQuantity,
  onProceedToCheckout
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleNavLink = (page) => {
    setMenuOpen(false);
    if (page) {
      onPageNav(page);
      setTimeout(() => {
        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1), 0);

  return (
    <>
      <nav id="mainNav" className={scrolled ? 'scrolled' : ''}>
        <a className="logo-wrap" href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); }} aria-label="Go to home">
          <img src="/AZ CARE Website Logo.webp" alt="AZ Care.pk Logo" className="logo-img" style={{height:'52px'}} />
        </a>

        <ul className="nav-links">
          <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavLink('cleaning'); }}>Cleaning</a></li>
          <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavLink('car'); }}>Car Detailing</a></li>
          <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavLink('products'); }}>Products</a></li>
          <li><a href="#process">Process</a></li>
          <li><a href="#reviews">Reviews</a></li>
          <li><a href="#why">FAQ</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        {/* Navigation Right Section (Book Now + Cart + Phone) */}
        <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a href="tel:03222468123" className="btn-call"><i className="fa-solid fa-phone"></i> 0322-2468123</a>
          
          <button className="btn-book" onClick={onBookClick}>Book Now</button>

          {/* Cart Icon Button */}
          <button
            className="nav-cart-btn"
            onClick={() => setCartOpen(true)}
            aria-label="Open Cart"
          >
            <span style={{ fontSize: '1.05rem' }}>🛒</span>
            <span className="cart-text">Cart</span>
            
            {totalCartCount > 0 && (
              <span className="cart-badge">{totalCartCount}</span>
            )}
          </button>
        </div>

        <div className="hamburger" onClick={() => setMenuOpen(true)}>
          <span></span><span></span><span></span>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <button className="mob-close" onClick={() => setMenuOpen(false)}>✕</button>
        <a href="#services" onClick={() => handleNavLink('cleaning')}>Cleaning</a>
        <a href="#services" onClick={() => handleNavLink('car')}>Car Detailing</a>
        <a href="#services" onClick={() => handleNavLink('products')}>Products</a>
        <a href="#process" onClick={() => setMenuOpen(false)}>Process</a>
        <a href="#reviews" onClick={() => setMenuOpen(false)}>Reviews</a>
        <a href="#why" onClick={() => setMenuOpen(false)}>FAQ</a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        <a href="https://wa.me/923222468123" target="_blank" rel="noreferrer" style={{color:'var(--acc3)'}}>💬 WhatsApp Us</a>
      </div>

      {/* Cart Drawer Backdrop */}
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(3px)',
            zIndex: 998,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* Sliding Cart Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: cartOpen ? 0 : '-400px',
          width: '100%',
          maxWidth: '380px',
          height: '100vh',
          backgroundColor: '#0b1e3d',
          color: '#ffffff',
          boxShadow: '-6px 0 25px rgba(0,0,0,0.4)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          transition: 'right 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          fontFamily: 'inherit'
        }}
      >
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center'
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>
            Your Cart ({totalCartCount})
          </h3>
          <button
            onClick={() => setCartOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              fontSize: '1rem',
              cursor: 'pointer',
              color: '#ffffff'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '60px', color: '#7a90b5' }}>
              <p style={{ fontSize: '2.5rem', margin: '0 0 10px 0' }}>🛒</p>
              <p style={{ margin: 0, fontWeight: '500' }}>Your cart is currently empty.</p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={item.id || index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  paddingBottom: '15px',
                  marginBottom: '15px',
                  borderBottom: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name || item.title}
                    style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: '600' }}>
                    {item.name || item.title}
                  </h4>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#00c4ff', fontWeight: '500' }}>
                    Rs. {item.price}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                      style={{
                        width: '26px',
                        height: '26px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.08)',
                        color: '#fff',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{item.quantity || 1}</span>
                    <button
                      onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                      style={{
                        width: '26px',
                        height: '26px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.08)',
                        color: '#fff',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveFromCart && onRemoveFromCart(item.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
            <div
              style={{
                display: 'flex',
                justify: 'space-between',
                fontSize: '1.1rem',
                fontWeight: '700',
                marginBottom: '15px'
              }}
            >
              <span>Total Amount:</span>
              <span style={{ color: '#00c4ff' }}>Rs. {totalPrice}</span>
            </div>
            <button
              onClick={() => {
                setCartOpen(false);
                if (onProceedToCheckout) onProceedToCheckout();
              }}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #1e90ff 0%, #0066cc 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(30, 144, 255, 0.3)',
                transition: 'opacity 0.2s ease'
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}