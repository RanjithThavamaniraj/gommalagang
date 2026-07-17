# Gommala Gang — Design System

**The single source of truth for every page.**

This document describes the system as it exists on the homepage. The homepage is
canonical. Nothing here is aspirational; if it isn't on the homepage, it isn't
in the system. Every future page (`/chat`, `/about`, `/404`, …) inherits this
language — extend it, never fork it.

The design is in freeze. Changes must simplify, refine, or strengthen. Every
revision should remove more than it adds.

---

## 1. Identity in one paragraph

Gommala Gang is presented as a recovered publication — a classified archive
about an underground personality-first AI. The page is not a website
with sections; it is one artifact with four numbered chapters. Typography is
the hero. Whitespace is a design element. The supplied 16:9 artwork
(`public/images/hero.png`) is the anchor: the page mirrors its internal
markings (`GG/01`, `CLASS: UNFILTERED AI`, the amber CRT) rather than
decorating around it.

---

## 2. Typography

### 2.1 The three voices

| Voice | Font | Weight | CSS variable | Role |
|---|---|---|---|---|
| **Display** | Anton | 400 | `--font-anton` → `font-display` | Headlines, numerals, wordmark, credit names |
| **Serif** | Fraunces (axes: `opsz`, `SOFT`, `WONK`; normal + italic) | variable | `--font-fraunces` → `font-serif` / body default | Body copy, subheads, epigraphs — always editorial, usually italic |
| **Mono** | IBM Plex Mono | 400 | `--font-plex-mono` → `font-mono` | Labels, slates, captions, terminal, buttons, nav links |

A fourth *script*, not a fourth voice: **Noto Sans Tamil** 400
(`--font-tamil`), used only for Tamil phrases. Tamil text always carries
`lang="ta"` and renders in bronze.

**Do not add weights.** Everything is one weight per family. Hierarchy comes
from size, case, tracking, and color — never boldness.

**Banned:** Inter, Geist, Manrope, and any default SaaS face. No additional
families, ever.

### 2.2 Hierarchy (as used)

| Level | Setting |
|---|---|
| H1 (hero) | Anton, `clamp(3.2rem, 8.5vw, 6.5rem)`, `leading-[0.92]`, uppercase; may exceed its column on desktop (`lg:whitespace-nowrap`) |
| H2 (chapter) | Anton, `text-4xl` → `sm:text-6xl`, `leading-[0.95]`, uppercase, two-line lockup |
| H3 (index row) | Anton, `text-3xl` → `lg:text-4xl`, uppercase, `tracking-wide` |
| Numerals | Anton hollow, `text-5xl` → `lg:text-6xl` |
| Body / subhead | Fraunces italic, `text-lg`, `leading-relaxed`, color stone |
| Mono label | 11px, uppercase, `tracking-[0.25em]`–`[0.35em]` |
| Mono micro (captions, specs) | 10px, uppercase, `tracking-[0.25em]`–`[0.3em]` |
| Serial | 9px, uppercase, `tracking-[0.3em]`, stone/30 |
| Quotes | Plex Mono, `text-sm`, `leading-6`, ivory/60 |

### 2.3 Headline lockup rule

Every display lockup mixes at most three fills, in this vocabulary only:

- **Solid ivory** — the default line
- **Hollow** — exactly one line (or one word) per lockup, never more
- **Ember** — the payoff word, used at most once per lockup

Examples in canon: `MEET (hollow) / GOMMALA (solid) / GANG. (ember)`;
`ASK IT ANYTHING. (solid) / REGRET NOTHING. (hollow)`;
`ONE AI. (solid) / THREE TEMPERAMENTS. (hollow)`.

---

## 3. Color

One palette. No blue. No purple. Anywhere.

| Token | Value | Use |
|---|---|---|
| `ink` | `#090909` | Page background, text on ember |
| `ivory` | `#F2E9D8` | Primary text, solid headlines |
| `stone` | `#B6ADA0` | Secondary text; opacities /60 /50 /40 /30 for receding microcopy |
| `ember` | `#C46A1A` | Accent: payoff words, slate codes, CTAs, cursor, focus, selection, hover fill |
| `bronze` | `#8D5C34` | Quiet accent: Tamil text, ghost-button borders |
| `hairline` | `rgba(255,255,255,0.08)` | All rules and borders |

Fixed supporting values (do not generalize into new tokens):

- Panel / caption-strip background: `#0D0C0A`
- Terminal bezel: `#161310`; screen: `#0B0A08`
- Phosphor (terminal prompt text): `#D8E06A` — echoes the CRT in the artwork
- Status dot: `#7FA650`
- Primary button hover: `#D97A24`
- Selection: ember background, ink text

Atmosphere (already at maximum; never intensify): `bg-concrete` radial warm
tint + vignette on body, fixed SVG-turbulence noise at 5% opacity, ≤10 drifting
dust motes in the hero only.

