import { useEffect, useState } from "react";
import api from "../../services/api.js";
import Loader from "../../components/Loader.jsx";
import Badge from "../../components/Badge.jsx";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled", "returned"];

export default function AdminOrders() {
  const [orders, setOrders] = useState(null);

  const load = () => api.get("/orders/admin/all").then((res) => setOrders(res.data));
  useEffect(load, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    load();
  };

  if (!orders) return <Loader />;

  return (
    <div>
      <h1 className="font-display text-4xl mb-8">Orders</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left font-mono text-[11px] text-steel tracking-widest border-b border-steeldim">
            <th className="py-2">Order</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} className="border-b border-steeldim/50">
              <td className="py-3 font-mono text-xs">{o._id.slice(-8).toUpperCase()}</td>
              <td>{o.shippingAddress?.fullName || o.user?.name}</td>
              <td>${o.grandTotal}</td>
              <td><Badge tone={o.paymentStatus === "paid" ? "volt" : "signal"}>{o.paymentStatus}</Badge></td>
              <td>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                  className="admin-input py-1"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <p className="text-steel text-sm mt-4">No orders yet.</p>}
    </div>
  );
}
