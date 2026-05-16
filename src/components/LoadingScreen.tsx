"use client";

import { useEffect, useRef, useState } from "react";

// 12x12 grid (144 blocks) — fade-away wave on initial mount.
// Mirrors the SOLAIS opening animation.
const COLS = 12;
const ROWS = 12;

export default function LoadingScreen() {
  const [hidden, setHidden] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // After the wave completes, unmount so the grid doesn't sit in the DOM.
    const t = window.setTimeout(() => setHidden(true), 2000);
    return () => window.clearTimeout(t);
  }, []);

  if (hidden) return null;

  return (
    <div ref={rootRef} className="loading-grid" aria-hidden>
      {Array.from({ length: COLS * ROWS }).map((_, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        // Deterministic jitter so SSR markup matches the client.
        const jitter = (i * 73) % 100;
        const delay = (col + row) * 35 + jitter;
        return (
          <div
            key={i}
            className="loading-block loading-block-anim"
            style={{ ["--delay" as string]: `${delay}ms` }}
          />
        );
      })}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="font-mono text-xs uppercase tracking-[0.4em] text-ink mix-blend-difference">
          DAO · loading
        </span>
      </div>
    </div>
  );
}
