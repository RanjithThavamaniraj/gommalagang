import type { Metadata } from "next";
import { TerminalSession } from "@/components/terminal/TerminalSession";

export const metadata: Metadata = {
  title: "Terminal — Gommala Gang",
  description:
    "Enter the recovered Gommala Gang terminal. Personality-first AI. Honest conversations worth your time.",
};

export default function TerminalPage() {
  return <TerminalSession />;
}
