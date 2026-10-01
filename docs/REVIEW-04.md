# Review 04 – Live test of Phase 1 (localhost:8081)

## Verified working (tested live by Claude)
- Magic-link login works (maria@baard.se); profile auto-created by `handle_new_user`.
- Household "Familjen Baard" created via `create_household`; owner membership + active household set.
- Security attacks from the logged-in client were all rejected:
  - set `households.plan = 'premium'` → blocked by trigger
  - insert self into `household_members` → blocked by RLS
  - insert own invite code → blocked by RLS
  - insert into `app_admins` → blocked by RLS
  - set `active_household_id` to a foreign household → blocked by trigger

## Gaps blocking the remaining Phase 1 tests
1. **No way to invite after onboarding.** If the user skips the invite step (as happened), there is no UI to create a code. Pull a minimal Household section into **Mer** now (full settings stay in Phase 6):
   - household name + member list (display name, role)
   - "Bjud in familjemedlem" → `create_invite` → show code + copy button + expiry date
   - "Logga ut"
2. **No logout anywhere** → impossible to test a second account in the same browser. Add it to Mer (above).
3. **Join an existing household after onboarding:** add "Gå med i ett annat hushåll med kod" in Mer → `accept_invite`.

## Small UI notes (fix now, cheap)
- On desktop the tab bar labels are tiny and the content isn't width-constrained. Apply the planned responsive container (`max-w-2xl mx-auto`) to screens and the tab bar, and increase tab label size to match the prototype.
- Placeholder tabs are fine for Phase 1, but show the household name in the library header (as in the prototype) so it's clear which household is active.

After these, commit and stop so Maria can run Test 4 (join with code from an incognito window) and Test 5.

## Design fidelity (added after Maria's feedback)
The app currently uses the Linne colours and fonts, but every tab is a 14-line placeholder, so it looks nothing like the Claude Design prototype. From now on the prototype is a hard acceptance criterion:

1. **Before Phase 2: "UI shell" step.** Recreate the app shell and shared components to match `design-reference/cookaloo Prototyp.dc.html` exactly: tab bar (sizes, labels, FAB), library header with household name, search bar, category pills, recipe card, empty states, Mer/settings list rows, login and onboarding screens. Use static sample data where the real data comes in later phases, clearly marked `// TODO(phase-N)`.
2. **Side-by-side check every phase.** Use Playwright MCP to open the prototype (file:// path) and the app at 390×844 and 1280×800, screenshot the same screen in both, save them to `docs/screenshots/phase-N/`, and list remaining differences in the phase report. A phase is not done while a screen differs visibly without a written reason.
3. Extract exact values (spacing, radii, font sizes, shadows) from the prototype's CSS rather than approximating.
