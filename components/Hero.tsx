"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Dust } from "@/components/Dust";

const ease = [0.16, 1, 0.3, 1] as const;

const dares = [
  "Ask the question you'd never ask a polite AI.",
  "Want honesty or a hug? Wrong site for the hug.",
  "Sharp wit. Honest answers. No corporate smile.",
  "Truth is bitter. Still better than fluff.",
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 80]);
  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, reduced ? 1 : 1.08]
  );
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -40]);

  const [dareIndex, setDareIndex] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (reduced) {
      setTyped(dares[0]);
      return;
    }

    let cancelled = false;
    let char = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const line = dares[dareIndex];

    const type = () => {
      if (cancelled) return;
      char += 1;
      setTyped(line.slice(0, char));
      if (char < line.length) {
        timeout = setTimeout(type, 28);
      } else {
        timeout = setTimeout(() => {
          if (cancelled) return;
          setDareIndex((i) => (i + 1) % dares.length);
          char = 0;
          setTyped("");
        }, 2800);
      }
    };

    timeout = setTimeout(type, 400);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [dareIndex, reduced]);

  return (
    <section
      ref={ref}
      id="about"
      className="relative flex min-h-[100svh] items-end overflow-hidden"
    >
      {/* Full-bleed cinematic plate — not a card, the whole stage */}
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 origin-center"
      >
        <Image
          src="/images/hero.png"
          alt="Gommala Gang — unfiltered AI energy in a dark room with a glowing CRT"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[58%_center] sm:object-center"
        />
      </motion.div>

      {/* Atmosphere washes — photo as stage light, not a framed tile */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-gg-background from-[12%] via-gg-background/85 via-[42%] to-gg-background/25 sm:via-gg-background/70 sm:to-gg-background/10"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-gg-background from-[18%] via-gg-background/70 via-[45%] to-gg-background/55"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_42%,transparent_0%,rgba(30,32,25,0.35)_45%,rgba(30,32,25,0.75)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-gg-background/80 to-transparent"
      />

      <Dust count={14} />

      <motion.div
        style={{ y: copyY }}
        className="relative z-10 w-full px-6 pb-16 pt-36 sm:pb-20 lg:px-10 lg:pb-24"
      >
        <div className="mx-auto max-w-7xl">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            lang="ta"
            className="mb-5 max-w-xl text-sm tracking-wide text-gg-primary [font-family:var(--font-tamil),sans-serif] sm:text-base"
          >
            உண்மை கசக்கும். ஆனா அது தான் மருந்து.
          </motion.p>

          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.08, ease }}
            className="font-display text-[clamp(4.2rem,16vw,11rem)] leading-[0.82] uppercase tracking-tight"
          >
            <span className="block text-hollow">Gommala</span>
            <span className="block text-gg-primary">Gang</span>
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease }}
            className="mt-7 max-w-md text-lg italic leading-relaxed text-gg-text/85 sm:text-xl"
          >
            Gommala, ask me something worth my time.
          </motion.p>

          {/* Living dare line — wit as motion, not a badge */}
          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-8 flex min-h-[1.5rem] max-w-xl items-start gap-2 font-mono text-[12px] uppercase tracking-[0.18em] text-gg-text/65 sm:text-[13px]"
            aria-live="polite"
          >
            <span className="shrink-0 text-gg-primary">&gt;</span>
            <span>
              {typed}
              <span className="cursor-blink ml-0.5 inline-block h-[1em] w-[0.55em] translate-y-[0.1em] bg-gg-primary align-baseline" />
            </span>
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease }}
            className="mt-10"
          >
            <Link
              href="/terminal"
              className="group relative inline-flex items-center gap-3 bg-gg-primary px-8 py-4 font-mono text-xs uppercase tracking-[0.28em] text-gg-background transition-all duration-300 hover:bg-gg-accent hover:shadow-[0_0_50px_rgba(167,117,77,0.35)]"
            >
              <span className="opacity-70 transition-opacity group-hover:opacity-100">
                &gt;
              </span>
              Try me. I dare you
              <span
                className="cursor-blink inline-block h-3 w-2 bg-gg-background"
                aria-hidden
              />
            </Link>
          </motion.div>

          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.65 }}
            className="mt-14 font-mono text-[10px] uppercase tracking-[0.35em] text-gg-text/50"
          >
            Personality-first · Full Gommala Mode
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
