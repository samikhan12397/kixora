import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggleWishlistItem } from "../redux/slices/wishlistSlice.js";
import { useCurrency } from "../context/CurrencyContext.jsx";
import Rating from "./Rating.jsx";
import Badge from "./Badge.jsx";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { format } = useCurrency();
  const finalPrice = product.finalPrice ?? product.price;

  return (
    <div className="group relative bg-ink2 rounded overflow-hidden [perspective:1000px]">
      <button
        onClick={(e) => { e.preventDefault(); dispatch(toggleWishlistItem(product._id)); }}
        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-ink/70 backdrop-blur flex items-center justify-center hover:text-signal transition-colors"
        aria-label="Toggle wishlist"
      >
        ♥
      </button>

      {product.discountPercent > 0 && (
        <span className="absolute top-3 left-3 z-10"><Badge tone="signal">-{product.discountPercent}%</Badge></span>
      )}
      {product.isNewArrival && !product.discountPercent && (
        <span className="absolute top-3 left-3 z-10"><Badge tone="volt">NEW</Badge></span>
      )}

      <Link to={`/product/${product.slug}`}>
        <div className="aspect-square overflow-hidden bg-[#1C2126] transition-transform duration-500 group-hover:scale-105 group-hover:[transform:rotateX(2deg)_rotateY(-2deg)]">
          <img
            src={product.images?.[0] || "https://placehold.co/500x500/1C2126/8A8F98?text=KIXORA"}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <div className="text-[11px] font-mono text-steel mb-1 tracking-wide">{product.brand?.name || "KIXORA"}</div>
          <h3 className="font-semibold text-sm mb-2 line-clamp-1">{product.name}</h3>
          <Rating value={product.ratingAverage} count={product.ratingCount} />
          <div className="mt-2 flex items-center gap-2">
            <span className="font-display text-lg text-volt">{format(finalPrice)}</span>
            {product.discountPercent > 0 && (
              <span className="text-xs text-steeldim line-through">{format(product.price)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
