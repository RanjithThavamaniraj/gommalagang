"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TEMPERAMENTS, type Temperament, type TerminalSettings } from "@/lib/terminal/types";
import { cn } from "@/lib/utils";

type SettingsSheetProps = {
  open: boolean;
  settings: TerminalSettings;
  onChange: (next: TerminalSettings) => void;
  onClearHistory: () => void;
  onClose: () => void;
};

export function SettingsSheet({
  open,
  settings,
  onChange,
  onClearHistory,
  onClose,
}: SettingsSheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close settings"
        className="absolute inset-0 bg-gg-background/80"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        className="relative z-10 w-full max-w-lg border border-gg-hairline bg-gg-surface px-6 py-8 sm:px-8"
      >
        <div className="mb-8 flex items-center gap-4">
          <span aria-hidden className="reg-mark shrink-0" />
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-gg-primary">
            GG/07
            <span className="mx-3 text-gg-text/40">·</span>
            <span className="text-gg-text/65">Settings</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto font-mono text-[11px] uppercase tracking-[0.25em] text-gg-text/65 hover:text-gg-text"
          >
            Esc
          </button>
        </div>

        <section className="border-t border-gg-hairline py-6">
          <h2 className="font-display text-2xl uppercase tracking-wide">
            Default temperament
          </h2>
          <p className="mt-2 text-base italic text-gg-text/65">
            New sessions start here. You can still switch mid-thread.
          </p>
          <div className="mt-5 space-y-2">
            {TEMPERAMENTS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() =>
                  onChange({ ...settings, defaultTemperament: t.id })
                }
                className={cn(
                  "flex w-full items-center justify-between border border-gg-hairline px-4 py-3 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors",
                  settings.defaultTemperament === t.id
                    ? "border-gg-primary text-gg-primary"
                    : "text-gg-text/65 hover:text-gg-text"
                )}
              >
                <span>{t.name}</span>
                {settings.defaultTemperament === t.id && <span>Active</span>}
              </button>
            ))}
          </div>
        </section>

        <section className="border-t border-gg-hairline py-6">
          <h2 className="font-display text-2xl uppercase tracking-wide">
            Stream pace
          </h2>
          <p className="mt-2 text-base italic text-gg-text/65">
            Lower = more cinematic. Higher = faster dump.
          </p>
          <div className="mt-5 flex gap-2">
            {(
              [
                { label: "Cinematic", ms: 22 },
                { label: "Present", ms: 16 },
                { label: "Brisk", ms: 10 },
              ] as const
            ).map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => onChange({ ...settings, streamPaceMs: opt.ms })}
                className={cn(
                  "flex-1 border border-gg-hairline px-3 py-3 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors",
                  settings.streamPaceMs === opt.ms
                    ? "border-gg-primary text-gg-primary"
                    : "text-gg-text/65 hover:text-gg-text"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section className="border-t border-gg-hairline py-6">
          <h2 className="font-display text-2xl uppercase tracking-wide">
            Identity
          </h2>
          <p className="mt-2 text-base italic text-gg-text/65">
            Anonymous session. Authentication arrives later — Phase 8.
          </p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.25em] text-gg-text/50">
            Status · Guest · Local only
          </p>
        </section>

        <section className="border-t border-gg-hairline py-6">
          <h2 className="font-display text-2xl uppercase tracking-wide">
            Community
          </h2>
          <p className="mt-2 text-base italic text-gg-text/65">
            Phase 9 hooks. Links when the gang publishes them.
          </p>
          <ul className="mt-5 space-y-3">
            <li>
              <Link
                href="https://github.com"
                className="font-mono text-[11px] uppercase tracking-[0.25em] text-gg-text/65 transition-colors hover:text-gg-text"
              >
                ↗ GitHub
              </Link>
            </li>
            <li>
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gg-text/40">
                Discord · Coming online
              </span>
            </li>
          </ul>
        </section>

        <section className="border-t border-gg-hairline pt-6">
          <button
            type="button"
            onClick={onClearHistory}
            className="font-mono text-[11px] uppercase tracking-[0.25em] text-gg-text/65 transition-colors hover:text-gg-accent"
          >
            Purge all local sessions
          </button>
        </section>
      </div>
    </div>
  );
}

export function temperamentShort(id: Temperament) {
  return TEMPERAMENTS.find((t) => t.id === id)?.name.replace(" Mode", "") ?? id;
}
