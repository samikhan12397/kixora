import { Link } from "react-router-dom";

export default function OrderFailed() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div>
        <div className="w-20 h-20 rounded-full bg-signal text-ink text-4xl flex items-center justify-center mx-auto mb-6">✕</div>
        <h1 className="font-display text-5xl mb-3">Order Failed</h1>
        <p className="text-steel mb-8">Something interrupted your order. Your bag hasn't been cleared — try again.</p>
        <Link to="/checkout" className="btn-primary">Back to Checkout</Link>
      </div>
    </div>
  );
}
