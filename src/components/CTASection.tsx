"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { setPose } from "./poseStore";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Claim pose 8 (finale) for the global logo while this section is on screen.
      const poseTrigger = ScrollTrigger.create({
        trigger: root.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => setPose(8),
        onEnterBack: () => setPose(8),
      });

      gsap.from(root.current?.querySelectorAll(".cta-anim") ?? [], {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
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
      className="section-pad relative max-w-7xl mx-auto w-full text-center"
    >
      <div className="flex flex-col items-center gap-8">
        <span className="cta-anim supertitle text-gold">Ready when you are</span>
        <h2 className="cta-anim is-h1 max-w-3xl">
          Let's build something the
          <br className="hidden tablet:block" /> market <span className="text-gold">can't ignore.</span>
        </h2>
        <p className="cta-anim text-ink-mid max-w-xl">
          Tell us about your brand. We'll come back within one business day with
          a clear plan and a fixed-fee proposal.
        </p>
        <div className="cta-anim flex flex-col phone:flex-row gap-4 mt-4">
          <Link
            href="/contact"
            className="bg-gold text-ink font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-full hover:bg-gold-light transition-colors"
          >
            Start a project
          </Link>
          <a
            href="mailto:hello@dao.studio"
            className="border border-ink/30 text-ink font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-full hover:border-gold hover:text-gold transition-colors"
          >
            hello@dao.studio
          </a>
        </div>
      </div>
    </section>
  );
}
