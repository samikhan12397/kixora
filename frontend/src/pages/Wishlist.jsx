import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "../redux/slices/wishlistSlice.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Wishlist() {
  const dispatch = useDispatch();
  const { products } = useSelector((s) => s.wishlist);
  useEffect(() => { dispatch(fetchWishlist()); }, [dispatch]);

  return (
    <div className="px-6 md:px-[5%] pt-28 pb-20">
      <h1 className="font-display text-5xl mb-10">Wishlist</h1>
      {products.length === 0 ? (
        <p className="text-steel text-center py-20">Nothing saved yet. Tap the ♥ on any sneaker to add it here.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
