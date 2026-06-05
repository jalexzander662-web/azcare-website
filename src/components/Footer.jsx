export default function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div className="ft-brand">
          <div className="logo-wrap">
            <img src="/AZ CARE Website Logo.png" alt="AZ Care.pk Logo" className="logo-img" style={{height:'52px'}} />
          </div>
          <p>Karachi ka #1 professional cleaning company. Eco-friendly, trusted, guaranteed.</p>
          <span className="ft-tagline">"Where Cleanliness Meets Perfection"</span>
          <div className="social-row">
            <a href="https://wa.me/923222468123" target="_blank" rel="noreferrer" className="soc-btn soc-wa" title="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
            <a href="https://www.facebook.com/azcare.pk" target="_blank" rel="noreferrer" className="soc-btn soc-fb" title="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/azcare.pk?igsh=MWlheXkzcjVpNm1zdQ==" target="_blank" rel="noreferrer" className="soc-btn soc-ig" title="Instagram"><i className="fa-brands fa-instagram"></i></a>
            <a href="https://www.youtube.com/@azcarepk" target="_blank" rel="noreferrer" className="soc-btn soc-yt" title="YouTube"><i className="fa-brands fa-youtube"></i></a>
            <a href="https://www.tiktok.com/@azcarepk?is_from_webapp=1&sender_device=pc" target="_blank" rel="noreferrer" className="soc-btn soc-tt" title="TikTok"><i className="fa-brands fa-tiktok"></i></a>
            <a href="tel:03222468123" className="soc-btn soc-ph" title="Call"><i className="fa-solid fa-phone"></i></a>
          </div>
        </div>
        <div className="fc">
          <h4>Services</h4>
          <ul>
            {['Sofa Cleaning','Carpet Cleaning','Mattress Cleaning','Car Detailing','Solar Panel Cleaning','Office Cleaning','Washroom Cleaning','Kitchen Cleaning','Floor Cleaning','Fumigation'].map(s => (
              <li key={s}><a href="#services">{s}</a></li>
            ))}
          </ul>
        </div>
        <div className="fc">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#process">How It Works</a></li>
            <li><a href="#reviews">Reviews</a></li>
            <li><a href="#gallery">Our Work</a></li>
            <li><a href="#why">FAQ</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="fc">
          <h4>Contact</h4>
          <ul>
            <li><a href="tel:03222468123"><i className="fa-solid fa-phone" style={{color:'#ef4444'}}></i> 0322-2468123</a></li>
            <li><a href="https://wa.me/923222468123" target="_blank" rel="noreferrer"><i className="fa-brands fa-whatsapp" style={{color:'#25d366'}}></i> WhatsApp</a></li>
            <li><a href="https://www.facebook.com/azcare.pk" target="_blank" rel="noreferrer"><i className="fa-brands fa-facebook-f" style={{color:'#1877f2'}}></i> AZ Care.pk</a></li>
            <li><a href="mailto:azcarepk@gmail.com"><i className="fa-solid fa-envelope" style={{color:'#ef4444'}}></i> azcarepk@gmail.com</a></li>
            <li><a href="https://www.google.com/maps?q=24.9172661,67.0307852" target="_blank" rel="noreferrer"><i className="fa-solid fa-location-dot" style={{color:'#f97316'}}></i> Karachi, Pakistan</a></li>
            <li><a href="https://www.google.com/search?q=AZ+Care.pk" target="_blank" rel="noreferrer"><i className="fa-brands fa-google" style={{color:'#4285F4'}}></i> Google Reviews</a></li>
            <li><a href="https://www.youtube.com/@azcarepk" target="_blank" rel="noreferrer"><i className="fa-brands fa-youtube" style={{color:'#FF0000'}}></i> YouTube Channel</a></li>
            <li><a href="https://www.tiktok.com/@azcarepk?is_from_webapp=1&sender_device=pc" target="_blank" rel="noreferrer"><i className="fa-brands fa-tiktok" style={{color:'#fff'}}></i> TikTok @azcarepk</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 AZ Care.pk — Professional Cleaning Services Karachi | All Rights Reserved</p>
        <span className="footer-tagline-bottom">Karachi Walon Ki Pehli Choice</span>
      </div>
    </footer>
  );
}
