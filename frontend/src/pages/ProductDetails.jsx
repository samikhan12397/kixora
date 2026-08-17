import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/api.js";
import { addToCart } from "../redux/slices/cartSlice.js";
import { toggleWishlistItem } from "../redux/slices/wishlistSlice.js";
import { showToast } from "../redux/slices/uiSlice.js";
import { useCurrency } from "../context/CurrencyContext.jsx";
import Rating from "../components/Rating.jsx";
import Badge from "../components/Badge.jsx";
import Tabs from "../components/Tabs.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ReviewCard from "../components/ReviewCard.jsx";
import Product360Viewer from "../components/Product360Viewer.jsx";
import Loader from "../components/Loader.jsx";

function ReviewsPanel({ productId }) {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 5, title: "", comment: "" });
  const [submitting, setSubmitting] = useState(false);

  const load = () => api.get(`/reviews/product/${productId}`).then((res) => setReviews(res.data));
  useEffect(load, [productId]);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/reviews", { productId, ...form });
      setForm({ rating: 5, title: "", comment: "" });
      dispatch(showToast({ message: "Review submitted" }));
      load();
    } catch (err) {
      dispatch(showToast({ type: "error", message: err.response?.data?.message || "Could not submit review" }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {reviews.length === 0 ? (
        <p className="text-steel text-sm mb-6">No reviews yet — be the first to share how these fit.</p>
      ) : (
        <div className="mb-8">{reviews.map((r) => <ReviewCard key={r._id} review={r} />)}</div>
      )}

      {user ? (
        <form onSubmit={submit} className="border-t border-steeldim pt-6">
          <div className="text-xs font-mono text-steel mb-3">YOUR RATING</div>
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => setForm({ ...form, rating: n })}
                className={`text-xl ${n <= form.rating ? "text-volt" : "text-steeldim"}`}>★</button>
            ))}
          </div>
          <input placeholder="Title (optional)" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-ink2 border border-steeldim rounded px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-volt" />
          <textarea required placeholder="Share your experience…" value={form.comment} rows={3}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            className="w-full bg-ink2 border border-steeldim rounded px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-volt" />
          <button disabled={submitting} className="btn-primary">{submitting ? "Submitting…" : "Submit Review"}</button>
        </form>
      ) : (
        <p className="text-steel text-sm border-t border-steeldim pt-6">
          <a href="/login" className="text-volt">Log in</a> to leave a review.
        </p>
      )}
    </div>
  );
}