---

## 4. Spacing & layout

### 4.1 Scale

- Chapter padding: `py-28 lg:py-36` (hero: `pt-32 lg:pt-40`, `pb-20 lg:pb-24`)
- Container: `max-w-7xl px-6 lg:px-10`; the terminal chapter narrows to
  `max-w-4xl`; colophon credits narrow to `max-w-xl`
- Slate to headline: `mb-8` (built into SectionSlate)
- Headline to subhead: `mt-6`–`mt-8`; subhead to buttons: `mt-10`
- Index rows: `py-10 lg:py-12`, `gap-x-8`
- Micro-gaps under equipment: `mt-2`–`mt-3`

### 4.2 Composition rules

- Two-column hero: copy `1fr`, plate `1.15fr`; the plate overflows right
  (`lg:-mr-16 xl:-mr-24`); the headline may break its column. Asymmetry is
  intentional — do not "fix" it.
- Grid breaks are allowed for display type only, never for body copy.
- Whitespace does the pacing between chapters. Do not fill gaps.
- Mobile stacks: copy above plate; buttons go full-width; the editorial rhythm
  (slate → headline → serif → mono) must survive intact.

---

## 5. The three motifs

These are the only recurring graphic devices. Do not add a fourth.

### 5.1 SectionSlate (`components/SectionSlate.tsx`)

The chapter opener. Registration crosshair (14px, stone/45) + mono code in
ember + `·` + label in stone + hairline running to the margin. `mb-8`.

- Every chapter opens with exactly one slate. No slate appears mid-chapter.
- Codes are sequential: `GG/01` Class: Unfiltered AI · `GG/02` The Terminal ·
  `GG/03` The Temperaments · `GG/04` Colophon.
- Future pages continue the numbering or reuse their parent chapter's code.
  The crosshair never appears outside a slate.

### 5.2 Hollow typography (`.text-hollow`)

2px stroke `rgba(242,233,216,0.85)`, transparent fill.

- One hollow element per lockup (see §2.3). Numerals in the index are hollow.
- Hollow type hosts the **signature interaction** (§7). No other element may
  use text-stroke.

### 5.3 Caption strips

Mono microcopy on a hairline — the "archival record" voice:

- **Plate caption** (under artwork): 10px mono on `#0D0C0A`, hairline border,
  left = record (`Plate 01 — The gang at work`), right = provenance
  (`Recovered · Archive`).
- **Equipment spec strip** (under terminal): borderless, stone/40, three
  entries: `Model GG-01 · Sarcasm: factory calibrated · Unfiltered · 240V`.
- **Serial**: 9px, stone/30, right-aligned inside the bezel (`SN 1997-GG-041`).

Rule: captions state facts in archive register — implication over explanation
("Recovered · Archive", not "Shot on location"). At most one caption strip per
object; not every object needs one.

---

## 6. Chapter structure

The artifact has four chapters. Every page is a chapter or a continuation of
one.

| Code | Chapter | Dominant idea |
|---|---|---|
| `GG/01` | The hero / plate | Poster typography + museum-mounted artwork |
| `GG/02` | The Terminal | One recovered machine |
| `GG/03` | The Temperaments | Magazine contents-page index |
| `GG/04` | Colophon | Movie-credit roll |

**One dominant visual idea per chapter.** If a chapter needs two ideas, it is
two chapters.

Canonical chapter anatomy: SectionSlate → display lockup → (optional serif
subhead) → the chapter's single object → (optional caption strip).

---

## 7. Interaction

### 7.1 The signature interaction (there is only one)

**Hollow letters slowly fill with ember on touch.** Defined once in
`globals.css`:

```css
.text-hollow { transition: color 0.8s ease, -webkit-text-stroke-color 0.8s ease; }
.text-hollow:hover,
.group:hover .text-hollow { color: #C46A1A; -webkit-text-stroke-color: transparent; }
```

