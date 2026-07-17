import type { LLMProvider } from "@/lib/terminal/providers/types";

/** Future: Local Ollama HTTP streaming. */
export const ollamaProvider: LLMProvider = {
  id: "ollama",
  async *stream() {
    yield "// Provider “ollama” is stubbed.\n";
    yield "// Wire OLLAMA_HOST + model in providers/ollama.ts\n";
    yield "// Set TERMINAL_PROVIDER=local until keys are wired.";
  },
};
