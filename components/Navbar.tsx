"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const links = [
  { index: "01", label: "About", href: "#about" },
  { index: "02", label: "Terminal", href: "#terminal" },
  { index: "03", label: "Temperaments", href: "#personality" },
  { index: "↗", label: "GitHub", href: "https://github.com" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-gg-hairline bg-gg-background/70 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link
          href="#"
          className="font-display text-2xl tracking-wide text-gg-text"
          aria-label="Gommala Gang home"
        >
          GG<span className="text-gg-primary">_</span>
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="group font-mono text-[11px] uppercase tracking-[0.25em] text-gg-text/65 transition-colors hover:text-gg-text"
              >
                <span className="mr-1.5 text-gg-primary/70 transition-colors group-hover:text-gg-accent">
                  {link.index}
                </span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/terminal"
          className="border border-gg-primary/70 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-gg-primary transition-all duration-300 hover:bg-gg-accent hover:text-gg-background"
        >
          Join the Gang
        </Link>
      </nav>
    </header>
  );
}
