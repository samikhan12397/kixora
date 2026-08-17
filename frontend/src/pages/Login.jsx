import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../redux/slices/authSlice.js";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);

  const submit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <form onSubmit={submit} className="w-full max-w-sm bg-ink2 border border-steeldim rounded p-8">
        <h1 className="font-display text-3xl mb-1">Welcome Back</h1>
        <p className="text-steel text-sm mb-6">Log in to KIXORA</p>
        {error && <p className="text-signal text-sm mb-4 font-mono">{error}</p>}
        <label className="text-xs font-mono text-steel">Email</label>
        <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full bg-ink border border-steeldim rounded px-4 py-3 text-sm mb-4 mt-1 focus:outline-none focus:border-volt" />
        <label className="text-xs font-mono text-steel">Password</label>
        <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full bg-ink border border-steeldim rounded px-4 py-3 text-sm mb-2 mt-1 focus:outline-none focus:border-volt" />
        <Link to="/forgot-password" className="text-xs text-steel hover:text-volt block mb-6">Forgot password?</Link>
        <button disabled={status === "loading"} className="btn-primary w-full">{status === "loading" ? "Logging in…" : "Log In"}</button>
        <p className="text-xs text-steel text-center mt-5">
          No account? <Link to="/register" className="text-volt">Register</Link>
        </p>
      </form>
    </div>
  );
}
