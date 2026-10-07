import Section from '../ds/Section'
import BookingForm from './BookingForm'

export default function Contact({ catalog, onSubmit }) {
  return (
    <div data-screen-label="10 Contact" id="contact">
      <Section tone="alt">
        <div className="az-sec-head az-sec-head--center">
          <div className="az-tag">Book a Service</div>
          <h2 className="az-sec-title">
            Contact <em>AZ Care</em> Today
          </h2>
          <p className="az-sec-sub">Reach us via WhatsApp, phone or form. We respond fast — 7 days a week.</p>
        </div>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div data-r="formbox" style={{ background: 'var(--navy)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 'var(--radius)', padding: '2.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.3rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', margin: '0 0 1.75rem', color: 'var(--white)' }}>📋 Book Our Service</h3>
            <BookingForm mode="inline" catalog={catalog} onSubmit={onSubmit} />
          </div>
        </div>
      </Section>
    </div>
  )
}
