import { useState } from "react";

export default function Accordion({ items }) {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div className="divide-y divide-steeldim border-t border-b border-steeldim">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex justify-between items-center py-5 text-left font-display text-xl"
          >
            {item.q}
            <span className={`transition-transform ${openIdx === i ? "rotate-45" : ""}`}>+</span>
          </button>
          <div className={`grid transition-all duration-300 ${openIdx === i ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"} overflow-hidden`}>
            <p className="text-steel text-sm leading-relaxed min-h-0">{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
