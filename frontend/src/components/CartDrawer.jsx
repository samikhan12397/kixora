import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { closeDrawer, removeFromCart } from "../redux/slices/cartSlice.js";

export default function CartDrawer() {
  const dispatch = useDispatch();
  const { items, drawerOpen } = useSelector((s) => s.cart);
  const total = items.reduce((sum, i) => sum + (i.product?.finalPrice ?? i.product?.price ?? 0) * i.quantity, 0);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => dispatch(closeDrawer())} className="fixed inset-0 bg-black/55 z-[60]" />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35 }}
            className="fixed top-0 right-0 h-full w-[90vw] max-w-[420px] bg-ink2 z-[61] p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-2xl">YOUR BAG ({items.length})</h3>
              <button onClick={() => dispatch(closeDrawer())} className="w-9 h-9 border border-steeldim rounded hover:rotate-90 transition-transform">✕</button>
            </div>

            {items.length === 0 ? (
              <p className="text-steel text-sm">Your bag is empty. Time to fix that.</p>
            ) : (
              <div className="flex-1 overflow-y-auto flex flex-col gap-4">
                {items.map((i) => (
                  <div key={i._id} className="flex gap-3 items-center">
                    <img src={i.product?.images?.[0] || "https://placehold.co/80x80/1C2126/8A8F98"} className="w-16 h-16 rounded object-cover bg-[#1C2126]" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{i.product?.name}</div>
                      <div className="text-xs text-steel font-mono">SIZE {i.size} · QTY {i.quantity}</div>
                    </div>
                    <button onClick={() => dispatch(removeFromCart(i._id))} className="text-steeldim hover:text-signal text-xs">Remove</button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-auto pt-6 border-t border-steeldim">
              <div className="flex justify-between mb-4 font-mono text-sm">
                <span className="text-steel">Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Link to="/checkout" onClick={() => dispatch(closeDrawer())} className="btn-primary w-full block text-center">Checkout</Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
