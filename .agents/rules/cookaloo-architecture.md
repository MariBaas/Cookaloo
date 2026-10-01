# Cookaloo Project Architectural Rules

These rules are authoritative. If a skill file or an older instruction conflicts with this file, this file wins.

## Product decisions (locked)
- **Cookaloo** is a family recipe app: import recipes (link, photo, PDF, text), uniform recipe view, portion scaling 1–8 (default 4), unit conversion, per-person ratings, "cooked" log, shared shopping list.
- Built for the owner's family first, designed to be sold later as a multi-household subscription product (Free / Premium).
- **Launch order: PWA (Expo web) first**, then iOS/Android app stores later from the same codebase. Every MVP feature must work on web. Native-only APIs (haptics, native camera) are progressive enhancements with a web fallback.

## Tech Stack
- **Framework**: Expo SDK (latest stable) + Expo Router (file-based navigation), TypeScript strict.
- **Styling**: NativeWind (Tailwind) using the Cookaloo "Linne" design tokens (see `cookaloo-design-system` skill).
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime, Edge Functions), project in an **EU region**. Row Level Security on **every** table.
- **Auth**: Google sign-in + email magic link.
- **AI**: Google Gemini API via `@google/genai`, called **only from Supabase Edge Functions** (server-side). Model name comes from a server env var (`GEMINI_MODEL`), default a Gemini Flash model.
- **Icons**: `lucide-react-native`.
- **Server data**: TanStack Query. Local UI state: Zustand.
- **Tests**: Jest/Vitest for pure logic (scaling, unit conversion, shopping-list merge).

## Security rules (non-negotiable)
1. **Never put the Gemini key (or any secret) in an `EXPO_PUBLIC_` variable or anywhere in client code.** `EXPO_PUBLIC_` values are bundled into the app and visible to every user. Only the Supabase URL and anon key may be public.
2. All AI calls go through Edge Functions that: verify the user's session, check the household's plan limits, call Gemini, log the call to `ai_usage`, return the result.
3. Secrets live in Supabase secrets / local `.env` (git-ignored). Commit a `.env.example`. Never ask the user to paste secrets into chat.
4. RLS checks household membership for every read and write. `security definer` functions must `set search_path = public`.

## Domain rules
- **Ingredients are structured**: quantity, quantity_max (ranges), unit (normalized code), item, note, group ("Sås"), sort_order, original_text. Items without quantity ("salt efter smak") are never scaled.
- **Servings**: store original servings + original quantities. Display default 4, dropdown 1–8, computed on display. Sensible rounding (½, ¼, ⅓; eggs to nearest ½ with "≈").
- **Units**: two choices in UI, **Metriskt | US** (EN: Metric | US).
  - Metriskt + Swedish UI → Swedish kitchen measures: dl, msk, tsk, krm, g, kg, l.
  - Metriskt + English UI → ml, l, g, kg.
  - US → cups, tbsp, tsp, oz, lb, °F.
  - Volume↔weight only via a density table; approximate values shown with "≈".
  - All conversion/scaling logic in pure, unit-tested modules (`lib/units`, `lib/scaling`).
- **Category**: exactly one per recipe: Förrätt, Huvudrätt, Efterrätt, Snacks, Frukost, Bakning, Dryck, Tillbehör. **Tags**: many, AI-suggested, editable.
- **Ratings, "Provat" and notes are per user**, not per recipe. Household view shows each member's rating + average. "Vi lagade den idag" writes to a cook log (date + user).
- **Language**: UI sv (default) / en. Recipes keep original language; AI translation is Premium and cached per recipe + language.

## Plans (Free / Premium)
All limits live in **one config file** (`config/plans.ts`). No payments in MVP; `households.plan` can be set to `premium` manually.

| | Free | Premium |
|---|---|---|
| Recipes per household | 50 | unlimited |
| URL import via schema.org JSON-LD (no AI) | yes | yes |
| AI imports per month (photo, PDF, text, URL without structured data) | 10 | 100 |
| Household members | 2 | 6 |
| AI translation | no | yes |

- Shared cached AI results (store section per item name, ingredient densities) never count toward limits.
- Limit reached → friendly message + what Premium unlocks. Never lose user input.
- Internal admin view (owner only): AI usage and estimated cost per household per month.

## MVP scope
In: auth, households + invites, import (URL → photo → PDF → text → manual) with review screen, library with search/filters, recipe view, ratings/tried/cook log, shopping list (merge, store sections, realtime, "Kopiera till OurGroceries" = one item per line), settings, GDPR (export data, delete account), PWA.
**Out (V2+)**: cooking mode with timers, weekly planner, pantry, reels/social import, AI recommendations, web recipe search, payments, Spanish UI. Keep the data model ready for them (e.g. step duration is already stored).

## Directory structure
- `app/`: Expo Router screens and layouts.
- `components/ui/`, `components/recipe/`, `components/grocery/`.
- `lib/`: pure logic (units, scaling, shopping-list merge).
- `services/`: Supabase client (anon key only) and typed wrappers that call Edge Functions.
- `supabase/functions/`: Edge Functions (AI import, translation, section/density lookup).
- `supabase/migrations/`: SQL migrations incl. RLS.
- `config/plans.ts`: plan limits.
- `hooks/`: custom React hooks.

## Way of working
- Plan first, build one phase at a time, run lint/type-check/tests, commit to Git after each phase, then wait for approval.
- If the same problem fails 3 times: stop and explain options instead of looping.
- Never invent API capabilities; say when unsure.
