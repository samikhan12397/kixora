import { useLocale } from "../context/LocaleContext.jsx";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value)}
      aria-label="Choose language"
      className="bg-transparent border border-steeldim rounded px-2 py-2 text-xs text-paper focus:outline-none focus:border-volt cursor-pointer"
    >
      <option value="en" className="bg-ink2">EN</option>
      <option value="ur" className="bg-ink2">اردو</option>
    </select>
  );
}
