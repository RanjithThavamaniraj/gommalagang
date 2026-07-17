import {
  DEFAULT_SETTINGS,
  type Session,
  type Temperament,
  type TerminalSettings,
} from "./types";

const SESSIONS_KEY = "gg.terminal.sessions.v1";
const ACTIVE_KEY = "gg.terminal.active.v1";
const SETTINGS_KEY = "gg.terminal.settings.v1";

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function createSerial(): string {
  const n = Math.floor(Math.random() * 900) + 100;
  return `SN ${n}-GG-${String(Date.now()).slice(-4)}`;
}

export function createSessionId(): string {
  return `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createMessageId(): string {
  return `msg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function blankSession(temperament: Temperament): Session {
  const now = Date.now();
  return {
    id: createSessionId(),
    serial: createSerial(),
    title: "Untitled session",
    temperament,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function titleFromPrompt(prompt: string): string {
  const t = prompt.trim().replace(/\s+/g, " ");
  if (!t) return "Untitled session";
  return t.length > 48 ? `${t.slice(0, 45)}…` : t;
}

export function loadSessions(): Session[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Session[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSessions(sessions: Session[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function upsertSession(session: Session) {
  const all = loadSessions().filter((s) => s.id !== session.id);
  all.unshift({ ...session, updatedAt: Date.now() });
  saveSessions(all.slice(0, 40));
}

export function deleteSession(id: string) {
  saveSessions(loadSessions().filter((s) => s.id !== id));
}

export function loadActiveId(): string | null {
  if (!canUseStorage()) return null;
  return localStorage.getItem(ACTIVE_KEY);
}

export function saveActiveId(id: string | null) {
  if (!canUseStorage()) return;
  if (!id) localStorage.removeItem(ACTIVE_KEY);
  else localStorage.setItem(ACTIVE_KEY, id);
}

export function loadSettings(): TerminalSettings {
  if (!canUseStorage()) return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as TerminalSettings) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: TerminalSettings) {
  if (!canUseStorage()) return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function clearAllTerminalData() {
  if (!canUseStorage()) return;
  localStorage.removeItem(SESSIONS_KEY);
  localStorage.removeItem(ACTIVE_KEY);
  localStorage.removeItem(SETTINGS_KEY);
}
