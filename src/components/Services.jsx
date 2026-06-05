import { cleaningServices } from '../data/cleaningServices';
import { carServices } from '../data/carServices';
import { products } from '../data/products';

export default function Services({ activePage, onPageChange, onDetailOpen }) {
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

          <div id="spage-cleaning" className={`svc-page${activePage === 'cleaning' ? ' active' : ''}`}>
            <div className="srv-grid">
              {cleaningServices.map((s) => (
                <div key={s.name} className="srv-card rv" style={{cursor:'pointer'}} onClick={() => onDetailOpen(s, 'AZ Care.pk — Professional Cleaning Services')}>
                  <div className="srv-img">
                    <img src={s.img} alt={s.name} />
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
                    <a href={`https://wa.me/923222468123?text=${s.wa}`} target="_blank" rel="noreferrer" className="srv-book" onClick={e => e.stopPropagation()}>
                      BOOK NOW →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="spage-car" className={`svc-page${activePage === 'car' ? ' active' : ''}`}>
            <div className="srv-grid">
              {carServices.map((s) => (
                <div key={s.name} className="srv-card rv" style={{cursor:'pointer'}} onClick={() => onDetailOpen(s, 'AZ Care.pk — Professional Car Detailing')}>
                  <div className="srv-img">
                    <img src={s.img} alt={s.name} />
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
                    <a href={`https://wa.me/923222468123?text=${s.wa}`} target="_blank" rel="noreferrer" className="srv-book" onClick={e => e.stopPropagation()}>
                      BOOK NOW →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="spage-products" className={`svc-page${activePage === 'products' ? ' active' : ''}`}>
            <div className="prod-grid">
              {products.map((p) => (
                <div key={p.name} className="prod-card rv">
                  <div className="prod-img">
                    <img src={p.img} alt={p.name} />
                  </div>
                  <div className="prod-body">
                    <div className="prod-name">{p.name}</div>
                    <div className="prod-price">{p.price}</div>
                    <a href={`https://wa.me/923222468123?text=${p.wa}`} target="_blank" rel="noreferrer" className="prod-buy">
                      <i className="fa-brands fa-whatsapp"></i> ORDER NOW
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
