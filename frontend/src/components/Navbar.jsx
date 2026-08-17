import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openSidebar } from "../redux/slices/uiSlice.js";
import { openDrawer } from "../redux/slices/cartSlice.js";
import { useLocale } from "../context/LocaleContext.jsx";
import SearchBar from "./SearchBar.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";
import CurrencySwitcher from "./CurrencySwitcher.jsx";
import InstallPWAButton from "./InstallPWAButton.jsx";
import PushNotificationOptIn from "./PushNotificationOptIn.jsx";

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [blurred, setBlurred] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dispatch = useDispatch();
  const { t } = useLocale();
  const cartCount = useSelector((s) => s.cart.items.reduce((n, i) => n + i.quantity, 0));

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY && y > 120);
      setBlurred(y > 20);
      setLastY(y);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-[5%] py-5 transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${blurred ? "bg-ink/80 backdrop-blur-md" : "bg-transparent"}`}
    >
      <Link to="/" className="font-display text-2xl tracking-wide">
        KIX<span className="text-volt">ORA</span>
      </Link>
      <ul className="hidden md:flex gap-9 list-none">
        <li><Link to="/shop" className="text-steel hover:text-paper text-sm transition-colors">{t("nav_shop")}</Link></li>
        <li><Link to="/shop?tag=new" className="text-steel hover:text-paper text-sm transition-colors">{t("nav_new_arrivals")}</Link></li>
        <li><Link to="/wishlist" className="text-steel hover:text-paper text-sm transition-colors">{t("nav_wishlist")}</Link></li>
        <li><Link to="/faq" className="text-steel hover:text-paper text-sm transition-colors">{t("nav_faq")}</Link></li>
      </ul>
      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <CurrencySwitcher />
        <InstallPWAButton />
        <PushNotificationOptIn />
        {searchOpen ? (
          <SearchBar onNavigate={() => setSearchOpen(false)} />
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="w-11 h-11 border border-steeldim rounded flex items-center justify-center hover:border-paper transition-colors text-sm"
          >
            ⌕
          </button>
        )}
        <button onClick={() => dispatch(openDrawer())} className="relative border border-steeldim rounded px-4 py-2 text-sm hover:border-paper transition-colors">
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-volt text-ink text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
        <button onClick={() => dispatch(openSidebar())} aria-label="Open menu" className="w-11 h-11 border border-steeldim rounded flex flex-col items-center justify-center gap-1.5 hover:border-paper transition-colors">
          <span className="w-4 h-px bg-paper" />
          <span className="w-4 h-px bg-paper" />
          <span className="w-4 h-px bg-paper" />
        </button>
      </div>
    </nav>
  );
}
