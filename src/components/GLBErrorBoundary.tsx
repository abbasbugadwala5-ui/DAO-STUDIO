"use client";

import { Component, type ReactNode } from "react";

// Minimal error boundary so a missing/broken GLB doesn't crash the Canvas.
// Suspense alone catches the *loading* state; an actual fetch failure throws.
export default class GLBErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err: unknown) {
    console.warn(
      "[DAO] GLB failed to load, using procedural compass fallback:",
      err,
    );
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
