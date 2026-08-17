import { useEffect, useState } from "react";
import api from "../../services/api.js";
import Loader from "../../components/Loader.jsx";

const StatCard = ({ label, value }) => (
  <div className="border border-steeldim rounded p-5 bg-ink2">
    <div className="font-mono text-[11px] text-steel tracking-widest mb-2">{label}</div>
    <div className="font-display text-3xl text-volt">{value}</div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then((res) => setStats(res.data))
      .catch(() => setError("Could not load dashboard stats. Is the backend running?"));
  }, []);

  if (error) return <p className="text-signal font-mono text-sm">{error}</p>;
  if (!stats) return <Loader />;

  return (
    <div>
      <h1 className="font-display text-4xl mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="TOTAL ORDERS" value={stats.totalOrders} />
        <StatCard label="REVENUE" value={`$${stats.totalRevenue.toLocaleString()}`} />
        <StatCard label="CUSTOMERS" value={stats.totalUsers} />
        <StatCard label="PRODUCTS" value={stats.totalProducts} />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-mono text-xs tracking-widest text-steel mb-4">PENDING ORDERS</h2>
          <div className="font-display text-5xl text-signal">{stats.pendingOrders}</div>
        </div>

        <div>
          <h2 className="font-mono text-xs tracking-widest text-steel mb-4">LOW STOCK ALERTS</h2>
          {stats.lowStock.length === 0 ? (
            <p className="text-steel text-sm">Nothing running low right now.</p>
          ) : (
            <ul className="space-y-2">
              {stats.lowStock.map((p) => (
                <li
                  key={p._id}
                  className="flex justify-between border-b border-steeldim pb-2 text-sm"
                >
                  <span>{p.name}</span>
                  <span className="font-mono text-signal">{p.stock} left · {p.sku}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
