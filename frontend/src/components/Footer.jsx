import { Link } from "react-router-dom";
import { useLocale } from "../context/LocaleContext.jsx";

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-steeldim px-6 md:px-[5%] py-16 mt-24">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
        <div>
          <div className="font-display text-2xl mb-4">KIX<span className="text-volt">ORA</span></div>
          <p className="text-steel text-sm leading-relaxed max-w-[220px]">{t("footer_tagline")}</p>
        </div>
        <div>
          <div className="font-mono text-xs text-steel mb-4 tracking-wide">{t("footer_shop")}</div>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="/shop" className="hover:text-volt">{t("footer_all_sneakers")}</Link></li>
            <li><Link to="/shop?tag=new" className="hover:text-volt">{t("footer_new_arrivals")}</Link></li>
            <li><Link to="/shop?tag=best-seller" className="hover:text-volt">{t("footer_best_sellers")}</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-xs text-steel mb-4 tracking-wide">{t("footer_support")}</div>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="/faq" className="hover:text-volt">{t("footer_faq")}</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-volt">{t("footer_shipping_policy")}</Link></li>
            <li><Link to="/return-policy" className="hover:text-volt">{t("footer_return_policy")}</Link></li>
            <li><Link to="/order-tracking" className="hover:text-volt">{t("footer_track_order")}</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-xs text-steel mb-4 tracking-wide">{t("footer_company")}</div>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="/about" className="hover:text-volt">{t("footer_about")}</Link></li>
            <li><Link to="/contact" className="hover:text-volt">{t("footer_contact")}</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-volt">{t("footer_privacy_policy")}</Link></li>
            <li><Link to="/terms" className="hover:text-volt">{t("footer_terms")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-4 text-xs font-mono text-steeldim">
        <span>© {new Date().getFullYear()} KIXORA</span>
        <span>{t("footer_built_for")}</span>
      </div>
    </footer>
  );
}
