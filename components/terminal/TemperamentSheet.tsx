"use client";

import { useEffect } from "react";
import { TEMPERAMENTS, type Temperament } from "@/lib/terminal/types";
import { cn } from "@/lib/utils";

type TemperamentSheetProps = {
  open: boolean;
  current: Temperament;
  onSelect: (id: Temperament) => void;
  onClose: () => void;
};

export function TemperamentSheet({
  open,
  current,
  onSelect,
  onClose,
}: TemperamentSheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "1") onSelect("chennai");
      if (e.key === "2") onSelect("engineer");
      if (e.key === "3") onSelect("roast");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onSelect]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close temperaments"
        className="absolute inset-0 bg-gg-background/80"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Temperaments"
        className="relative z-10 w-full max-w-3xl border border-gg-hairline bg-gg-surface px-6 py-8 sm:px-10"
      >
        <div className="mb-8 flex items-center gap-4">
          <span aria-hidden className="reg-mark shrink-0" />
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-gg-primary">
            GG/03
            <span className="mx-3 text-gg-text/40">·</span>
            <span className="text-gg-text/65">Temperaments</span>
          </p>
          <span aria-hidden className="h-px flex-1 bg-gg-hairline" />
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-[11px] uppercase tracking-[0.25em] text-gg-text/65 transition-colors hover:text-gg-text"
          >
            Esc
          </button>
        </div>

        <p className="mb-8 max-w-md text-lg italic text-gg-text/65">
          Not features. Moods. Pick the one you can handle today.
        </p>

        <div className="border-t border-gg-hairline">
          {TEMPERAMENTS.map((mode) => {
            const active = mode.id === current;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onSelect(mode.id)}
                className={cn(
                  "group relative grid w-full items-baseline gap-x-8 gap-y-2 border-b border-gg-hairline py-8 text-left md:grid-cols-[5rem_1fr_auto]",
                  active && "bg-white/[0.02]"
                )}
              >
                <span
                  aria-hidden
                  className="text-hollow font-display text-4xl leading-none"
                >
                  {mode.index}
                </span>
                <div>
                  <p className="font-display text-2xl uppercase tracking-wide sm:text-3xl">
                    {mode.name}
                  </p>
                  <p
                    lang="ta"
                    className="mt-2 text-sm text-gg-primary [font-family:var(--font-tamil),sans-serif]"
                  >
                    {mode.tamil}
                  </p>
                  <p className="mt-2 text-base italic text-gg-text/65">
                    {mode.traits}
                  </p>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gg-text/50 md:justify-self-end">
                  {active ? "Active" : `Key ${mode.index.replace(/^0/, "")}`}
                </span>
                <span
                  aria-hidden
                  className="absolute bottom-[-1px] left-0 h-px w-0 bg-gg-primary transition-all duration-700 group-hover:w-full"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
