"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FadeUp } from "@/components/FadeUp";
import { SectionSlate } from "@/components/SectionSlate";

const modes = [
  {
    index: "01",
    name: "Chennai Mode",
    tamil: "நேரடியா சொல்லுவேன்",
    traits: "Straightforward. No fluff.",
    sample: "“Short answer: no. Long answer: still no, but with reasons.”",
  },
  {
    index: "02",
    name: "Engineer Mode",
    tamil: "வேலை நடக்கணும்",
    traits: "Detailed. Technical. Practical.",
    sample: "“Here's the fix, the root cause, and the test you forgot.”",
  },
  {
    index: "03",
    name: "Roast Mode",
    tamil: "தாங்க முடியாது",
    traits: "Merciless. Funny. Still helpful.",
    sample: "“Your code works. Nobody knows why. Least of all you.”",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function Personality() {
  const reduced = useReducedMotion();

  return (
    <section id="personality" className="relative py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <FadeUp>
          <SectionSlate code="GG/03" label="The Temperaments" />
          <h2 className="max-w-3xl font-display text-4xl uppercase leading-[0.95] sm:text-6xl">
            One AI.
            <br />
            <span className="text-hollow">Three temperaments.</span>
          </h2>
          <p className="mt-6 max-w-md text-lg italic text-stone">
            Not features. Moods. Pick the one you can handle today.
          </p>
        </FadeUp>

        {/* Editorial index — contents-page rows, not cards */}
        <div className="mt-16 border-t border-hairline">
          {modes.map((mode, i) => (
            <motion.article
              key={mode.name}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease }}
              className="group relative grid items-baseline gap-x-8 gap-y-3 border-b border-hairline py-10 md:grid-cols-[7rem_1fr_1fr] lg:py-12"
            >
              <span
                aria-hidden
                className="text-hollow font-display text-5xl leading-none transition-all duration-500 group-hover:[-webkit-text-stroke-color:rgba(196,106,26,0.9)] lg:text-6xl"
              >
                {mode.index}
              </span>

              <div>
                <h3 className="font-display text-3xl uppercase tracking-wide lg:text-4xl">
                  {mode.name}
                </h3>
                <p
                  lang="ta"
                  className="mt-2 text-sm text-bronze [font-family:var(--font-tamil),sans-serif]"
                >
                  {mode.tamil}
                </p>
                <p className="mt-3 text-lg italic text-stone">{mode.traits}</p>
              </div>

              <p className="max-w-md font-mono text-sm leading-6 text-ivory/60 transition-colors duration-500 group-hover:text-ivory/90 md:justify-self-end md:text-right">
                {mode.sample}
              </p>

              <span
                aria-hidden
                className="absolute bottom-[-1px] left-0 h-px w-0 bg-ember transition-all duration-700 group-hover:w-full"
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
