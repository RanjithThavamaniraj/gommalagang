"use client";

import { INVITATIONS } from "@/lib/terminal/invitations";
import { SectionSlate } from "@/components/SectionSlate";

type InvitationIndexProps = {
  onPick: (label: string) => void;
};

export function InvitationIndex({ onPick }: InvitationIndexProps) {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pb-10 pt-6 lg:px-10">
      <SectionSlate code="GG/05" label="The Session" />
      <h1 className="font-display text-4xl uppercase leading-[0.95] sm:text-6xl">
        Power on.
        <br />
        <span className="text-hollow">Speak freely.</span>
      </h1>
      <p className="mt-6 max-w-md text-lg italic text-gg-text/65">
        Invitations, not prompts. Pick one — or type something braver.
      </p>

      <div className="mt-14 border-t border-gg-hairline">
        {INVITATIONS.map((inv) => (
          <button
            key={inv.id}
            type="button"
            onClick={() => onPick(inv.label)}
            className="group relative grid w-full items-baseline gap-x-6 gap-y-2 border-b border-gg-hairline py-7 text-left md:grid-cols-[4rem_1fr_12rem]"
          >
            <span
              aria-hidden
              className="text-hollow font-display text-3xl leading-none"
            >
              {inv.index}
            </span>
            <span className="font-mono text-sm leading-6 text-gg-text/80 transition-colors group-hover:text-gg-text sm:text-[15px]">
              {inv.label}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gg-text/40 md:justify-self-end md:text-right">
              {inv.tease}
            </span>
            <span
              aria-hidden
              className="absolute bottom-[-1px] left-0 h-px w-0 bg-gg-primary transition-all duration-700 group-hover:w-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
