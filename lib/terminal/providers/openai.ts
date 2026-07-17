import type { LLMProvider } from "@/lib/terminal/providers/types";

/** Future: OpenAI Chat Completions streaming. */
export const openaiProvider: LLMProvider = {
  id: "openai",
  async *stream() {
    yield "// Provider “openai” is stubbed.\n";
    yield "// Wire OPENAI_API_KEY + model in providers/openai.ts\n";
    yield "// Set TERMINAL_PROVIDER=local until keys are wired.";
  },
};
