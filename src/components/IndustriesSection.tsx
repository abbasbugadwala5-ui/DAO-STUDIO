"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { INDUSTRIES } from "@/lib/services";
import { setPose } from "./poseStore";

gsap.registerPlugin(ScrollTrigger);

const COPY: Record<string, string> = {
  Ecommerce:
    "Funnels that turn first-time visitors into repeat buyers. Catalog, ads, retention — fully connected.",
  "Real Estate":
    "Cinematic listings, lead gen that actually converts, and brand systems built for a long sales cycle.",
  Education:
    "Enrollment-grade campaigns plus brand work that earns trust with parents, students, and faculty.",
  Finance:
    "Compliant, credible, and not boring. Brand and demand systems for financial advisors and firms.",
  FinTech:
    "Positioning, product marketing, and growth ops for fast-moving fintech and trading platforms.",
  "Food & Beverage":
    "Branding and content that travels — from menu to feed to shelf. Built to make people hungry.",
  B2B:
    "Account-based programs, technical content, and demand-gen for teams that sell complex software.",
  Automotive:
    "Showroom traffic, test-drive leads, and digital-first launches for OEMs and dealer groups.",
  Hospitality:
    "Identity, photography, and bookings for hotels, restaurants, and destination brands.",
};

export default function IndustriesSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Claim pose 7 for the global logo while this section is on screen.
      const poseTrigger = ScrollTrigger.create({
        trigger: root.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => setPose(7),
        onEnterBack: () => setPose(7),
      });

      gsap.from(root.current?.querySelectorAll(".find-your-anim") ?? [], {
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      gsap.from(root.current?.querySelectorAll(".diag-card") ?? [], {
        y: 80,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 60%" },
      });

      return () => {
        poseTrigger.kill();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="industries" className="relative w-full">
      <div className="grid grid-cols-1 tablet:grid-cols-5 gap-12 section-pad max-w-7xl mx-auto w-full">
        <div className="tablet:col-span-2 flex flex-col gap-6 text-ink">
          <span className="supertitle find-your-anim flex items-center gap-1">
            <span className="px-3 py-0.5 bg-gold text-ink leading-none flex items-center">
              Industries
            </span>
            <span className="bg-gold w-2 h-7" />
            <span className="bg-gold w-1 h-7" />
          </span>
          <h2 className="is-h1 find-your-anim flex flex-col">
            <span>Find Your</span>
            <span className="flex items-center gap-4">
              <span className="accent-line text-gold h-[6px] w-[60px] laptop:w-[120px]" />
              <span className="shrink-0 text-gold">Industry</span>
            </span>
          </h2>
          <p className="find-your-anim max-w-[400px] text-ink-mid">
            DAO Studio is built for the teams responsible for how brands are
            seen, understood, and chosen. Nine sectors we know cold.
          </p>
          <a
            href="/contact"
            className="find-your-anim mt-2 self-start bg-gold text-ink font-mono text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-gold-light transition-colors"
          >
            Get Started
          </a>
        </div>

        <div className="tablet:col-span-3 -mr-4 tablet:-mr-8 overflow-hidden relative">
          <div className="flex gap-4 tablet:gap-6 overflow-x-auto snap-x snap-mandatory pb-6 pr-4 tablet:pr-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {INDUSTRIES.map((name, i) => (
              <article
                key={name}
                className="diag-card snap-start shrink-0 w-[280px] tablet:w-[340px] laptop:w-[400px]"
              >
                <div className="flex items-center gap-2 supertitle text-gold">
                  <span>dao</span>
                  <span
                    className="h-[2px] w-12"
                    style={{
                      background:
                        "linear-gradient(to left, #B8975A, transparent)",
                    }}
                  />
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="is-h2 text-cream">{name}</h3>
                <p
                  className="mt-auto text-sm leading-relaxed text-bone-mid"
                  style={{ textIndent: "2rem" }}
                >
                  {COPY[name] ?? "A specialist team built for this sector."}
                </p>
                <div className="absolute bottom-6 right-6 flex items-center gap-[6px]">
                  {Array.from({ length: 7 }).map((_, k) => (
                    <span key={k} className="bg-gold h-5 w-[2px]" />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
