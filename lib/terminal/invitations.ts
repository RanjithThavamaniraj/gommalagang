export type Invitation = {
  id: string;
  index: string;
  label: string;
  tease: string;
};

/** Premium invitations — fill the composer, never auto-send. */
export const INVITATIONS: Invitation[] = [
  {
    id: "worth-time",
    index: "01",
    label: "Gommala, ask me something worth my time.",
    tease: "Machine interrogates first.",
  },
  {
    id: "roast-idea",
    index: "02",
    label: "Roast my idea.",
    tease: "Bring the idea. Bring thick skin.",
  },
  {
    id: "challenge",
    index: "03",
    label: "Challenge my thinking.",
    tease: "Pressure test. No participation trophy.",
  },
  {
    id: "dont-want",
    index: "04",
    label: "Tell me what I don't want to hear.",
    tease: "Honesty over comfort.",
  },
  {
    id: "eli5",
    index: "05",
    label: "Explain it like I'm five.",
    tease: "Clarity. Still no fluff.",
  },
  {
    id: "fix-thinking",
    index: "06",
    label: "Fix my thinking.",
    tease: "Corrective, not polite.",
  },
  {
    id: "right-question",
    index: "07",
    label: "What's the question I should be asking?",
    tease: "Meta. Signature move.",
  },
  {
    id: "wrong",
    index: "08",
    label: "Convince me I'm wrong.",
    tease: "Adversarial curiosity.",
  },
  {
    id: "five-min",
    index: "09",
    label: "Teach me something useful in five minutes.",
    tease: "Dense utility. Timer on.",
  },
  {
    id: "surprise",
    index: "10",
    label: "Surprise me.",
    tease: "Wildcard. Machine picks.",
  },
];
