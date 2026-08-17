export default function PolicyPage({ title, children }) {
  return (
    <div className="px-6 md:px-[5%] pt-28 pb-20 max-w-2xl mx-auto">
      <h1 className="font-display text-5xl mb-8">{title}</h1>
      <div className="text-steel text-sm leading-relaxed space-y-4">{children}</div>
    </div>
  );
}
