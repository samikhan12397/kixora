export default function About() {
  return (
    <div className="px-6 md:px-[5%] pt-28 pb-20 max-w-3xl mx-auto">
      <div className="font-mono text-xs text-volt tracking-widest mb-4">OUR STORY</div>
      <h1 className="font-display text-5xl mb-8">Good Sneakers Deserve A Second Lap</h1>
      <p className="text-steel leading-relaxed mb-6">
        KIXORA started with a simple frustration: too many great sneakers end up forgotten in closets while
        people who'd wear them can't find them, or can't afford them new. We built a place where every pair
        is inspected, cleaned, honestly graded, and priced fair.
      </p>
      <p className="text-steel leading-relaxed mb-6">
        Every listing goes through the same process — authentication check, deep clean, sole restoration where
        needed, and photography that shows the shoe exactly as it is, wear and all.
      </p>
      <div className="grid grid-cols-3 gap-6 mt-12 text-center">
        {[["4,200+", "Pairs Restored"], ["98%", "Verified Authentic"], ["4.8★", "Average Rating"]].map(([n, l]) => (
          <div key={l}>
            <div className="font-display text-4xl text-volt mb-1">{n}</div>
            <div className="text-xs text-steel font-mono">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
