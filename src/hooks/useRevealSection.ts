"use client";

import { useEffect, useRef } from "react";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Section-wide scroll reveal orchestrator.
 *
 * Attach the returned ref to a section root. Inside, mark elements with:
 *   - .reveal-label  → fades + slides in from the left (0.6s, fires first)
 *   - .reveal-heading → split into chars, each rises from below with stagger
 *                       (30ms per char, 0.8s duration, starts 0.2s after label)
 *   - .reveal-body   → fades + slides up (0.6s, starts 0.3s after heading
 *                      finishes)
 *
 * Each section's IntersectionObserver fires ONCE at threshold 0.2.
 *
 * split-type loaded lazily via dynamic import so it stays out of initial JS.
 */
export function useRevealSection<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current) return;
    const root = ref.current;

    // Respect prefers-reduced-motion — show everything immediately.
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let splits: { revert: () => void; chars?: HTMLElement[] | null }[] = [];
    let io: IntersectionObserver | null = null;
    let cancelled = false;

    const labels = Array.from(
      root.querySelectorAll<HTMLElement>(".reveal-label"),
    );
    const headings = Array.from(
      root.querySelectorAll<HTMLElement>(".reveal-heading"),
    );
    const bodies = Array.from(
      root.querySelectorAll<HTMLElement>(".reveal-body"),
    );

    if (reducedMotion) {
      // No-op cleanup if motion is reduced.
      return;
    }

    // Lock in starting state synchronously so there's no flash of un-animated
    // text before split-type loads.
    labels.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateX(-20px)";
      el.style.willChange = "transform, opacity";
    });
    bodies.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.willChange = "transform, opacity";
    });
    // Headings get a temporary opacity:0 so we don't see un-split text first.
    headings.forEach((el) => {
      el.style.opacity = "0";
    });

    (async () => {
      const mod = await import("split-type");
      if (cancelled) return;
      const SplitType = mod.default;

      headings.forEach((h) => {
        const s = new SplitType(h, {
          types: "lines,words,chars",
          tagName: "span",
        });
        splits.push(s as unknown as { revert: () => void; chars?: HTMLElement[] | null });

        // Lines clip the rising chars
        s.lines?.forEach((line) => {
          line.style.overflow = "hidden";
          line.style.display = "block";
        });
        s.words?.forEach((w) => {
          w.style.display = "inline-block";
          w.style.verticalAlign = "top";
        });
        s.chars?.forEach((c) => {
          c.style.display = "inline-block";
          c.style.transform = "translateY(105%)";
          c.style.opacity = "0";
          c.style.willChange = "transform, opacity";
        });
        // Once chars are positioned, restore parent heading visibility.
        h.style.opacity = "1";
      });

      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;

            // Phase 1: labels (fires immediately on enter)
            labels.forEach((el) => {
              el.style.transition = `transform 0.6s ${EASE}, opacity 0.6s ${EASE}`;
              el.style.transform = "translateX(0)";
              el.style.opacity = "1";
            });

            // Phase 2: heading chars stagger (starts 0.2s after labels begin)
            let lastFinish = 200; // ms — at minimum, body waits this long
            splits.forEach((s) => {
              s.chars?.forEach((c: HTMLElement, i: number) => {
                const delay = 200 + i * 30;
                c.style.transition = `transform 0.8s ${EASE} ${delay}ms, opacity 0.8s ${EASE} ${delay}ms`;
                c.style.transform = "translateY(0)";
                c.style.opacity = "1";
                lastFinish = Math.max(lastFinish, delay + 800);
              });
            });

            // Phase 3: body (0.3s after the last heading char finishes)
            const bodyDelay = lastFinish + 300;
            bodies.forEach((el) => {
              el.style.transition = `transform 0.6s ${EASE} ${bodyDelay}ms, opacity 0.6s ${EASE} ${bodyDelay}ms`;
              el.style.transform = "translateY(0)";
              el.style.opacity = "1";
            });

            io?.disconnect();
            io = null;
          }
        },
        { threshold: 0.2 },
      );
      io.observe(root);
    })();

    return () => {
      cancelled = true;
      io?.disconnect();
      splits.forEach((s) => {
        try {
          s.revert();
        } catch {
          /* ignore */
        }
      });
    };
  }, []);

  return ref;
}
