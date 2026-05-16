// Repeating "DAO" marquee strip — SOLAIS hero-tail pattern in DAO palette.
const TIMES = 8;

export default function MarqueeBar({
  word = "DAO",
  className = "",
}: {
  word?: string;
  className?: string;
}) {
  return (
    <section
      className={`relative w-full overflow-hidden bg-ink py-8 tablet:py-16 ${className}`}
      aria-hidden
    >
      {/* Top/bottom soft fades match SOLAIS's bg-gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-ink to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-ink to-transparent pointer-events-none z-10" />

      <div className="marquee-track flex items-center">
        {Array.from({ length: TIMES * 2 }).map((_, i) => (
          <span
            key={i}
            className="font-display font-medium text-gold shrink-0 flex items-center text-[100px] phone:text-[140px] tablet:text-[200px] laptop:text-[260px] leading-none"
          >
            <span>{word}</span>
            <span className="mx-8 tablet:mx-16 translate-y-[60%] h-2 phone:h-3 tablet:h-4 laptop:h-6 w-[80px] phone:w-[140px] tablet:w-[200px] bg-gradient-to-l from-gold to-transparent" />
          </span>
        ))}
      </div>
    </section>
  );
}
