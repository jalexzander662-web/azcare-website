const steps = [
  { n: 1, title: 'Contact Us', desc: 'WhatsApp, call or fill our online form. We respond within minutes — anytime.' },
  { n: 2, title: 'Get a Quote', desc: 'Tell us your service and location. We give you a transparent, honest price — no surprises.' },
  { n: 3, title: 'We Arrive', desc: 'Our trained, uniformed team arrives on time with all equipment and eco-friendly products ready.' },
  { n: 4, title: 'Enjoy & Relax', desc: "We clean thoroughly. You inspect. We won't leave until you're 100% satisfied — guaranteed." },
];

export default function Process() {
  return (
    <div id="process" className="process-bg">
      <div className="sec">
        <div className="sec-inner">
          <div className="sec-head center rv">
            <div className="sec-tag">How It Works</div>
            <h2 className="sec-title">4 Simple <em>Steps</em></h2>
            <p className="sec-sub">Booking AZ Care is easy, fast and completely hassle-free.</p>
          </div>
          <div className="steps">
            {steps.map((s) => (
              <div className="step-item rv" key={s.n}>
                <div className="step-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
