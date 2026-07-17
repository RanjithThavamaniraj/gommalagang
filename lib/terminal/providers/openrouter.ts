import type { LLMProvider } from "@/lib/terminal/providers/types";

/** Future: OpenRouter OpenAI-compatible streaming. */
export const openrouterProvider: LLMProvider = {
  id: "openrouter",
  async *stream() {
    yield "// Provider “openrouter” is stubbed.\n";
    yield "// Wire OPENROUTER_API_KEY + model in providers/openrouter.ts\n";
    yield "// Set TERMINAL_PROVIDER=local until keys are wired.";
  },
};
