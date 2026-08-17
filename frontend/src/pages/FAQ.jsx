import Accordion from "../components/Accordion.jsx";

const faqs = [
  { q: "Are these sneakers authentic?", a: "Every pair is verified before listing. If a pair fails our authentication check, it never goes on the site." },
  { q: "What condition grades mean", a: "New: unworn deadstock. Like-new: worn a handful of times, no visible flaws. Good: honest wear, fully functional. Fair: budget pairs with visible wear, priced accordingly." },
  { q: "How does shipping work?", a: "Orders ship within 2 business days via TCS, Leopards, M&P, or Trax depending on your city." },
  { q: "Can I return a pair?", a: "Yes — 30 days from delivery if the condition doesn't match the listing. See our Return Policy for details." },
  { q: "Do you restore the shoes?", a: "Yes, our team deep cleans, deodorizes, and re-laces every pair, and restores soles where needed." },
];

export default function FAQ() {
  return (
    <div className="px-6 md:px-[5%] pt-28 pb-20 max-w-2xl mx-auto">
      <h1 className="font-display text-5xl mb-10">Frequently Asked</h1>
      <Accordion items={faqs} />
    </div>
  );
}
