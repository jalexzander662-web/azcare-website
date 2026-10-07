// Lifted verbatim from the AZ Care.pk design system (components/cards/TrustItem.jsx) by tools/extract-ds.mjs. Do not hand-edit.
import React from 'react'

function TrustItem({
  img,
  title,
  sub
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "az-titem"
  }, /*#__PURE__*/React.createElement("div", {
    className: "az-titem__ico"
  }, /*#__PURE__*/React.createElement("img", {
    src: img,
    alt: title
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, title), /*#__PURE__*/React.createElement("span", null, sub)));
}

export default TrustItem
