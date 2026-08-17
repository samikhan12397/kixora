export default function Avatar({ name, src, size = 40 }) {
  const initials = name?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";
  const style = { width: size, height: size };

  if (src) {
    return <img src={src} alt={name} style={style} className="rounded-full object-cover border border-steeldim" />;
  }
  return (
    <div
      style={{ ...style, fontSize: size * 0.4 }}
      className="rounded-full bg-volt text-ink font-display flex items-center justify-center flex-shrink-0"
    >
      {initials}
    </div>
  );
}
