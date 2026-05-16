"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    // No backend yet — surface a soft confirmation. Wire to /api/contact later.
    setTimeout(() => setStatus("sent"), 600);
  };

  if (status === "sent") {
    return (
      <div className="border border-gold/60 bg-cream/70 p-10 flex flex-col gap-3">
        <span className="supertitle text-gold">Received</span>
        <h2 className="is-h3">Thanks — we'll be in touch.</h2>
        <p className="text-ink-mid text-sm max-w-md">
          We aim to reply within one business day. If it's urgent, email{" "}
          <a href="mailto:hello@dao.studio" className="text-gold underline">
            hello@dao.studio
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 phone:grid-cols-2 gap-4">
        <label className="flex flex-col gap-2">
          <span className="supertitle text-ink-mid">Name</span>
          <input
            required
            name="name"
            className="bg-white border border-ink/20 px-4 py-3 text-ink focus:outline-none focus:border-gold transition-colors"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="supertitle text-ink-mid">Email</span>
          <input
            required
            type="email"
            name="email"
            className="bg-white border border-ink/20 px-4 py-3 text-ink focus:outline-none focus:border-gold transition-colors"
          />
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="supertitle text-ink-mid">Company</span>
        <input
          name="company"
          className="bg-white border border-ink/20 px-4 py-3 text-ink focus:outline-none focus:border-gold transition-colors"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="supertitle text-ink-mid">What do you need?</span>
        <textarea
          required
          name="message"
          rows={6}
          className="bg-white border border-ink/20 px-4 py-3 text-ink focus:outline-none focus:border-gold transition-colors resize-none"
        />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="self-start bg-gold text-ink font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-full hover:bg-gold-light transition-colors disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
