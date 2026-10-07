// Lifted verbatim from the AZ Care.pk design system (components/overlays/CartDrawer.jsx) by tools/extract-ds.mjs. Do not hand-edit.
import React from 'react'

function CartDrawer({
  open = false,
  inline = false,
  items = [],
  onClose,
  onQty,
  onRemove,
  onCheckout
}) {
  const count = items.reduce((a, i) => a + (i.quantity || 1), 0);
  const total = items.reduce((a, i) => a + (Number(i.price) || 0) * (i.quantity || 1), 0);
  const drawer = /*#__PURE__*/React.createElement("div", {
    className: 'az-drawer' + (inline ? ' az-drawer--inline' : ''),
    style: inline ? undefined : {
      right: open ? 0 : -400
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "az-drawer__head"
  }, /*#__PURE__*/React.createElement("h3", null, "Your Cart (", count, ")"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "az-drawer__body"
  }, items.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "az-drawer__empty"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-cart-shopping"
  }), /*#__PURE__*/React.createElement("p", null, "Your cart is currently empty.")) : items.map(it => /*#__PURE__*/React.createElement("div", {
    className: "az-line",
    key: it.id
  }, it.image && /*#__PURE__*/React.createElement("img", {
    src: it.image,
    alt: it.name
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h4", null, it.name), /*#__PURE__*/React.createElement("p", {
    className: "pr"
  }, "Rs. ", it.price), /*#__PURE__*/React.createElement("div", {
    className: "az-qty"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => onQty && onQty(it.id, (it.quantity || 1) - 1)
  }, "-"), /*#__PURE__*/React.createElement("span", null, it.quantity || 1), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => onQty && onQty(it.id, (it.quantity || 1) + 1)
  }, "+"))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rm",
    onClick: () => onRemove && onRemove(it.id)
  }, "\u2715")))), items.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "az-drawer__foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "az-drawer__total"
  }, /*#__PURE__*/React.createElement("span", null, "Total Amount:"), /*#__PURE__*/React.createElement("b", null, "Rs. ", total)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "az-drawer__cta",
    onClick: onCheckout
  }, "Proceed to Checkout")));
  if (inline) return drawer;
  return /*#__PURE__*/React.createElement(React.Fragment, null, open && /*#__PURE__*/React.createElement("div", {
    className: "az-drawer-scrim",
    onClick: onClose
  }), drawer);
}

export default CartDrawer
