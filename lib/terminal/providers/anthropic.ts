import type { LLMProvider } from "@/lib/terminal/providers/types";

/** Future: Anthropic Messages streaming. */
export const anthropicProvider: LLMProvider = {
  id: "anthropic",
  async *stream() {
    yield "// Provider “anthropic” is stubbed.\n";
    yield "// Wire ANTHROPIC_API_KEY + model in providers/anthropic.ts\n";
    yield "// Set TERMINAL_PROVIDER=local until keys are wired.";
  },
};
