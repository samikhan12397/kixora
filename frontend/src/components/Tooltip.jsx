import { useState } from "react";

export default function Tooltip({ label, children, position = "top" }) {
  const [show, setShow] = useState(false);

  const posClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          role="tooltip"
          className={`absolute z-50 whitespace-nowrap px-2.5 py-1.5 rounded text-[11px] font-mono bg-paper text-ink ${posClasses[position]}`}
        >
          {label}
        </span>
      )}
    </span>
  );
}
