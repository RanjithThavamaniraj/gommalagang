"use client";

import Link from "next/link";
import type { Temperament } from "@/lib/terminal/types";
import { temperamentShort } from "@/components/terminal/SettingsSheet";

type TerminalMastheadProps = {
  serial: string;
  temperament: Temperament;
  busy: boolean;
  onTemperament: () => void;
  onArchive: () => void;
  onSettings: () => void;
};

export function TerminalMasthead({
  serial,
  temperament,
  busy,
  onTemperament,
  onArchive,
  onSettings,
}: TerminalMastheadProps) {
  return (
    <header className="shrink-0 border-b border-gg-hairline bg-gg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
        <div className="flex min-w-0 items-center gap-6">
          <Link
            href="/"
            className="font-display text-2xl tracking-wide text-gg-text"
            aria-label="Gommala Gang home"
          >
            GG<span className="text-gg-primary">_</span>
          </Link>
          <p className="hidden font-mono text-[11px] uppercase tracking-[0.3em] text-gg-text/65 sm:block">
            <span className="text-gg-primary">GG/05</span>
            <span className="mx-2 text-gg-text/40">·</span>
            The Session
          </p>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={onTemperament}
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-gg-text/65 transition-colors hover:text-gg-text"
          >
            <span className="text-gg-primary/70">Mode</span>{" "}
            {temperamentShort(temperament)}
          </button>
          <button
            type="button"
            onClick={onArchive}
            className="hidden font-mono text-[11px] uppercase tracking-[0.22em] text-gg-text/65 transition-colors hover:text-gg-text sm:inline"
          >
            Archive
          </button>
          <button
            type="button"
            onClick={onSettings}
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-gg-text/65 transition-colors hover:text-gg-text"
          >
            Settings
          </button>
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gg-text/60">
            <span
              className={`size-1.5 rounded-full ${busy ? "bg-gg-primary" : "bg-gg-accent"}`}
            />
            <span className="hidden md:inline">
              {busy ? "Transmitting" : "Full Gommala Mode"}
            </span>
          </span>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl justify-between border-t border-gg-hairline px-6 py-2 font-mono text-[9px] uppercase tracking-[0.3em] text-gg-text/35 lg:px-10">
        <span>{serial}</span>
        <span className="hidden sm:inline">Recovered · Archive</span>
        <button
          type="button"
          onClick={onArchive}
          className="sm:hidden hover:text-gg-text/70"
        >
          Archive
        </button>
      </div>
    </header>
  );
}
