export default function Rating({ value = 0, count }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-1">
      {stars.map((s) => (
        <span key={s} className={s <= Math.round(value) ? "text-volt" : "text-steeldim"}>★</span>
      ))}
      {count !== undefined && <span className="text-xs text-steel ml-1 font-mono">({count})</span>}
    </div>
  );
}