export default function ProductDetails() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { format } = useCurrency();
  const [data, setData] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    api.get(`/products/${slug}`).then((res) => {
      setData(res.data);
      setColor(res.data.product.colors?.[0]);
      document.title = `${res.data.product.name} — KIXORA`;
    });
  }, [slug]);

  if (!data) return <Loader />;
  const { product, related } = data;
  const finalPrice = product.finalPrice ?? product.price;

  const handleAddToCart = () => {
    if (!size) return dispatch(showToast({ type: "error", message: "Pick a size first" }));
    dispatch(addToCart({ productId: product._id, size, color, quantity: 1 }));
    dispatch(showToast({ message: "Added to bag" }));
  };

  const handleBuyNow = () => {
    if (!size) return dispatch(showToast({ type: "error", message: "Pick a size first" }));
    dispatch(addToCart({ productId: product._id, size, color, quantity: 1 }));
    navigate("/checkout");
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: product.name, url }); }
      catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      dispatch(showToast({ message: "Link copied to clipboard" }));
    }
  };

  return (
    <div className="px-6 md:px-[5%] pt-28 pb-20">
      <Breadcrumb items={[
        { label: "Shop", to: "/shop" },
        ...(product.category?.name ? [{ label: product.category.name, to: `/shop?category=${product.category._id}` }] : []),
        { label: product.name },
      ]} />
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div
            className="aspect-square bg-[#1C2126] rounded overflow-hidden mb-4 cursor-zoom-in relative"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              e.currentTarget.style.setProperty("--zx", `${x}%`);
              e.currentTarget.style.setProperty("--zy", `${y}%`);
            }}
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
          >
            <img
              src={product.images?.[activeImg] || "https://placehold.co/600x600/1C2126/8A8F98?text=KIXORA"}
              className="w-full h-full object-cover transition-transform duration-150"
              style={zoom ? { transform: "scale(2)", transformOrigin: "var(--zx,50%) var(--zy,50%)" } : undefined}
              alt={product.name}
            />
          </div>
          <div className="flex gap-3">
            {(product.images?.length ? product.images : [1, 2, 3]).map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-16 rounded overflow-hidden border ${activeImg === i ? "border-volt" : "border-steeldim"}`}>
                <img src={typeof img === "string" ? img : "https://placehold.co/100x100/1C2126/8A8F98"} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          {product.video && (
            <video controls className="w-full mt-4 rounded border border-steeldim" poster={product.images?.[0]}>
              <source src={product.video} />
            </video>
          )}
        </div>

        <div>
          <div className="text-xs font-mono text-steel mb-2">{product.brand?.name} · SKU {product.sku}</div>
          <h1 className="font-display text-4xl mb-3">{product.name}</h1>
          <Rating value={product.ratingAverage} count={product.ratingCount} />
          <div className="flex items-center gap-3 mt-4 mb-2">
            <span className="font-display text-3xl text-volt">{format(finalPrice)}</span>
            {product.discountPercent > 0 && <span className="text-steeldim line-through">{format(product.price)}</span>}
            <Badge tone="steel">{product.condition?.toUpperCase()}</Badge>
          </div>
          <p className="text-steel text-sm leading-relaxed mb-6">{product.description}</p>

          <div className="mb-6">
            <div className="text-xs font-mono text-steel mb-2">SIZE (US)</div>
            <div className="flex flex-wrap gap-2">
              {product.sizes?.map((s) => (
                <button key={s} onClick={() => setSize(s)}
                  className={`w-11 h-11 rounded border text-sm ${size === s ? "bg-volt text-ink border-volt" : "border-steeldim hover:border-paper"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {product.colors?.length > 0 && (
            <div className="mb-6">
              <div className="text-xs font-mono text-steel mb-2">COLOR</div>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setColor(c)}
                    className={`w-9 h-9 rounded-full border-2 ${color === c ? "border-paper" : "border-transparent"}`}
                    style={{ background: c }} />
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mb-8">
            <button onClick={handleAddToCart} className="btn-primary flex-1">Add to Cart</button>
            <button onClick={handleBuyNow} className="btn-ghost flex-1">Buy Now</button>
            <button onClick={() => dispatch(toggleWishlistItem(product._id))} className="w-14 border border-steeldim rounded hover:text-signal hover:border-signal">♥</button>
            <button onClick={handleShare} className="w-14 border border-steeldim rounded hover:border-paper" aria-label="Share">↗</button>
          </div>

          <Tabs
            tabs={[
              { label: "Features", content: (
                <ul className="list-disc list-inside text-sm text-steel space-y-2">
                  {(product.features || ["Cleaned and sanitized", "Verified authentic", "Minor signs of wear noted in photos"]).map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              )},
              { label: "Material & Care", content: <p className="text-sm text-steel">{product.material || "Mixed leather and mesh upper. Spot clean only, air dry."}</p> },
              { label: "Shipping", content: <p className="text-sm text-steel">Ships within 2 business days via TCS, Leopards, M&P, or Trax depending on your region.</p> },
              { label: "360° View", content: <Product360Viewer frames={product.images360 || []} accent="#C8FF00" /> },
              { label: "Reviews", content: <ReviewsPanel productId={product._id} /> },
            ]}
          />
        </div>
      </div>

      {related?.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-3xl mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
