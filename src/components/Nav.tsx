"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/services", label: "SERVICES" },
  { href: "/work", label: "WORK" },
  { href: "/contact", label: "CONTACT" },
];

export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY.current;
      // Only react to non-trivial movement so jitter doesn't flicker the bar
      if (Math.abs(y - lastY.current) > 6) {
        setHidden(goingDown && y > 120);
        lastY.current = y;
      }
      setAtTop(y < 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed top-0 left-0 z-50 w-full transition-transform duration-300 will-change-transform",
        hidden ? "-translate-y-full" : "translate-y-0",
        atTop
          ? "bg-transparent"
          : "bg-cream/80 backdrop-blur-md border-b border-ink/10",
      ].join(" ")}
    >
      <div className="px-4 tablet:px-8 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="font-display font-semibold text-2xl tracking-tight">
          DAO
        </Link>

        <nav className="hidden tablet:flex items-center gap-1 font-mono text-xs uppercase tracking-widest">
          {LINKS.map((l, i) => (
            <span key={l.href} className="flex items-center">
              <Link
                href={l.href}
                className="px-3 py-2 hover:text-gold transition-colors"
              >
                {l.label}
              </Link>
              {i < LINKS.length - 1 && (
                <span className="text-ink-dim">·</span>
              )}
            </span>
          ))}
        </nav>

        <Link
          href="/contact"
          className="bg-gold text-ink font-mono text-xs uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-gold-light transition-colors"
        >
          Let's Talk
        </Link>
      </div>
    </header>
  );
}
