import { useState } from 'react';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLU7x56fRc5YBnca91B4JOPneelUS2ruD1JFX8Nyk4vclCyzd69AjeXqXtgY5WxhUh/exec';

const contactItems = [
  { href: 'https://wa.me/923222468123?text=Hello%20AZ%20Care%20Assalam%20o%20Alaikum!%20Mujhe%20cleaning%20service%20chahiye.', img: '/LOGOS/whatsapp.webp', lbl: 'WhatsApp (Fastest)', val: '0322-2468123', external: true },
  { href: 'tel:03222468123', img: '/LOGOS/phone.webp', lbl: 'Call Us', val: '0322-2468123', external: false },
  { href: 'https://www.facebook.com/azcare.pk', img: '/LOGOS/facebook.webp', lbl: 'Facebook Page', val: 'AZ Care.pk', external: true },
  { href: 'https://www.instagram.com/azcare.pk?igsh=MWlheXkzcjVpNm1zdQ==', img: '/LOGOS/instagram.webp', lbl: 'Instagram', val: '@azcare.pk', external: true },
  { href: 'mailto:azcarepk@gmail.com', img: '/LOGOS/mail.webp', lbl: 'Email Us', val: 'azcarepk@gmail.com', external: false },
  { href: 'https://www.google.com/maps?q=24.9172661,67.0307852&z=17&hl=en', img: '/LOGOS/location.webp', lbl: 'Location', val: 'Karachi, Pakistan', external: true },
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

    const payload = {
      action: 'createBooking',
      name: form.name,
      phone: form.phone,
      service: form.service,
      area: form.area,
      preferred_time: form.preferred_time,
      message: form.message
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      setDone(true);
    } catch (err) {
      console.error('Booking submission failed:', err);
      alert('Request send nahi ho saka. Please WhatsApp ya phone se contact karein: 0322-2468123');
    } finally {
      setSending(false);
    }
  };

  return (
    <div id="contact" className="contact-bg">
      <div className="sec">
        <div className="sec-inner">
          <div className="sec-head center rv">
            <div className="sec-tag">Book a Service</div>
            <img src="/AZ CARE Website Logo.webp" alt="AZ Care Logo" style={{height:'60px',width:'auto',display:'block',margin:'0 auto 1rem',objectFit:'contain',background:'#0b1e3d',padding:'8px',borderRadius:'14px'}} />
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
                  <div className="fg"><label>Address / Message (Optional)</label><textarea name="message" placeholder="Ghar ka address ya koi details yahan likhein..." value={form.message} onChange={handleChange}></textarea></div>
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