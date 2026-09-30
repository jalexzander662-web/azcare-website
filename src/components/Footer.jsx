export default function Footer() {
  const socialBtnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: '#1e293b',
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  };

  const linkStyle = {
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.2s ease'
  };

  const headingStyle = {
    color: '#ffffff',
    marginBottom: '12px',
    fontSize: '15px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    textTransform: 'uppercase'
  };

  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#cbd5e1',
      padding: '50px 20px 20px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderTop: '1px solid #1e293b'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '35px'
      }}>
        
        {/* Brand & Social Row */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/AZ CARE Website Logo.webp" alt="AZ Care.pk Logo" style={{ height: '52px', objectFit: 'contain' }} />
          </div>
          <p style={{ margin: 0, fontSize: '15px', color: '#94a3b8', lineHeight: '1.5' }}>
            Professional cleaning company. Eco-friendly, trusted, guaranteed.
          </p>
          <span style={{ fontStyle: 'italic', color: '#38bdf8', fontSize: '14px', fontWeight: '500' }}>
            "Where Cleanliness Meets Perfection"
          </span>
          
          {/* Social Icons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="https://wa.me/923222468123" target="_blank" rel="noreferrer" style={socialBtnStyle} title="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
            <a href="https://www.facebook.com/azcare.pk" target="_blank" rel="noreferrer" style={socialBtnStyle} title="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/azcare.pk?igsh=MWlheXkzcjVpNm1zdQ==" target="_blank" rel="noreferrer" style={socialBtnStyle} title="Instagram"><i className="fa-brands fa-instagram"></i></a>
            <a href="https://www.youtube.com/@azcarepk" target="_blank" rel="noreferrer" style={socialBtnStyle} title="YouTube"><i className="fa-brands fa-youtube"></i></a>
            <a href="https://www.tiktok.com/@azcarepk?is_from_webapp=1&sender_device=pc" target="_blank" rel="noreferrer" style={socialBtnStyle} title="TikTok"><i className="fa-brands fa-tiktok"></i></a>
            <a href="tel:03222468123" style={socialBtnStyle} title="Call"><i className="fa-solid fa-phone"></i></a>
          </div>
        </div>

        <hr style={{ width: '100%', border: '0', borderTop: '1px solid #1e293b', margin: '0' }} />

        {/* Services Horizontal Pill Bar */}
        <div style={{ width: '100%' }}>
          <h4 style={headingStyle}>Our Services</h4>
          <ul style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px 22px', listStyle: 'none', padding: 0, margin: 0 }}>
            {['Sofa Cleaning','Carpet Cleaning','Mattress Cleaning','Car Detailing','Solar Panel Cleaning','Office Cleaning','Washroom Cleaning','Kitchen Cleaning','Floor Cleaning','Fumigation'].map(s => (
              <li key={s}>
                <a href="#services" style={linkStyle}>{s}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Service Areas Section (Karachi Highlighted & Lahore) */}
        <div style={{ width: '100%' }}>
          <h4 style={headingStyle}>Service Areas</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', alignItems: 'center' }}>
            
            {/* Karachi - Primary Highlighted City Badge */}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 2px 6px rgba(2, 132, 199, 0.4)'
            }}>
              <i className="fa-solid fa-location-dot" style={{color: '#ffe4e6'}}></i> Karachi <span style={{fontSize: '11px', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '10px', marginLeft: '4px'}}>Primary</span>
            </span>

            {/* Lahore - Standard City Badge */}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#1e293b',
              color: '#cbd5e1',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              border: '1px solid #334155'
            }}>
              <i className="fa-solid fa-location-dot" style={{color: '#f97316'}}></i> Lahore
            </span>

            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#1e293b',
              color: '#cbd5e1',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              border: '1px solid #334155'
            }}>
              <i className="fa-solid fa-location-dot" style={{color: '#f97316'}}></i> Islamabad
            </span>

          </div>
        </div>

        {/* Quick Links & Contact Details Inline Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px', width: '100%' }}>
          
          {/* Quick Links */}
          <div>
            <h4 style={headingStyle}>Quick Links</h4>
            <ul style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '18px', listStyle: 'none', padding: 0, margin: 0 }}>
              <li><a href="#process" style={linkStyle}>How It Works</a></li>
              <li><a href="#reviews" style={linkStyle}>Reviews</a></li>
              <li><a href="#gallery" style={linkStyle}>Our Work</a></li>
              <li><a href="#why" style={linkStyle}>FAQ</a></li>
              <li><a href="#contact" style={linkStyle}>Contact</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={headingStyle}>Contact Info</h4>
            <ul style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '18px', listStyle: 'none', padding: 0, margin: 0 }}>
              <li><a href="tel:03222468123" style={{...linkStyle, display: 'flex', alignItems: 'center', gap: '6px'}}><i className="fa-solid fa-phone" style={{color:'#ef4444'}}></i> 0322-2468123</a></li>
              <li><a href="https://wa.me/923222468123" target="_blank" rel="noreferrer" style={{...linkStyle, display: 'flex', alignItems: 'center', gap: '6px'}}><i className="fa-brands fa-whatsapp" style={{color:'#25d366'}}></i> WhatsApp</a></li>
              <li><a href="mailto:azcarepk@gmail.com" style={{...linkStyle, display: 'flex', alignItems: 'center', gap: '6px'}}><i className="fa-solid fa-envelope" style={{color:'#38bdf8'}}></i> Email</a></li>
            </ul>
          </div>

        </div>

      </div>

      {/* Footer Bottom Bar */}
      <div style={{ borderTop: '1px solid #1e293b', marginTop: '45px', paddingTop: '20px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
        <p style={{ margin: '0 0 6px 0' }}>© 2026 AZ Care.pk — Professional Cleaning Services | All Rights Reserved</p>
        <span style={{ color: '#38bdf8', fontWeight: '500', letterSpacing: '0.5px' }}>Pakistan Walon Ki Pehli Choice</span>
      </div>
    </footer>
  );
}