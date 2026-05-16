"use client";

import dynamic from "next/dynamic";
import { usePose } from "./poseStore";

const CompassLogo3D = dynamic(() => import("./CompassLogo3D"), {
  ssr: false,
  loading: () => null,
});

// Warm champagne glow that follows the logo from section to section.
// Soft and luminous — never a hard "blob" against cream.
const GLOW = {
  0: { x: 50, y: 50, size: 70, alpha: 0.5 },
  1: { x: 28, y: 45, size: 70, alpha: 0.55 },
  2: { x: 72, y: 50, size: 70, alpha: 0.55 },
  3: { x: 50, y: 65, size: 90, alpha: 0.6 },
  4: { x: 50, y: 50, size: 55, alpha: 0.4 },
  5: { x: 78, y: 62, size: 75, alpha: 0.5 },
  6: { x: 22, y: 38, size: 80, alpha: 0.5 },
  7: { x: 62, y: 28, size: 75, alpha: 0.45 },
  8: { x: 50, y: 50, size: 100, alpha: 0.65 },
} as const;

// Deterministic positions for floating particles. Mixed sizes, mixed timings.
const PARTICLES = Array.from({ length: 36 }, (_, i) => ({
  top: ((i * 37) + 7) % 100,
  left: ((i * 53) + 13) % 100,
  size: 1 + (i % 4),
  delay: ((i * 0.7) % 8).toFixed(2),
  duration: 9 + (i % 7),
  drift: 10 + (i % 5) * 4,
}));

// Diagonal light streaks — like camera lens flares cutting across the scene.
const STREAKS = [
  { top: 8, angle: -22, width: 130, delay: 0, duration: 14 },
  { top: 22, angle: -28, width: 110, delay: 4, duration: 18 },
  { top: 44, angle: -25, width: 140, delay: 1.5, duration: 16 },
  { top: 62, angle: -20, width: 100, delay: 6, duration: 13 },
  { top: 78, angle: -30, width: 125, delay: 2.5, duration: 20 },
];

// Mono-font code snippets that fade in and out at corners — SOLAIS style.
const CODE_BITS = [
  { top: "8%", left: "6%", text: "// vw_03 +sx02", delay: 0 },
  { top: "14%", right: "8%", text: "01100001", delay: 2 },
  { bottom: "12%", left: "4%", text: "{-0.213 R+074}", delay: 4 },
  { bottom: "22%", right: "6%", text: "010_", delay: 1 },
  { top: "55%", left: "3%", text: "00000_", delay: 3 },
];

export default function GlobalLogoScene() {
  const pose = usePose();
  const glow = GLOW[pose as keyof typeof GLOW] ?? GLOW[0];

  return (
    <>
      {/* === Layer 0: warm champagne glow following the logo === */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at ${glow.x}% ${glow.y}%,
            rgba(212,168,83,${glow.alpha}) 0%,
            rgba(232,200,120,${glow.alpha * 0.5}) ${glow.size * 0.4}%,
            rgba(250,247,241,0) ${glow.size}%)`,
          transition: "background 1200ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/* === Layer 1: subtle grid, masked to fade at edges === */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-0 animate-grid-breathe"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(12,12,12,0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(12,12,12,0.07) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 85%)",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 85%)",
        }}
      />

      {/* === Layer 2: diagonal light streaks (lens-flare style) === */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
      >
        {STREAKS.map((s, i) => (
          <div
            key={i}
            className="absolute h-px"
            style={{
              top: `${s.top}%`,
              left: "-15%",
              width: `${s.width}%`,
              transform: `rotate(${s.angle}deg)`,
              transformOrigin: "left center",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 40%, rgba(232,200,120,0.5) 55%, rgba(255,255,255,0.7) 70%, transparent 100%)",
              animation: `streak ${s.duration}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* === Layer 3: floating particles === */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
      >
        {PARTICLES.map((p, i) => {
          const variant = i % 3; // a/b/c keyframe variants give natural variety
          return (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                top: `${p.top}%`,
                left: `${p.left}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                background:
                  i % 5 === 0
                    ? "rgba(184,151,90,0.65)"
                    : "rgba(12,12,12,0.28)",
                boxShadow:
                  i % 5 === 0
                    ? "0 0 8px rgba(212,168,83,0.6)"
                    : "none",
                animation: `float-slow-${["a", "b", "c"][variant]} ${p.duration}s ease-in-out infinite`,
                animationDelay: `${p.delay}s`,
              }}
            />
          );
        })}
      </div>

      {/* === Layer 4: mono code snippets at corners === */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-[1] font-mono text-[10px] tracking-widest text-ink-dim"
      >
        {CODE_BITS.map((c, i) => (
          <span
            key={i}
            className="absolute animate-code-flicker"
            style={{
              top: c.top,
              left: c.left,
              right: c.right,
              bottom: c.bottom,
              animationDelay: `${c.delay}s`,
            }}
          >
            {c.text}
          </span>
        ))}
      </div>

      {/* === Layer 5: 3D logo (top of background stack) === */}
      <div className="fixed inset-0 pointer-events-none z-[2]">
        <CompassLogo3D pose={pose} className="w-full h-full" />
      </div>
    </>
  );
}
