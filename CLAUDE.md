# Cookaloo – instructions for Claude Code

Family recipe & meal app (Expo SDK 57 + Expo Router + NativeWind, Supabase EU, Gemini via Edge Functions). Built for the owner's family first, designed to be sold later (Free / Premium). PWA first, app stores later.

## Read before doing anything
1. `.agents/rules/cookaloo-architecture.md` – **authoritative rules** (stack, security, domain rules, plans, MVP scope). Overrides everything else.
2. `.agents/skills/*/SKILL.md` – design system, Expo, Gemini AI, Supabase, i18n details.
3. `docs/PLAN.md` – phases and acceptance criteria. `docs/PRD.md`, `docs/DATA_MODEL.md`, `docs/DESIGN_NOTES.md`.
4. `docs/REVIEW-01.md` … latest `REVIEW-*.md` – owner review decisions; the highest number is the current to-do.
5. `docs/PHASE1_VERIFIED.md` – what is verified live.

## Current status (2026-10-01)
- Phase 1 code done and committed. Migrations 001 + 002 applied to Supabase project `zrvwidconuptzcppsxrc`. `.env` exists (git-ignored).
- Live-verified: magic-link login, auto profile, create household, RLS/trigger attacks blocked.
- At handover, Antigravity had **uncommitted** REVIEW-04 work in `app/(tabs)/*` (~1,100 lines). First run `git status` / `git diff`, review it against REVIEW-04 and the prototype, and either keep (commit) or improve it — don't silently discard it.
- **Next: `docs/REVIEW-04.md`** – (a) minimal Household section in Mer (members, invite code, join with code, log out), (b) small UI fixes, (c) **UI shell step**: recreate shell + shared components to match the Claude Design prototype exactly, with side-by-side screenshots. Do not start Phase 2 before owner approval.

## Design source
- Primary: the Claude Design project (the owner sends it via Share → Send to Claude Code).
- Local copy: `design-reference/cookaloo Prototyp.dc.html` (+ `Visuella riktningar.dc.html`). Never modify files in `design-reference/`.
- Rules decide functionality/data; the design decides look and feel. Known deviations: AI limit from `config/plans.ts` (Free 10/month) with "Läs om Premium"; unit toggle Metriskt | US (Swedish UI → dl/msk/tsk/krm); cooking mode is V2.
- Every UI phase: screenshot prototype vs app at 390×844 and 1280×800, save to `docs/screenshots/phase-N/`, list differences.

## Non-negotiables
- No secrets in client code or Git. Only `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` are public. Gemini key only in Supabase secrets.
- All DB changes as new numbered files in `supabase/migrations/`; never edit an applied migration; never change the DB directly.
- Always `npx expo install` for packages (SDK-compatible versions). Check versioned docs for SDK 57 – don't trust memory (see https://docs.expo.dev/llms.txt).
- One phase at a time. Gate: `npm run lint`, `npm run type-check`, `npm test`, `npx expo export --platform web` → commit → short report + manual test checklist → stop for approval.
- Same problem fails 3 times → stop and explain options. Never invent API capabilities.
- UI copy Swedish (default) + English via i18n. Code, comments and commits in English.
- Ask before: deleting files, `git push --force`, anything touching production data.

## Commands
- Dev: `npx expo start --web` → http://localhost:8081
- Checks: `npm run lint` · `npm run type-check` · `npm test` · `npx expo-doctor`
