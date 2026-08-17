import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCart, removeFromCart } from "../redux/slices/cartSlice.js";
import { useCurrency } from "../context/CurrencyContext.jsx";

export default function Cart() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.cart);
  const { format } = useCurrency();
  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  const total = items.reduce((sum, i) => sum + (i.product?.finalPrice ?? i.product?.price ?? 0) * i.quantity, 0);

  return (
    <div className="px-6 md:px-[5%] pt-28 pb-20 max-w-4xl mx-auto">
      <h1 className="font-display text-5xl mb-10">Your Bag</h1>
      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-steel mb-6">Nothing here yet.</p>
          <Link to="/shop" className="btn-primary">Browse Sneakers</Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-5 mb-10">
            {items.map((i) => (
              <div key={i._id} className="flex items-center gap-4 border-b border-steeldim pb-5">
                <img src={i.product?.images?.[0] || "https://placehold.co/100x100/1C2126/8A8F98"} className="w-20 h-20 rounded object-cover bg-[#1C2126]" />
                <div className="flex-1">
                  <div className="font-semibold">{i.product?.name}</div>
                  <div className="text-xs text-steel font-mono mt-1">SIZE {i.size} · {i.color}</div>
                </div>
                <div className="font-display text-xl text-volt">{format((i.product?.finalPrice ?? i.product?.price ?? 0) * i.quantity)}</div>
                <button onClick={() => dispatch(removeFromCart(i._id))} className="text-steeldim hover:text-signal text-sm ml-2">Remove</button>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-steel">Subtotal</span>
            <span className="font-display text-3xl text-volt">{format(total)}</span>
          </div>
          <Link to="/checkout" className="btn-primary w-full block text-center mt-6">Proceed to Checkout</Link>
        </>
      )}
    </div>
  );
}
