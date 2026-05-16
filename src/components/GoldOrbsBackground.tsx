"use client";

import { useEffect, useState } from "react";

// Light-theme scroll-driven metallic background.
//
// Floating gold / champagne / white orbs drift across a warm cream surface
// as the user scrolls. The base bg colour also shifts subtly through 4
// phases (cream → warm cream → champagne tint → cream). A brushed-metal
// sheen overlays the whole thing for the "metallic gold" feel.
export default function GoldOrbsBackground() {
  const [scroll, setScroll] = useState(0);
  const [docH, setDocH] = useState(1);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      setDocH(
        Math.max(
          1,
          (document.documentElement.scrollHeight || 1) - window.innerHeight,
        ),
      );
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScroll(window.scrollY);
        raf = 0;
      });
    };
    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const p = Math.max(0, Math.min(1, scroll / docH));

  // 4 colour phases — all in the warm-light spectrum.
  const PHASES = [
    { bg: [250, 247, 241] }, // cream  (hero)
    { bg: [245, 234, 210] }, // warm cream (services / marquee)
    { bg: [238, 220, 178] }, // champagne tint (mid-page peak)
    { bg: [250, 247, 241] }, // back to cream (cta)
  ];
  const lerp = (a: number, b: number, t: number) =>
    Math.round(a + (b - a) * t);
  const segs = PHASES.length - 1;
  const seg = Math.min(segs - 1, Math.floor(p * segs));
  const segT = p * segs - seg;
  const bgColor = [0, 1, 2].map((i) =>
    lerp(PHASES[seg].bg[i], PHASES[seg + 1].bg[i], segT),
  );

  const t = scroll * 0.15;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{
        backgroundColor: `rgb(${bgColor.join(",")})`,
        transition: "background-color 200ms linear",
      }}
    >
      {/* === Primary gold orb that drifts down-right === */}
      <div
        className="absolute rounded-full blur-[140px] mix-blend-multiply"
        style={{
          width: 820,
          height: 820,
          top: -220 + t * 0.3,
          left: `${28 + Math.sin(scroll * 0.001) * 18}%`,
          opacity: 0.55,
          background:
            "radial-gradient(circle, rgba(184,151,90,0.85) 0%, rgba(184,151,90,0) 70%)",
        }}
      />

      {/* === Light gold orb on the right === */}
      <div
        className="absolute rounded-full blur-[160px] mix-blend-multiply"
        style={{
          width: 600,
          height: 600,
          top: 380 - t * 0.4,
          right: -140 + Math.cos(scroll * 0.0008) * 100,
          opacity: 0.45 + Math.sin(p * Math.PI) * 0.2,
          background:
            "radial-gradient(circle, rgba(212,168,83,0.85) 0%, rgba(212,168,83,0) 70%)",
        }}
      />

      {/* === Champagne accent, brightest mid-page === */}
      <div
        className="absolute rounded-full blur-[180px] mix-blend-multiply"
        style={{
          width: 480,
          height: 480,
          top: 900 + t * 0.2,
          left: `${60 - p * 25}%`,
          opacity: 0.3 + Math.sin(p * Math.PI * 1.4) * 0.25,
          background:
            "radial-gradient(circle, rgba(232,200,120,0.9) 0%, rgba(232,200,120,0) 70%)",
        }}
      />

      {/* === Deep gold underglow === */}
      <div
        className="absolute rounded-full blur-[200px] mix-blend-multiply"
        style={{
          width: 720,
          height: 720,
          top: 1500 - t * 0.3,
          right: `${18 + Math.sin(scroll * 0.0006) * 12}%`,
          opacity: 0.4,
          background:
            "radial-gradient(circle, rgba(184,151,90,0.9) 0%, rgba(184,151,90,0) 70%)",
        }}
      />

      {/* === Late-scroll warm highlight (CTA region) === */}
      <div
        className="absolute rounded-full blur-[150px] mix-blend-multiply"
        style={{
          width: 460,
          height: 460,
          top: 2400 + t * -0.5,
          left: "10%",
          opacity: Math.max(0, p - 0.55) * 1.5,
          background:
            "radial-gradient(circle, rgba(212,168,83,0.75) 0%, rgba(212,168,83,0) 70%)",
        }}
      />

      {/* === White highlight orb (gives the metal a brushed look) === */}
      <div
        className="absolute rounded-full blur-[180px] mix-blend-soft-light"
        style={{
          width: 520,
          height: 520,
          top: 200 + t * 0.5,
          left: `${10 + Math.cos(scroll * 0.0009) * 15}%`,
          opacity: 0.7,
          background:
            "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%)",
        }}
      />

      {/* === Brushed-metal sheen (diagonal gold gradient) === */}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-40"
        style={{
          background: `linear-gradient(${110 + p * 40}deg,
            rgba(255,255,255,0) 0%,
            rgba(255,250,235,0.6) 30%,
            rgba(232,200,120,0.5) 50%,
            rgba(255,250,235,0.6) 70%,
            rgba(255,255,255,0) 100%)`,
          backgroundSize: "200% 200%",
          backgroundPosition: `${50 + Math.sin(scroll * 0.0008) * 30}% ${50 + Math.cos(scroll * 0.0008) * 30}%`,
        }}
      />

      {/* === Gold grid texture === */}
      <div className="absolute inset-0 grid-background opacity-50" />

      {/* === Soft warm vignette so type stays readable === */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(250,247,241,0) 40%, rgba(184,151,90,0.18) 100%)",
        }}
      />
    </div>
  );
}
