import { Link } from "react-router-dom";

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-2 text-xs font-mono text-steel mb-6">
      <Link to="/" className="hover:text-volt transition-colors">Home</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className="text-steeldim">/</span>
          {item.to ? (
            <Link to={item.to} className="hover:text-volt transition-colors">{item.label}</Link>
          ) : (
            <span className="text-paper">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
