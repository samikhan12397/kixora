import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

export default function Checkout() {
  const { items } = useSelector((s) => s.cart);
  const navigate = useNavigate();
  const [address, setAddress] = useState({ fullName: "", phone: "", street: "", city: "", state: "", postalCode: "", country: "Pakistan" });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");

  const subtotal = items.reduce((sum, i) => sum + (i.product?.finalPrice ?? i.product?.price ?? 0) * i.quantity, 0);

  const placeOrder = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/orders", { shippingAddress: address, paymentMethod, couponCode });
      navigate("/order-success", { state: { order: data } });
    } catch (err) {
      setError(err.response?.data?.message || "Order failed");
      navigate("/order-failed");
    }
  };

  return (
    <div className="px-6 md:px-[5%] pt-28 pb-20 max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
      <form onSubmit={placeOrder}>
        <h1 className="font-display text-4xl mb-8">Checkout</h1>
        {error && <p className="text-signal text-sm mb-4 font-mono">{error}</p>}

        <div className="text-xs font-mono text-steel mb-3 tracking-wide">SHIPPING ADDRESS</div>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {Object.keys(address).map((key) => (
            <input key={key} required={key !== "state"} placeholder={key} value={address[key]}
              onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
              className={`bg-ink2 border border-steeldim rounded px-4 py-3 text-sm focus:outline-none focus:border-volt capitalize ${key === "street" ? "col-span-2" : ""}`} />
          ))}
        </div>

        <div className="text-xs font-mono text-steel mb-3 tracking-wide">PAYMENT METHOD</div>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { v: "cod", l: "Cash on Delivery" }, { v: "bank_transfer", l: "Bank Transfer" },
            { v: "easypaisa", l: "Easypaisa" }, { v: "jazzcash", l: "JazzCash" },
          ].map((m) => (
            <button type="button" key={m.v} onClick={() => setPaymentMethod(m.v)}
              className={`border rounded px-4 py-3 text-sm text-left ${paymentMethod === m.v ? "border-volt text-volt" : "border-steeldim"}`}>
              {m.l}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-steel mb-3 tracking-wide">COUPON</div>
        <input placeholder="e.g. WELCOME10" value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
          className="w-full bg-ink2 border border-steeldim rounded px-4 py-3 text-sm mb-8 focus:outline-none focus:border-volt" />

        <button className="btn-primary w-full">Place Order — ${subtotal.toFixed(2)}</button>
      </form>

      <div className="bg-ink2 border border-steeldim rounded p-6 h-fit">
        <h2 className="font-display text-2xl mb-6">Order Summary</h2>
        {items.map((i) => (
          <div key={i._id} className="flex justify-between text-sm mb-3">
            <span className="text-steel">{i.product?.name} × {i.quantity}</span>
            <span>${((i.product?.finalPrice ?? i.product?.price ?? 0) * i.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t border-steeldim mt-4 pt-4 flex justify-between font-display text-2xl text-volt">
          <span>Total</span><span>${subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
