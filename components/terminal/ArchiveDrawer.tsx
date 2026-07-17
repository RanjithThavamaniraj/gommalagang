"use client";

import { useEffect } from "react";
import type { Session } from "@/lib/terminal/types";
import { TEMPERAMENTS } from "@/lib/terminal/types";

type ArchiveDrawerProps = {
  open: boolean;
  sessions: Session[];
  activeId: string;
  onOpen: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
};

function formatWhen(ts: number) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(ts);
  } catch {
    return "";
  }
}

export function ArchiveDrawer({
  open,
  sessions,
  activeId,
  onOpen,
  onNew,
  onDelete,
  onClose,
}: ArchiveDrawerProps) {
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
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close archive"
        className="absolute inset-0 bg-gg-background/80"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Session archive"
        className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-gg-hairline bg-gg-surface"
      >
        <div className="flex items-center gap-4 border-b border-gg-hairline px-6 py-5">
          <span aria-hidden className="reg-mark shrink-0" />
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-gg-primary">
            GG/06
            <span className="mx-3 text-gg-text/40">·</span>
            <span className="text-gg-text/65">Archive</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto font-mono text-[11px] uppercase tracking-[0.25em] text-gg-text/65 hover:text-gg-text"
          >
            Esc
          </button>
        </div>

        <div className="border-b border-gg-hairline px-6 py-4">
          <button
            type="button"
            onClick={onNew}
            className="w-full border border-gg-primary/70 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-gg-primary transition-all duration-300 hover:bg-gg-accent hover:text-gg-background"
          >
            New session
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <p className="px-6 py-10 text-lg italic text-gg-text/60">
              No recovered sessions yet. Transmit something first.
            </p>
          ) : (
            <ul>
              {sessions.map((s) => {
                const mode =
                  TEMPERAMENTS.find((t) => t.id === s.temperament)?.name ?? "";
                const active = s.id === activeId;
                return (
                  <li key={s.id} className="border-b border-gg-hairline">
                    <div className="flex items-start gap-3 px-6 py-5">
                      <button
                        type="button"
                        onClick={() => onOpen(s.id)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gg-text/40">
                          {s.serial}
                          {active ? " · Live" : ""}
                        </p>
                        <p className="mt-2 font-display text-lg uppercase tracking-wide text-gg-text">
                          {s.title}
                        </p>
                        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-gg-text/50">
                          {mode} · {formatWhen(s.updatedAt)}
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(s.id)}
                        className="shrink-0 pt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-gg-text/40 hover:text-gg-accent"
                      >
                        Purge
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
