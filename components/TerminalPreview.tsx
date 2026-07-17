"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FadeUp } from "@/components/FadeUp";
import { SectionSlate } from "@/components/SectionSlate";

type Exchange = {
  prompt: string;
  reply: string[];
};

const exchanges: Exchange[] = [
  {
    prompt: "Explain recursion",
    reply: [
      "Seri...",
      "First understand recursion.",
      "Then come back and ask this question again.",
    ],
  },
  {
    prompt: "Will my startup succeed?",
    reply: [
      "Enna da question idhu.",
      "Ship something first.",
      "Then we'll talk about success.",
    ],
  },
  {
    prompt: "Fix my code, it doesn't work",
    reply: [
      "It works exactly as you wrote it.",
      "That's the problem.",
      "Paste the error. Full error. Not a screenshot.",
    ],
  },
];

const TYPE_MS = 45;
const REPLY_MS = 22;
const LINE_PAUSE = 500;
const CYCLE_PAUSE = 3200;

export function TerminalPreview() {
  const [lines, setLines] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    let cancelled = false;
    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(() => !cancelled && fn(), ms);
      timeouts.current.push(t);
    };

    const typeText = (
      text: string,
      speed: number,
      prefix: string,
      done: () => void
    ) => {
      let i = 0;
      const step = () => {
        i += 1;
        setCurrent(prefix + text.slice(0, i));
        if (i < text.length) later(step, speed);
        else {
          setLines((prev) => [...prev, prefix + text]);
          setCurrent("");
          done();
        }
      };
      later(step, speed);
    };

    const runExchange = (idx: number) => {
      const ex = exchanges[idx % exchanges.length];
      setLines([]);
      typeText(ex.prompt, TYPE_MS, "> ", () => {
        const replyLine = (li: number) => {
          if (li >= ex.reply.length) {
            later(() => runExchange(idx + 1), CYCLE_PAUSE);
            return;
          }
          later(
            () => typeText(ex.reply[li], REPLY_MS, "", () => replyLine(li + 1)),
            LINE_PAUSE
          );
        };
        replyLine(0);
      });
    };

    runExchange(0);
    return () => {
      cancelled = true;
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
    };
  }, []);

  return (
    <section id="terminal" className="relative py-28 lg:py-36">
      <div className="mx-auto max-w-4xl px-6">
        <FadeUp>
          <SectionSlate code="GG/02" label="The Terminal" />
          <h2 className="font-display text-4xl uppercase leading-[0.95] sm:text-6xl">
            Ask it anything.
            <br />
            <span className="text-hollow">Regret nothing.</span>
          </h2>
        </FadeUp>

        <FadeUp delay={0.15} className="mt-12">
          {/* The unit: a bezel of dark metal around a phosphor screen */}
          <div className="border border-gg-hairline bg-gg-surface p-3 shadow-[0_30px_90px_rgba(0,0,0,0.7)] sm:p-4">
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gg-primary">
                Gommala Gang AI v1.0.0
              </span>
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gg-text/60">
                <span className="size-1.5 rounded-full bg-gg-accent" />
                Full Gommala Mode
              </span>
            </div>
            <div
              role="log"
              aria-label="Gommala Gang terminal demo"
              className="crt-screen border border-black/60 bg-gg-surface shadow-[inset_0_0_60px_rgba(0,0,0,0.9)]"
            >
              <div className="crt-text min-h-[240px] px-5 py-6 font-mono text-sm leading-7 sm:px-7 sm:text-base">
                {lines.map((line, i) => (
                  <p
                    key={i}
                    className={
                      line.startsWith("> ") ? "text-gg-primary" : "text-gg-text/90"
                    }
                  >
                    {line}
                  </p>
                ))}
                <p
                  className={
                    current.startsWith("> ") ? "text-gg-primary" : "text-gg-text/90"
                  }
                >
                  {current}
                  <span className="cursor-blink ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-gg-primary" />
                </p>
              </div>
            </div>
            <div className="mt-2 flex justify-end px-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-gg-text/30">
                SN 1997-GG-041
              </span>
            </div>
          </div>
          {/* Equipment specification strip */}
          <div className="mt-3 flex items-center justify-between px-1 font-mono text-[10px] uppercase tracking-[0.25em] text-gg-text/40">
            <span>Model GG-01</span>
            <span className="hidden sm:inline">Sarcasm: factory calibrated</span>
            <span>Unfiltered · 240V</span>
          </div>
          <div className="mt-8 flex justify-end">
            <Link
              href="/terminal"
              className="font-mono text-[11px] uppercase tracking-[0.3em] text-gg-text/65 transition-colors hover:text-gg-accent"
            >
              Enter the machine →
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
