// Lifted verbatim from the AZ Care.pk design system (components/cards/StatCounter.jsx) by tools/extract-ds.mjs. Do not hand-edit.
import React from 'react'

const {
  useState,
  useEffect
} = React;
function StatCounter({
  value,
  label,
  animate = false
}) {
  const [v, setV] = useState(animate ? 0 : value);
  useEffect(() => {
    if (!animate) {
      setV(value);
      return;
    }
    let cur = 0;
    const step = value / 2200 * 16;
    const t = setInterval(() => {
      cur += step;
      if (cur >= value) {
        cur = value;
        clearInterval(t);
      }
      setV(Math.floor(cur));
    }, 16);
    return () => clearInterval(t);
  }, [value, animate]);
  return /*#__PURE__*/React.createElement("div", {
    className: "az-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "az-stat__val"
  }, (value >= 1000 ? v.toLocaleString() : v) + (value >= 100 ? '+' : '')), /*#__PURE__*/React.createElement("span", {
    className: "az-stat__lbl"
  }, label));
}

export default StatCounter
