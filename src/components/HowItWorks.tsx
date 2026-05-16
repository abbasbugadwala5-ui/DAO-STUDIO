"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { setPose } from "./poseStore";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    n: "01",
    label: "Defining",
    title: "Find your voice",
    body: "We unpack what your brand stands for, who it serves, and where it can win. Positioning, messaging, and identity — established before a single ad runs.",
  },
  {
    n: "02",
    label: "Amplifying",
    title: "Build the engine",
    body: "Content, design, ads, video and SEO running in concert. Each channel feeds the next, compounding visibility across every place your customers look.",
  },
  {
    n: "03",
    label: "Owning",
    title: "Compound the gains",
    body: "We measure what moved the needle, double down on it, and turn early traction into category leadership. The goal isn't traffic — it's ownership.",
  },
];

export default function HowItWorks() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Claim pose 6 for the global logo while this section is on screen.
      const poseTrigger = ScrollTrigger.create({
        trigger: root.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => setPose(6),
        onEnterBack: () => setPose(6),
      });

      const steps = root.current?.querySelectorAll<HTMLElement>(".step") ?? [];
      steps.forEach((step) => {
        gsap.from(step, {
          y: 80,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: step, start: "top 80%" },
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
      id="how"
      className="section-pad relative max-w-7xl mx-auto w-full"
    >
      <div className="flex flex-col gap-3 mb-12 max-w-2xl">
        <span className="supertitle flex items-center gap-1">
          <span className="px-3 py-1 bg-gold text-ink">How it works</span>
          <span className="w-2 h-7 bg-gold" />
          <span className="w-1 h-7 bg-gold" />
        </span>
        <h2 className="is-h1 flex flex-col text-white">
          <span>Three moves.</span>
          <span className="flex items-center gap-4">
            <span className="accent-line h-[6px] w-[60px] laptop:w-[120px]" />
            <span>Repeatable.</span>
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 laptop:grid-cols-3 gap-6 tablet:gap-10">
        {STEPS.map((s) => (
          <div
            key={s.n}
            className="step relative border border-ink/15 p-8 tablet:p-10 flex flex-col gap-4 bg-cream/70 backdrop-blur-sm hover:border-gold/80 hover:bg-cream hover:-translate-y-2 hover:shadow-xl hover:shadow-gold/10 transition-all duration-300 will-change-transform"
          >
            <div className="flex items-center gap-3">
              <span className="size-8 flex items-center justify-center font-mono text-[10px] text-gold border border-gold">
                {s.n}
              </span>
              <span className="px-3 py-1 bg-gold text-ink font-mono text-xs uppercase tracking-widest">
                {s.label}
              </span>
            </div>
            <h3 className="is-h3 capitalize">{s.title}</h3>
            <p className="text-ink-mid text-sm leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
