# Cookaloo – Master Engineering Plan (PLAN.md)

This execution plan breaks down Cookaloo's implementation into 6 sequential phases incorporating all Review 01 and Review 02 architectural and security requirements.

> **Execution Protocol**:
> 1. Build **one phase at a time**.
> 2. All database changes must be written to migration files in `supabase/migrations/` and committed to Git (never executed directly via write-MCP).
> 3. Complete the gate criteria: `npm run lint`, `npm run type-check`, `npm test`.
> 4. Verify the manual test checklist.
> 5. Commit to Git with a conventional commit message.
> 6. Present a concise summary + manual verification report, then **pause and wait for user approval** before advancing.

---

## Phase 1: Foundation, Linne Tokens, Supabase EU, Auth & Household Security

### Objective
Establish the Expo project locally on the desktop, configure NativeWind with "Linne" design tokens and custom typography, connect Supabase EU, configure Google OAuth + Magic Link auth, create user profiles and atomic household creation/joining via secure RPCs with strict RLS. Ensure the Web/PWA build is running cleanly.

### Tasks
- [ ] Initialize Expo SDK 52+ with TypeScript and Expo Router v4 in `C:\Users\maria\Desktop\Cookaloo`.
- [ ] Configure `tailwind.config.js` and `global.css` with Linne semantic tokens (`--bg`, `--surface`, `--acc`, `--herb`, etc.) and dark mode.
- [ ] Configure Google Fonts (`Newsreader`, `Figtree`, `Bricolage Grotesque`) via `expo-font`.
- [ ] Configure `services/supabase.ts` with EU project URL and anon key; generate TypeScript database types.
- [ ] Create migration `supabase/migrations/001_initial_schema.sql`:
  - `plan_limits` reference table (`free`: 50 recipes, 2 members, 10 AI imports, max 3 owned households; `premium`: 1M recipes, 6 members, 100 AI imports, max 10 owned households).
  - `app_admins` table with RLS enabled and **zero client policies** (managed exclusively via dashboard/SQL).
  - Helper functions: `is_household_member(h_id)`, `is_household_owner(h_id)`, `is_app_admin()`.
  - `households`, `household_members`, `household_invites`, `profiles`.
  - Trigger `prevent_plan_change` ensuring authenticated users cannot alter `households.plan`.
  - Trigger `protect_household_member_update` ensuring `household_id` and `user_id` cannot be reassigned; revoke general update and grant `update (role)` to authenticated users.
  - Trigger `check_active_household` verifying `profiles.active_household_id` belongs to a household the user is an active member of.
  - Trigger `prevent_abandoning_household` protecting the sole owner from leaving a multi-member household.
  - RPC `create_household(name text)` (`security definer`): enforces maximum 3 owned households, creates household + owner membership + sets active profile atomically.
  - RPC `create_invite(p_household_id uuid)` (`security definer`): generates random code with high entropy (`NAME-XXXXXXXX` from unambiguous alphabet), sets 7-day expiry, and records creator.
  - RPC `accept_invite(code text)` (`security definer`): validates code, checks existing membership (returns early without consuming code), enforces plan member limits (Free: 2, Premium: 6), adds member, and marks code used.
  - RLS policies for households, members, invites, and profiles (no client insert on invites, no open invite listing).
  - Storage bucket `recipe-images` created as **private** with household RLS policies.
- [ ] Build Auth Screens (`app/(auth)/login.tsx`):
  - Google OAuth sign-in via Supabase standard redirect (`redirectTo: window.location.origin`). (Ensure `http://localhost:8081` and production domains are configured in Supabase Redirect URLs).
  - Email magic link input, validation, and sent-confirmation card.
- [ ] Build Onboarding Flow (`app/(auth)/onboarding.tsx`):
  - Step 1: Create household ("Familjen Baard") via `create_household` OR join with code via `accept_invite`.
  - Step 2: Choose default unit system (`metric` vs `us`) and UI language (`sv` vs `en`).
  - Step 3: Optional "Bjud in familjen" step that calls `create_invite` on demand (expires in 7 days); CTA to library.
- [ ] Build App Shell with bottom tabs (`app/(tabs)/_layout.tsx`): Recept, Importera, Inköpslista, Mer.
- [ ] Configure Web PWA manifest (`manifest.json`, theme color `#B4472A`, icons).

