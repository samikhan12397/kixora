import { createContext, useContext, useEffect, useState } from "react";
import translations from "../i18n/translations.js";

const LocaleContext = createContext(null);
const STORAGE_KEY = "kixora_locale";

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(() => localStorage.getItem(STORAGE_KEY) || "en");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ur" ? "rtl" : "ltr";
  }, [locale]);

  const t = (key) => translations[locale]?.[key] ?? translations.en[key] ?? key;

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
