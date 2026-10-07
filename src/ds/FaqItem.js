// Lifted verbatim from the AZ Care.pk design system (components/cards/FaqItem.jsx) by tools/extract-ds.mjs. Do not hand-edit.
import React from 'react'

const {
  useState
} = React;
function FaqItem({
  q,
  a,
  open,
  defaultOpen = false,
  onToggle
}) {
  const [o, setO] = useState(defaultOpen);
  const isOpen = open !== undefined ? open : o;
  return /*#__PURE__*/React.createElement("div", {
    className: 'az-faq' + (isOpen ? ' is-open' : '')
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "az-faq__q",
    onClick: () => {
      setO(!o);
      onToggle && onToggle();
    }
  }, /*#__PURE__*/React.createElement("span", null, q), /*#__PURE__*/React.createElement("div", {
    className: "az-faq__icon"
  }, "+")), /*#__PURE__*/React.createElement("div", {
    className: "az-faq__a"
  }, /*#__PURE__*/React.createElement("p", null, a)));
}

export default FaqItem
