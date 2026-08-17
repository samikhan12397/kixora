import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../redux/slices/authSlice.js";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);

  const submit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) navigate("/verify-otp", { state: { userId: result.payload.userId } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <form onSubmit={submit} className="w-full max-w-sm bg-ink2 border border-steeldim rounded p-8">
        <h1 className="font-display text-3xl mb-1">Create Account</h1>
        <p className="text-steel text-sm mb-6">Join the KIXORA crew</p>
        {error && <p className="text-signal text-sm mb-4 font-mono">{error}</p>}
        {["name", "email", "phone"].map((field) => (
          <div key={field} className="mb-4">
            <label className="text-xs font-mono text-steel capitalize">{field}</label>
            <input required={field !== "phone"} type={field === "email" ? "email" : "text"} value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="w-full bg-ink border border-steeldim rounded px-4 py-3 text-sm mt-1 focus:outline-none focus:border-volt" />
          </div>
        ))}
        <label className="text-xs font-mono text-steel">Password</label>
        <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full bg-ink border border-steeldim rounded px-4 py-3 text-sm mb-6 mt-1 focus:outline-none focus:border-volt" />
        <button disabled={status === "loading"} className="btn-primary w-full">{status === "loading" ? "Creating…" : "Create Account"}</button>
        <p className="text-xs text-steel text-center mt-5">
          Already have an account? <Link to="/login" className="text-volt">Log in</Link>
        </p>
      </form>
    </div>
  );
}
