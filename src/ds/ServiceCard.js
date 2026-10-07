// Lifted verbatim from the AZ Care.pk design system (components/cards/ServiceCard.jsx) by tools/extract-ds.mjs. Do not hand-edit.
import React from 'react'

function ServiceCard({
  img,
  category,
  name,
  desc,
  price,
  bookLabel = 'BOOK NOW →',
  onClick,
  onBook
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "az-srv",
    onClick: onClick
  }, /*#__PURE__*/React.createElement("div", {
    className: "az-srv__img"
  }, /*#__PURE__*/React.createElement("img", {
    src: img,
    alt: name
  }), /*#__PURE__*/React.createElement("div", {
    className: "az-srv__ov"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "az-srv__cat"
  }, category), /*#__PURE__*/React.createElement("div", {
    className: "az-srv__title"
  }, name)))), /*#__PURE__*/React.createElement("div", {
    className: "az-srv__body"
  }, /*#__PURE__*/React.createElement("p", null, desc), /*#__PURE__*/React.createElement("div", {
    className: "az-srv__price"
  }, price), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "az-btn az-btn--soft az-btn--xs",
    onClick: e => {
      e.stopPropagation();
      onBook && onBook();
    }
  }, bookLabel)));
}

export default ServiceCard
