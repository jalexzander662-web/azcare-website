// Lifted verbatim from the AZ Care.pk design system (components/layout/Nav.jsx) by tools/extract-ds.mjs. Do not hand-edit.
import React from 'react'

const {
  useState,
  useEffect
} = React;
const DEFAULT_LINKS = [{
  label: 'Cleaning',
  children: [{
    label: 'Services'
  }]
}, {
  label: 'Car Detailing'
}, {
  label: 'Products'
}, {
  label: 'Process'
}, {
  label: 'Reviews'
}, {
  label: 'FAQ'
}, {
  label: 'Contact'
}];
function Nav({
  logoSrc = 'assets/logo/az-care-logo.webp',
  links = DEFAULT_LINKS,
  phone = '0322-2468123',
  phoneHref = 'tel:03222468123',
  cartCount = 0,
  bookLabel = 'Book Now',
  fixed = false,
  scrolled = false,
  onBook,
  onCart,
  onLink
}) {
  const [open, setOpen] = useState(false);
  const [sc, setSc] = useState(false);
  useEffect(() => {
    if (!fixed) return;
    const h = () => setSc(window.scrollY > 40);
    h();
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, [fixed]);
  const go = l => e => {
    e.preventDefault();
    setOpen(false);
    onLink && onLink(l);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("nav", {
    className: 'az-nav' + (fixed ? ' az-nav--fixed' : '') + (scrolled || sc ? ' is-scrolled' : '')
  }, /*#__PURE__*/React.createElement("a", {
    className: "az-nav__logo",
    href: "#",
    onClick: go('Home')
  }, /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: "AZ Care.pk"
  })), /*#__PURE__*/React.createElement("ul", {
    className: "az-nav__links"
  }, links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l.label,
    className: l.children ? 'has-dd' : ''
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: go(l.label)
  }, l.label, l.children && /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-chevron-down az-nav__caret"
  })), l.children && /*#__PURE__*/React.createElement("div", {
    className: "az-nav__dd"
  }, /*#__PURE__*/React.createElement("div", {
    className: "az-nav__ddbox"
  }, l.children.map(c => /*#__PURE__*/React.createElement("a", {
    key: c.label,
    href: "#",
    onClick: go(c.label)
  }, c.label))))))), /*#__PURE__*/React.createElement("div", {
    className: "az-nav__right"
  }, /*#__PURE__*/React.createElement("a", {
    href: phoneHref,
    className: "az-btn az-btn--call"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-phone"
  }), " ", phone), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "az-btn az-btn--primary az-btn--sm",
    onClick: onBook
  }, bookLabel), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "az-btn az-btn--cart",
    onClick: onCart,
    "aria-label": "Open cart"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-cart-shopping"
  }), /*#__PURE__*/React.createElement("span", null, "Cart"), cartCount > 0 && /*#__PURE__*/React.createElement("span", {
    className: "az-btn__badge"
  }, cartCount))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "az-nav__burger",
    onClick: () => setOpen(true),
    "aria-label": "Menu"
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null))), /*#__PURE__*/React.createElement("div", {
    className: 'az-mobile' + (open ? ' is-open' : '')
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "az-mobile__close",
    onClick: () => setOpen(false)
  }, "\u2715"), links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    href: "#",
    onClick: go(l.label)
  }, l.label)), /*#__PURE__*/React.createElement("a", {
    href: "https://wa.me/923222468123",
    style: {
      color: 'var(--acc3)'
    }
  }, "WhatsApp Us")));
}

export default Nav
