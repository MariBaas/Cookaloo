# Review 01 – Answers + required fixes before Phase 1

Apply everything below to `docs/DATA_MODEL.md`, `docs/PLAN.md` (and PRD where relevant) BEFORE writing any code. Then summarise the changes and wait for approval.

## Answers to your 4 questions

1. **Google OAuth on web**: Yes, use the standard Supabase redirect flow. Add `http://localhost:8081` (or the actual Expo web dev port) and the future production web domain to Supabase Auth → URL Configuration → Redirect URLs.
2. **Invite codes**: Create **on demand**, not automatically. At the end of onboarding show an optional "Bjud in familjen" step that generates a code when tapped; also available from the Household screen. Codes expire after 7 days.
3. **App admin**: Neither `APP_OWNER_EMAIL` nor a client-writable profile flag. Use a separate table `app_admins (user_id uuid primary key references auth.users)` with RLS enabled and **no client policies** (managed only from the Supabase dashboard). `is_app_admin()` reads that table. Remove `is_app_admin` from `profiles`.
4. **Images**: Yes, resize client-side to max 1600 px long edge, WebP/JPEG ~80 % quality, and **strip EXIF metadata** (phone photos contain GPS location). For AI import, send the resized image (max 2048 px) to the Edge Function.

## Required security fixes (blocking)

1. **Remove policy "Users can join household"** on `household_members`. As written, any logged-in user can insert themselves into any household, even with `role = 'owner'`. Joining must only happen through a `security definer` RPC `accept_invite(code text)` that validates the code (not expired, not used), inserts the caller with role `member`, marks the invite used, and enforces the plan's member limit.
2. **Remove policy "Anyone can lookup invite by code"**. It lets every user list all active invite codes. Invite lookup/acceptance goes only through the RPC above.
3. **Household creation via RPC** `create_household(name text)` (`security definer`) that creates the household AND the caller's `owner` membership atomically, and sets `profiles.active_household_id`.
4. **Plan cannot be changed by users**: "Owners can update their households" currently allows an owner to set `plan = 'premium'` themselves. Restrict: owners may update `name` only (column-level privileges: `revoke update on households from authenticated; grant update (name) on households to authenticated;` or a trigger that blocks changes to `plan`). `plan` is changed only via dashboard/service role.
5. **Private images**: `recipe-images` must be a **private** bucket, read via signed URLs, paths `<household_id>/<recipe_id>/...`, access checked with `is_household_member`. Family photos and handwritten cards must not be public. Do **not** download/copy third-party website images into Storage; for URL imports store only the external `image_url` reference.
6. **recipe_user_state**: insert/update must also check that the recipe belongs to one of the user's households (not only `user_id = auth.uid()`).
7. **cook_log**: insert must require `cooked_by = auth.uid()`.
8. Members must be able to **leave** a household (delete own membership). The last owner cannot leave without transferring ownership or deleting the household.

## Required functional fixes

1. **Enforce all plan limits server-side**, not only AI imports: recipes per household (Free 50) via a `before insert` trigger on `recipes`, members per household (Free 2 / Premium 6) inside `accept_invite`. Limits are read from one place (mirror `config/plans.ts` in a `plan_limits` table or in the functions).
2. **AI extraction schema**: PLAN Phase 3 says `categories` – it must be a single `category` (enum) + `tags[]`, matching the `recipe-gemini-ai` skill (incl. `servingsEstimated`, `estimatedFields`, `quantityMax`, `group`, `originalText`).
3. **Quota check** counts AI imports per household per calendar month (Europe/Stockholm time), and the check + usage insert must be safe against two imports at the same time.
4. **Naming**: don't call the US system "Imperial" anywhere (code, tests, UI). Use `metric` / `us`.
5. **Account deletion**: if the user is the owner of a household with other members, ownership transfers to the longest-standing member; household is deleted only if the user is the sole member.

## Tooling note

The Supabase MCP server is connected with write features (database, functions, branching) to project `zrvwidconuptzcppsxrc`. **All schema changes must go through migration files in `supabase/migrations/` committed to Git** — do not change the database directly through MCP. Before real family data exists this project is fine for development; once the family uses it, create a separate dev project or branch and use read-only MCP against production.
