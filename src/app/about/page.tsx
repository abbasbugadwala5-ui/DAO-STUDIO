import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — DAO Studio",
  description:
    "DAO Studio is a Dubai-based marketing studio that defines brands, amplifies their reach, and helps them own their category.",
};

const PILLARS = [
  {
    letter: "D",
    word: "Define",
    body:
      "Every engagement starts with positioning. Who you are, who you serve, and why anyone should care. Without that, no campaign converts.",
  },
  {
    letter: "A",
    word: "Amplify",
    body:
      "We make brands impossible to miss. Across paid, organic, social, video and search — coordinated, not siloed.",
  },
  {
    letter: "O",
    word: "Own",
    body:
      "Visibility is rented. Authority is owned. Our work is built to compound, so the brand keeps earning long after the campaign ends.",
  },
];

export default function AboutPage() {
  return (
    <div className="section-pad max-w-7xl mx-auto w-full pt-32">
      <header className="mb-20 max-w-3xl">
        <span className="supertitle flex items-center gap-1">
          <span className="px-3 py-1 bg-gold text-ink">About</span>
          <span className="w-2 h-7 bg-gold" />
          <span className="w-1 h-7 bg-gold" />
        </span>
        <h1 className="is-h1 mt-6 flex flex-col">
          <span>A studio for brands</span>
          <span className="flex items-center gap-4">
            <span className="accent-line h-[6px] w-[60px] laptop:w-[120px]" />
            <span className="text-gold">built to last.</span>
          </span>
        </h1>
        <p className="text-ink-mid mt-8 text-lg leading-relaxed max-w-2xl">
          DAO Marketing Management LLC is a digital marketing studio based in
          Dubai, UAE. We work with founders and growth teams who want more than
          impressions — they want a brand that actually means something.
        </p>
      </header>

      <section className="grid grid-cols-1 laptop:grid-cols-3 gap-6 tablet:gap-10 mb-20">
        {PILLARS.map((p) => (
          <div
            key={p.letter}
            className="border border-ink/15 bg-cream/70 backdrop-blur-sm p-8 tablet:p-10 flex flex-col gap-4 hover:border-gold/60 transition-colors"
          >
            <span className="font-display text-7xl text-gold leading-none">
              {p.letter}
            </span>
            <h2 className="is-h3">{p.word}</h2>
            <p className="text-ink-mid text-sm leading-relaxed">{p.body}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 tablet:grid-cols-2 gap-10 max-w-5xl">
        <div className="flex flex-col gap-4">
          <span className="supertitle text-gold">What we believe</span>
          <p className="text-ink leading-relaxed">
            Marketing without brand is decoration. Brand without distribution is
            a private joke. We do both, in lockstep, because they only work
            together.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <span className="supertitle text-gold">How we work</span>
          <p className="text-ink leading-relaxed">
            Small, senior team. No layers between you and the people doing the
            work. Fixed-fee engagements with clear deliverables — no ambiguous
            retainers, no surprise invoices.
          </p>
        </div>
      </section>
    </div>
  );
}
