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
          "bg-ember text-ink hover:bg-[#d97a24] hover:shadow-[0_0_40px_rgba(196,106,26,0.25)]",
        variant === "ghost" &&
          "border border-bronze/60 text-ivory hover:border-ember hover:text-ember",
        className
      )}
    >
      {children}
    </Link>
  );
}
