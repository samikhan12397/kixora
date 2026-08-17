import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "../context/CurrencyContext.jsx";

const shoeSVG = (fill) => (
  <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" className="w-full">
    <path d="M130,270 L690,270 C700,270 707,280 700,291 C650,312 300,317 158,309 C138,306 124,296 130,281 Z" fill="#1a1a1a" />
    <path d="M132,271 L688,271 L688,286 C620,297 300,301 165,296 C148,294 133,286 132,278 Z" fill={fill} />
    <path d="M120,262 C120,232 142,206 176,196 C212,186 232,150 272,140 C332,124 422,120 482,130 C562,142 632,166 676,206 C696,223 701,241 691,256 L691,271 L130,271 Z" fill="#f4f2ef" stroke="#d8d3cb" strokeWidth="2" />
    <path d="M162,232 C252,272 402,272 522,222 C562,207 602,197 652,207 C602,232 502,257 402,252 C302,250 202,247 162,232 Z" fill={fill} opacity="0.9" />
  </svg>
);

const FALLBACK_PRODUCTS = [
  { _id: "f1", name: "Kixora Trail Runner", price: 148, finalPrice: 148, colors: ["#C8FF00"] },
  { _id: "f2", name: "Kixora Court High", price: 189, finalPrice: 160.65, colors: ["#FF7A45"] },
  { _id: "f3", name: "Kixora Street Low", price: 79, finalPrice: 55.3, colors: ["#3DA9FC"] },
];

export default function HeroShowcase({ products }) {
  const { format } = useCurrency();
  const list = products?.length ? products.slice(0, 6) : FALLBACK_PRODUCTS;
  const [active, setActive] = useState(0);

  const current = list[active];
  const price = current.finalPrice ?? current.price;
  const accent = current.colors?.[0]
    ? (current.colors[0].startsWith("#") ? current.colors[0] : "#C8FF00")
    : "#C8FF00";

  const prev = () => setActive((i) => (i - 1 + list.length) % list.length);
  const next = () => setActive((i) => (i + 1) % list.length);

  return (
    <section className="px-6 md:px-[5%] pt-28 pb-16">
      <div
        className="rounded-[28px] p-3 md:p-4"
        style={{ background: "linear-gradient(135deg, #5B6B73 0%, #C7B8A8 55%, #C87A6E 100%)" }}
      >
        <div className="bg-[#F7F5F2] rounded-3xl overflow-hidden text-[#111]">
          <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-black/5">
            <div className="font-display text-xl tracking-wide">KIX<span className="text-[#C8FF00]">ORA</span></div>
            <div className="hidden sm:flex gap-8 text-xs font-semibold tracking-wide text-black/60">
              <span>SHOP</span>
              <span>COLLECTION</span>
              <span>BLOG</span>
            </div>
            <div className="text-lg">🛍</div>
          </div>

          <div className="relative px-6 md:px-10 py-10 md:py-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={current._id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4, ease: [0.2, 0.9, 0.2, 1] }}
                className="grid md:grid-cols-[1fr_1.2fr] gap-8 items-center"
              >
                <div>
                  <div className="text-xs font-mono tracking-widest text-black/40 mb-3">
                    KIXORA — THRIFTED
                  </div>
                  <h1 className="font-display text-5xl md:text-6xl leading-[0.95] mb-4">
                    {current.name.split(" ").slice(0, 2).join(" ").toUpperCase()}
                    <br />
                    <span style={{ color: accent }}>{current.name.split(" ").slice(2).join(" ").toUpperCase() || "SE"}</span>
                  </h1>
                  <p className="text-black/60 text-sm max-w-xs mb-6 leading-relaxed">
                    Verified authentic, inspected and cleaned before listing. Priced at {format(price)}.
                  </p>
                  <Link
                    to={current.slug ? `/product/${current.slug}` : "/shop"}
                    className="inline-block bg-black text-white font-semibold text-sm px-8 py-3.5 rounded-full hover:bg-[#222] transition-colors"
                  >
                    SHOP
                  </Link>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="w-full max-w-md">{shoeSVG(accent)}</div>
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 rotate-90 origin-right text-[10px] font-mono tracking-widest text-black/30 whitespace-nowrap">
                    FREE SHIPPING — on all orders above PKR 10,000
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4 px-6 md:px-10 pb-8">
            <button
              onClick={prev}
              aria-label="Previous"
              className="w-9 h-9 rounded-full border border-black/15 flex items-center justify-center hover:bg-black hover:text-white transition-colors flex-shrink-0"
            >
              ←
            </button>
            <div className="flex gap-3 overflow-x-auto">
              {list.map((p, i) => {
                const c = p.colors?.[0]?.startsWith("#") ? p.colors[0] : "#8A8F98";
                return (
                  <button
                    key={p._id}
                    onClick={() => setActive(i)}
                    className={`w-16 h-16 rounded-xl bg-white flex-shrink-0 flex items-center justify-center border-2 transition-all ${
                      i === active ? "border-black scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="w-11">{shoeSVG(c)}</div>
                  </button>
                );
              })}
            </div>
            <button
              onClick={next}
              aria-label="Next"
              className="w-9 h-9 rounded-full border border-black/15 flex items-center justify-center hover:bg-black hover:text-white transition-colors flex-shrink-0"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}