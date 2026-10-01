# Cookaloo – Product Requirements Document (PRD)

## 1. Vision & Executive Summary
**Cookaloo** is a delightful, organic, Scandinavian-inspired family recipe and household grocery web & mobile application. Designed initially for the founder's household, Cookaloo is engineered from day one as a production-grade multi-tenant subscription SaaS (Free / Premium).

The design language embodies **"Linne" (Linen)**: warm, tactile, calm, and editorial—evoking a favorite linen-bound cookbook in an herb-scented kitchen, rather than a clinical utility.

---

## 2. Platform Strategy & Launch Order
1. **Launch Phase 1: Progressive Web App (Expo Web / PWA)**:
   - Every single MVP feature must work seamlessly on desktop and mobile web browsers.
   - Zero friction: instant access via URL, desktop responsive container (`max-w-2xl` / `max-w-4xl`), and mobile browser touch interactions.
2. **Launch Phase 2: App Stores (iOS & Android)**:
   - Compiled from the identical Expo codebase.
   - Native hardware APIs (e.g. `expo-haptics`, native camera OCR, keep-awake) serve as progressive enhancements with robust web fallbacks.

---

## 3. User Personas & Core Journeys

### Personas
- **The Household Chef (Organizer)**: Collects recipes across food blogs, family cookbooks, and clippings; scales portions; plans dinners.
- **The Household Shopper (Partner/Family Member)**: Uses the shared grocery list in the supermarket; checks off items in real time without collisions or missing items.
- **The Casual Family Cook**: Follows clear recipe instructions, logs when a meal was made ("Vi lagade den idag"), and rates dishes individually.

### Core User Journeys
1. **Onboarding & Household Setup**:
   - User signs up with Google OAuth or Email Magic Link via standard Supabase redirect.
   - Creates a new household (e.g., "Familjen Baard") via secure RPC `create_household` OR joins with code (e.g., `BAARD-7K2Q`) via RPC `accept_invite`.
   - Selects measurement preferences (**Metriskt | US**, coded as `metric` / `us`) and UI language (Svenska vs English).
   - Generates an invite code **on demand** (expires in 7 days) if they wish to invite family immediately.
2. **Recipe Collection & Multi-Source Import**:
   - Imports via web URL: JSON-LD (`schema.org/Recipe`) parsed instantly without AI; food blogs without structured data fallback to server-side Gemini 2.5 Flash via Supabase Edge Function.
   - External recipe photos from URLs are referenced directly via their external URL; they are **never downloaded** to storage.
   - Imports via photo/camera (cookbook or handwritten card), PDF, or plain text:
     - Client automatically resizes images to max 1600 px long edge (~80% quality) and **strips EXIF location metadata** before upload.
     - Ephemeral image (max 2048 px) passed to Edge Function for multimodal extraction.
   - Reviews and edits parsed data in the Review Screen before saving to the household library.
3. **Recipe Browsing & Portion Scaling**:
   - Search by title, ingredient, or tag. Filter by single category (Förrätt, Huvudrätt, etc.).
   - Interactive portion selector (1–8 servings, default 4). Quantities recalculate dynamically; volume-to-weight uses verified density lookup.
   - User marks personal rating (1–5 stars), "Provat" (Tried) toggle, and personal private note.
   - Logs cooking activity with "Vi lagade den idag" (writes to `cook_log`).
4. **Shared Collaborative Shopping List**:
   - Add recipe ingredients to shopping list with chosen serving count.
   - Ingredients merge intelligently (e.g., combining garlic cloves).
   - Items group into supermarket aisles (Grönsaker, Mejeri, Skafferi, etc.) with local caching.
   - Real-time sync via Supabase channels so multiple shoppers update the list simultaneously in-store.
   - One-tap "Kopiera till OurGroceries" plain-text clipboard export.
5. **Household & Account Management**:
   - Generate expiring 7-day invite codes on demand for family members.
   - Members can leave a household; the sole owner cannot leave without transferring ownership.
   - GDPR self-service: Export all household data (JSON) and permanently delete account. Account deletion automatically transfers household ownership to the oldest member if other members exist, or deletes the household if the user is the sole member.

---

## 4. Plans & Subscription Limits

All usage limits are hard-coded in a single configuration file (`config/plans.ts`), mirrored in the `plan_limits` database table, and enforced strictly server-side.

