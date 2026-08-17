import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/customers", label: "Customers" },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen grid grid-cols-[220px_1fr] bg-ink text-paper font-body">
      <aside className="border-r border-steeldim p-6 flex flex-col gap-2">
        <div className="font-display text-2xl mb-6 tracking-wide">
          KIX<span className="text-volt">ORA</span>
          <div className="font-mono text-[10px] text-steel tracking-widest mt-1">ADMIN PANEL</div>
        </div>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `font-mono text-xs tracking-wide px-3 py-2 rounded border transition-colors ${
                isActive
                  ? "border-volt text-volt bg-volt/10"
                  : "border-transparent text-steel hover:text-paper hover:border-steeldim"
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
        <NavLink
          to="/"
          className="mt-auto font-mono text-xs text-steel hover:text-paper border-t border-steeldim pt-4"
        >
          ← Back to store
        </NavLink>
      </aside>
      <section className="p-8 overflow-y-auto">
        <Outlet />
      </section>
    </div>
  );
}
