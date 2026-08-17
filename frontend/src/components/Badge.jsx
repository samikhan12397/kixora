export default function Badge({ children, tone = "volt" }) {
  const tones = {
    volt: "border-volt text-volt",
    signal: "border-signal text-signal",
    steel: "border-steeldim text-steel",
  };
  return <span className={`badge ${tones[tone] || tones.volt}`}>{children}</span>;
}
