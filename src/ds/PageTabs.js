// Lifted verbatim from the AZ Care.pk design system (components/layout/PageTabs.jsx) by tools/extract-ds.mjs. Do not hand-edit.
import React from 'react'

function PageTabs({
  tabs,
  active,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "az-tabs"
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    type: "button",
    className: 'az-tab' + (t.id === active ? ' is-active' : ''),
    onClick: () => onChange && onChange(t.id)
  }, t.label)));
}

export default PageTabs
