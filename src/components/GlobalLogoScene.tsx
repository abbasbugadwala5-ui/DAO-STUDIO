"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
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

const WHITE_DOTS = Array.from({ length: 54 }, (_, i) => ({
  top: ((i * 41) + 9) % 100,
  left: ((i * 67) + 5) % 100,
  size:
    i % 17 === 0
      ? 8
      : i % 11 === 0
        ? 6
        : i % 7 === 0
          ? 4
          : i % 3 === 0
            ? 2.5
            : 1.25,
  delay: ((i * 0.43) % 7).toFixed(2),
  duration: 8 + (i % 8),
  opacity: 0.22 + (i % 5) * 0.11,
}));

const WALL_GRID_COLUMNS = Array.from({ length: 19 }, (_, i) => i * 72 - 48);
const WALL_GRID_ROWS = Array.from({ length: 14 }, (_, i) => i * 64 - 36);

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
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    let raf = 0;

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScroll(window.scrollY);
        raf = 0;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const waveY = Math.sin(scroll * 0.006) * 42;
  const waveX = Math.cos(scroll * 0.004) * 28;
  const waveTilt = -11 + Math.sin(scroll * 0.002) * 5;
  const gridWave = scroll * 0.005;

  return (
    <>
      {/* === Layer -1: left-side black/gold shadow waves === */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      >
        <div
          className="absolute left-[-24vw] top-[-18vh] h-[145vh] w-[76vw] dao-shadow-wave dao-shadow-wave-a"
          style={{
            transform: `translate3d(${waveX}px, ${waveY}px, 0) rotate(${waveTilt}deg)`,
          }}
        />
        <div
          className="absolute left-[-16vw] top-[8vh] h-[124vh] w-[62vw] dao-shadow-wave dao-shadow-wave-b"
          style={{
            transform: `translate3d(${-waveX * 0.7}px, ${-waveY * 0.55}px, 0) rotate(${waveTilt * -0.75}deg)`,
          }}
        />
        <div
          className="absolute left-[-26vw] top-[30vh] h-[94vh] w-[70vw] dao-shadow-wave dao-shadow-wave-c"
          style={{
            transform: `translate3d(${waveX * 0.45}px, ${waveY * 0.85}px, 0) rotate(${waveTilt + 18}deg)`,
          }}
        />
        <div
          className="absolute left-[18vw] top-[18vh] h-[82vh] w-[48vw] dao-shadow-wave dao-shadow-wave-mid"
          style={{
            transform: `translate3d(${waveX * 0.3}px, ${-waveY * 0.35}px, 0) rotate(${waveTilt * 0.4}deg)`,
          }}
        />
      </div>

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
        className="fixed inset-0 pointer-events-none z-0 animate-grid-breathe overflow-hidden"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 85%)",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 85%)",
        }}
      >
        <svg
          className="absolute inset-[-7%] h-[114%] w-[114%]"
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
        >
          {WALL_GRID_COLUMNS.map((x, i) => {
            const topBend = Math.sin(gridWave + i * 0.55) * 10;
            const midBend = Math.cos(gridWave * 1.15 + i * 0.7) * 20;
            const bottomBend = Math.sin(gridWave * 0.85 + i * 0.42) * 12;

            return (
              <path
                key={`wall-col-${i}`}
                d={`M ${x + topBend} -80 C ${x - midBend} 180, ${x + midBend} 520, ${x + bottomBend} 880`}
                fill="none"
                stroke="rgba(12,12,12,0.07)"
                strokeWidth="1"
                className="dao-wall-grid-line"
              />
            );
          })}
          {WALL_GRID_ROWS.map((y, i) => {
            const leftBend = Math.cos(gridWave + i * 0.6) * 9;
            const midBend = Math.sin(gridWave * 1.1 + i * 0.52) * 17;
            const rightBend = Math.cos(gridWave * 0.9 + i * 0.44) * 11;

            return (
              <path
                key={`wall-row-${i}`}
                d={`M -90 ${y + leftBend} C 260 ${y - midBend}, 760 ${y + midBend}, 1290 ${y + rightBend}`}
                fill="none"
                stroke="rgba(12,12,12,0.07)"
                strokeWidth="1"
                className="dao-wall-grid-line"
              />
            );
          })}
        </svg>
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
                animationName: `float-slow-${["a", "b", "c"][variant]}`,
                animationDuration: `${p.duration}s`,
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
                animationDelay: `${p.delay}s`,
              }}
            />
          );
        })}
      </div>

      {/* === Layer 3b: bright white dots drifting across the viewport === */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
      >
        {WHITE_DOTS.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full dao-white-dot"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              transform: scroll
                ? `translate3d(${(Math.sin(scroll * 0.002 + i) * 18).toFixed(3)}px, ${(Math.cos(scroll * 0.0025 + i) * 22).toFixed(3)}px, 0px)`
                : "translate3d(0px, 0px, 0px)",
            }}
          />
        ))}
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
