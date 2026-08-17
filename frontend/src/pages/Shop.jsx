import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../redux/slices/productSlice.js";
import ProductCard from "../components/ProductCard.jsx";
import Pagination from "../components/Pagination.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";
import { Skeleton } from "../components/Loader.jsx";

const SORTS = [
  { value: "-createdAt", label: "Newest" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "-ratingAverage", label: "Top Rated" },
];

export default function Shop() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { list, status, page, pages } = useSelector((s) => s.products);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [gender, setGender] = useState("");
  const [size, setSize] = useState("");
  const [sort, setSort] = useState("-createdAt");

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    dispatch(fetchProducts({
      search: search || undefined,
      gender: gender || undefined,
      size: size || undefined,
      sort,
      tag: searchParams.get("tag") || undefined,
      page: searchParams.get("page") || 1,
    }));
  }, [dispatch, search, gender, size, sort, searchParams]);

  return (
    <div className="px-6 md:px-[5%] pt-28 pb-20">
      <Breadcrumb items={[{ label: "Shop" }]} />
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-10">
        <div>
          <div className="font-mono text-xs text-volt tracking-widest mb-2">SHOP ALL</div>
          <h1 className="font-display text-5xl">Every Pair, Inspected.</h1>
        </div>
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search sneakers…"
          className="bg-ink2 border border-steeldim rounded px-4 py-3 text-sm w-full md:w-72 focus:outline-none focus:border-volt"
        />
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        <select value={gender} onChange={(e) => setGender(e.target.value)} className="bg-ink2 border border-steeldim rounded px-3 py-2 text-sm">
          <option value="">All Genders</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="unisex">Unisex</option>
          <option value="kids">Kids</option>
        </select>
        <select value={size} onChange={(e) => setSize(e.target.value)} className="bg-ink2 border border-steeldim rounded px-3 py-2 text-sm">
          <option value="">All Sizes</option>
          {[6, 7, 8, 9, 10, 11, 12].map((s) => <option key={s} value={s}>US {s}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-ink2 border border-steeldim rounded px-3 py-2 text-sm ml-auto">
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {status === "loading" ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-square" />)}
        </div>
      ) : list.length === 0 ? (
        <p className="text-steel text-center py-20">No sneakers match those filters. Try widening the search.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {list.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      <Pagination page={page} pages={pages} onChange={(p) => setSearchParams({ ...Object.fromEntries(searchParams), page: p })} />
    </div>
  );
}
