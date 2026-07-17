import { temperamentSystemPrompt } from "@/lib/terminal/prompt/personality";
import type { Temperament } from "@/lib/terminal/types";
import type { ProviderMessage } from "@/lib/terminal/providers/types";

export type ConversationTurn = {
  role: "user" | "assistant";
  content: string;
};

/**
 * Prompt assembly — conversation turns → provider messages.
 * Personality system prompt is applied here, not in the UI.
 */
export function assembleProviderMessages(
  turns: ConversationTurn[],
  temperament: Temperament
): ProviderMessage[] {
  const out: ProviderMessage[] = [
    {
      role: "system",
      content: temperamentSystemPrompt(temperament),
    },
  ];

  for (const t of turns) {
    const content = t.content.trim();
    if (!content) continue;
    out.push({ role: t.role, content });
  }

  return out;
}

/** Last user utterance — used by the local engine. */
export function lastUserContent(messages: ProviderMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content;
  }
  return "";
}
