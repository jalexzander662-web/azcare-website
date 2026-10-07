import { EMAIL, MAPS_URL, PHONE, PHONE_HREF, SOCIALS, WA_URL } from '../data/links'

export default function Topbar() {
  return (
    <div className="az-topbar">
      <div className="az-topbar__l">
        <a data-r="tb-hide" href={'mailto:' + EMAIL}>
          <i className="fa-solid fa-envelope" style={{ marginRight: 5, color: '#7ab3f5' }} />
          {EMAIL}
        </a>
        <a data-r="tb-hide" href={MAPS_URL} target="_blank" rel="noreferrer">
          <i className="fa-solid fa-location-dot" style={{ marginRight: 5, color: '#f5a623' }} />
          Karachi, Pakistan
        </a>
        <a href={PHONE_HREF}>
          <i className="fa-solid fa-phone" style={{ marginRight: 6, color: '#22c55e' }} />
          {PHONE}
        </a>
        <a data-r="tb-mob" href={WA_URL} target="_blank" rel="noreferrer">
          <i className="fa-brands fa-whatsapp" style={{ marginRight: 6, color: '#25d366', fontSize: '1rem' }} />
          WhatsApp
        </a>
      </div>
      <div className="az-topbar__r" data-r="tb-hide">
        {SOCIALS.map(([key, href, icon]) => (
          <a key={key} href={href} target="_blank" rel="noreferrer" title={key} className={'az-social az-social--topbar az-social--' + key}>
            <i className={icon} />
          </a>
        ))}
      </div>
    </div>
  )
}
