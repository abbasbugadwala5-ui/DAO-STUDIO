"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { setPose } from "./poseStore";

gsap.registerPlugin(ScrollTrigger);

/**
 * Pinned mega-scroll hero, SOLAIS-faithful.
 *
 * Scroll arc (700lvh total):
 *   0.00 – 0.12   INTRO       DEFINE · AMPLIFY · OWN headline  | pose 0
 *   0.15 – 0.32   WHAT IS DAO sub-state 1 (Define, label right)    | pose 1
 *   0.32 – 0.52   WHAT IS DAO sub-state 2 (Amplify, label left)    | pose 2
 *   0.52 – 0.72   WHAT IS DAO sub-state 3 (Own, label bottom-right,
 *                 grid floor visible)                              | pose 3
 *   0.78 – 1.00   WHY DAO outro                                    | pose 4
 *
 * The headline "What is DAO?" persists across sub-states 1-3 just like the
 * "What is SOLAIS?" headline does in the reference screenshots.
 */
export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const pinTarget = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useGSAP(
    () => {
      const ctx = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        pin: pinTarget.current,
        scrub: 0.25,
        onUpdate: (self) => {
          // Quantize to 2 decimals so React only re-renders on meaningful
          // changes (~100 renders per full scroll instead of 1000+).
          const p = Math.round(self.progress * 100) / 100;
          setProgress((prev) => (prev === p ? prev : p));
          // Drive the global 3D scene (pose 0-4 belongs to Hero).
          let next = 0;
          if (p >= 0.78) next = 4;
          else if (p >= 0.56) next = 3;
          else if (p >= 0.36) next = 2;
          else if (p >= 0.16) next = 1;
          setPose(next);
        },
      });

      gsap.from("[data-anim='intro']", {
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        delay: 0.3,
      });

      return () => {
        ctx.kill();
      };
    },
    { scope: root },
  );

  const ramp = (a: number, b: number) =>
    Math.max(0, Math.min(1, (progress - a) / (b - a)));

  // Smooth in/out panel visibility helper.
  const panel = (start: number, fadeIn: number, fadeOut: number, end: number) => {
    if (progress < start || progress > end) return 0;
    if (progress < fadeIn) return ramp(start, fadeIn);
    if (progress > fadeOut) return 1 - ramp(fadeOut, end);
    return 1;
  };

  // ===== Panels =====
  const pIntro = panel(0, 0, 0.10, 0.15);
  // The 3 WHAT-IS-DAO sub-states overlap the headline but cycle the labels.
  // We render the headline as one panel that's visible across all three sub-
  // states, then 3 label panels that each cover their own range.
  const pHead = panel(0.15, 0.20, 0.70, 0.78);
  const pSub1 = panel(0.16, 0.22, 0.32, 0.36);
  const pSub2 = panel(0.36, 0.42, 0.52, 0.56);
  const pSub3 = panel(0.56, 0.60, 0.72, 0.76);
  const pOutro = panel(0.78, 0.82, 1.0, 1.0);

  // Pose mapping. CompassLogo3D smoothly lerps between targets, so flipping
  // the integer here triggers a graceful tween in 3D space.
  let pose = 0;
  if (progress >= 0.78) pose = 4;
  else if (progress >= 0.56) pose = 3;
  else if (progress >= 0.36) pose = 2;
  else if (progress >= 0.16) pose = 1;
  else pose = 0;

  return (
    <section ref={root} className="relative" style={{ height: "500lvh" }}>
      <div
        ref={pinTarget}
        className="h-lvh w-full overflow-hidden sticky top-0"
      >
        {/* 3D Canvas + atmospheric blob both live in <GlobalLogoScene>, fixed
            behind every section so the logo persists through the whole page. */}

        {/* ============ PANEL: INTRO ============ */}
        <div
          className="absolute inset-0 z-20 flex pointer-events-none"
          style={{ opacity: pIntro }}
        >
          <div className="flex flex-col tablet:flex-row gap-4 tablet:gap-24 w-full justify-between tablet:items-end self-end px-4 tablet:px-8 pb-8 tablet:pb-12">
            <h1
              className="is-h1 max-w-[725px] flex flex-col relative text-ink"
              data-anim="intro"
            >
              <span className="supertitle absolute -top-10 left-0 flex flex-row gap-1 items-center">
                <span className="px-3 py-0.5 bg-gold text-ink leading-none flex items-center">
                  DAO Studio
                </span>
                <span className="bg-gold w-2 h-7" />
                <span className="bg-gold w-1 h-7" />
              </span>
              <span className="block">DEFINE.</span>
              <span className="block flex items-center gap-2 phone:gap-4">
                <span className="accent-line text-gold h-[4px] phone:h-[6px] w-[40px] phone:w-[60px] laptop:w-[120px]" />
                <span className="shrink-0">AMPLIFY.</span>
              </span>
              <span className="block text-gold">OWN.</span>
            </h1>
            <p
              className="text-ink-mid max-w-[500px] text-balance"
              data-anim="intro"
            >
              <span className="hidden phone:inline">
                A digital marketing studio based in Dubai. We build brands that
                define their category, amplify across every channel, and own the
                conversation.{" "}
              </span>
              Clarity for a new kind of growth.
            </p>
          </div>
        </div>

        {/* ============ PERSISTENT HEADLINE: WHAT IS DAO? ============ */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ opacity: pHead }}
        >
          <h2 className="is-h1 max-w-[700px] flex flex-col absolute bottom-8 tablet:bottom-12 left-4 tablet:left-8 text-ink">
            <span className="supertitle absolute -top-10 left-0 flex items-center gap-1">
              <span className="px-3 py-0.5 bg-gold text-ink leading-none flex items-center">
                Understanding
              </span>
              <span className="bg-gold w-2 h-7" />
              <span className="bg-gold w-1 h-7" />
            </span>
            <span>What is</span>
            <span className="flex items-center gap-2 phone:gap-4">
              <span className="accent-line text-gold h-[4px] phone:h-[6px] w-[40px] phone:w-[60px] laptop:w-[120px]" />
              <span className="shrink-0 text-gold">DAO?</span>
            </span>
          </h2>
        </div>

        {/* ============ SUB-STATE 1: DEFINE (label RIGHT) ============ */}
        <Label
          opacity={pSub1}
          position="top-right"
          tag="01 · Definition"
          title="Brand Definition"
          body="Before a single ad runs, we lock down positioning, voice and identity. Every campaign that follows is built on that foundation."
        />

        {/* ============ SUB-STATE 2: AMPLIFY (label LEFT) ============ */}
        <Label
          opacity={pSub2}
          position="middle-left"
          tag="02 · Reach"
          title="Cross-Channel Amplification"
          body="Content, design, video, paid and SEO running in concert. Each channel feeds the next and compounds the impact."
        />

        {/* ============ SUB-STATE 3: OWN (label BOTTOM-RIGHT + grid floor) === */}
        <Label
          opacity={pSub3}
          position="bottom-right"
          tag="03 · Ownership"
          title="Category Leadership"
          body="We measure what moved the needle, double down on it, and turn early traction into lasting category leadership."
        />

        {/* ============ OUTRO: WHY DAO ============ */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ opacity: pOutro }}
        >
          <div className="absolute bottom-8 tablet:bottom-12 left-4 tablet:left-8 max-w-[725px]">
            <span className="supertitle absolute -top-10 left-0 flex items-center gap-1">
              <span className="px-3 py-0.5 bg-gold text-ink leading-none flex items-center">
                Your advantage
              </span>
              <span className="bg-gold w-2 h-7" />
              <span className="bg-gold w-1 h-7" />
            </span>
            <h2 className="is-h1 flex flex-col text-ink">
              <span>Why brands</span>
              <span className="flex items-center gap-4">
                <span className="accent-line text-gold h-[6px] w-[60px] laptop:w-[120px]" />
                <span className="shrink-0 text-gold">choose DAO</span>
              </span>
            </h2>
            <p className="text-ink-mid mt-6 max-w-md">
              Small senior team. Fixed-fee engagements. One studio talking to
              itself across twelve disciplines — so the work compounds instead
              of fragmenting.
            </p>
          </div>
        </div>

        {/* === Scroll cue (only at top) === */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 font-mono text-[10px] tracking-[0.4em] uppercase text-ink-dim transition-opacity"
          style={{ opacity: progress < 0.05 ? 1 : 0 }}
        >
          scroll
        </div>

        {/* === Sub-state progress dots (top-right) === */}
        <div
          className="absolute top-24 right-4 tablet:right-8 z-30 flex flex-col gap-2 transition-opacity duration-500"
          style={{ opacity: pHead }}
        >
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className="size-2 rounded-full transition-colors"
              style={{
                background:
                  pose === n ? "var(--color-gold)" : "rgba(12,12,12,0.18)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ Mesh-label (SOLAIS corner-bracket style) ============
function Label({
  opacity,
  position,
  tag,
  title,
  body,
}: {
  opacity: number;
  position: "top-right" | "middle-left" | "bottom-right";
  tag: string;
  title: string;
  body: string;
}) {
  const posClass =
    position === "top-right"
      ? "top-28 right-4 tablet:right-8 laptop:right-[8%] tablet:top-32 laptop:top-[18%]"
      : position === "middle-left"
      ? "top-1/2 left-4 tablet:left-8 -translate-y-1/2 laptop:left-[8%]"
      : "bottom-44 right-4 tablet:right-8 laptop:right-[8%] laptop:bottom-[18%]";

  return (
    <div
      className={`mesh-label ${posClass}`}
      style={{
        opacity,
        transition: "opacity 400ms ease",
      }}
    >
      <span className="label-corner tl" />
      <span className="label-corner tr" />
      <span className="label-corner bl" />
      <span className="label-corner br" />
      <div className="flex flex-col gap-2 text-ink bg-cream/85 backdrop-blur-sm px-4 py-3 border border-ink/10">
        <div className="flex items-center gap-2">
          <span className="border border-gold size-3 flex items-center justify-center shrink-0">
            <span className="size-1.5 bg-gold blink" />
          </span>
          <h3 className="supertitle text-gold !text-[12px]">{tag}</h3>
        </div>
        <h4 className="is-h3 !text-lg !leading-tight">{title}</h4>
        <p className="text-sm text-ink-mid leading-snug">{body}</p>
      </div>
    </div>
  );
}