| Feature / Limit | Free Plan | Premium Plan | Enforcement Mechanism |
| :--- | :--- | :--- | :--- |
| **Household Members** | Up to **2 members** | Up to **6 members** | Server-side check inside `accept_invite` RPC |
| **Recipes per Household** | Up to **50 recipes** | Unlimited | Server-side `before insert` trigger on `recipes` |
| **Structured URL Import (JSON-LD)** | Unlimited (Free) | Unlimited | Edge Function bypassing AI |
| **AI Imports / Month** (Photo, PDF, Text, Non-schema URL) | **10 imports / month** | **100 imports / month** | Concurrency-safe check in `import-recipe` Edge Function (Europe/Stockholm calendar month) |
| **AI Recipe Translation** | Not included | Yes (Cached per recipe + target language) | Edge Function + `recipe_translations` cache |
| **Aisle Sorting & Ingredient Density Lookup** | Shared cache (unlimited) | Shared cache (unlimited) | Global cached lookup tables |

### Plan Modification Security
- Household plan (`free` vs `premium`) is protected by database triggers. Users (including household owners) **cannot** update their own plan column. Changes occur strictly via Supabase Dashboard / SQL.

### Limit Reached Experience
- When the 10/month AI import limit is reached, a friendly Linne-styled card explains the quota reset date and provides a **"Läs om Premium"** action sheet.
- **Never lose user input**: If an import limit or recipe limit is hit, the user's uploaded image or pasted text is preserved and can be saved manually.

---

## 5. Scope Definition (MVP vs V2)

### MVP Scope (IN)
- **Authentication**: Supabase Auth with Google OAuth & Email Magic Link.
- **Households & Profiles**: Household creation via RPC, on-demand 7-day expiring invite codes, member roles (`owner`, `member`), user preferences (display name, UI language, unit system).
- **Recipe Data Model**: Structured ingredients (amount, quantity_max, unit, item, note, group), single category enum, AI tags, source attribution.
- **Scaling & Units**: Pure unit-tested engines (`lib/scaling`, `lib/units`) for 1–8 servings, Metriskt (dl/msk/tsk in Swedish, ml/l in English) vs US (cups/oz/tbsp). Coded strictly as `metric` and `us` (never "Imperial").
- **Import Pipeline**: Edge Functions calling Gemini 2.5 Flash; JSON-LD scraper fallback; review/edit screen; `ai_usage` audit log.
- **Library**: Search, category pills, filtering, sorting (Nyast, Betyg, Senast lagad).
- **Per-User State**: Independent user ratings (1–5), "Provat" badge, private notes, and `cook_log` history.
- **Shopping List**: Recipe ingredient insertion, auto-merge, supermarket aisles, real-time sync, "Kopiera till OurGroceries".
- **Settings & GDPR**: Language switcher (sv/en), units toggle, data export (JSON), account deletion with ownership succession.
- **Owner Admin View**: Owner-only dashboard showing AI token usage and estimated cost per household per month, restricted via the `app_admins` table.

### V2+ Backlog (OUT of MVP)
- Step-by-step full-screen cooking mode with interactive timers (database model retains `duration_minutes` for forward compatibility).
- Weekly meal planner & calendar.
- Pantry inventory tracking & expiry notifications.
- Social media / video reels / Instagram URL parser.
- Stripe / Apple In-App Purchase integration (manual plan toggles in DB for MVP).
- Spanish (es) localization.

---

## 6. Non-Functional & Security Requirements
1. **EU Data Sovereignty**: All Supabase databases, storage buckets, and serverless functions hosted in an EU region (Frankfurt `eu-central-1`).
2. **Private Storage & EXIF Scrubbing**:
   - `recipe-images` bucket is **private**. Images are served via short-lived signed URLs.
   - All uploaded photos have EXIF location tags removed on client before upload.
3. **Zero Client Secret Leakage**:
   - `GEMINI_API_KEY` is strictly a Supabase Edge Function secret.
   - Client bundle only exposes `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
4. **Row-Level Security (RLS)**: Enforced unconditionally on 100% of database tables.
5. **App Admin Isolation**: Super-admin privilege is read strictly from `app_admins` table with zero client access policies.
6. **Tooling & Migrations**: All database schema changes are managed strictly via migration files in `supabase/migrations/` committed to Git.
