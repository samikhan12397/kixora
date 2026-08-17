import { createContext, useContext, useEffect, useState } from "react";

// Static rates relative to USD. Swap for a live FX API in production
// (e.g. exchangerate.host) — kept static here so the demo works offline.
export const CURRENCIES = {
  USD: { symbol: "$", rate: 1, label: "USD — US Dollar" },
  PKR: { symbol: "Rs ", rate: 278.5, label: "PKR — Pakistani Rupee" },
  EUR: { symbol: "€", rate: 0.92, label: "EUR — Euro" },
  GBP: { symbol: "£", rate: 0.79, label: "GBP — British Pound" },
  AED: { symbol: "د.إ", rate: 3.67, label: "AED — UAE Dirham" },
};

const CurrencyContext = createContext(null);
const STORAGE_KEY = "kixora_currency";

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => localStorage.getItem(STORAGE_KEY) || "USD");

  useEffect(() => localStorage.setItem(STORAGE_KEY, currency), [currency]);

  const format = (usdAmount) => {
    const { symbol, rate } = CURRENCIES[currency] || CURRENCIES.USD;
    const converted = usdAmount * rate;
    const decimals = currency === "PKR" ? 0 : 2;
    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
