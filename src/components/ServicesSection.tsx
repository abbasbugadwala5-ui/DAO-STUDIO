"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { SERVICES } from "@/lib/services";
import { setPose } from "./poseStore";

gsap.registerPlugin(ScrollTrigger);

export default function ServicesSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Claim pose 5 for the global logo scene while this section is on screen.
      const poseTrigger = ScrollTrigger.create({
        trigger: root.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => setPose(5),
        onEnterBack: () => setPose(5),
      });

      const cards = root.current?.querySelectorAll<HTMLElement>(".service-card") ?? [];
      cards.forEach((card, i) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          delay: (i % 3) * 0.06,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
        });
      });

      return () => {
        poseTrigger.kill();
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="services"
      className="section-pad relative max-w-7xl mx-auto w-full"
    >
      <div className="flex flex-col gap-3 mb-16 max-w-2xl">
        <span className="supertitle flex items-center gap-1">
          <span className="px-3 py-1 bg-gold text-ink">Services</span>
          <span className="w-2 h-7 bg-gold" />
          <span className="w-1 h-7 bg-gold" />
        </span>
        <h2 className="is-h1 flex flex-col">
          <span>Twelve ways</span>
          <span className="flex items-center gap-4">
            <span className="accent-line h-[6px] w-[60px] laptop:w-[120px]" />
            <span>to grow.</span>
          </span>
        </h2>
        <p className="text-ink-mid mt-2 max-w-lg">
          A full-stack marketing studio. Whether you need one service or twelve,
          DAO is built to scale with your ambition.
        </p>
      </div>

      <div className="grid grid-cols-1 mini:grid-cols-2 laptop:grid-cols-3 gap-px bg-ink/15">
        {SERVICES.map((s) => (
          <article
            key={s.n}
            className="service-card group relative bg-cream/80 backdrop-blur-sm text-ink p-8 tablet:p-10 flex flex-col gap-6 min-h-[260px] hover:bg-ink hover:text-cream hover:-translate-y-2 hover:shadow-2xl hover:shadow-ink/20 transition-all duration-300 cursor-pointer will-change-transform"
          >
            <span className="font-mono text-xs text-ink-dim group-hover:text-bone-dim">{s.n}</span>
            <div className="mt-auto flex flex-col gap-2">
              <h3 className="is-h3 group-hover:text-gold transition-colors">
                {s.title}
              </h3>
              <p className="text-ink-mid group-hover:text-bone-mid text-sm transition-colors">{s.caption}</p>
            </div>
            <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity text-gold font-mono text-xs">
              →
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
