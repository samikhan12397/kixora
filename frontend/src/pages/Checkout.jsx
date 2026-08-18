import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/api.js";
import { clearCart } from "../redux/slices/cartSlice.js";
import { showToast } from "../redux/slices/uiSlice.js";
import { useCurrency } from "../context/CurrencyContext.jsx";

const PAYMENT_DETAILS = {
  nayapay: { label: "NayaPay", id: "sk89215@nayapay" },
};

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((s) => s.cart);
  const { format } = useCurrency();

  const [method, setMethod] = useState("cod");
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [address, setAddress] = useState({ fullName: "", phone: "", street: "", city: "", postalCode: "" });
  const [submitting, setSubmitting] = useState(false);

  const total = items.reduce((sum, i) => sum + (i.product?.finalPrice ?? i.product?.price ?? 0) * i.quantity, 0);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (method === "nayapay" && !screenshot) {
      return dispatch(showToast({ type: "error", message: "Please upload your payment screenshot" }));
    }
    setSubmitting(true);
    try {
      let paymentScreenshotUrl = null;
      if (screenshot) {
        const form = new FormData();
        form.append("paymentScreenshot", screenshot);
        const { data } = await api.post("/uploads/payment-screenshot", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        paymentScreenshotUrl = data.url;
      }

      const { data: order } = await api.post("/orders", {
        shippingAddress: address,
        paymentMethod: method,
        paymentScreenshot: paymentScreenshotUrl,
      });

      dispatch(clearCart());
      navigate(`/order/success/${order._id}`);
    } catch (err) {
      dispatch(showToast({ type: "error", message: err.response?.data?.message || "Could not place order" }));
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="px-6 md:px-[5%] pt-32 pb-20 text-center">
        <p className="text-steel">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-[5%] pt-28 pb-20 max-w-4xl mx-auto">
      <h1 className="font-display text-4xl mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-[1.3fr_1fr] gap-10">
        <div className="space-y-8">
          <section>
            <h2 className="font-display text-xl mb-4">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="Full Name" className="admin-input col-span-2"
                value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
              <input required placeholder="Phone" className="admin-input col-span-2"
                value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
              <input required placeholder="Street Address" className="admin-input col-span-2"
                value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
              <input required placeholder="City" className="admin-input"
                value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              <input placeholder="Postal Code" className="admin-input"
                value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl mb-4">Payment Method</h2>
            <div className="space-y-3">
              {[
                { id: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives." },
                { id: "nayapay", label: "NayaPay", desc: "Transfer manually, then upload your screenshot." },
              ].map((opt) => (
                <label key={opt.id}
                  className={`block border rounded-lg p-4 cursor-pointer transition-colors ${
                    method === opt.id ? "border-volt bg-volt/5" : "border-steeldim"
                  }`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="method" checked={method === opt.id}
                      onChange={() => setMethod(opt.id)} className="accent-volt" />
                    <div>
                      <div className="font-semibold text-sm">{opt.label}</div>
                      <div className="text-xs text-steel">{opt.desc}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {method === "nayapay" && (
              <div className="mt-5 border border-steeldim rounded-lg p-5 bg-ink2">
                <div className="text-xs font-mono text-steel mb-3">SEND PAYMENT TO</div>
                <div className="text-sm space-y-1 mb-4">
                  <div>NayaPay ID: <span className="text-volt font-mono">{PAYMENT_DETAILS.nayapay.id}</span></div>
                </div>
                <div className="text-xs font-mono text-steel mb-2">UPLOAD PAYMENT SCREENSHOT</div>
                <input type="file" accept="image/*" onChange={handleFile}
                  className="text-sm text-steel file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-volt file:text-ink file:font-semibold file:text-xs" />
                {screenshotPreview && (
                  <img src={screenshotPreview} alt="Payment proof" className="mt-3 max-h-40 rounded border border-steeldim" />
                )}
                <p className="text-[11px] text-steel mt-3">
                  Your order will show as "Payment Under Review" until we verify the transfer — usually within a few hours.
                </p>
              </div>
            )}
          </section>
        </div>

        <div className="border border-steeldim rounded-lg p-6 h-fit">
          <h2 className="font-display text-xl mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map((i) => (
              <div key={i._id} className="flex justify-between text-sm">
                <span className="text-steel">{i.product?.name} x{i.quantity}</span>
                <span>{format((i.product?.finalPrice ?? i.product?.price ?? 0) * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-steeldim pt-4 flex justify-between items-center mb-6">
            <span className="text-steel">Total</span>
            <span className="font-display text-2xl text-volt">{format(total)}</span>
          </div>
          <button disabled={submitting} className="btn-primary w-full">
            {submitting ? "Placing Order…" : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}