import { useEffect, useState } from 'react';

export default function Nav({ onBookClick, onPageNav }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
        <div className="nav-right">
          <a href="tel:03222468123" className="btn-call"><i className="fa-solid fa-phone"></i> 0322-2468123</a>
          <button className="btn-book" onClick={onBookClick}>Book Now</button>
        </div>
        <div className="hamburger" onClick={() => setMenuOpen(true)}>
          <span></span><span></span><span></span>
        </div>
      </nav>

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
    </>
  );
}
