# Review 02 – Approved with 5 small fixes

Good work, REVIEW-01 is applied correctly. Apply these 5 fixes to DATA_MODEL.md / PLAN.md, then **start Phase 1** (no need to wait for another approval unless something conflicts).

1. **Invite codes must be generated server-side.** Today the client inserts its own `code`, so a user could create a trivially guessable code. Remove the client insert policy on `household_invites` and add RPC `create_invite()` (security definer, caller must be a member) that generates a random code with enough entropy (e.g. `FAMILYNAME-` + 8 random chars from an unambiguous alphabet), expires in 7 days, returns the code.
2. **Limit households per user** to prevent multiplying free quotas: `create_household()` rejects if the caller already owns 3 households (value in `plan_limits` or a constant).
3. **Owner update on `household_members` only for `role`.** Restrict with column privileges (`grant update (role) ...`) so rows cannot be moved to another household or reassigned to another user.
4. **`profiles.active_household_id`** may only be set to a household the user is a member of (check in RLS `with check` or a trigger).
5. **Account deletion:** deleting from `auth.users` inside a SQL function may not be permitted in Supabase. Implement `delete-account` as an Edge Function: run the ownership-transfer logic in SQL (`prepare_account_deletion()` RPC), then delete the user with the Admin API (`auth.admin.deleteUser`) using the service role key server-side. Also delete the user's files in Storage for households that get deleted.

Minor (fix when convenient): in `accept_invite`, if the user is already a member, return early without marking the invite as used.