### Acceptance Criteria
- [ ] Web build runs without errors (`npm run web` / `npx expo start --web`).
- [ ] User can sign in via Magic Link or Google OAuth.
- [ ] Creating a household atomically assigns the caller as owner, updates `profiles.active_household_id`, and halts if caller already owns 3 households.
- [ ] Joining a household is only possible with a valid, non-expired, unused code, and fails if member limit is exceeded. If already a member, returns early without consuming the code.
- [ ] Direct attempts to update `households.plan` or reassign membership foreign keys are rejected by database triggers.
- [ ] `profiles.active_household_id` cannot be set to a household the user is not a member of.
- [ ] RLS policies prevent User A from seeing User B's household data or invites.

---

## Phase 2: Recipe Data Engine, EXIF Stripping, Scaling, Units & Recipe View

### Objective
Build the recipe schema with server-side limit enforcement (Free: 50 recipes), client-side image optimization (max 1600 px + EXIF stripping), manual recipe editor/creator, recipe detail view with portion scaling (1–8 servings, default 4), and pure, unit-tested scaling and unit-conversion libraries (`lib/scaling.ts`, `lib/units.ts`) using `metric` and `us` terminology.

### Tasks
- [ ] Create migration `supabase/migrations/002_recipes.sql`:
  - `recipes`, `recipe_ingredients`, `recipe_steps`.
  - Trigger `check_recipe_limit` enforcing max recipes (Free: 50) before insert.
  - RLS policies for recipes, ingredients, and steps.
- [ ] Implement `lib/image.ts`:
  - Client-side image resizing to max 1600 px long edge, WebP/JPEG ~80% quality.
  - Strips EXIF metadata (especially GPS location tags) to protect home privacy.
  - Generates signed URLs for private images; stores direct external URLs for web imports without downloading to storage.
- [ ] Implement `lib/scaling.ts`:
  - Scaling formula for 1–8 servings (display default 4).
  - Fractional quantity formatting (½, ⅓, ¼).
  - Range handling (`2–3 klyftor` -> scaled ranges).
  - Items without quantity ("salt efter smak") excluded from scaling.
  - Egg count rounding to nearest ½ with "≈".
  - Comprehensive unit tests (`lib/scaling.test.ts`).
- [ ] Implement `lib/units.ts` (strictly named `metric` and `us`, never "Imperial"):
  - Metric + Swedish UI: dl, msk, tsk, krm, g, kg, l.
  - Metric + English UI: ml, l, g, kg.
  - US: cups, tbsp, tsp, oz, lb, °F.
  - Density table volume-to-weight conversions with approximate indicator ("≈").
  - Comprehensive unit tests (`lib/units.test.ts`).
- [ ] Build Manual Recipe Creator / Editor (`app/recipe/edit.tsx`):
  - Image picker with automatic client-side resizing and EXIF stripping.
  - Single category selector (Förrätt, Huvudrätt, etc.) + tag input.
  - Structured ingredient input (amount, quantity_max, unit, item, note, group).
  - Source attribution (`source_name`, `source_url`).
- [ ] Build Recipe Detail Screen (`app/recipe/[id].tsx`):
  - Hero image with fallback monogram circle (`Newsreader` italic) when no photo is provided.
  - Interactive portion selector (1–8, default 4).
  - Unit toggle (**Metriskt | US**) respecting active UI language formatting.
  - Clean ingredient checklist and step cards.

### Acceptance Criteria
- [ ] Unit tests for `lib/scaling` and `lib/units` achieve 100% pass rate.
- [ ] Uploaded mobile photos have EXIF GPS tags completely stripped and size under 500 KB.
- [ ] Free household attempting to insert the 51st recipe is blocked server-side by the database trigger.
- [ ] Switching between Metriskt and US units converts values accurately.

---

## Phase 3: AI Import Pipeline (Edge Functions, Gemini 2.5 Flash & Review)

### Objective
Create secure server-side Supabase Edge Functions to import recipes from Web URLs (JSON-LD schema first, Gemini fallback), Photos (camera OCR), PDFs, and raw text. Enforce concurrency-safe monthly plan limits (Europe/Stockholm calendar month), log usage to `ai_usage`, and build the interactive Review & Edit Screen.

