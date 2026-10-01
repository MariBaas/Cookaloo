# Cookaloo – Design Notes & Rule Alignment (DESIGN_NOTES.md)

This document provides a complete audit of the Claude Design prototype (`/design-reference`), cataloging all design tokens, typography scales, screens, and components, along with an explicit resolution matrix for every conflict between the visual design and the authoritative architecture rules.

---

## 1. Visual Theme: "Linne" (Linen) & Herb Garden

The visual reference defines three aesthetic directions in `Visuella riktningar.dc.html`, with **1a "Linne"** selected as the official aesthetic:
> *"Linne – varm gräddvit bas, terrakotta som accentfärg, serif (Newsreader) i rubrikerna och Figtree i resten. Lugn och tidningsaktig."*

### Design Tokens (CSS Variables)

#### Light Theme ("Linne")
```css
:root {
  --bg: #F6F1E9;         /* Warm linen canvas */
  --surface: #FFFDF9;    /* Card and sheet background */
  --surface2: #EFE7DC;   /* Secondary inputs, subtle pills, search background */
  --line: #E6DCCF;       /* Delicate borders, dividers */
  --line2: #DCCFBF;      /* Form input borders, active outlines */
  --ink: #2A211B;        /* Primary deep espresso text */
  --muted: #6E6259;      /* Secondary text, timestamps, subtitles */
  --acc: #B4472A;        /* Terracotta primary brand accent */
  --accInk: #FFFFFF;     /* Pure white on terracotta */
  --accSoft: #F4E1D7;    /* Subtle terracotta tint for active badges/icons */
  --accText: #8A3218;    /* High-contrast terracotta text */
  --herb: #2F6A43;       /* Herb green for "Provat", fresh tags */
  --herbSoft: #E1EDE3;   /* Soft herb green pill background */
  --herbText: #24573A;   /* Forest green text */
  --warnSoft: #FBEFD9;   /* Warm amber for alerts / timer warnings */
  --warnText: #7A4E0C;   /* Amber text */
  --danger: #B3261E;     /* Destructive actions (delete) */
  --scrim: rgba(30, 22, 16, 0.42);
  --shadow: 0 1px 2px rgba(42, 33, 27, 0.05), 0 6px 20px rgba(42, 33, 27, 0.06);
  --starOff: #DCCFBF;    /* Unfilled star rating color */
}
```

#### Dark Theme
```css
[data-theme="dark"] {
  --bg: #1A1613;         /* Deep charcoal with warm undertones */
  --surface: #25201C;    /* Elevated surface */
  --surface2: #302924;   /* Secondary button backgrounds */
  --line: #3A322B;       /* Dark dividers */
  --line2: #4A3F36;      /* Dark input borders */
  --ink: #F3EBE1;        /* Warm cream primary text */
  --muted: #B5A899;      /* Muted light text */
  --acc: #E07A55;        /* Vibrant terracotta for dark contrast */
  --accInk: #1A1613;     /* Dark text on accent */
  --accSoft: #45281E;    /* Dark terracotta container tint */
  --accText: #F2A68A;
  --herb: #86C79A;       /* Minty herb green */
  --herbSoft: #22382A;
  --herbText: #A8DDB8;
  --warnSoft: #3A2F1E;
  --warnText: #F0C97A;
  --danger: #F08A80;
  --shadow: 0 0 0 1px #332B25;
  --starOff: #4A3F36;
}
```

---

## 2. Typography Scales & Rules

1. **Logo & Wordmark**:
   - `Bricolage Grotesque`, Extra Bold (800), letter-spacing: `-0.045em`.
   - Distinctive dual "oo" round glyphs with terracotta borders.
2. **Editorial Serif (Headings & Recipe Titles)**:
   - `Newsreader`, Medium (500) and Regular (400), optical size `6..72`.
   - Evokes classic Scandinavian editorial culinary literature.
   - Sizing:
     - Large Screen Titles (Library, Recipe Title): `32px` – `36px`, `lineHeight: 1.1`, `letterSpacing: -0.01em`.
     - Subheadings / Card Titles: `22px` – `24px`.
3. **UI Sans-Serif (Body & Controls)**:
   - `Figtree`, Regular (400), Medium (500), SemiBold (600), Bold (700).
   - Clean, round numerals for ingredient weights and measures.
   - Sizing: Body `16px`/`17px`, Metadata `14px`, Small Badges `12px`/`13px`.

---

## 3. Inventory of Prototype Screens & Components

