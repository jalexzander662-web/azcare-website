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

const serviceOptions = [
  'Sofa Cleaning','Carpet Cleaning','Rug Cleaning','Upholstery Cleaning','Mattress Cleaning',
  'Car Interior Cleaning','Curtain Cleaning','Solar Panel Cleaning','Kitchen Cleaning',
  'Washroom Cleaning','Office Cleaning','Floor Cleaning','Whole House Deep Cleaning','Fumigation','Multiple Services',
];

export default function BookModal({ open, onClose }) {
  const [form, setForm] = useState({ name:'', phone:'', service:'', area:'', preferred_time:'', message:'' });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await saveBooking(form, 'book_modal');
      setDone(true);
    } catch {
      setSending(false);
      alert('Request send nahi ho saka. Please WhatsApp karein: 0322-2468123');
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
            <div className="fg"><label>Message (Optional)</label><textarea name="message" rows="3" placeholder="Koi additional details yahan likhein..." value={form.message} onChange={handleChange}></textarea></div>
            <button type="submit" className="btn-submit" disabled={sending}>{sending ? 'Sending...' : 'SEND BOOKING REQUEST ✉'}</button>
          </form>
        )}
      </div>
    </div>
  );
}
