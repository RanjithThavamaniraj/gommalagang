import type { LLMProvider } from "@/lib/terminal/providers/types";

/** Future: Google Gemini streaming. */
export const googleProvider: LLMProvider = {
  id: "google",
  async *stream() {
    yield "// Provider “google” is stubbed.\n";
    yield "// Wire GOOGLE_API_KEY + model in providers/google.ts\n";
    yield "// Set TERMINAL_PROVIDER=local until keys are wired.";
  },
};
