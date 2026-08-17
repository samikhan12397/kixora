import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchFeaturedGroups } from "../redux/slices/productSlice.js";
import HeroShowcase from "../components/HeroShowcase.jsx";
import ProductCard from "../components/ProductCard.jsx";

function Row({ title, subtitle, products, viewAllTo }) {
  if (!products?.length) return null;
  return (
    <section className="px-6 md:px-[5%] py-16">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-display text-4xl md:text-5xl">{title}</h2>
          {subtitle && <p className="text-steel text-sm mt-2">{subtitle}</p>}
        </div>
        <Link to={viewAllTo} className="text-sm text-volt hover:underline whitespace-nowrap">View all →</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {products.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </section>
  );
}

export default function Home() {
  const dispatch = useDispatch();
  const { featured, newArrivals, bestSellers, limitedEdition } = useSelector((s) => s.products);

  useEffect(() => { dispatch(fetchFeaturedGroups()); }, [dispatch]);

  return (
    <div>
      <HeroShowcase products={featured} />

      <div className="bg-paper text-ink overflow-hidden whitespace-nowrap py-4 border-y border-ink">
        <div className="inline-flex gap-10 animate-[scroll_20s_linear_infinite]">
          {Array(2).fill(null).map((_, i) => (
            <span key={i} className="inline-flex gap-10 font-display text-xl">
              <span>THRIFTED SNEAKERS</span><span>•</span><span>RESTORED BY HAND</span><span>•</span>
              <span>FAIR PRICES</span><span>•</span><span>WORN ONCE, LOVED TWICE</span><span>•</span>
            </span>
          ))}
        </div>
      </div>

      <Row title="Featured Collection" products={featured} viewAllTo="/shop" />
      <Row title="New Arrivals" subtitle="Just cleaned, just listed." products={newArrivals} viewAllTo="/shop?tag=new" />
      <Row title="Best Sellers" subtitle="What everyone keeps re-lacing." products={bestSellers} viewAllTo="/shop?tag=best-seller" />
      <Row title="Limited Edition" subtitle="Rare finds, one pair each." products={limitedEdition} viewAllTo="/shop?tag=limited" />

      <section className="px-6 md:px-[5%] py-20 bg-ink2 my-16">
        <h2 className="font-display text-4xl mb-10 text-center">What Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { name: "Ayesha K.", text: "Looked brand new. Couldn't believe it was thrifted." },
            { name: "Hamza R.", text: "Fast shipping, honest condition notes. Buying again." },
            { name: "Zara M.", text: "The restoration work on my Jordans was genuinely impressive." },
          ].map((r) => (
            <div key={r.name} className="bg-ink p-6 rounded border border-steeldim">
              <div className="text-volt mb-3">★★★★★</div>
              <p className="text-sm text-steel mb-4">"{r.text}"</p>
              <div className="text-xs font-mono">{r.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-[5%] py-20 text-center">
        <h2 className="font-display text-4xl md:text-5xl mb-4">JOIN THE CREW</h2>
        <p className="text-steel mb-8">First look at new drops. No spam, just sneakers.</p>
        <form onSubmit={(e) => e.preventDefault()} className="flex justify-center gap-3 max-w-md mx-auto flex-wrap">
          <input type="email" placeholder="your@email.com" required
            className="flex-1 min-w-[220px] bg-transparent border border-steeldim rounded px-4 py-3 text-sm focus:outline-none focus:border-volt" />
          <button type="submit" className="btn-primary">Subscribe</button>
        </form>
      </section>
    </div>
  );
}