It applies to every hollow element sitewide — hero "MEET", chapter headline
hollow lines, index numerals (triggered by their row's `group` hover). It is
disabled under `prefers-reduced-motion`. **Do not invent a second signature
interaction on any future page.**

### 7.2 Permitted secondary states (utilitarian, not expressive)

- Links: color shift stone → ivory (300ms)
- Primary button: fill brightens to `#D97A24`, soft ember shadow; arrow nudges
  4px
- Ghost button / nav CTA: border and text warm to ember, or invert to ember
  fill with ink text
- Index rows: the bottom hairline sweeps left→right in ember (700ms) alongside
  the numeral fill — these two read as one gesture

Nothing else responds to hover. If a new element wants a hover state, the
answer is one of the above or nothing.

---

## 8. Motion

Motion exists for pacing, not decoration.

- **Library:** Framer Motion. Shared ease: `[0.16, 1, 0.3, 1]`. Durations
  0.7–1.1s. No bounce, no elastic, no spring, no spin.
- **Entrances:** fade-up only — opacity 0→1 with y 20–32px. Component:
  `FadeUp` (0.8s, 28px, `viewport={{ once: true }}`, margin −60 to −80px).
  Staggers 0.1–0.12s between siblings.
- **Parallax:** hero only — copy drifts up ≤30px, plate down ≤60px across the
  scroll of the section. Nowhere else.
- **Loops:** exactly two, both diegetic (they belong to the machine, not the
  UI): the terminal typing cycle and the 1.1s stepped cursor blink. Dust
  drifts linearly over 18–40s.
- **Reduced motion:** every animated element checks `useReducedMotion` or a
  `prefers-reduced-motion` media query. Entrances render settled; dust and
  hollow transitions switch off; typing may simply appear.

---

## 9. Components (`components/`)

| Component | Contract |
|---|---|
| `Navbar` | Fixed, transparent. Gains `bg-ink/70 backdrop-blur-md` + hairline only after 24px of scroll. Wordmark `GG_` (ember underscore). Links are mono 11px with ember index numbers (`01 About · 02 Terminal · 03 Temperaments · ↗ GitHub`). CTA is the ember-outlined "Join the Gang". |
| `SectionSlate` | See §5.1. Props: `code`, `label`. Never restyle per-page. |
| `Button` (`ui/Button.tsx`) | Two variants only. `primary`: ember fill, ink text. `ghost`: bronze/60 border, ivory text. Both: mono 11–12px, uppercase, `tracking-[0.25em]`, `px-7 py-4`, **square corners**. No pills, no rounded buttons, no third variant. |
| `FadeUp` | The only entrance wrapper. Props: `delay`, `className`. |
| `Dust` | Hero only. Deterministic seed (SSR-safe), ≤10 motes. |
| `TerminalPreview` | The machine: `#161310` bezel (`p-3/4`) → header row (version in ember mono, status dot) → recessed `#0B0A08` screen with inset shadow, CRT scanlines (`.crt-screen`), phosphor glow (`.crt-text`) → serial → spec strip. Prompt lines in phosphor `#D8E06A`, replies ivory/90, ember block cursor. It is hardware, not a code editor: no window chrome, no traffic-light dots, no syntax colors. |
| `Personality` | Index rows, not cards: grid `7rem / 1fr / 1fr` — hollow numeral / name + Tamil (bronze) + serif-italic traits / right-aligned mono quote. Hairline top and bottom. Hover: §7.2 only. |
| `Footer` | Colophon: slate `GG/04` → credit ledger (`dl`: mono role left, Anton name right, `max-w-xl`) → serif-italic epigraph → hairline base bar (wordmark · "Zero corporate politeness." · mono links). |

New components must be composed from these voices and motifs. If a new
component invents a visual device, it is out of system.

---

## 10. Copy register

- English: confident, dry, economical. Sarcasm lands because it is calm.
- Tamil appears as short authentic phrases, never decoration-gibberish, always
  `lang="ta"`, always bronze.
- Archive register for microcopy: `Recovered · Archive`, `Class: Unfiltered
  AI`, `Sarcasm: factory calibrated`. Imply; don't explain. Use sparingly —
  a few per page, not per section.
- The brand line is `Zero corporate politeness.` — do not vary it.

---

## 11. Accessibility

- **Focus:** `:focus-visible` → 1px ember outline, 4px offset. Never remove;
  never restyle to blue defaults.
- **Reduced motion:** honored everywhere (§8).
- **Language:** Tamil text carries `lang="ta"`.
- **Semantics:** one `h1` per page; heading order h1→h2→h3 without skips;
  `header`/`main`/`footer` landmarks; nav CTA and links are real anchors; the
  terminal uses `role="log"` with an `aria-label`; decorative elements
  (crosshairs, motes, sweeps, numerals) carry `aria-hidden`.
- **Images:** the plate has full descriptive alt text. Decorative images don't
  exist in this system.
- **Contrast:** ivory-on-ink and stone-on-ink pass comfortably. Low-opacity
  stone (/40, /30) is reserved for non-essential microcopy that is also
  understandable from context; never set body copy below stone/60.
- **Dark scheme:** `color-scheme: dark` is declared; theme color `#090909`.

---

## 12. The checklist

Before shipping any change or page, ask in order:

1. Would someone mistake this for another AI startup website? → redesign it.
2. Does this feel like another page of the same publication? → if not, redesign it.
3. If every logo and word disappeared, is it still recognizably Gommala Gang? → that is the standard.
4. Does it add a motif, voice, palette entry, or interaction? → reject it.
5. Can something be removed instead? → remove it.

The page should become quieter over time. Not louder.
