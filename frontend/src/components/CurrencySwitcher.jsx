import { useCurrency, CURRENCIES } from "../context/CurrencyContext.jsx";

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value)}
      aria-label="Choose currency"
      className="bg-transparent border border-steeldim rounded px-2 py-2 text-xs text-paper focus:outline-none focus:border-volt cursor-pointer"
    >
      {Object.entries(CURRENCIES).map(([code, { label }]) => (
        <option key={code} value={code} className="bg-ink2">{code}</option>
      ))}
    </select>
  );
}
