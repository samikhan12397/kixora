export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  return (
    <div className="flex justify-center gap-2 mt-12 font-mono text-sm">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)} className="w-9 h-9 border border-steeldim rounded disabled:opacity-30 hover:border-paper">‹</button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button key={p} onClick={() => onChange(p)} className={`w-9 h-9 rounded border ${p === page ? "bg-volt text-ink border-volt" : "border-steeldim hover:border-paper"}`}>{p}</button>
      ))}
      <button disabled={page >= pages} onClick={() => onChange(page + 1)} className="w-9 h-9 border border-steeldim rounded disabled:opacity-30 hover:border-paper">›</button>
    </div>
  );
}
