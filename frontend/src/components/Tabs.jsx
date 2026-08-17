import { useState } from "react";

export default function Tabs({ tabs }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="flex gap-6 border-b border-steeldim mb-6">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setActive(i)}
            className={`pb-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              active === i ? "border-volt text-paper" : "border-transparent text-steel hover:text-paper"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>{tabs[active]?.content}</div>
    </div>
  );
}
