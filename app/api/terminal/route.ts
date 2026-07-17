import {
  assembleProviderMessages,
  type ConversationTurn,
} from "@/lib/terminal/prompt/assemble";
import { resolveProvider } from "@/lib/terminal/providers";
import type { Temperament } from "@/lib/terminal/types";

export const runtime = "nodejs";

type Body = {
  /** Preferred: full conversation turns (C3). */
  messages?: ConversationTurn[];
  /** Legacy single-turn — still accepted. */
  prompt?: string;
  temperament?: Temperament;
  paceMs?: number;
};

function normalizeTurns(body: Body): ConversationTurn[] {
  if (Array.isArray(body.messages) && body.messages.length > 0) {
    return body.messages
      .filter(
        (m) =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0
      )
      .map((m) => ({ role: m.role, content: m.content.trim() }));
  }
  const prompt = body.prompt?.trim();
  if (prompt) return [{ role: "user", content: prompt }];
  return [];
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return new Response("Bad request.", { status: 400 });
  }

  const turns = normalizeTurns(body);
  if (turns.length === 0) {
    return new Response("Empty line. Type something real.", { status: 400 });
  }

  const temperament: Temperament =
    body.temperament === "engineer" || body.temperament === "roast"
      ? body.temperament
      : "chennai";

  const paceMs = Math.min(40, Math.max(8, body.paceMs ?? 16));
  const messages = assembleProviderMessages(turns, temperament);
  const provider = resolveProvider();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of provider.stream({
          messages,
          temperament,
          paceMs,
          signal: request.signal,
        })) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          // Client broke the line — close quietly.
        } else {
          controller.enqueue(
            encoder.encode("\n\nLine dropped mid-thought. Try again.")
          );
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-GG-Provider": provider.id,
    },
  });
}
