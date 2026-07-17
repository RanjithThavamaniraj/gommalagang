"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dust } from "@/components/Dust";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const artY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 60]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -30]);

  return (
    <section
      ref={ref}
      id="about"
      className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-24"
    >
      <Dust />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-10 lg:px-10">
        {/* Copy — the headline is allowed to break the column and run over the plate */}
        <motion.div style={{ y: copyY }} className="relative z-20 max-w-xl">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="mb-3 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.35em] text-ember"
          >
            <span aria-hidden className="reg-mark shrink-0" />
            GG/01 <span className="text-stone/40">·</span> Class: Unfiltered AI
          </motion.p>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
            lang="ta"
            className="mb-6 text-sm tracking-wide text-bronze [font-family:var(--font-tamil),sans-serif]"
          >
            உண்மை கசக்கும். ஆனா அது தான் மருந்து.
          </motion.p>

          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
            className="font-display text-[clamp(3.2rem,8.5vw,6.5rem)] leading-[0.92] uppercase lg:whitespace-nowrap"
          >
            <span className="text-hollow">Meet</span>
            <br />
            Gommala
            <br />
            <span className="text-ember">Gang.</span>
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease }}
            className="mt-8 text-lg italic leading-relaxed text-stone"
          >
            The AI that skips corporate politeness and gets straight to the
            point—with Chennai attitude, sharp wit, and surprisingly good
            answers.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Button href="#terminal" className="w-full sm:w-auto">
              Join the Gang
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </Button>
            <Button
              href="#personality"
              variant="ghost"
              className="w-full sm:w-auto"
            >
              See the Madness
              <Terminal className="size-4" aria-hidden />
            </Button>
          </motion.div>

          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-10 font-mono text-[11px] uppercase tracking-[0.3em] text-stone/60"
          >
            Built somewhere in Chennai.
          </motion.p>
        </motion.div>

        {/* Artwork, mounted like an archival plate */}
        <motion.div
          style={{ y: artY }}
          initial={reduced ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.2, ease }}
          className="relative lg:-mr-16 xl:-mr-24"
        >
          <figure className="relative">
            <div className="relative overflow-hidden rounded-sm border border-hairline shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
              <Image
                src="/images/hero.png"
                alt="Gommala Gang — a man in a Gommala Gang hoodie beside a CRT terminal glowing amber in a dark room"
                width={1672}
                height={941}
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="h-auto w-full"
              />
              <div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-white/5" />
            </div>
            <figcaption className="flex items-center justify-between border-x border-b border-hairline bg-[#0d0c0a] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-stone/60">
              <span>Plate 01 — The gang at work</span>
              <span className="hidden sm:inline">Shot on location, Chennai</span>
            </figcaption>
          </figure>
        </motion.div>
      </div>
    </section>
  );
}
