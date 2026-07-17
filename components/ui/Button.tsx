import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href: string;
  variant?: "primary" | "ghost";
  children: React.ReactNode;
  className?: string;
};

export function Button({
  href,
  variant = "primary",
  children,
  className,
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center justify-center gap-3 px-7 py-4 font-mono text-xs uppercase tracking-[0.25em] transition-all duration-300",
        variant === "primary" &&
          "bg-gg-primary text-gg-background hover:bg-gg-accent hover:shadow-[0_0_40px_rgba(167,117,77,0.3)]",
        variant === "ghost" &&
          "border border-gg-primary/60 text-gg-text hover:border-gg-accent hover:text-gg-accent",
        className
      )}
    >
      {children}
    </Link>
  );
}
