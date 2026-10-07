// Lifted verbatim from the AZ Care.pk design system (components/layout/Hero.jsx) by tools/extract-ds.mjs. Do not hand-edit.
import React from 'react'

const {
  useState,
  useEffect
} = React;
function Stat({
  t,
  label,
  animate
}) {
  const [v, setV] = useState(animate ? 0 : t);
  useEffect(() => {
    if (!animate) {
      setV(t);
      return;
    }
    let cur = 0;
    const step = t / 2200 * 16;
    const id = setInterval(() => {
      cur += step;
      if (cur >= t) {
        cur = t;
        clearInterval(id);
      }
      setV(Math.floor(cur));
    }, 16);
    return () => clearInterval(id);
  }, [t, animate]);
  return /*#__PURE__*/React.createElement("div", {
    className: "az-hero__stat"
  }, /*#__PURE__*/React.createElement("b", null, (t >= 1000 ? v.toLocaleString() : v) + (t >= 100 ? '+' : '')), /*#__PURE__*/React.createElement("span", null, label));
}
const DEFAULT_STATS = [{
  t: 10000,
  label: 'Cleaning Jobs Done'
}, {
  t: 5000,
  label: 'Happy Customers'
}, {
  t: 11,
  label: 'Services Offered'
}, {
  t: 6,
  label: 'Years Experience'
}];
function Hero({
  tagline = 'Pakistan ka Bharosa · AZ Care.pk · 6 Years Experience',
  lineMain = 'PROFESSIONAL CLEANING',
  lineAccent = 'SERVICES IN Pakistan',
  subhead = 'Safai Aisi Jo Nazar Aaye',
  trustLine = 'Pakistan Walon Ki Pehli Choice',
  whereLine = '"Where Cleanliness Meets Perfection"',
  bgImage,
  stats = DEFAULT_STATS,
  animate = true,
  flow = false,
  onBook,
  onExplore,
  onProducts
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: 'az-hero' + (flow ? ' az-hero--flow' : '')
  }, /*#__PURE__*/React.createElement("div", {
    className: "az-hero__bg",
    style: bgImage ? {
      '--hero-img': 'url("' + bgImage + '")'
    } : undefined
  }), /*#__PURE__*/React.createElement("div", {
    className: "az-hero__inner"
  }, /*#__PURE__*/React.createElement("span", {
    className: "az-tag az-tag--hero"
  }, tagline), /*#__PURE__*/React.createElement("h1", null, /*#__PURE__*/React.createElement("span", {
    className: "az-hero__main"
  }, lineMain), /*#__PURE__*/React.createElement("span", {
    className: "az-hero__accent"
  }, lineAccent)), /*#__PURE__*/React.createElement("div", {
    className: "az-hero__sub"
  }, subhead), /*#__PURE__*/React.createElement("div", {
    className: "az-hero__trust"
  }, trustLine), /*#__PURE__*/React.createElement("div", {
    className: "az-hero__where"
  }, whereLine), /*#__PURE__*/React.createElement("div", {
    className: "az-hero__btns"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "az-btn az-btn--primary az-btn--lg",
    onClick: onBook
  }, "BOOK YOUR SERVICE NOW"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "az-btn az-btn--secondary az-btn--lg",
    onClick: onExplore
  }, "Explore Services \u2192"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "az-btn az-btn--secondary az-btn--lg",
    onClick: onProducts
  }, "Products \u2192")), /*#__PURE__*/React.createElement("div", {
    className: "az-hero__stats"
  }, stats.map((s, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: s.label
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    className: "az-hero__div"
  }), /*#__PURE__*/React.createElement(Stat, {
    t: s.t,
    label: s.label,
    animate: animate
  }))))));
}

export default Hero
