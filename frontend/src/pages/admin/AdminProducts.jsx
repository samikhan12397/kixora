import { useEffect, useState } from "react";
import api from "../../services/api.js";
import Loader from "../../components/Loader.jsx";

const emptyForm = {
  name: "", sku: "", price: "", stock: "", description: "", gender: "unisex", condition: "good",
};

export default function AdminProducts() {
  const [products, setProducts] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const load = () => {
    api.get("/products?limit=100").then((res) => setProducts(res.data.items || res.data));
  };

  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/products", {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        slug: form.name.toLowerCase().trim().replace(/\s+/g, "-"),
      });
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create product.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    load();
  };

  const handleStockChange = async (id, stock) => {
    await api.put(`/products/${id}`, { stock: Number(stock) });
    load();
  };

  return (
    <div>
      <h1 className="font-display text-4xl mb-8">Products</h1>

      <form onSubmit={handleCreate} className="border border-steeldim rounded p-6 mb-10 grid md:grid-cols-3 gap-4">
        <input required placeholder="Name" className="admin-input" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required placeholder="SKU" className="admin-input" value={form.sku}
          onChange={(e) => setForm({ ...form, sku: e.target.value })} />
        <input required type="number" placeholder="Price" className="admin-input" value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input required type="number" placeholder="Stock" className="admin-input" value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <input placeholder="Description" className="admin-input md:col-span-2" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="btn-primary md:col-span-3">Add Product</button>
        {error && <p className="text-signal font-mono text-xs md:col-span-3">{error}</p>}
      </form>

      {!products ? (
        <Loader />
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left font-mono text-[11px] text-steel tracking-widest border-b border-steeldim">
              <th className="py-2">Name</th><th>SKU</th><th>Price</th><th>Stock</th><th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b border-steeldim/50">
                <td className="py-3">{p.name}</td>
                <td className="font-mono text-steel">{p.sku}</td>
                <td>${p.price}</td>
                <td>
                  <input
                    type="number"
                    defaultValue={p.stock}
                    className="admin-input w-20 py-1"
                    onBlur={(e) => handleStockChange(p._id, e.target.value)}
                  />
                </td>
                <td>
                  <button onClick={() => handleDelete(p._id)} className="text-signal font-mono text-xs">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
