"use client";

import { useMemo } from "react";

type Mote = {
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  x: number;
};

export function Dust({ count = 10 }: { count?: number }) {
  const motes = useMemo<Mote[]>(() => {
    // Deterministic pseudo-random so server and client render identically
    const seeds: number[] = [];
    for (let i = 0, s = 7; i < count * 7; i++) {
      s = (s * 16807) % 2147483647;
      seeds.push(s / 2147483647);
    }
    return Array.from({ length: count }, (_, i) => {
      const r = (j: number) => seeds[i * 7 + j];
      return {
        left: `${r(0) * 100}%`,
        top: `${40 + r(1) * 60}%`,
        size: 1 + r(2) * 2,
        duration: 18 + r(3) * 22,
        delay: -r(4) * 30,
        opacity: 0.1 + r(5) * 0.3,
        x: -30 + r(6) * 60,
      };
    });
  }, [count]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {motes.map((m, i) => (
        <span
          key={i}
          className="mote"
          style={{
            left: m.left,
            top: m.top,
            width: m.size,
            height: m.size,
            animationDuration: `${m.duration}s`,
            animationDelay: `${m.delay}s`,
            ["--mote-opacity" as string]: m.opacity,
            ["--mote-x" as string]: `${m.x}px`,
          }}
        />
      ))}
    </div>
  );
}
