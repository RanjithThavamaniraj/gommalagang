import { anthropicProvider } from "@/lib/terminal/providers/anthropic";
import { googleProvider } from "@/lib/terminal/providers/google";
import { localProvider } from "@/lib/terminal/providers/local";
import { ollamaProvider } from "@/lib/terminal/providers/ollama";
import { openaiProvider } from "@/lib/terminal/providers/openai";
import { openrouterProvider } from "@/lib/terminal/providers/openrouter";
import type {
  LLMProvider,
  ProviderId,
} from "@/lib/terminal/providers/types";

const registry: Record<ProviderId, LLMProvider> = {
  local: localProvider,
  openai: openaiProvider,
  anthropic: anthropicProvider,
  google: googleProvider,
  openrouter: openrouterProvider,
  ollama: ollamaProvider,
};

/** Server-only. Terminal UI never imports providers. */
export function resolveProvider(id?: string | null): LLMProvider {
  const key = (id ?? process.env.TERMINAL_PROVIDER ?? "local").toLowerCase();
  if (key in registry) return registry[key as ProviderId];
  return localProvider;
}

export function listProviderIds(): ProviderId[] {
  return Object.keys(registry) as ProviderId[];
}

export type {
  LLMProvider,
  ProviderId,
  ProviderMessage,
  ProviderStreamRequest,
} from "@/lib/terminal/providers/types";
