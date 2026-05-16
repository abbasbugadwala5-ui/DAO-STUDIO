"use client";

import { useEffect, useState } from "react";

// Tiny shared pose store. Sections write to it when they enter view; the
// global 3D scene reads from it and lerps the logo through dramatic poses
// like a movie unfolding as the page scrolls.
const state: { pose: number; listeners: Set<() => void> } = {
  pose: 0,
  listeners: new Set(),
};

export function setPose(n: number) {
  if (state.pose === n) return;
  state.pose = n;
  state.listeners.forEach((l) => l());
}

export function getPose() {
  return state.pose;
}

export function usePose() {
  const [p, setP] = useState(state.pose);
  useEffect(() => {
    const fn = () => setP(state.pose);
    state.listeners.add(fn);
    return () => {
      state.listeners.delete(fn);
    };
  }, []);
  return p;
}
