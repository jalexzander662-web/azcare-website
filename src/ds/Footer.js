// Lifted verbatim from the AZ Care.pk design system (components/layout/Footer.jsx) by tools/extract-ds.mjs. Do not hand-edit.
import React from 'react'

const SERVICES = ['Sofa Cleaning', 'Carpet Cleaning', 'Mattress Cleaning', 'Car Detailing', 'Solar Panel Cleaning', 'Office Cleaning', 'Washroom Cleaning', 'Kitchen Cleaning', 'Floor Cleaning', 'Fumigation'];
const AREAS = [{
  name: 'Karachi',
  primary: true
}, {
  name: 'Lahore'
}, {
  name: 'Islamabad'
}];
const QUICK = ['How It Works', 'Reviews', 'Our Work', 'FAQ', 'Contact'];
const SOCIALS = [['whatsapp', 'fa-brands fa-whatsapp'], ['facebook', 'fa-brands fa-facebook-f'], ['instagram', 'fa-brands fa-instagram'], ['youtube', 'fa-brands fa-youtube'], ['tiktok', 'fa-brands fa-tiktok'], ['phone', 'fa-solid fa-phone']];
function Footer({
  logoSrc = 'assets/logo/az-care-logo.webp',
  blurb = 'Professional cleaning company. Eco-friendly, trusted, guaranteed.',
  slogan = '"Where Cleanliness Meets Perfection"',
  services = SERVICES,
  areas = AREAS,
  quickLinks = QUICK,
  phone = '0322-2468123',
  email = 'azcarepk@gmail.com'
}) {
  return /*#__PURE__*/React.createElement("footer", {
    className: "az-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "az-footer__in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "az-footer__brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: "AZ Care.pk"
  }), /*#__PURE__*/React.createElement("p", null, blurb), /*#__PURE__*/React.createElement("span", {
    className: "az-footer__tag"
  }, slogan), /*#__PURE__*/React.createElement("div", {
    className: "az-footer__soc"
  }, SOCIALS.map(s => /*#__PURE__*/React.createElement("a", {
    key: s[0],
    href: "#",
    title: s[0],
    className: "az-social az-social--footer"
  }, /*#__PURE__*/React.createElement("i", {
    className: s[1]
  }))))), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("h4", null, "Our Services"), /*#__PURE__*/React.createElement("ul", null, services.map(s => /*#__PURE__*/React.createElement("li", {
    key: s
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, s))))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("h4", null, "Service Areas"), /*#__PURE__*/React.createElement("div", {
    className: "az-footer__areas"
  }, areas.map(a => /*#__PURE__*/React.createElement("span", {
    key: a.name,
    className: 'az-city' + (a.primary ? ' az-city--primary' : '')
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-location-dot"
  }), " ", a.name, a.primary && /*#__PURE__*/React.createElement("em", null, "Primary"))))), /*#__PURE__*/React.createElement("div", {
    className: "az-footer__row"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Quick Links"), /*#__PURE__*/React.createElement("ul", {
    style: {
      gap: 18
    }
  }, quickLinks.map(q => /*#__PURE__*/React.createElement("li", {
    key: q
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, q))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Contact Info"), /*#__PURE__*/React.createElement("ul", {
    style: {
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "tel:03222468123"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-phone",
    style: {
      color: '#ef4444'
    }
  }), " ", phone)), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "https://wa.me/923222468123"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-whatsapp",
    style: {
      color: '#25d366'
    }
  }), " WhatsApp")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: 'mailto:' + email
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-envelope",
    style: {
      color: '#38bdf8'
    }
  }), " Email")))))), /*#__PURE__*/React.createElement("div", {
    className: "az-footer__bar"
  }, /*#__PURE__*/React.createElement("p", null, "\xA9 2026 AZ Care.pk \u2014 Professional Cleaning Services | All Rights Reserved"), /*#__PURE__*/React.createElement("span", null, "Pakistan Walon Ki Pehli Choice")));
}

export default Footer
