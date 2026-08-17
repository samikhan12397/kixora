import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div className="px-6 md:px-[5%] pt-28 pb-20 max-w-xl mx-auto">
      <h1 className="font-display text-5xl mb-8">Get In Touch</h1>
      {sent ? (
        <p className="text-volt">Thanks — we'll reply within 24 hours.</p>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="flex flex-col gap-4">
          <input required placeholder="Your name" className="bg-ink2 border border-steeldim rounded px-4 py-3 text-sm focus:outline-none focus:border-volt" />
          <input required type="email" placeholder="Your email" className="bg-ink2 border border-steeldim rounded px-4 py-3 text-sm focus:outline-none focus:border-volt" />
          <textarea required rows={5} placeholder="Message" className="bg-ink2 border border-steeldim rounded px-4 py-3 text-sm focus:outline-none focus:border-volt" />
          <button className="btn-primary">Send Message</button>
        </form>
      )}
    </div>
  );
}
