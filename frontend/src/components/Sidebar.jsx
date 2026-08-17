import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { closeSidebar } from "../redux/slices/uiSlice.js";
import { logout } from "../redux/slices/authSlice.js";
import { useLocale } from "../context/LocaleContext.jsx";

export default function Sidebar() {
  const dispatch = useDispatch();
  const { t } = useLocale();
  const open = useSelector((s) => s.ui.sidebarOpen);
  const user = useSelector((s) => s.auth.user);

  const links = [
    { to: "/shop?tag=new", label: t("sidebar_new_arrivals"), badge: "NEW" },
    { to: "/shop?tag=best-seller", label: t("sidebar_best_sellers"), badge: "🔥" },
    { to: "/shop?tag=limited", label: t("sidebar_limited_edition") },
    { to: "/shop?sale=true", label: t("sidebar_flash_sale"), badge: "-30%" },
    { to: "/about", label: t("sidebar_about") },
    { to: "/contact", label: t("sidebar_contact") },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => dispatch(closeSidebar())}
            className="fixed inset-0 bg-black/55 z-[60]"
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.2, 0.9, 0.2, 1] }}
            className="fixed top-0 right-0 h-full w-[88vw] max-w-[400px] bg-ink2 z-[61] p-6 flex flex-col gap-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center">
              <span className="font-display text-2xl">KIX<span className="text-volt">ORA</span></span>
              <button onClick={() => dispatch(closeSidebar())} className="w-9 h-9 border border-steeldim rounded hover:rotate-90 transition-transform">✕</button>
            </div>

            <div className="bg-volt text-ink text-center text-[11px] font-mono font-bold py-2.5 rounded">
              {t("sidebar_free_shipping")}
            </div>

            <nav className="flex flex-col">
              {links.map((l) => (
                <Link key={l.label} to={l.to} onClick={() => dispatch(closeSidebar())}
                  className="flex justify-between items-center py-4 border-b border-steeldim font-display text-xl hover:text-volt hover:pl-2 transition-all">
                  <span>{l.label}</span>
                  {l.badge && <em className="not-italic font-mono text-[11px] border border-signal text-signal px-2 py-0.5 rounded-full">{l.badge}</em>}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-4">
              {user ? (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">{user.name}</div>
                    <div className="text-xs text-steel">{user.email}</div>
                  </div>
                  <button onClick={() => dispatch(logout())} className="btn-ghost text-xs px-4 py-2">{t("sidebar_logout")}</button>
                </div>
              ) : (
                <Link to="/login" onClick={() => dispatch(closeSidebar())} className="btn-primary text-center">{t("sidebar_login_register")}</Link>
              )}
              <div className="flex gap-3">
                {["IG", "TT", "X"].map((s) => (
                  <a key={s} href="#" className="w-9 h-9 rounded-full border border-steeldim flex items-center justify-center text-xs text-steel hover:border-volt hover:text-volt transition-colors font-mono">{s}</a>
                ))}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
