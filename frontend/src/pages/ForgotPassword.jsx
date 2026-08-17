import { useState } from "react";
import api from "../services/api.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="w-full max-w-sm bg-ink2 border border-steeldim rounded p-8">
        <h1 className="font-display text-3xl mb-2">Forgot Password</h1>
        {sent ? (
          <p className="text-volt text-sm">Check your email for a reset link.</p>
        ) : (
          <form onSubmit={submit}>
            <p className="text-steel text-sm mb-6">We'll email you a reset link.</p>
            {error && <p className="text-signal text-sm mb-4 font-mono">{error}</p>}
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-ink border border-steeldim rounded px-4 py-3 text-sm mb-6 focus:outline-none focus:border-volt" />
            <button className="btn-primary w-full">Send Reset Link</button>
          </form>
        )}
      </div>
    </div>
  );
}
