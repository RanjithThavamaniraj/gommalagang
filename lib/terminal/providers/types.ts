import type { Temperament } from "@/lib/terminal/types";

/** Wire format for provider adapters — UI never imports provider SDKs. */
export type ProviderRole = "system" | "user" | "assistant";

export type ProviderMessage = {
  role: ProviderRole;
  content: string;
};

/** Optional generation knobs — adapters ignore what they don't support. */
export type ProviderGenerationOptions = {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stop?: string[];
};

/** Tool / function definitions — unused until a provider wires them. */
export type ProviderToolDefinition = {
  name: string;
  description?: string;
  /** JSON-schema-like parameters object */
  parameters?: Record<string, unknown>;
};

/** Structured output request — unused until a provider wires it. */
export type StructuredOutputSpec = {
  name?: string;
  /** JSON Schema or provider-native schema object */
  schema?: Record<string, unknown>;
};

/**
 * Stable streaming request.
 *
 * Required fields stay required. Everything else is optional so we can add
 * temperature, tools, structured output, metadata, and vendor flags without
 * breaking existing adapters (they simply ignore unknown option bags).
 */
export type ProviderStreamRequest = {
  /**
   * Full assembled thread: system prompt(s) + conversation history + latest user.
   * History and system prompts live here — not as parallel channels.
   */
  messages: ProviderMessage[];

  temperament: Temperament;

  /** Sampling / length controls for cloud providers. */
  generation?: ProviderGenerationOptions;

  /** Function / tool calling surface. */
  tools?: ProviderToolDefinition[];

  /** Ask the model for structured output. */
  structuredOutput?: StructuredOutputSpec;

  /**
   * Namespaced vendor escape hatch, e.g.
   * `{ "openai": { seed: 1 }, "anthropic": { thinking: true } }`
   */
  providerOptions?: Record<string, unknown>;

  /**
   * Hint that the caller may want response metadata later
   * (tokens, model id, finish reason). Streaming body stays text deltas;
   * metadata can ride headers or a future side-channel without changing
   * AsyncIterable<string>.
   */
  includeMetadata?: boolean;

  /**
   * Cinematic throttle hint for the local adapter only.
   * Cloud / Ollama adapters MUST ignore this.
   */
  paceMs?: number;

  signal?: AbortSignal;
};

/**
 * Every model backend implements this.
 * Yield UTF-8 text deltas; the route pipes them to the client unchanged.
 */
export interface LLMProvider {
  readonly id: string;
  stream(req: ProviderStreamRequest): AsyncIterable<string>;
}

export type ProviderId =
  | "local"
  | "openai"
  | "anthropic"
  | "google"
  | "openrouter"
  | "ollama";
