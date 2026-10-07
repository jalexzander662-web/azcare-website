// Lifted verbatim from the AZ Care.pk design system (components/layout/Section.jsx) by tools/extract-ds.mjs. Do not hand-edit.
import React from 'react'

function Section({
  tone = 'default',
  id,
  children,
  style
}) {
  const t = {
    alt: ' az-sec--alt',
    gallery: ' az-sec--gallery',
    services: ' az-sec--services',
    band: ' az-sec--band',
    trust: ' az-sec--trust'
  }[tone] || '';
  return /*#__PURE__*/React.createElement("section", {
    id: id,
    className: 'az-sec' + t,
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "az-sec__inner"
  }, children));
}

export default Section
