import { useEffect, useState } from "react";
import api from "../../services/api.js";
import Loader from "../../components/Loader.jsx";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState(null);

  useEffect(() => {
    api.get("/admin/customers").then((res) => setCustomers(res.data));
  }, []);

  if (!customers) return <Loader />;

  return (
    <div>
      <h1 className="font-display text-4xl mb-8">Customers</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left font-mono text-[11px] text-steel tracking-widest border-b border-steeldim">
            <th className="py-2">Name</th><th>Email</th><th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c._id} className="border-b border-steeldim/50">
              <td className="py-3">{c.name}</td>
              <td className="text-steel">{c.email}</td>
              <td className="font-mono text-xs text-steel">
                {new Date(c.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {customers.length === 0 && <p className="text-steel text-sm mt-4">No customers yet.</p>}
    </div>
  );
}
