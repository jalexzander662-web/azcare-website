import { useState } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function saveBooking(data, source) {
  const res = await fetch(SUPABASE_URL + '/rest/v1/bookings', {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ ...data, source }),
  });
  if (!res.ok) throw new Error('insert failed: ' + res.status);
}

const contactItems = [
  { href: 'https://wa.me/923222468123?text=Hello%20AZ%20Care%20Assalam%20o%20Alaikum!%20Mujhe%20cleaning%20service%20chahiye.', img: '/LOGOS/whatsapp.jpg', lbl: 'WhatsApp (Fastest)', val: '0322-2468123', external: true },
  { href: 'tel:03222468123', img: '/LOGOS/phone.jpg', lbl: 'Call Us', val: '0322-2468123', external: false },
  { href: 'https://www.facebook.com/azcare.pk', img: '/LOGOS/facebook.jpg', lbl: 'Facebook Page', val: 'AZ Care.pk', external: true },
  { href: 'https://www.instagram.com/azcare.pk?igsh=MWlheXkzcjVpNm1zdQ==', img: '/LOGOS/instagram.jpg', lbl: 'Instagram', val: '@azcare.pk', external: true },
  { href: 'mailto:azcarepk@gmail.com', img: '/LOGOS/mail.png', lbl: 'Email Us', val: 'azcarepk@gmail.com', external: false },
  { href: 'https://www.google.com/maps?q=24.9172661,67.0307852&z=17&hl=en', img: '/LOGOS/location.jpg', lbl: 'Location', val: 'Karachi, Pakistan', external: true },
];

const serviceOptions = [
  'Sofa Cleaning','Carpet Cleaning','Rug Cleaning','Upholstery Cleaning','Mattress Cleaning',
  'Car Interior Cleaning','Curtain Cleaning','Solar Panel Cleaning','Kitchen Cleaning',
  'Washroom Cleaning','Office Cleaning','Floor Cleaning','Whole House Deep Cleaning','Fumigation','Multiple Services',
];

export default function Contact() {
  const [form, setForm] = useState({ name:'', phone:'', service:'', area:'', preferred_time:'', message:'' });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await saveBooking(form, 'contact_form');
      setDone(true);
    } catch {
      setSending(false);
      alert('Request send nahi ho saka. Please WhatsApp ya phone se contact karein: 0322-2468123');
    }
  };

  return (
    <div id="contact" className="contact-bg">
      <div className="sec">
        <div className="sec-inner">
          <div className="sec-head center rv">
            <div className="sec-tag">Book a Service</div>
            <img src="/AZ CARE Website Logo.png" alt="AZ Care Logo" style={{height:'60px',width:'auto',display:'block',margin:'0 auto 1rem',objectFit:'contain',background:'#0b1e3d',padding:'8px',borderRadius:'14px'}} />
            <h2 className="sec-title">Contact <em>AZ Care</em> Today</h2>
            <p className="sec-sub">Reach us via WhatsApp, phone or form. We respond fast — 7 days a week.</p>
          </div>

          <div className="contact-grid">
            <div>
              <div className="c-cards">
                {contactItems.map((c) => (
                  <a key={c.lbl} href={c.href} target={c.external ? '_blank' : undefined} rel={c.external ? 'noreferrer' : undefined} className="c-item">
                    <div className="c-ico"><img src={c.img} alt={c.lbl} /></div>
                    <div>
                      <div className="c-lbl">{c.lbl}</div>
                      <div className="c-val">{c.val}</div>
                    </div>
                  </a>
                ))}
                <a href="https://www.google.com/search?q=AZ+Care.pk" target="_blank" rel="noreferrer" className="c-item">
                  <div className="c-ico" style={{background:'#fff',padding:'6px',borderRadius:'50%',width:'46px',height:'46px',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 3px 12px rgba(0,0,0,.3)'}}>
                    <i className="fa-brands fa-google" style={{fontSize:'1.35rem',background:'linear-gradient(135deg,#4285F4,#EA4335,#FBBC05,#34A853)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}></i>
                  </div>
                  <div>
                    <div className="c-lbl">Google Business</div>
                    <div className="c-val">Rate &amp; Review Us ⭐</div>
                  </div>
                </a>
                <a href="https://www.youtube.com/@azcarepk" target="_blank" rel="noreferrer" className="c-item">
                  <div className="c-ico" style={{background:'#fff',padding:'6px',borderRadius:'50%',width:'46px',height:'46px',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 3px 12px rgba(0,0,0,.3)'}}>
                    <i className="fa-brands fa-youtube" style={{fontSize:'1.45rem',color:'#FF0000'}}></i>
                  </div>
                  <div>
                    <div className="c-lbl">YouTube Channel</div>
                    <div className="c-val">@azcarepk</div>
                  </div>
                </a>
                <a href="https://www.tiktok.com/@azcarepk?is_from_webapp=1&sender_device=pc" target="_blank" rel="noreferrer" className="c-item">
                  <div style={{background:'#010101',padding:'6px',borderRadius:'50%',width:'46px',height:'46px',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 3px 12px rgba(0,0,0,.3)',flexShrink:0}}>
                    <i className="fa-brands fa-tiktok" style={{fontSize:'1.35rem',color:'#fff'}}></i>
                  </div>
                  <div>
                    <div className="c-lbl">TikTok</div>
                    <div className="c-val">@azcarepk</div>
                  </div>
                </a>
              </div>
              <div className="hours-card">
                <h4>Working Hours</h4>
                <div className="hours-row"><span>All Days</span><span>24 / 7</span></div>
                <span className="emergency">✅ Available anytime — Book on WhatsApp</span>
              </div>
            </div>

            <div className="contact-form-box">
              <h3>📋 Book Our Service</h3>
              {done ? (
                <div className="form-ok show">✅ SHUKRIYA! Apki booking request send ho gai. Hum 30 minute mein contact karenge.</div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-row2">
                    <div className="fg"><label>Your Name *</label><input type="text" name="name" placeholder="e.g. Ahmed Khan" required value={form.name} onChange={handleChange} /></div>
                    <div className="fg"><label>Phone / WhatsApp *</label><input type="tel" name="phone" placeholder="0322-XXXXXXX" required value={form.phone} onChange={handleChange} /></div>
                  </div>
                  <div className="fg"><label>Service Required *</label>
                    <select name="service" required value={form.service} onChange={handleChange}>
                      <option value="">-- Select a Service --</option>
                      {serviceOptions.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="fg"><label>Your Area in Karachi</label><input type="text" name="area" placeholder="e.g. DHA, Gulshan, Clifton, PECHS..." value={form.area} onChange={handleChange} /></div>
                  <div className="fg"><label>Preferred Date &amp; Time</label><input type="text" name="preferred_time" placeholder="e.g. Kal subah, Saturday afternoon..." value={form.preferred_time} onChange={handleChange} /></div>
                  <div className="fg"><label>Message (Optional)</label><textarea name="message" placeholder="Koi additional details yahan likhein..." value={form.message} onChange={handleChange}></textarea></div>
                  <button type="submit" className="btn-submit" disabled={sending}>{sending ? 'Sending...' : 'SEND BOOKING REQUEST ✉'}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
