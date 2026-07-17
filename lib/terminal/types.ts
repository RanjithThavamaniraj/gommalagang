export type Temperament = "chennai" | "engineer" | "roast";

export type MessageRole = "user" | "assistant" | "system";

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  temperament?: Temperament;
  createdAt: number;
};

export type Session = {
  id: string;
  serial: string;
  title: string;
  temperament: Temperament;
  messages: Message[];
  updatedAt: number;
  createdAt: number;
};

export type TerminalSettings = {
  defaultTemperament: Temperament;
  /** Characters per tick while streaming — lower = more cinematic */
  streamPaceMs: number;
};

export const TEMPERAMENTS: {
  id: Temperament;
  index: string;
  name: string;
  tamil: string;
  traits: string;
}[] = [
  {
    id: "chennai",
    index: "01",
    name: "Direct Mode",
    tamil: "நேரடியா சொல்லுவேன்",
    traits: "Straightforward. No fluff.",
  },
  {
    id: "engineer",
    index: "02",
    name: "Engineer Mode",
    tamil: "வேலை நடக்கணும்",
    traits: "Detailed. Technical. Practical.",
  },
  {
    id: "roast",
    index: "03",
    name: "Roast Mode",
    tamil: "தாங்க முடியாது",
    traits: "Merciless. Funny. Still helpful.",
  },
];

export const DEFAULT_SETTINGS: TerminalSettings = {
  defaultTemperament: "chennai",
  streamPaceMs: 16,
};
