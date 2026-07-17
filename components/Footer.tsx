import Link from "next/link";
import { SectionSlate } from "@/components/SectionSlate";

const links = [
  { label: "GitHub", href: "https://github.com" },
  { label: "X", href: "https://x.com" },
  { label: "Privacy", href: "#" },
];

const credits = [
  { role: "A production of", name: "Gommala Gang" },
  { role: "Starring", name: "One brutally honest LLM" },
  { role: "Written by", name: "Conversations worth having" },
  { role: "Politeness department", name: "Vacant" },
];

export function Footer() {
  return (
    <footer className="border-t border-gg-hairline">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-12 lg:px-10">
        <SectionSlate code="GG/04" label="Colophon" />

        {/* Movie-credit roll: role left, name right */}
        <dl className="mx-auto max-w-xl">
          {credits.map((credit) => (
            <div
              key={credit.role}
              className="flex items-baseline justify-between gap-6 py-2.5"
            >
              <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-gg-text/50">
                {credit.role}
              </dt>
              <dd className="font-display text-sm uppercase tracking-[0.15em] text-gg-text/80">
                {credit.name}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-10 text-center text-sm italic text-gg-text/60">
          No corporate politeness was harmed in the making of this AI. It was
          eliminated.
        </p>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 border-t border-gg-hairline px-6 py-10 sm:flex-row sm:justify-between lg:px-10">
        <p className="font-display text-xl tracking-wide">
          GG<span className="text-gg-primary">_</span>
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gg-text/60">
          Zero corporate politeness.
        </p>
        <ul className="flex items-center gap-8">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="font-mono text-[11px] uppercase tracking-[0.25em] text-gg-text/65 transition-colors hover:text-gg-text"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
