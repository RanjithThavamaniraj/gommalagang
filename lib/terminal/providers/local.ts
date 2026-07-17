import { generateReply } from "@/lib/terminal/reply";
import { lastUserContent } from "@/lib/terminal/prompt/assemble";
import type {
  LLMProvider,
  ProviderStreamRequest,
} from "@/lib/terminal/providers/types";

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const t = setTimeout(resolve, ms);
    const onAbort = () => {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

/**
 * Local personality engine — cinematic throttle lives HERE (H7), not in cloud adapters.
 */
export const localProvider: LLMProvider = {
  id: "local",

  async *stream(req: ProviderStreamRequest) {
    const prompt = lastUserContent(req.messages);
    if (!prompt) {
      yield "Empty line. Type something real.";
      return;
    }

    // History is already in req.messages (system + turns). Local engine can use it.
    const full = generateReply(prompt, req.temperament, req.messages);
    // generation / tools / structuredOutput / providerOptions: reserved for cloud adapters
    void req.generation;
    void req.tools;
    void req.structuredOutput;
    void req.providerOptions;
    void req.includeMetadata;

    const pace = Math.min(40, Math.max(8, req.paceMs ?? 16));
    const BATCH = 3;

    for (let i = 0; i < full.length; i += BATCH) {
      if (req.signal?.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }
      const slice = full.slice(i, i + BATCH);
      yield slice;
      const last = slice[slice.length - 1] ?? "";
      const delay =
        last === "\n"
          ? pace * 2.4
          : /[.,:;?!]/.test(last)
            ? pace * 1.7
            : pace * BATCH * 0.85;
      await sleep(delay, req.signal);
    }
  },
};
