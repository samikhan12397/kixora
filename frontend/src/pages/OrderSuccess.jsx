import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div>
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="w-20 h-20 rounded-full bg-volt text-ink text-4xl flex items-center justify-center mx-auto mb-6"
        >✓</motion.div>
        <h1 className="font-display text-5xl mb-3">Order Placed!</h1>
        <p className="text-steel mb-8">
          {order ? `Order #${order._id?.slice(-8).toUpperCase()} — $${order.grandTotal?.toFixed(2)}` : "Your order is confirmed."}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/order-tracking" className="btn-primary">Track Order</Link>
          <Link to="/shop" className="btn-ghost">Keep Shopping</Link>
        </div>
      </div>
    </div>
  );
}
