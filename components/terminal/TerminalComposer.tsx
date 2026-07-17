"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";

export type TerminalComposerHandle = {
  focus: () => void;
};

type TerminalComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onAbort?: () => void;
  disabled?: boolean;
  busy?: boolean;
  autoFocus?: boolean;
};

export const TerminalComposer = forwardRef<
  TerminalComposerHandle,
  TerminalComposerProps
>(function TerminalComposer(
  { value, onChange, onSend, onAbort, disabled, busy, autoFocus },
  ref
) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);

  useImperativeHandle(ref, () => ({
    focus: () => {
      const el = inputRef.current;
      if (!el) return;
      el.focus({ preventScroll: true });
      const len = el.value.length;
      el.setSelectionRange(len, len);
      // Instant — smooth scroll fights mobile keyboards and stream restore.
      el.scrollIntoView({ block: "nearest", behavior: "instant" });
    },
  }));

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  useEffect(() => {
    const onSlash = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "TEXTAREA" || t.tagName === "INPUT")) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onSlash);
    return () => window.removeEventListener("keydown", onSlash);
  }, []);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (disabled || !value.trim()) return;
    onSend();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape" && busy) {
      e.preventDefault();
      onAbort?.();
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form
      onSubmit={submit}
      className={"border-t border-gg-hairline bg-gg-surface pb-[env(safe-area-inset-bottom)]"}
    >
      <div className="mx-auto flex max-w-4xl items-end gap-3 px-6 py-4 lg:px-10">
        <span
          aria-hidden
          className={cn(
            "mb-3 font-mono text-gg-primary transition-opacity",
            focused || busy ? "opacity-100" : "opacity-60"
          )}
        >
          {">"}
        </span>
        <textarea
          ref={inputRef}
          rows={1}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Type something you'd never ask a polite AI..."
          aria-label="Session prompt"
          className="max-h-40 min-h-[2.75rem] flex-1 resize-none bg-transparent py-3 font-mono text-sm leading-6 text-gg-primary outline-none placeholder:text-gg-text/35 disabled:opacity-50"
        />
        {busy ? (
          <button
            type="button"
            onClick={onAbort}
            className="mb-1 shrink-0 border border-gg-primary/60 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-gg-text/65 transition-all duration-300 hover:border-gg-accent hover:text-gg-accent"
          >
            Break
          </button>
        ) : (
          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className="mb-1 shrink-0 border border-gg-primary/70 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-gg-primary transition-all duration-300 hover:bg-gg-accent hover:text-gg-background disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gg-primary"
          >
            Transmit
          </button>
        )}
      </div>
      <div className="mx-auto flex max-w-4xl justify-between px-6 pb-3 font-mono text-[9px] uppercase tracking-[0.3em] text-gg-text/30 lg:px-10">
        <span>
          {busy ? "Esc break" : "Enter send · Shift+Enter break"}
        </span>
        <span className="hidden sm:inline">/ focus</span>
      </div>
    </form>
  );
});
