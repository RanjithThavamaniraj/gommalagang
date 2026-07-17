"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArchiveDrawer } from "@/components/terminal/ArchiveDrawer";
import { InvitationIndex } from "@/components/terminal/InvitationIndex";
import { SettingsSheet } from "@/components/terminal/SettingsSheet";
import { TemperamentSheet } from "@/components/terminal/TemperamentSheet";
import {
  TerminalComposer,
  type TerminalComposerHandle,
} from "@/components/terminal/TerminalComposer";
import { TerminalMasthead } from "@/components/terminal/TerminalMasthead";
import { TranscriptLog } from "@/components/terminal/TranscriptLog";
import {
  blankSession,
  clearAllTerminalData,
  createMessageId,
  deleteSession,
  loadActiveId,
  loadSessions,
  loadSettings,
  saveActiveId,
  saveSettings,
  titleFromPrompt,
  upsertSession,
} from "@/lib/terminal/storage";
import type {
  Message,
  Session,
  Temperament,
  TerminalSettings,
} from "@/lib/terminal/types";

type Sheet = null | "temperament" | "archive" | "settings";

export function TerminalSession() {
  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [settings, setSettings] = useState<TerminalSettings | null>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState("");
  const [sheet, setSheet] = useState<Sheet>(null);
  const [error, setError] = useState<string | null>(null);

  const lastPrompt = useRef("");
  const nearBottom = useRef(true);
  const abortRef = useRef<AbortController | null>(null);
  const streamBuffer = useRef("");
  const rafRef = useRef<number | null>(null);
  const composerRef = useRef<TerminalComposerHandle>(null);
  const sessionRef = useRef<Session | null>(null);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  const focusComposer = useCallback((delay = 0) => {
    const run = () => composerRef.current?.focus();
    if (delay > 0) window.setTimeout(run, delay);
    else requestAnimationFrame(run);
  }, []);

  const flushStreamFrame = useCallback(() => {
    rafRef.current = null;
    setStreamingText(streamBuffer.current);
  }, []);

  const queueStreamChunk = useCallback(
    (chunk: string) => {
      streamBuffer.current += chunk;
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(flushStreamFrame);
      }
    },
    [flushStreamFrame]
  );

  const clearStreamUi = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamBuffer.current = "";
    setStreamingText("");
    setStreamingId(null);
  }, []);

  useEffect(() => {
    const s = loadSettings();
    setSettings(s);
    const all = loadSessions();
    setSessions(all);
    const activeId = loadActiveId();
    const active = all.find((x) => x.id === activeId) ?? null;
    setSession(active ?? blankSession(s.defaultTemperament));
    setHydrated(true);
  }, []);

  /** Persist to disk + refresh archive list. Avoid during streaming. */
  const commitSession = useCallback((next: Session) => {
    upsertSession(next);
    saveActiveId(next.id);
    setSession(next);
    setSessions(loadSessions());
  }, []);

  const closeSheet = useCallback(() => {
    setSheet(null);
    focusComposer(40);
  }, [focusComposer]);

  const startNew = useCallback(() => {
    if (!settings) return;
    abortRef.current?.abort();
    clearStreamUi();
    setBusy(false);
    setError(null);
    setDraft("");
    const next = blankSession(settings.defaultTemperament);
    commitSession(next);
    setSheet(null);
    nearBottom.current = true;
    focusComposer(40);
  }, [clearStreamUi, commitSession, focusComposer, settings]);

  const openSession = useCallback(
    (id: string) => {
      const found = loadSessions().find((s) => s.id === id);
      if (!found) return;
      abortRef.current?.abort();
      clearStreamUi();
      setBusy(false);
      setError(null);
      setDraft("");
      saveActiveId(found.id);
      setSession(found);
      setSessions(loadSessions());
      setSheet(null);
      nearBottom.current = true;
      focusComposer(40);
    },
    [clearStreamUi, focusComposer]
  );

  const purgeOne = useCallback(
    (id: string) => {
      deleteSession(id);
      const remaining = loadSessions();
      setSessions(remaining);
      if (sessionRef.current?.id === id) {
        const fallback =
          remaining[0] ??
          blankSession(settings?.defaultTemperament ?? "chennai");
        commitSession(fallback);
      }
    },
    [commitSession, settings?.defaultTemperament]
  );

  const setTemperament = useCallback(
    (id: Temperament) => {
      const current = sessionRef.current;
      if (!current) return;
      if (current.temperament === id) {
        closeSheet();
        return;
      }
      const label =
        id === "chennai"
          ? "Direct Mode"
          : id === "engineer"
            ? "Engineer Mode"
            : "Roast Mode";
      const stamp: Message = {
        id: createMessageId(),
        role: "system",
        content: `Temperament · ${label} · switched`,
        createdAt: Date.now(),
      };
      const next: Session = {
        ...current,
        temperament: id,
        messages:
          current.messages.length > 0
            ? [...current.messages, stamp]
            : current.messages,
        updatedAt: Date.now(),
      };
      commitSession(next);
      closeSheet();
    },
    [closeSheet, commitSession]
  );

  const abortTransmit = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const send = useCallback(async () => {
    const current = sessionRef.current;
    if (!current || !settings || busy) return;
    const prompt = draft.trim();
    if (!prompt) return;

    setError(null);
    setDraft("");
    lastPrompt.current = prompt;
    nearBottom.current = true;

    const userMsg: Message = {
      id: createMessageId(),
      role: "user",
      content: prompt,
      createdAt: Date.now(),
    };
    const assistantId = createMessageId();
    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      temperament: current.temperament,
      createdAt: Date.now(),
    };

    const seeded: Session = {
      ...current,
      title:
        current.messages.length === 0
          ? titleFromPrompt(prompt)
          : current.title,
      messages: [...current.messages, userMsg, assistantMsg],
      updatedAt: Date.now(),
    };

    // One disk write at transmit start (user line + empty assistant stub).
    commitSession(seeded);
    setBusy(true);
    streamBuffer.current = "";
    setStreamingText("");
    setStreamingId(assistantId);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const turns = [...current.messages, userMsg]
        .filter(
          (m) =>
            (m.role === "user" || m.role === "assistant") && m.content.trim()
        )
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

      const res = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: turns,
          temperament: current.temperament,
          paceMs: settings.streamPaceMs,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Line's dead. Try again.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        queueStreamChunk(decoder.decode(value, { stream: true }));
      }

      // Final frame flush before commit.
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      const finalText = streamBuffer.current;
      setStreamingText(finalText);

      const latest = sessionRef.current ?? seeded;
      const completed: Session = {
        ...latest,
        messages: latest.messages.map((m) =>
          m.id === assistantId ? { ...m, content: finalText } : m
        ),
        updatedAt: Date.now(),
      };
      commitSession(completed);
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        if (rafRef.current != null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        const partial = streamBuffer.current;
        const latest = sessionRef.current ?? seeded;
        const broken: Session = {
          ...latest,
          messages: latest.messages.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: partial
                    ? `${partial}\n\n// Line broken.`
                    : "// Line broken.",
                }
              : m
          ),
          updatedAt: Date.now(),
        };
        commitSession(broken);
      } else {
        const message =
          err instanceof Error ? err.message : "Line's dead. Try again.";
        setError(message);
        const latest = sessionRef.current ?? seeded;
        const failed: Session = {
          ...latest,
          messages: latest.messages.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: streamBuffer.current || `// ${message}`,
                }
              : m
          ),
          updatedAt: Date.now(),
        };
        commitSession(failed);
      }
    } finally {
      clearStreamUi();
      setBusy(false);
      abortRef.current = null;
      focusComposer(30);
    }
  }, [
    busy,
    clearStreamUi,
    commitSession,
    draft,
    focusComposer,
    queueStreamChunk,
    settings,
  ]);

  // Global Esc: close sheet first, else break transmit.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (sheet) {
        e.preventDefault();
        closeSheet();
        return;
      }
      if (busy) {
        e.preventDefault();
        abortTransmit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abortTransmit, busy, closeSheet, sheet]);

  const onSettingsChange = (next: TerminalSettings) => {
    setSettings(next);
    saveSettings(next);
  };

  const clearHistory = () => {
    clearAllTerminalData();
    const s = loadSettings();
    setSettings(s);
    setSessions([]);
    const fresh = blankSession(s.defaultTemperament);
    setSession(fresh);
    saveActiveId(fresh.id);
    setSheet(null);
    focusComposer(40);
  };

  if (!hydrated || !session || !settings) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-gg-background">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-gg-text/50">
          Booting session…
        </p>
      </div>
    );
  }

  const empty = session.messages.length === 0;

  return (
    <div className="flex h-[100svh] flex-col overflow-hidden bg-gg-background">
      <TerminalMasthead
        serial={session.serial}
        temperament={session.temperament}
        busy={busy}
        onTemperament={() => setSheet("temperament")}
        onArchive={() => setSheet("archive")}
        onSettings={() => setSheet("settings")}
      />

      <main className="relative min-h-0 flex-1">
        {empty ? (
          <div className="h-full overflow-y-auto">
            <InvitationIndex
              onPick={(label) => {
                setDraft(label);
                focusComposer(0);
              }}
            />
          </div>
        ) : (
          <TranscriptLog
            messages={session.messages}
            streamingId={streamingId}
            streamingText={streamingText}
            nearBottomRef={nearBottom}
          />
        )}
      </main>

      {error && (
        <div className="border-t border-gg-hairline bg-gg-surface px-6 py-3 lg:px-10">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gg-primary">
              {error}
            </p>
            <button
              type="button"
              disabled={busy || !lastPrompt.current}
              onClick={() => {
                setDraft(lastPrompt.current);
                setError(null);
                focusComposer(0);
              }}
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-gg-text/65 hover:text-gg-text disabled:opacity-40"
            >
              Restore line
            </button>
          </div>
        </div>
      )}

      <TerminalComposer
        ref={composerRef}
        value={draft}
        onChange={setDraft}
        onSend={() => void send()}
        onAbort={abortTransmit}
        disabled={busy}
        busy={busy}
        autoFocus
      />

      <TemperamentSheet
        open={sheet === "temperament"}
        current={session.temperament}
        onSelect={setTemperament}
        onClose={closeSheet}
      />
      <ArchiveDrawer
        open={sheet === "archive"}
        sessions={sessions}
        activeId={session.id}
        onOpen={openSession}
        onNew={startNew}
        onDelete={purgeOne}
        onClose={closeSheet}
      />
      <SettingsSheet
        open={sheet === "settings"}
        settings={settings}
        onChange={onSettingsChange}
        onClearHistory={clearHistory}
        onClose={closeSheet}
      />
    </div>
  );
}
