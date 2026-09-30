import { cleaningServices } from '../data/cleaningServices';
import { carServices } from '../data/carServices';

export default function Services({
  activePage,
  onPageChange,
  onDetailOpen,
  onBookService,
  sheetProducts = [],
  loadingProducts,
  onAddToCart,
}) {
  return (
    <div id="services" className="services-bg">
      <div className="sec">
        <div className="sec-inner">
          <div className="sec-head center rv">
            <div className="sec-tag">What We Offer</div>
            <h2 className="sec-title">Our <em>Services</em></h2>
            <p className="sec-sub">Professional cleaning, car detailing &amp; quality products — all under one roof in Karachi.</p>
          </div>

          <div className="page-tabs rv">
            <button className={`page-tab${activePage === 'cleaning' ? ' active' : ''}`} onClick={() => onPageChange('cleaning')}>Cleaning Services</button>
            <button className={`page-tab${activePage === 'car' ? ' active' : ''}`} onClick={() => onPageChange('car')}>Car Detailing</button>
            <button className={`page-tab${activePage === 'products' ? ' active' : ''}`} onClick={() => onPageChange('products')}>Shop / Products</button>
          </div>

          {/* Cleaning Services Section */}
          <div id="spage-cleaning" className={`svc-page${activePage === 'cleaning' ? ' active' : ''}`}>
            <div className="srv-grid">
              {cleaningServices.map((s) => (
                <div key={s.name} className="srv-card rv" style={{cursor:'pointer'}} onClick={() => onDetailOpen(s, 'AZ Care.pk — Professional Cleaning Services')}>
                  <div className="srv-img">
                    <img src={s.img} alt={s.name} loading="lazy" decoding="async" />
                    <div className="srv-overlay">
                      <div>
                        <span className="srv-cat">{s.cat}</span>
                        <div className="srv-overlay-title">{s.name}</div>
                      </div>
                    </div>
                  </div>
                  <div className="srv-body">
                    <p>{s.desc}</p>
                    <div className="card-price">{s.price}</div>
                    <button 
                      className="srv-book" 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onBookService) {
                          onBookService(s.name);
                        } else {
                          onDetailOpen(s, 'AZ Care.pk — Professional Cleaning Services');
                        }
                      }}
                    >
                      BOOK NOW →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Car Detailing Services Section */}
          <div id="spage-car" className={`svc-page${activePage === 'car' ? ' active' : ''}`}>
            <div className="srv-grid">
              {carServices.map((s) => (
                <div key={s.name} className="srv-card rv" style={{cursor:'pointer'}} onClick={() => onDetailOpen(s, 'AZ Care.pk — Professional Car Detailing')}>
                  <div className="srv-img">
                    <img src={s.img} alt={s.name} loading="lazy" decoding="async" />
                    <div className="srv-overlay">
                      <div>
                        <span className="srv-cat">{s.cat}</span>
                        <div className="srv-overlay-title">{s.name}</div>
                      </div>
                    </div>
                  </div>
                  <div className="srv-body">
                    <p>{s.desc}</p>
                    <div className="card-price">{s.price}</div>
                    <button 
                      className="srv-book" 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onBookService) {
                          onBookService(s.name);
                        } else {
                          onDetailOpen(s, 'AZ Care.pk — Professional Car Detailing');
                        }
                      }}
                    >
                      BOOK NOW →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Google Sheet Products Tab */}
          <div id="spage-products" className={`svc-page${activePage === 'products' ? ' active' : ''}`}>
            {loadingProducts ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: '#7a90b5', fontSize: '1.1rem' }}>
                ⏳ Loading live products...
              </div>
            ) : sheetProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7a90b5' }}>
                No products found in Google Sheet.
              </div>
            ) : (
              <div className="prod-grid">
                {sheetProducts.map((p) => (
                  <div key={p.id || p.name} className="prod-card rv">
                    <div className="prod-img">
                      <img src={p.image} alt={p.name} loading="lazy" decoding="async" />
                    </div>
                    <div className="prod-body">
                      <div className="prod-name">{p.name}</div>
                      <div className="prod-price">
                        {String(p.price).startsWith('Rs') ? p.price : `Rs. ${p.price}`}
                      </div>
                      <button
                        onClick={() => onAddToCart(p)}
                        className="prod-buy"
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          background: 'linear-gradient(135deg, var(--acc), var(--acc2))',
                          color: '#fff',
                          border: 'none',
                          marginTop: 'auto',
                          padding: '10px 14px',
                          borderRadius: '25px',
                          fontWeight: 'bold',
                        }}
                      >
                        🛒 ADD TO CART
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}