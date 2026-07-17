"use client";

import { memo, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Message, Temperament } from "@/lib/terminal/types";
import { TEMPERAMENTS } from "@/lib/terminal/types";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

type TranscriptLogProps = {
  messages: Message[];
  streamingId: string | null;
  streamingText: string;
  nearBottomRef: React.MutableRefObject<boolean>;
};

function modeLabel(id?: Temperament) {
  if (!id) return null;
  return TEMPERAMENTS.find((t) => t.id === id)?.name ?? id;
}

type RowProps = {
  message: Message;
  streaming: boolean;
  body: string;
  reduced: boolean | null;
};

const TranscriptRow = memo(function TranscriptRow({
  message: m,
  streaming,
  body,
  reduced,
}: RowProps) {
  if (m.role === "system") {
    return (
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gg-text/45">
        {m.content}
      </p>
    );
  }

  if (m.role === "user") {
    return (
      <motion.p
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="text-gg-primary"
      >
        <span className="text-gg-primary">&gt; </span>
        {m.content}
      </motion.p>
    );
  }

  const waiting = streaming && body.length === 0;

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease }}
      className="space-y-2"
    >
      {m.temperament && (
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-gg-text/35">
          {modeLabel(m.temperament)}
        </p>
      )}
      <p
        aria-live={streaming ? "polite" : undefined}
        className={cn(
          "whitespace-pre-wrap text-gg-text/90",
          m.temperament === "engineer" && "text-gg-text/85",
          m.temperament === "chennai" &&
            "font-serif text-[1.05rem] italic leading-8 text-gg-text/90",
          m.temperament === "roast" &&
            "font-serif text-[1.05rem] leading-8 text-gg-text/90"
        )}
      >
        {waiting ? (
          <span className="font-mono not-italic tracking-[0.35em] text-gg-text/50">
            ···
          </span>
        ) : (
          body
        )}
        {streaming && (
          <span
            className={cn(
              "ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-gg-primary align-baseline",
              waiting || body.length === 0 ? "cursor-blink" : "opacity-90"
            )}
          />
        )}
      </p>
    </motion.div>
  );
});

export function TranscriptLog({
  messages,
  streamingId,
  streamingText,
  nearBottomRef,
}: TranscriptLogProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const wasStreaming = useRef(false);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const onScroll = () => {
      nearBottomRef.current =
        el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [nearBottomRef]);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;

    const streaming = streamingId != null;
    if (streaming) {
      wasStreaming.current = true;
      if (!nearBottomRef.current) return;
      el.scrollTop = el.scrollHeight;
      return;
    }

    if (wasStreaming.current) {
      wasStreaming.current = false;
      if (!nearBottomRef.current) return;
      el.scrollTo({
        top: el.scrollHeight,
        behavior: reduced ? "auto" : "smooth",
      });
      return;
    }

    if (!nearBottomRef.current) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, streamingId, streamingText, nearBottomRef, reduced]);

  return (
    <div
      ref={scroller}
      className="h-full overflow-y-auto"
      role="log"
      aria-label="Gommala Gang session log"
    >
      <div className="mx-auto w-full max-w-4xl px-6 py-8 lg:px-10">
        <div className="crt-screen border border-black/40 bg-gg-surface shadow-[inset_0_0_80px_rgba(0,0,0,0.85)]">
          <div className="crt-text space-y-6 px-5 py-7 font-mono text-sm leading-7 sm:px-8 sm:text-[15px]">
            {messages.map((m) => {
              const streaming = m.id === streamingId;
              const body = streaming ? streamingText : m.content;
              return (
                <TranscriptRow
                  key={m.id}
                  message={m}
                  streaming={streaming}
                  body={body}
                  reduced={reduced}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
