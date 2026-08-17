import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api.js";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <form onSubmit={submit} className="w-full max-w-sm bg-ink2 border border-steeldim rounded p-8">
        <h1 className="font-display text-3xl mb-6">Set New Password</h1>
        {error && <p className="text-signal text-sm mb-4 font-mono">{error}</p>}
        <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-ink border border-steeldim rounded px-4 py-3 text-sm mb-6 focus:outline-none focus:border-volt" />
        <button className="btn-primary w-full">Reset Password</button>
      </form>
    </div>
  );
}
