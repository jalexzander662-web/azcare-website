import { useState } from 'react';
import { faqs } from '../data/faqs';

const feats = [
  { img: '/LOGOS/Eco-Friendly.png', title: 'Eco-Friendly Products', desc: 'Hospital-grade, non-toxic — 100% safe for babies, children, pets and elders.' },
  { img: '/LOGOS/Fast & Reliable.jpg', title: 'Fast & Reliable', desc: 'Punctual arrival, efficient cleaning, zero mess left. We respect your time always.' },
  { img: '/LOGOS/Verified Staff.png', title: 'Trained & Verified Staff', desc: 'Background-checked, uniformed professionals trained for every surface and material.' },
  { img: '/LOGOS/No Hidden Charges.jpg', title: 'Honest Pricing', desc: 'Affordable rates, free quotes, zero hidden charges. Pay only what you agreed to.' },
];

export default function WhyUs() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (i) => setOpenIdx(openIdx === i ? null : i);

  return (
    <div id="why">
      <div className="sec">
        <div className="sec-inner">
          <div className="sec-tag rv" style={{display:'inline-block',marginBottom:'1.5rem'}}>Why Choose AZ Care</div>
          <div className="why-grid">
            <div className="rvl">
              <h2 className="sec-title" style={{fontSize:'clamp(1.4rem,3vw,2rem)'}}>Karachi Walon Ki<br /><em>Pehli Choice</em></h2>
              <p className="sec-sub" style={{marginBottom:'1.5rem',fontStyle:'italic',color:'rgba(240,246,255,.6)',fontSize:'.88rem'}}>"Where Cleanliness Meets Perfection"</p>
              <div className="feats">
                {feats.map((f) => (
                  <div className="feat" key={f.title}>
                    <div className="feat-ico" style={{overflow:'hidden'}}>
                      <img src={f.img} alt={f.title} style={{width:'100%',height:'100%',objectFit:'contain'}} />
                    </div>
                    <div>
                      <h4>{f.title}</h4>
                      <p>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rvr">
              <h2 className="sec-title" style={{fontSize:'clamp(1.4rem,3vw,2rem)'}}>Common <em>Questions</em></h2>
              <div className="faq-list" style={{marginTop:'6.5rem'}}>
                {faqs.map((f, i) => (
                  <div key={i} className={`faq-item${openIdx === i ? ' open' : ''}`}>
                    <div className="faq-q" onClick={() => toggle(i)}>
                      <span>{f.q}</span>
                      <div className="faq-icon">+</div>
                    </div>
                    <div className="faq-a">
                      <p>{f.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