### Tasks
- [ ] Create `config/plans.ts` defining Free (10 AI imports/mo, 50 recipes, 2 members, 3 owned households) and Premium limits.
- [ ] Implement Supabase Edge Function `supabase/functions/import-recipe/`:
  - Authenticate caller via JWT; verify household membership.
  - Concurrency-safe quota check: count AI imports for caller's household for current calendar month in `Europe/Stockholm` timezone using row locking or serializable check. Reject with `403 QuotaExceeded` if Free limit reached.
  - **URL Handler**: Fetch HTML, inspect for `application/ld+json` (`schema.org/Recipe`). If valid, parse directly without LLM (zero quota cost!). If absent, pass cleaned text to Gemini 2.5 Flash.
  - **Photo / PDF / Text Handler**: Receive resized image (max 2048 px), prompt Gemini 2.5 Flash with strict structured JSON schema returning:
    - Single `category` (enum)
    - `tags[]` (suggested tags)
    - `servings` & `servingsEstimated` (boolean)
    - `estimatedFields[]`
    - `ingredients[]` with `item`, `quantity`, `quantityMax`, `unit`, `note`, `group`, `originalText`, `aisle`
    - `steps[]` with `stepNumber`, `instruction`, `durationMinutes`
  - Insert audit record to `ai_usage` (model, tokens, cost estimate).
- [ ] Build Import Screen (`app/(tabs)/import.tsx`):
  - Tab switcher: Länk (URL), Foto / Kamera, PDF, Klistra in text.
  - Quota card: "X av 10 AI-importer kvar denna månad" with "Läs om Premium" action sheet.
  - Loading animation with cheerful Linne pulse during processing.
- [ ] Build Import Review Screen (`app/recipe/review.tsx`):
  - Displays parsed title, single category, tags, ingredients, and steps.
  - Fully editable form before committing to database.
  - "Spara i receptsamlingen" saves recipe, ingredients, and steps in Supabase.

### Acceptance Criteria
- [ ] `GEMINI_API_KEY` is stored solely in Supabase Edge Secrets, never exposed to client.
- [ ] Structured URL import (e.g. Arla, ICA) extracts in <1.5s with zero AI quota consumption.
- [ ] Multimodal extraction outputs a single category enum and tags array matching design rules.
- [ ] Simultaneous imports cannot bypass the 10/month quota.
- [ ] Limit-reached card opens "Läs om Premium" sheet without losing user input.

---

## Phase 4: Library, Search, Category Chips & Cook Log

### Objective
Build the Recipe Library with client-side cached search, category filtering, sorting, per-user ratings (1–5 stars), personal "Provat" flags, and the "Vi lagade den idag" cook log.

### Tasks
- [ ] Create migration `supabase/migrations/004_user_state_and_cook_log.sql`:
  - `recipe_user_state` with RLS ensuring updates only target recipes belonging to caller's household.
  - `cook_log` with RLS requiring `cooked_by = auth.uid()` and household membership.
- [ ] Build Recipe Library Screen (`app/(tabs)/index.tsx`):
  - Header with household title ("Familjen Baard") and user avatar.
  - Instant search input matching title, ingredient, or tag.
  - Horizontal scrollable category pill bar: Alla, Förrätt, Huvudrätt, Efterrätt, Snacks, Frukost, Bakning, Dryck, Tillbehör.
  - Recipe counter and Sort dropdown (Nyast, Betyg, Senast lagad, Titel).
- [ ] Build Recipe Card Component:
  - 16:10 aspect ratio image (with monogram fallback).
  - "Provat" green badge if marked by user.
  - Star rating showing household average + individual member ratings.
  - Category, cooking time icon, and "Senast lagad" timestamp.
- [ ] Implement Per-User Actions on Recipe View:
  - Interactive star rating (1–5) saving to `recipe_user_state`.
  - "Provat" toggle saving to `recipe_user_state`.
  - "Vi lagade den idag" button writing to `cook_log` and updating the last cooked timestamp.

### Acceptance Criteria
- [ ] Library filters instantly on client when data is cached; search queries return in <100ms.
- [ ] User A rating a recipe 5 stars does not overwrite User B's 4-star rating; card displays average.
- [ ] Non-members cannot insert ratings or cook log entries for recipes outside their household.

