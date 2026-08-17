import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api.js";

export default function VerifyOTP() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/verify-otp", { userId: state?.userId, otp });
      localStorage.setItem("kixora_token", data.token);
      localStorage.setItem("kixora_user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <form onSubmit={submit} className="w-full max-w-sm bg-ink2 border border-steeldim rounded p-8 text-center">
        <h1 className="font-display text-3xl mb-2">Verify Your Email</h1>
        <p className="text-steel text-sm mb-6">Enter the 6-digit code we sent you.</p>
        {error && <p className="text-signal text-sm mb-4 font-mono">{error}</p>}
        <input value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6}
          className="w-full text-center tracking-[0.5em] font-mono text-xl bg-ink border border-steeldim rounded px-4 py-3 mb-6 focus:outline-none focus:border-volt" />
        <button className="btn-primary w-full">Verify</button>
      </form>
    </div>
  );
}
