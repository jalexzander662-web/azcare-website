import { useState } from 'react';

export default function ProductsPage({ products, loadingProducts, onAddToCart, onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = ['All', 'Featured', 'Best Seller'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleBuyNow = (product) => {
    const message = encodeURIComponent(`Hello AZ Care.pk, I want to buy this product:\n\n*${product.name}*\nPrice: Rs. ${product.price}\n\nPlease guide me on delivery.`);
    window.open(`https://wa.me/923222468123?text=${message}`, '_blank');
  };

  return (
    <div className="prod-page-wrapper">
      <style>{`
        .prod-page-wrapper {
          min-height: 100vh;
          background: radial-gradient(circle at top, #0d1d38 0%, #050b14 70%);
          color: #fff;
          padding: 40px 20px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .prod-container {
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        /* Grid System: 2 items per row on Mobile, scalable on Desktop */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        @media (min-width: 640px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 22px;
          }
        }

        @media (min-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
            gap: 26px;
          }
        }

        /* Mobile specific aesthetic tuning */
        @media (max-width: 640px) {
          .prod-page-wrapper {
            padding: 16px 10px;
          }
          
          .prod-card-body {
            padding: 14px 12px !important;
          }

          .prod-card-title {
            font-size: 0.95rem !important;
          }

          .prod-card-desc {
            font-size: 0.78rem !important;
            margin-bottom: 12px !important;
          }

          .prod-card-price {
            font-size: 1.05rem !important;
          }

          .prod-card-btn {
            padding: 7px 12px !important;
            font-size: 0.78rem !important;
          }

          .prod-img-box {
            height: 160px !important;
            padding: 10px !important;
          }

          .modal-content-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          
          .modal-img-box {
            min-height: 240px !important;
          }
        }

        /* Smooth Card Hover Glow */
        .prod-item-card {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .prod-item-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 196, 255, 0.15);
          border-color: rgba(0, 196, 255, 0.4) !important;
        }

        /* Custom Scrollbar for Modal */
        .modal-scroll-area::-webkit-scrollbar {
          width: 6px;
        }
        .modal-scroll-area::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .modal-scroll-area::-webkit-scrollbar-thumb {
          background: rgba(0, 196, 255, 0.3);
          border-radius: 4px;
        }
      `}</style>

      <div className="prod-container">
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '24px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'linear-gradient(135deg, rgba(0, 196, 255, 0.15), rgba(30, 144, 255, 0.05))', color: '#00c4ff', border: '1px solid rgba(0, 196, 255, 0.25)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
              <span>✨</span> Exclusive Collection
            </div>
            <h1 style={{ color: '#fff', fontSize: '2.4rem', margin: 0, fontWeight: '800', letterSpacing: '-0.5px', background: 'linear-gradient(180deg, #ffffff 0%, #a5c0dd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Explore Our Catalog
            </h1>
            <p style={{ color: '#8a99ad', margin: '6px 0 0 0', fontSize: '1rem' }}>
              Handpicked premium items synchronized directly with our live store inventory.
            </p>
          </div>
          
          <button 
            onClick={onBack}
            style={{ 
              background: 'rgba(255, 255, 255, 0.04)', 
              border: '1px solid rgba(255, 255, 255, 0.12)', 
              color: '#fff', 
              padding: '12px 24px', 
              borderRadius: '30px', 
              cursor: 'pointer', 
              fontWeight: '600', 
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s ease'
            }}
          >
            ← Back to Home
          </button>
        </div>

        {/* Filter & Search Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '25px',
                  border: selectedCategory === cat ? '1px solid #00c4ff' : '1px solid rgba(255,255,255,0.08)',
                  background: selectedCategory === cat ? 'linear-gradient(135deg, rgba(0, 196, 255, 0.2), rgba(30, 144, 255, 0.3))' : 'rgba(255,255,255,0.03)',
                  color: selectedCategory === cat ? '#00c4ff' : '#94a3b8',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: selectedCategory === cat ? '0 4px 15px rgba(0, 196, 255, 0.25)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '1rem' }}>🔍</span>
            <input 
              type="text"
              placeholder="Search catalog..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px 18px 12px 44px', 
                background: 'rgba(11, 25, 48, 0.7)', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                color: '#fff', 
                borderRadius: '30px', 
                outline: 'none', 
                fontSize: '0.92rem',
                boxSizing: 'border-box',
                backdropFilter: 'blur(8px)'
              }}
            />
          </div>
        </div>

        {/* Loading / Empty States */}
        {loadingProducts ? (
          <div style={{ textAlign: 'center', padding: '120px 0', color: '#00c4ff', fontSize: '1.2rem', fontWeight: '600' }}>
            <div style={{ fontSize: '2.8rem', marginBottom: '16px', animation: 'pulse 1.5s infinite' }}>⏳</div>
            Fetching live products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 20px', background: 'rgba(11, 30, 61, 0.3)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.12)' }}>
            <div style={{ fontSize: '3.2rem', marginBottom: '14px' }}>📦</div>
            <h3 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: '1.3rem', fontWeight: '700' }}>No matching products</h3>
            <p style={{ color: '#8a99ad', margin: 0, fontSize: '0.95rem' }}>Try clearing filters or search queries.</p>
          </div>
        ) : (
          /* Mobile-First 2-Column Grid */
          <div className="products-grid">
            {filteredProducts.map((p) => (
              <div 
                key={p.id || p.name} 
                className="prod-item-card"
                onClick={() => setSelectedProduct(p)}
                style={{ 
                  background: 'linear-gradient(160deg, #0b1a30 0%, #060e1a 100%)', 
                  border: '1px solid rgba(255, 255, 255, 0.08)', 
                  borderRadius: '18px', 
                  overflow: 'hidden', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  boxShadow: '0 12px 30px rgba(0,0,0,0.5)', 
                  cursor: 'pointer'
                }}
              >
                {/* Card Top: Image Box */}
                <div className="prod-img-box" style={{ height: '210px', backgroundColor: '#03070e', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '14px' }}>
                  <img 
                    src={p.image || 'https://via.placeholder.com/280'} 
                    alt={p.name} 
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.6))' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/280'; }}
                  />
                  <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(5, 11, 20, 0.85)', color: '#00c4ff', border: '1px solid rgba(0,196,255,0.3)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.68rem', fontWeight: '700', backdropFilter: 'blur(4px)' }}>
                    In Stock
                  </span>
                </div>

                {/* Card Bottom: Content Area */}
                <div className="prod-card-body" style={{ padding: '18px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h3 className="prod-card-title" style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: '#f8fafc', fontWeight: '700', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.3' }}>
                      {p.name}
                    </h3>
                    <p className="prod-card-desc" style={{ margin: '0 0 16px 0', fontSize: '0.84rem', color: '#94a3b8', lineHeight: '1.45', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {p.description || 'High-performance premium product carefully selected for durability.'}
                    </p>
                  </div>
                  
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div className="prod-card-price" style={{ fontSize: '1.2rem', fontWeight: '800', color: '#00c4ff', letterSpacing: '-0.3px' }}>
                      Rs. {p.price}
                    </div>
                    
                    <button 
                      className="prod-card-btn"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        onAddToCart(p); 
                        alert('Added to cart!');
                      }}
                      style={{ 
                        padding: '8px 16px', 
                        background: 'linear-gradient(135deg, #00c4ff, #0066cc)', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '10px', 
                        fontWeight: '700', 
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0, 196, 255, 0.3)'
                      }}
                    >
                      + Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* FULL-PAGE SCREEN COVERAGE POPUP MODAL */}
      {selectedProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(3, 8, 16, 0.96)',
          backdropFilter: 'blur(16px)',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Top Sticky Bar */}
          <div style={{
            padding: '18px 28px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(11, 26, 48, 0.8)',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>🛍️</span>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#00c4ff', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Product Overview
              </h3>
            </div>
            
            <button 
              onClick={() => setSelectedProduct(null)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                padding: '8px 18px',
                borderRadius: '24px',
                fontSize: '0.88rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              ✕ Close
            </button>
          </div>

          {/* Scrollable Main Content Container */}
          <div className="modal-scroll-area" style={{
            flex: 1,
            overflowY: 'auto',
            padding: '36px 20px',
            maxWidth: '1240px',
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <div className="modal-content-grid" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.1fr',
              gap: '40px',
              alignItems: 'start'
            }}>
              {/* Left Side: Product Display Image */}
              <div className="modal-img-box" style={{
                backgroundColor: '#02050a',
                borderRadius: '24px',
                minHeight: '380px',
                maxHeight: '520px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '30px',
                border: '1px solid rgba(0, 196, 255, 0.2)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,196,255,0.05)',
                position: 'relative'
              }}>
                <img 
                  src={selectedProduct.image || 'https://via.placeholder.com/280'} 
                  alt={selectedProduct.name} 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.7))' }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/280'; }}
                />
                <span style={{
                  position: 'absolute',
                  top: '18px',
                  left: '18px',
                  background: 'rgba(34, 197, 94, 0.15)',
                  color: '#4ade80',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  letterSpacing: '0.5px'
                }}>
                  ● In Stock & Ready to Ship
                </span>
              </div>

              {/* Right Side: Product Details & Purchase Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#f8fafc', margin: '0 0 12px 0', lineHeight: '1.25', letterSpacing: '-0.5px' }}>
                    {selectedProduct.name}
                  </h1>
                  
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px' }}>
                    <span style={{ fontSize: '2.4rem', fontWeight: '900', color: '#00c4ff', letterSpacing: '-0.5px' }}>
                      Rs. {selectedProduct.price}
                    </span>
                    <span style={{ fontSize: '0.88rem', color: '#8a99ad' }}>(Inclusive of all applicable taxes)</span>
                  </div>

                  {/* Specifications Card */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    fontSize: '0.95rem',
                    color: '#cbd5e1',
                    background: 'linear-gradient(145deg, #0b1a30, #060f1d)',
                    padding: '24px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                  }}>
                    <div>
                      <strong style={{ color: '#00c4ff', display: 'block', marginBottom: '4px' }}>Description</strong> 
                      <span style={{ lineHeight: '1.6', color: '#94a3b8' }}>{selectedProduct.description || 'Professional-grade formulation engineered for exceptional reliability and maximum performance results.'}</span>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                      <strong style={{ color: '#00c4ff', display: 'block', marginBottom: '4px' }}>How to Use</strong> 
                      <span style={{ lineHeight: '1.6', color: '#94a3b8' }}>{selectedProduct.usage || 'Apply evenly on the target area, let it absorb or react for 2–3 minutes, then wipe down with a clean micro-fiber towel.'}</span>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                      <strong style={{ color: '#00c4ff', display: 'block', marginBottom: '4px' }}>Where to Use</strong> 
                      <span style={{ lineHeight: '1.6', color: '#94a3b8' }}>{selectedProduct.where || 'Suitable for residential, automotive, and commercial environments.'}</span>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ color: '#00c4ff' }}>Estimated Delivery:</strong> 
                      <span style={{ color: '#4ade80', fontWeight: '700' }}>24–48 Hours Nationwide Express</span>
                    </div>
                  </div>
                </div>

                {/* Primary CTA Buttons */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
                  <button 
                    onClick={() => {
                      onAddToCart(selectedProduct);
                      alert('Added to cart successfully!');
                      setSelectedProduct(null);
                    }}
                    style={{
                      flex: 1,
                      minWidth: '160px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: '#fff',
                      border: '1px solid rgba(255, 255, 255, 0.18)',
                      padding: '16px',
                      borderRadius: '16px',
                      fontWeight: '700',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    🛒 Add to Cart
                  </button>
                  <button 
                    onClick={() => {
                      handleBuyNow(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    style={{
                      flex: 1,
                      minWidth: '160px',
                      background: 'linear-gradient(135deg, #25d366, #128c7e)',
                      color: '#fff',
                      border: 'none',
                      padding: '16px',
                      borderRadius: '16px',
                      fontWeight: '700',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      boxShadow: '0 8px 25px rgba(37, 211, 102, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    💬 Buy via WhatsApp
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}