---

## Phase 5: Shared Realtime Shopping List & Aisle Categorization

### Objective
Build the collaborative shared shopping list with recipe ingredient aggregation, automatic ingredient merging, supermarket aisle sorting with shared caching, Supabase Realtime synchronization, and "Kopiera till OurGroceries".

### Tasks
- [ ] Create migration `supabase/migrations/005_shopping_items.sql` and global `aisle_cache`.
- [ ] Implement `lib/shopping-merge.ts`:
  - Merges duplicate ingredients added from different recipes (e.g., 2 cloves garlic + 1 clove garlic = 3 cloves garlic).
  - Handles non-mergeable units cleanly.
  - Unit tests in `lib/shopping-merge.test.ts`.
- [ ] Build "Lägg till i inköpslista" Action on Recipe View:
  - Prompts user for serving count (defaulting to recipe active serving).
  - Automatically scales and pushes ingredients into `shopping_items`.
- [ ] Build Shopping List Screen (`app/(tabs)/grocery.tsx`):
  - Group items by supermarket aisle: Grönsaker & Frukt, Mejeri, Kött & Fisk, Skafferi, Kryddor, Bröd & Bageri, Fryst, Övrigt.
  - Manual quick-add input at top ("Lägg till vara...").
  - Checkbox toggle with instant optimistic strike-through and tactile haptic pulse on mobile.
  - Collapsible "Avbockade varor" (Checked items) section with "Rensa avbockade".
- [ ] Configure Supabase Realtime Channel:
  - Subscribe to `postgres_changes` on `shopping_items` filtered by `household_id`.
  - Partner checking off an item updates partner's phone in real time (<300ms).
- [ ] Implement "Kopiera till OurGroceries" & Share Action:
  - Copies plain-text list formatted as one item per line grouped by category.

### Acceptance Criteria
- [ ] Realtime checkoffs reflect across two browser sessions / devices simultaneously.
- [ ] Ingredients from multiple recipes merge accurately according to unit tests.
- [ ] "Kopiera till OurGroceries" copies clean, un-checked items to clipboard.

---

## Phase 6: Settings, i18n, AI Translation, GDPR, Admin View & Web Deploy

### Objective
Implement bilingual Swedish/English localization, cached Premium AI recipe translation, GDPR privacy tools (data export & secure account deletion via Edge Function), owner-only AI cost dashboard via `app_admins`, PWA optimizations, and final web deployment.

### Tasks
- [ ] Configure `i18n` with type-safe Swedish (`sv`) and English (`en`) JSON resources.
- [ ] Build Settings Screen (`app/(tabs)/more.tsx`):
  - Language toggle (Svenska / English).
  - Unit preference toggle (Metriskt / US).
  - Theme mode (Ljust / Mörkt / Följ system).
  - Household management: on-demand invite code generator (`create_invite`), member list, "Lämna hushåll".
- [ ] Implement Premium AI Recipe Translation:
  - Edge Function translates recipe text; caches result in `recipe_translations` (zero repeated cost).
- [ ] Implement GDPR Privacy Compliance:
  - "Exportera data": downloads complete household data as formatted JSON.
  - "Radera konto" Edge Function `supabase/functions/delete-account/`:
    - Calls RPC `prepare_account_deletion()`: transfers ownership of multi-member households to oldest member (`joined_at asc`) or returns sole-member household IDs for file cleanup.
    - Deletes files in Storage under deleted household prefixes.
    - Calls `auth.admin.deleteUser(user_id)` via service role key.
- [ ] Build Owner-Only AI Cost Admin Dashboard:
  - Restricted via `is_app_admin()` RLS check against `app_admins`.
  - Displays monthly token breakdown, cost estimates, and household counts.
- [ ] PWA Polish & Deployment:
  - Service worker registration, offline caching for static assets.
  - Build and verify production bundle (`npm run build:web`).

### Acceptance Criteria
- [ ] Switching between Svenska and English updates all navigation, buttons, and aisle headers instantly.
- [ ] GDPR account deletion transfers ownership to oldest member or removes household if sole member, and removes user via Admin API.
- [ ] Only users present in `app_admins` can access the AI cost dashboard.
- [ ] PWA installs on mobile home screen and loads offline.
