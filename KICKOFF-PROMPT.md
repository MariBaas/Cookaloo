# Cookaloo – Kickoff prompt för Antigravity (v2, Expo + Gemini)

> Klistra in allt under strecket i Antigravity, i den lokala projektmappen (inte Google Drive).
> Mappen ska innehålla `.agents/` (regler + skills) och den uppackade designexporten i `design-reference/`.

---

You are the lead engineer for **Cookaloo**. Before doing anything, read:
- `.agents/rules/cookaloo-architecture.md` — authoritative rules (stack, security, domain rules, plans, MVP scope). It overrides anything else, including older skill text.
- All skills in `.agents/skills/` (design system, Expo, Gemini AI, Supabase, i18n).
- The Claude Design prototype in `/design-reference` (`cookaloo Prototyp.dc.html` and `Visuella riktningar.dc.html`).

## Design reference
- The prototype is the **visual reference**: screens, layout, Linne design tokens, typography, components, copy and interactions. Recreate it with Expo Router + NativeWind.
- Do **not** reuse the prototype's code, sample-data logic or any browser-only persistence. All app data lives in Supabase.
- If the design and the rules conflict: **rules decide functionality and data, design decides look and feel.** Known deviations to apply:
  - AI import limit is read from `config/plans.ts` (Free: 10/month), not the hardcoded 20 in the prototype. Add a "Läs om Premium" action to the limit card.
  - Unit toggle stays **Metriskt | US**, but Metriskt shows dl/msk/tsk/krm when the UI is Swedish.
  - Cooking mode is V2 — do not build it.
- Do not modify files in `/design-reference`.

## Step 1 – plan only (no code yet)
1. Ask me up to 5 truly blocking questions.
2. Write `docs/PRD.md`, `docs/DATA_MODEL.md` (based on the Supabase skill, incl. RLS for every table), `docs/PLAN.md` (phases below with tasks and acceptance criteria) and `docs/DESIGN_NOTES.md` (screens/tokens found in the design, plus every conflict with the rules).
3. Stop and wait for my approval.

## Build phases (one at a time; after each: lint, type-check, tests, Git commit, short summary + manual test checklist, then wait)
1. Expo project setup, NativeWind theme from Linne tokens, fonts, Supabase (EU), auth (Google + magic link), profiles, households, expiring invites, RLS. Web/PWA build running.
2. Recipe data model + manual create/edit + recipe view (servings 1–8 default 4, Metriskt/US) + `lib/units` and `lib/scaling` with tests.
3. Import via Edge Functions: URL (JSON-LD first, AI fallback) → photo → PDF → text, review screen, `ai_usage` logging, plan limits from `config/plans.ts`.
4. Library (search, category chips, filters, sort), per-user ratings/tried/notes, cook log.
5. Shopping list: add recipes with servings, merge, aisles (cached), realtime, "Kopiera till OurGroceries", share.
6. Settings (language, units, theme), sv/en i18n, Premium translation (cached), GDPR (export data, delete account), owner-only admin view of AI cost, PWA polish, deploy web.

## Accounts and secrets
I have GitHub, Supabase (EU), Google Cloud (OAuth + Gemini API key) ready. Tell me exactly which values you need and where they go (`.env`, Supabase secrets). Never ask me to paste secrets into chat, never commit them, and never put the Gemini key in an `EXPO_PUBLIC_` variable.

Start with Step 1.
