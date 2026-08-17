export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-ink2 rounded ${className}`} />;
}

export default function Loader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-steeldim border-t-volt rounded-full animate-spin" />
    </div>
  );
}
