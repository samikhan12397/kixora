import { useState } from "react";
import api from "../services/api.js";

const STAGES = ["pending", "processing", "shipped", "delivered"];

export default function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const track = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.get(`/orders/${orderId}/track`);
      setOrder(data);
    } catch (err) {
      setError("Order not found");
      setOrder(null);
    }
  };

  const stageIdx = order ? STAGES.indexOf(order.status) : -1;

  return (
    <div className="px-6 md:px-[5%] pt-28 pb-20 max-w-2xl mx-auto">
      <h1 className="font-display text-4xl mb-8">Track Your Order</h1>
      <form onSubmit={track} className="flex gap-3 mb-10">
        <input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Order ID"
          className="flex-1 bg-ink2 border border-steeldim rounded px-4 py-3 text-sm focus:outline-none focus:border-volt" />
        <button className="btn-primary">Track</button>
      </form>
      {error && <p className="text-signal text-sm font-mono">{error}</p>}
      {order && (
        <div>
          <div className="flex justify-between mb-2">
            {STAGES.map((s, i) => (
              <div key={s} className="flex-1 text-center">
                <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-xs font-bold ${i <= stageIdx ? "bg-volt text-ink" : "bg-ink2 border border-steeldim text-steel"}`}>
                  {i + 1}
                </div>
                <div className={`text-xs font-mono capitalize ${i <= stageIdx ? "text-paper" : "text-steeldim"}`}>{s}</div>
              </div>
            ))}
          </div>
          {order.trackingNumber && (
            <p className="text-sm text-steel text-center mt-6 font-mono">{order.shippingCarrier} · {order.trackingNumber}</p>
          )}
        </div>
      )}
    </div>
  );
}
