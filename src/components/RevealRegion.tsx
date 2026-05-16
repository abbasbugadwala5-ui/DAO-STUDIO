"use client";

import type { ElementType, ReactNode } from "react";
import { useRevealSection } from "@/hooks/useRevealSection";

/**
 * Thin client wrapper that runs useRevealSection on its root element.
 * Use inside server pages to wrap any region containing .reveal-label,
 * .reveal-heading, and .reveal-body elements.
 *
 * Pass `as` to render a semantic tag (e.g. "header", "section").
 */
export default function RevealRegion({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRevealSection<HTMLElement>();
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
