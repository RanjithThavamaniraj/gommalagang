import type { Temperament } from "./types";
import type { ProviderMessage } from "@/lib/terminal/providers/types";

export type Topic =
  | "code"
  | "venture"
  | "life"
  | "teach"
  | "spar"
  | "invert"
  | "correct"
  | "general";

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function pick<T>(items: T[], seed: string): T {
  return items[hash(seed) % items.length];
}

function clip(prompt: string, n = 110): string {
  const t = prompt.trim().replace(/\s+/g, " ");
  return t.length > n ? `${t.slice(0, n - 1).trim()}…` : t;
}

export function topicHint(prompt: string): Topic {
  const p = prompt.toLowerCase();
  if (/code|bug|error|typescript|react|api|deploy|stack/.test(p)) return "code";
  if (/startup|idea|business|product|launch|venture/.test(p)) return "venture";
  if (/love|life|career|decision|should i|quit|job/.test(p)) return "life";
  if (/explain|what is|how does|teach|eli5|five|minutes/.test(p)) return "teach";
  if (/roast|wrong|challenge|convince|thinking/.test(p)) return "spar";
  if (
    /question i should|ask me|surprise|worth my time|something worth/.test(p)
  )
    return "invert";
  if (/fix my thinking|don'?t want to hear|blind/.test(p)) return "correct";
  return "general";
}

/** Prior turns for continuity (system messages already stripped upstream). */
function continuityNote(history: ProviderMessage[], seed: string): string {
  const prior = history.filter(
    (m) => m.role === "user" || m.role === "assistant"
  );
  if (prior.length < 2) return "";
  const lastAssistant = [...prior].reverse().find((m) => m.role === "assistant");
  if (!lastAssistant) return "";
  const snip = clip(lastAssistant.content.replace(/\n/g, " "), 72);
  return pick(
    [
      `Continuing from earlier (“${snip}”). `,
      `Building on what we already established. `,
      "",
    ],
    seed + "cont"
  );
}

/**
 * Local personality engine — three different reasoning machines.
 * Cloud providers use system prompts; this keeps V1 distinctive without an LLM.
 */
export function generateReply(
  prompt: string,
  temperament: Temperament,
  history: ProviderMessage[] = []
): string {
  const topic = topicHint(prompt);
  const short = clip(prompt);
  const cont = continuityNote(history, short + temperament);

  if (temperament === "engineer") return cont + engineer(short, topic);
  if (temperament === "roast") return cont + roast(short, topic);
  return cont + chennai(short, topic);
}

/* ─── Engineer: analytical, structured, evidence-first ─── */

function engineer(prompt: string, topic: Topic): string {
  switch (topic) {
    case "code":
      return [
        "Assumptions",
        "- You have a failing behaviour and an incomplete error surface.",
        "- “It doesn’t work” is a symptom, not a diagnosis.",
        "",
        "Diagnosis",
        "- Without the exact error + minimal repro, any fix is speculation.",
        "- Most “mystery” bugs are: wrong input, stale build, or an assumption you didn’t write down.",
        "",
        "Trade-offs",
        "- Spray-fixing: fast feeling, slow learning.",
        "- Bisect + one change: slower start, owned outcome.",
        "",
        "Recommendation",
        "1. Reproduce with the smallest input.",
        "2. Capture full error text + stack (not a screenshot of vibes).",
        "3. Bisect last-known-good → first-broken.",
        "4. Patch the cause; add a test that fails once then passes twice.",
        "",
        "Verify",
        "If you can’t state the root cause in one sentence, you don’t have it yet.",
        "",
        `Re: “${prompt}” — send the error body. Then we engineer, not guess.`,
      ].join("\n");

    case "venture":
      return [
        "Assumptions",
        "- You’re evaluating a venture with opinions where you need instrumentation.",
        "",
        "Diagnosis",
        "- Idea quality is unmeasured. Risk is concentrated in untested demand.",
        "",
        "Trade-offs",
        "- Pitch polish vs contact with reality. Only one updates the model.",
        "",
        "Recommendation",
        "1. One user, one job-to-be-done, one success metric.",
        "2. Thinnest path that touches that metric.",
        "3. Ten real people in seven days — not ten slides.",
        "",
        "Verify",
        "Metric moved → continue. Flat → kill or rewrite the assumption, not the logo.",
      ].join("\n");

    case "life":
      return [
        "Assumptions",
        "- This is framed as confusion; it’s usually a trade-off under constraints.",
        "",
        "Diagnosis",
        "- Emotion is data. It is not a decision procedure.",
        "",
        "Trade-offs",
        "- Comfort now vs self-respect in 12 months. Name which you’re optimizing.",
        "",
        "Recommendation",
        "1. List ≤3 options.",
        "2. For each: cost now, cost in a year, reversible?",
        "3. Pick the option with acceptable irreversible downside.",
        "",
        "Verify",
        "Calendar block the first irreversible-safe action within 72 hours. No block = no decision.",
      ].join("\n");

    case "teach":
      return [
        "Assumptions",
        "- You want understanding that transfers, not trivia.",
        "",
        "Teaching brief",
        "1. Name the system in one sentence.",
        "2. Identify 2–3 levers that change outcomes.",
        "3. Practice one lever with a tiny exercise.",
        "4. Ignore secondary detail until that lever is automatic.",
        "",
        "Trade-off",
        "Breadth without a lever feels smart and stays useless.",
        "",
        `Topic in “${prompt}” is still fuzzy. Narrow to one noun — I’ll go deep on that lever only.`,
      ].join("\n");

    case "invert":
      return [
        "Assumptions",
        "- The question you typed may be protecting an untested preference.",
        "",
        "Better question",
        "What experiment would make this conversation unnecessary — because you’d already have the data?",
        "",
        "Recommendation",
        "Design that experiment at the smallest cost. Run it. Bring results.",
        "",
        "Verify",
        "If nothing could change your mind, this isn’t inquiry. It’s decoration.",
      ].join("\n");

    case "correct":
      return [
        "Assumptions",
        "- You’re optimizing narrative coherence over causal accuracy.",
        "",
        "Diagnosis",
        "- Facts, inferences, and wishes are currently fused.",
        "",
        "Recommendation",
        "1. Split into three lists: facts / inferences / wishes.",
        "2. Circle the inference that carries the decision.",
        "3. Ask: what measurement kills that inference?",
        "",
        "Verify",
        "Run the measurement. Update the model. Repeat. Feeling certain is not verification.",
      ].join("\n");

    case "spar":
      return [
        "Assumptions",
        "- Your claim is currently unfalsifiable or under-specified.",
        "",
        "Counter-position",
        "Without a falsifier, this is taste wearing a lab coat.",
        "",
        "Provide",
        "- Claim in one sentence",
        "- Strongest opposing evidence you already know",
        "- What you’d measure next",
        "",
        "Then we stress-test it. Until then, confidence is premature.",
      ].join("\n");

    default:
      return [
        "Assumptions",
        `- Request: “${prompt}”`,
        "- Success criteria and constraints are missing.",
        "",
        "Diagnosis",
        "- Answering without those produces confident noise.",
        "",
        "Recommendation — reply with:",
        "1. What “done” looks like",
        "2. Hard constraints (time / tools / skills)",
        "3. What you already tried",
        "",
        "Verify",
        "I’ll answer against those three. Everything else is scope creep.",
      ].join("\n");
  }
}

/* ─── Direct: conversational friend, natural colour, practical ─── */

function chennai(prompt: string, topic: Topic): string {
  const openQuestionFirst = hash(prompt) % 3 === 0;

  switch (topic) {
    case "code": {
      const body = [
        "Your code is doing exactly what you wrote. That’s the diagnosis and the insult.",
        "",
        "Read the full error — not the mood of the error. Change one thing. Run it. Confirm.",
        "If you can’t explain the bug in one line, you don’t understand it yet.",
        "",
        "Paste the actual error next. Screenshots of feelings won’t help.",
      ].join("\n");
      return openQuestionFirst
        ? `Before we dig — what’s the exact error text?\n\n${body}`
        : `Seri.\n\n${body}`;
    }

    case "venture": {
      const body = [
        "Idea is cheap. Proof is expensive.",
        "",
        "Ship something ugly this week that a stranger can use. If nobody cares, the market already answered — louder than any pitch deck.",
        "",
        "Stop asking if it’ll work. Ask what you’ll measure in 14 days.",
      ].join("\n");
      return openQuestionFirst
        ? `Who is the one person who should care if this disappears tomorrow?\n\n${body}`
        : `Ok. Straight.\n\n${body}`;
    }

    case "life": {
      const body = [
        "You’re not confused. You’re avoiding a decision that has a cost either way.",
        "",
        "Pick the option you’ll respect yourself for in a year — not the one that keeps everyone comfortable this week.",
        "",
        "If you wanted soft encouragement, wrong terminal.",
      ].join("\n");
      return openQuestionFirst
        ? `What are you postponing because choosing would make the excuse disappear?\n\n${body}`
        : body;
    }

    case "teach": {
      const body = [
        "Most complicated things are a few rules stacked. Find the rule that actually moves the outcome. Ignore the rest until that one’s solid.",
        "",
        "Tell me the topic in one line. I’ll cut it to five-year-old size without talking like one.",
      ].join("\n");
      return openQuestionFirst
        ? `What single noun should I teach — not the whole universe?\n\n${body}`
        : `Simple version.\n\n${body}`;
    }

    case "invert":
      return [
        "Question for you first:",
        "What are you postponing because starting would erase your favourite excuse?",
        "",
        "Answer that honestly. Then we talk about whatever you typed.",
        "",
        `You said: “${prompt}” — that’s the surface. The postponement is the plot.`,
      ].join("\n");

    case "correct":
      return [
        "What you don’t want to hear: you’re optimizing for looking busy, not getting clearer.",
        "",
        "Write the problem in one sentence with no adjectives. If you can’t, the thinking is the bug — not the world.",
        "",
        "Do that sentence. Then we fix something real.",
      ].join("\n");

    case "spar":
      return [
        "Your position assumes the comfortable version of the facts.",
        "",
        "Challenge: what evidence would make you change your mind in 48 hours?",
        "",
        "If the answer is “nothing,” you’re not thinking — you’re decorating a conclusion.",
        openQuestionFirst ? "" : "",
        "I’ll meet you at the evidence. Bring some.",
      ]
        .filter(Boolean)
        .join("\n");

    default: {
      const body = [
        `You said: “${prompt}”`,
        "",
        "Say the real constraint in one line — time, money, skill, or fear. Pick one.",
        "",
        "Once that’s named, the next step is usually obvious. And boring. Do the boring step.",
      ].join("\n");
      return openQuestionFirst
        ? `What’s the actual constraint — not the story around it?\n\n${body}`
        : `Fine. Listen once.\n\n${body}`;
    }
  }
}

/* ─── Roast: honest, playful, constructive — never toxic ─── */

function roast(prompt: string, topic: Topic): string {
  const needle = pick(
    [
      "Cute question. Dangerous confidence.",
      "Ah — curiosity wearing a helmet.",
      "Bold of you to type that like it’s a strategy.",
    ],
    prompt + "r"
  );

  switch (topic) {
    case "code":
      return [
        needle,
        "",
        "Blind spot",
        "Your code works exactly as written. That’s the tragedy. Nobody — least of all you — knows why.",
        "",
        "Useful move",
        "Stop remixing Stack Overflow like it’s jazz. Read the error. Change one variable. Run it. Pretend you’re a professional for eleven minutes.",
        "",
        "Then come back. I’ll be sharp and useful — not cruel for sport.",
      ].join("\n");

    case "venture":
      return [
        needle,
        "",
        "Blind spot",
        "Your “idea” is currently a mood board with funding anxiety.",
        "",
        "Useful move",
        "Pick one user who’ll be annoyed if it disappears. Build only for them. If you need a slide to explain it, you don’t have it yet.",
        "",
        "Ship. Or keep workshopping your personality. One of those changes the world; the other changes your LinkedIn.",
      ].join("\n");

    case "life":
      return [
        needle,
        "",
        "Blind spot",
        "You’re not seeking wisdom. You’re seeking permission to keep hesitating.",
        "",
        "Useful move",
        "Denied. Choose the path that scares you for the right reason — growth — not the one that scares you because you’d have to admit you were stalling.",
        "",
        "Respect is downstream of a decision. Start there.",
      ].join("\n");

    case "teach":
      return [
        needle,
        "",
        "Blind spot",
        "You asked for simple, which people often use as a request for permission to stay shallow.",
        "",
        "Useful move",
        "Big thing = small rules in a trench coat. Learn the rule that pays rent. Practice until it’s boring. Then add the next rule.",
        "",
        "Name the topic like an adult. I’ll make it simple — not stupid.",
      ].join("\n");

    case "invert":
      return [
        needle,
        "",
        "Blind spot",
        `The question worth your time isn’t “${prompt}”.`,
        "",
        "Useful move",
        "Ask instead: what skill are you avoiding because getting good would remove your favourite excuse?",
        "",
        "Sit with that. It’s uglier than a prompt. That’s why it matters.",
      ].join("\n");

    case "correct":
      return [
        needle,
        "",
        "Blind spot",
        "Your “thinking” is mostly vibes with footnotes.",
        "",
        "Useful move",
        "Write the claim, the evidence, the fear underneath. Cross out anything that exists only to protect your ego.",
        "",
        "What’s left is the actual problem. We can work with that — and only that.",
      ].join("\n");

    case "spar":
      return [
        needle,
        "",
        "Blind spot",
        "You’re wrong in a very popular way — which is why it feels smart.",
        "",
        "Useful move",
        "If your idea can’t survive a hostile reading, it can’t survive the market, the codebase, or Tuesday.",
        "",
        "Steelman the opposite view in five lines. Then we’ll see what’s left of yours.",
      ].join("\n");

    default:
      return [
        needle,
        "",
        "Blind spot",
        `“${prompt}” isn’t a prompt. It’s a shrug with punctuation.`,
        "",
        "Useful move",
        "Give me a concrete thing — a decision, a bug, a claim. I’ll roast the weak parts and leave you something usable.",
        "",
        "Deal?",
      ].join("\n");
  }
}
