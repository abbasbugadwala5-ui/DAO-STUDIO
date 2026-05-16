import type { Metadata } from "next";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services — DAO Studio",
  description:
    "Branding, advertising, content, video, social, SEO, websites, UI/UX, ecommerce, logo design and PPC — under one roof.",
};

export default function ServicesPage() {
  return (
    <div className="section-pad max-w-7xl mx-auto w-full pt-32">
      <header className="mb-20 max-w-3xl">
        <span className="supertitle flex items-center gap-1">
          <span className="px-3 py-1 bg-gold text-ink">Services</span>
          <span className="w-2 h-7 bg-gold" />
          <span className="w-1 h-7 bg-gold" />
        </span>
        <h1 className="is-h1 mt-6 flex flex-col text-white">
          <span>Twelve disciplines.</span>
          <span className="flex items-center gap-4">
            <span className="accent-line h-[6px] w-[60px] laptop:w-[120px]" />
            <span className="text-gold">One studio.</span>
          </span>
        </h1>
        <p className="text-ink-mid mt-8 text-lg leading-relaxed max-w-2xl">
          Hire us for one. Hire us for all twelve. Either way, you get a senior
          team that talks to each other — no agency-of-record handoffs, no
          channels working in isolation.
        </p>
      </header>

      <div className="grid grid-cols-1 mini:grid-cols-2 laptop:grid-cols-3 gap-px bg-ink/15">
        {SERVICES.map((s) => (
          <article
            key={s.n}
            className="group bg-cream/80 backdrop-blur-sm text-ink p-8 tablet:p-10 flex flex-col gap-6 min-h-[260px] hover:bg-ink hover:text-cream transition-colors"
          >
            <span className="font-mono text-xs text-ink-dim group-hover:text-bone-dim">{s.n}</span>
            <div className="mt-auto flex flex-col gap-3">
              <h2 className="is-h3 group-hover:text-gold transition-colors">
                {s.title}
              </h2>
              <p className="text-ink-mid group-hover:text-bone-mid text-sm transition-colors">{s.caption}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