| Screen Label in Prototype | Key Visual Components | Reusable UI Elements |
| :--- | :--- | :--- |
| **Inloggning** (`is.signin`) | Brand mark with dual circles, Google pill button, Email magic link input, Sent confirmation card. | `Button` (primary terracotta, outlined Google), `Input`, `Card`. |
| **Onboarding** (`is.onb`) | 3-step progress dots, Create vs Join household cards, Unit system radio cards (Metriskt vs US), Link vs Photo import cards. | `StepIndicator`, `SelectCard`, `RadioPill`. |
| **Receptbibliotek** (`is.library`) | Household header, search bar, horizontal scrolling category pills, recipe count + sort dropdown, recipe cards. | `SearchBar`, `CategoryPills`, `RecipeCard`, `BottomTabBar`. |
| **Receptvy** (`is.recipe`) | Hero photo with gradient scrim, back/share buttons, tag pills, portion scaling selector (1–8), Metriskt/US toggle, ingredient checklist, steps, ratings & cook log. | `HeroHeader`, `PortionSelector`, `UnitToggle`, `IngredientRow`, `StepCard`. |
| **Importera** (`is.import`) | Multi-tab input (Länk, Foto, PDF, Text), Plan usage card, import progress animation. | `TabSwitcher`, `QuotaCard`, `PulseLoader`. |
| **Import - granska** (`is.review`) | Parsed recipe preview, editable title/category/ingredients, save action. | `ReviewForm`, `BadgeList`. |
| **Inköpslista** (`is.grocery`) | Aisle-grouped checklists (Grönsaker, Mejeri, etc.), quick-add bar, checked item collapse, "Kopiera till OurGroceries". | `GroceryAisleSection`, `GroceryItemRow`, `QuickAddInput`. |
| **Mer / Inställningar / Hushåll** | Member list with avatars, invite code card, language/unit/theme toggles, data export. | `SettingsRow`, `InviteCard`, `MemberAvatar`. |

---

## 4. Conflict Resolution Matrix: Design Reference vs Architecture Rules

When the visual design prototype conflicts with the authoritative rules in `.agents/rules/cookaloo-architecture.md`, the golden rule is:
> **Rules decide functionality and data model; Design decides look and feel.**

| # | Feature / Area | Prototype Implementation (Design Reference) | Authoritative Rule (`cookaloo-architecture.md`) | Resolution / Implementation Directive |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **AI Import Limit** | Hardcoded to 20/month (`20 av 20 kvar`). | Free plan has **10 AI imports/month** read dynamically from `config/plans.ts`. Premium has 100/mo. | Use dynamic value from `config/plans.ts` (10/mo on Free). Add a **"Läs om Premium"** action sheet to the limit card. |
| **2** | **Unit System Display** | Simple "Metriskt \| US" toggle. | Metriskt displays **dl, msk, tsk, krm, g, kg** when UI language is Swedish; displays **ml, l, g, kg** when UI is English. US displays **cups, tbsp, tsp, oz, lb, °F**. | Keep the UI toggle label as **Metriskt \| US** (Metric \| US), but format the units according to the user's active UI language. |
| **3** | **Cooking Mode (Matlagningsläge)** | Fullscreen step-by-step view with interactive timers ("Sjud i 12 min", start timer button). | Cooking mode with timers is **strictly V2 (OUT of MVP)**. | **Do NOT build cooking mode in MVP.** Store `duration_minutes` in `recipe_steps` for future V2 compatibility, but do not render cooking mode UI. |
| **4** | **Ratings & "Provat" Badge** | Stored globally on the recipe object (e.g. single rating `4.6`, single tried flag). | Ratings (1–5 stars), "Provat" (Tried), and notes are **per-user** (`recipe_user_state`). | Recipe card displays household average rating + indicator of member ratings. Tapping stars or "Provat" updates `recipe_user_state` for the logged-in user only. |
| **5** | **Data Persistence** | In-memory JavaScript arrays and browser DOM manipulation. | PostgreSQL with Supabase, EU data sovereignty, RLS on every table. | Discard prototype's mock data logic entirely. Wire components directly to Supabase client & TanStack Query. |
| **6** | **Recipe Categories** | Arbitrary categories in prototype tabs. | Exactly **one** category per recipe from locked enum: `Förrätt`, `Huvudrätt`, `Efterrätt`, `Snacks`, `Frukost`, `Bakning`, `Dryck`, `Tillbehör`. Tags: many. | Enforce single category selector in manual edit and review screens. Tags render as secondary pill filters. |
| **7** | **Household Invites** | Static display code `BAARD-7K2Q`. | Dynamic 7-day expiring invite codes stored in `household_invites`. | Generate real unique codes on household creation; validate expiration timestamp (`expires_at > now() and used_at is null`) on join. |
| **8** | **AI Call Security** | Prototype was static mockup. | AI calls must **never** be made from client; **never** expose `GEMINI_API_KEY` in `EXPO_PUBLIC_`. | All AI extraction calls executed via Supabase Edge Function with JWT auth and plan verification. |
