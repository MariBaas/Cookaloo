# Review 03 – Phase 1 code review

Phase 1 code looks good: secrets are clean (no keys in code, `.env` not committed, Gemini only server-side), RLS/RPCs/triggers follow DATA_MODEL and REVIEW-01/02. Two fixes before Phase 2, plus end-to-end verification.

## Fixes (new migration `002_phase1_fixes.sql`, do not edit 001 if it has already been applied)

1. **Invite codes must use a cryptographically secure random source.** `create_invite` uses `random()`, which is predictable. Use `extensions.gen_random_bytes()` (pgcrypto, available in Supabase) to pick the 8 characters. Also retry on the (unlikely) unique-code collision.
2. **Create the profile automatically on sign-up.** Today a `profiles` row is only created inside `create_household` / `accept_invite`, so a newly signed-in user has no profile during onboarding (language/units can't be saved, `useAuth` gets null). Add the standard `handle_new_user()` trigger `after insert on auth.users` (security definer, `set search_path = public`) that inserts `profiles(user_id, display_name)` from the Google name / email prefix. Keep the inserts in the RPCs as `on conflict do nothing`.

## End-to-end verification (Phase 1 is not done until this passes)

The code has not yet run against the real Supabase project (no `.env`, migration not confirmed applied). Guide me step by step through:

1. Creating `.env` with `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` (I paste the anon key myself, not in chat).
2. Applying migrations 001 + 002 to project `zrvwidconuptzcppsxrc` from the migration files (Supabase CLI `db push` or SQL editor), then confirming tables, RLS and functions exist.
3. Google OAuth: Google Cloud client ID/secret → Supabase Auth provider, redirect URLs for `http://localhost:8081` (actual web port).
4. Running `npx expo start --web` and testing with me:
   - [ ] Sign in with Google → profile row exists
   - [ ] Sign in with magic link (second account)
   - [ ] Create household "Familjen Baard"
   - [ ] Generate invite code, join from the second account (another browser/incognito)
   - [ ] Second account cannot see a third household's data (RLS test)
   - [ ] Language + units saved on profile
5. Write a short `docs/PHASE1_VERIFIED.md` with the results, commit, then stop for approval before Phase 2.
