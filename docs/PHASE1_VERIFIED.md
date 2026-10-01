# Phase 1 Verification Checklist & Results

**Date**: 2026-10-01  
**Project Ref**: `zrvwidconuptzcppsxrc` (Supabase EU)  
**App Environment**: Expo SDK 57 (Web & Universal)

---

## 1. Database Migrations & Security
- [x] Migration `001_initial_schema.sql` written and committed
- [x] Migration `002_phase1_fixes.sql` written and committed (cryptographic `gen_random_bytes` invites, auto `handle_new_user` profile creation)
- [ ] Migrations applied to Supabase project `zrvwidconuptzcppsxrc`
- [ ] RLS enabled on all 16 tables
- [ ] Security triggers and RPCs active (`create_household`, `create_invite`, `accept_invite`, `prevent_plan_change`, etc.)

---

## 2. Authentication & Profile Creation
- [ ] `.env` created with `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Google OAuth configured in Supabase Auth & Google Cloud Console (`http://localhost:8081` redirect)
- [ ] Sign in with Google (Account 1) → profile auto-created in `profiles` table
- [ ] Sign in with Email Magic Link (Account 2) → profile auto-created in `profiles` table

---

## 3. Household Management & Security
- [ ] Account 1 creates household ("Familjen Baard") via `create_household()`
- [ ] Account 1 generates cryptographic invite code via `create_invite()`
- [ ] Account 2 joins household using the invite code via `accept_invite()`
- [ ] Both accounts appear in `household_members` for "Familjen Baard"
- [ ] Units (`metric`) and language (`sv`) preferences saved to `profiles`

---

## 4. Multi-Tenant Isolation & RLS Verification
- [ ] Account 2 cannot view or access data/invites from an unrelated third household (verified by `is_household_member` RLS policy)
- [ ] Attempts to modify `households.plan` directly are blocked by trigger `trg_protect_household_plan`

---

## 5. Build & Code Quality Gate
- [x] `npm run lint` — 0 errors, 0 warnings
- [x] `npm run type-check` — 0 errors
- [x] `npm test` — 100% pass
- [x] `npx expo-doctor` — 21/21 checks passed
- [x] `npx expo export --platform web` — all 15 static routes bundled cleanly
