// Lifted verbatim from the AZ Care.pk design system (components/layout/WAFloat.jsx) by tools/extract-ds.mjs. Do not hand-edit.
import React from 'react'

function WAFloat({
  href = 'https://wa.me/923222468123?text=Hello%20AZ%20Care%20Assalam%20o%20Alaikum!%20Mujhe%20cleaning%20service%20chahiye.',
  tip = 'Chat on WhatsApp!',
  fixed = true
}) {
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    target: "_blank",
    rel: "noreferrer",
    className: 'az-wa' + (fixed ? '' : ' az-wa--inline'),
    title: "WhatsApp AZ Care"
  }, /*#__PURE__*/React.createElement("div", {
    className: "az-wa__ring"
  }), /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-whatsapp"
  }), /*#__PURE__*/React.createElement("div", {
    className: "az-wa__tip"
  }, tip));
}

export default WAFloat
