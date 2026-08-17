import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { useLocale } from "../context/LocaleContext.jsx";

const RECENT_KEY = "kixora_recent_searches";

function getRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; }
  catch { return []; }
}
function saveRecent(term) {
  const recent = [term, ...getRecent().filter((t) => t !== term)].slice(0, 5);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
  return recent;
}

export default function SearchBar({ onNavigate }) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => { setRecent(getRecent()); }, [open]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); return; }
    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      api.get(`/products?search=${encodeURIComponent(query)}&limit=5`)
        .then((res) => setSuggestions(res.data.products || []))
        .catch(() => setSuggestions([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const goToSearch = (term) => {
    if (!term.trim()) return;
    saveRecent(term.trim());
    setOpen(false);
    setQuery("");
    navigate(`/shop?search=${encodeURIComponent(term.trim())}`);
    onNavigate?.();
  };

  return (
    <div ref={wrapRef} className="relative w-full md:w-64">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && goToSearch(query)}
        placeholder={t("nav_search_placeholder")}
        aria-label="Search products"
        className="w-full bg-ink2 border border-steeldim rounded px-4 py-2.5 text-sm focus:outline-none focus:border-volt"
      />

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-ink2 border border-steeldim rounded-md shadow-xl z-50 overflow-hidden">
          {query.trim() ? (
            <>
              {loading && <div className="px-4 py-3 text-xs text-steel font-mono">Searching…</div>}
              {!loading && suggestions.length === 0 && (
                <div className="px-4 py-3 text-xs text-steel font-mono">No matches for "{query}"</div>
              )}
              {suggestions.map((p) => (
                <button
                  key={p._id}
                  onClick={() => { saveRecent(query.trim()); setOpen(false); setQuery(""); navigate(`/product/${p.slug}`); onNavigate?.(); }}
                  className="w-full flex items-center justify-between px-4 py-3 text-left text-sm hover:bg-ink border-b border-steeldim/50 last:border-0"
                >
                  <span>{p.name}</span>
                  <span className="text-volt font-mono text-xs">${p.finalPrice ?? p.price}</span>
                </button>
              ))}
              {suggestions.length > 0 && (
                <button onClick={() => goToSearch(query)} className="w-full px-4 py-3 text-left text-xs font-mono text-steel hover:text-volt">
                  See all results for "{query}" →
                </button>
              )}
            </>
          ) : recent.length > 0 ? (
            <>
              <div className="px-4 py-2 text-[11px] font-mono text-steel tracking-widest">RECENT SEARCHES</div>
              {recent.map((term) => (
                <button key={term} onClick={() => goToSearch(term)} className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-ink">
                  <span className="text-steel">↺</span> {term}
                </button>
              ))}
            </>
          ) : (
            <div className="px-4 py-3 text-xs text-steel font-mono">Start typing to search…</div>
          )}
        </div>
      )}
    </div>
  );
}
