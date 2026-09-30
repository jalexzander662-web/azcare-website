import { useState, useEffect } from 'react';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLU7x56fRc5YBnca91B4JOPneelUS2ruD1JFX8Nyk4vclCyzd69AjeXqXtgY5WxhUh/exec';

const serviceOptions = [
  'Sofa Cleaning','Carpet Cleaning','Rug Cleaning','Upholstery Cleaning','Mattress Cleaning',
  'Car Interior Cleaning','Curtain Cleaning','Solar Panel Cleaning','Kitchen Cleaning',
  'Washroom Cleaning','Office Cleaning','Floor Cleaning','Whole House Deep Cleaning','Fumigation','Multiple Services',
];

export default function BookModal({ open, onClose, selectedService = '' }) {
  const [form, setForm] = useState({ name:'', phone:'', service:'', area:'', preferred_time:'', message:'' });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (selectedService) {
      setForm(f => ({ ...f, service: selectedService }));
    }
  }, [selectedService]);

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
      alert('Request send nahi ho saka. Please WhatsApp karein: 0322-2468123');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    onClose();
    setDone(false);
    setSending(false);
    setForm({ name:'', phone:'', service:'', area:'', preferred_time:'', message:'' });
  };

  if (!open) return null;

  return (
    <div className="book-modal open" onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="book-box">
        <button className="book-close" onClick={handleClose} aria-label="Close">✕</button>
        <h3>📋 Book Our Service</h3>
        {done ? (
          <div className="form-ok">✅ Shukriya! Apki booking request send ho gai. Hum 30 minute mein contact karenge.</div>
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
            <div className="fg"><label>Address / Message (Optional)</label><textarea name="message" rows="3" placeholder="Ghar ka address ya koi details yahan likhein..." value={form.message} onChange={handleChange}></textarea></div>
            <button type="submit" className="btn-submit" disabled={sending}>{sending ? 'Sending...' : 'SEND BOOKING REQUEST ✉'}</button>
          </form>
        )}
      </div>
    </div>
  );
}