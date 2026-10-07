// Lifted verbatim from the AZ Care.pk design system (components/cards/ReviewCard.jsx) by tools/extract-ds.mjs. Do not hand-edit.
import React from 'react'

function ReviewCard({
  text,
  name,
  location,
  img
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "az-rev"
  }, /*#__PURE__*/React.createElement("div", {
    className: "az-rev__stars"
  }, "\u2605\u2605\u2605\u2605\u2605"), /*#__PURE__*/React.createElement("p", {
    className: "az-rev__text"
  }, text), /*#__PURE__*/React.createElement("div", {
    className: "az-rev__author"
  }, /*#__PURE__*/React.createElement("div", {
    className: "az-rev__av"
  }, /*#__PURE__*/React.createElement("img", {
    src: img,
    alt: name
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "az-rev__name"
  }, name), /*#__PURE__*/React.createElement("div", {
    className: "az-rev__loc"
  }, location))));
}

export default ReviewCard
