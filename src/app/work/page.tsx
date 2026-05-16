import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work — DAO Studio",
  description: "Selected work from DAO Studio.",
};

const CASES = [
  { sector: "FinTech", title: "A challenger bank's first ad system", year: "2025" },
  { sector: "Hospitality", title: "Repositioning a luxury group for Gen Z", year: "2025" },
  { sector: "Ecommerce", title: "Scaling a beauty brand 7×", year: "2024" },
  { sector: "Real Estate", title: "A new identity for a Dubai developer", year: "2024" },
  { sector: "Education", title: "Rebrand and growth engine, Year One", year: "2024" },
  { sector: "B2B", title: "A SaaS launch that hit 10k MRR in 60 days", year: "2024" },
];

export default function WorkPage() {
  return (
    <div className="section-pad max-w-7xl mx-auto w-full pt-32">
      <header className="mb-20 max-w-3xl">
        <span className="supertitle flex items-center gap-1">
          <span className="px-3 py-1 bg-gold text-ink">Work</span>
          <span className="w-2 h-7 bg-gold" />
          <span className="w-1 h-7 bg-gold" />
        </span>
        <h1 className="is-h1 mt-6 flex flex-col">
          <span>Selected</span>
          <span className="flex items-center gap-4">
            <span className="accent-line h-[6px] w-[60px] laptop:w-[120px]" />
            <span className="text-gold">engagements.</span>
          </span>
        </h1>
        <p className="text-ink-mid mt-8 max-w-2xl">
          A snapshot of work shipped over the last 18 months. Full case studies
          available on request — most clients prefer we keep specifics behind a
          handshake.
        </p>
      </header>

      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-px bg-ink/15">
        {CASES.map((c, i) => (
          <article
            key={c.title}
            className="group bg-cream/80 backdrop-blur-sm text-ink p-8 tablet:p-12 flex flex-col gap-6 min-h-[320px] hover:bg-ink hover:text-cream transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs font-mono text-ink-dim group-hover:text-bone-dim transition-colors">
              <span>{String(i + 1).padStart(2, "0")}</span>
              <span>{c.year}</span>
            </div>
            <div
              aria-hidden
              className="h-40 rounded border border-ink/15 group-hover:border-bone-dim relative overflow-hidden transition-colors"
              style={{
                background:
                  "linear-gradient(135deg, rgba(184,151,90,0.18), rgba(232,200,120,0.12))",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(184,151,90,0.35), transparent 60%)",
                }}
              />
              <span className="absolute bottom-3 right-3 font-mono text-[10px] text-ink-dim group-hover:text-bone-dim tracking-widest transition-colors">
                {c.sector.toUpperCase()}
              </span>
            </div>
            <h2 className="is-h3 mt-auto group-hover:text-gold transition-colors">
              {c.title}
            </h2>
            <span className="font-mono text-xs text-ink-dim group-hover:text-gold transition-colors">
              Request the case study →
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}
