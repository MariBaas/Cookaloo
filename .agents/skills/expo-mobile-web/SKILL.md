---
name: expo-mobile-web
description: Best practices and workflows for building universal cross-platform mobile (iOS, Android) and web applications with Expo SDK 52+, Expo Router v4, React Native Web, and NativeWind v4.
---

# Universal Mobile & Web Development with Expo

This skill guides the design, development, and maintenance of universal applications that target iOS, Android, and Web from a single TypeScript/React codebase.

---

## 1. Project Initialization & Architecture

### Recommended Stack
- **Framework**: Expo (SDK 52+) with `expo-router` v4 (file-based routing).
- **Styling**: NativeWind v4 (Tailwind CSS engine with zero-runtime React Native primitives) or Tamagui.
- **Icons**: `lucide-react-native` (tree-shakeable SVGs for native and web).
- **State**: Zustand for lightweight local/UI state; TanStack Query v5 for server data & cache.
- **Fonts**: `@expo-google-fonts/newsreader`, `@expo-google-fonts/figtree`, `@expo-google-fonts/bricolage-grotesque`.

### Directory Layout
```
app/
  _layout.tsx            # Root layout: font loading, auth provider, theme provider
  (auth)/
    login.tsx            # Login screen (Google / Magic link)
    onboarding.tsx       # Onboarding flow (household join/create, unit preferences)
  (tabs)/
    _layout.tsx          # Tab bar navigator (Recept, Importera, Inköpslista, Mer)
    index.tsx            # Recipe Library (Receptbibliotek)
    import.tsx           # Recipe Importer (URL + Camera OCR)
    grocery.tsx          # Smart Grocery List (Inköpslista)
    more.tsx             # More / Household / Settings menu
  recipe/
    [id].tsx             # Recipe Detail View (portion scaling, units, ratings)
    # cook.tsx           # Cooking mode — V2, not in MVP
components/
  ui/                    # Atomic design components (Button, Input, Card, Badge)
  recipe/                # Recipe-specific components (IngredientRow, TimerCard)
  grocery/               # Grocery-specific components (GroceryCategoryList)
constants/
  Colors.ts              # Theme tokens (Light / Dark)
  Typography.ts          # Font family and size tokens
hooks/                   # Custom hooks (useHousehold, useRecipe, useTimer)
services/
  supabase.ts            # Supabase client (URL + anon key only)
  ai.ts                  # Typed wrappers that call Supabase Edge Functions (NO Gemini key in the app)
supabase/
  functions/             # Edge Functions: import-recipe, translate-recipe, lookup-sections
  migrations/            # SQL schema + RLS
config/
  plans.ts               # Free / Premium limits
lib/
  units/  scaling/       # Pure, unit-tested logic
```

---

## 2. Universal Navigation (Expo Router v4)

1. **File-Based Routing**:
   - `app/(tabs)/_layout.tsx` creates the bottom tab bar on mobile and can render as a bottom bar or side navigation on desktop web.
   - Use `<Stack.Screen options={{ presentation: 'modal' }} />` for sheets and dialogs.
2. **Platform Adaptations**:
   - For mobile: Native bottom tab bar with haptic feedback (`expo-haptics`).
   - For web: Responsive layout with max-width container (`max-w-2xl` or `max-w-4xl mx-auto`) so the app feels natural on desktop browsers without stretching.
3. **Deep Linking & URLs**:
   - Expo Router maps routes directly to web URLs (e.g., `/recipe/pasta-pomodoro`).
   - Configure URL schemes in `app.json` (`scheme: "cookaloo"`).

---

## 3. Styling Guidelines (NativeWind v4 / Tailwind)

1. Always use universal Tailwind classes supported by NativeWind:
   - Layout: `flex-1`, `flex-col`, `flex-row`, `items-center`, `justify-between`.
   - Spacing: `p-4`, `px-6`, `py-3`, `gap-3`.
   - Colors: Bind to CSS variables or custom Tailwind theme tokens (`bg-sand-100`, `text-terracotta`).
2. **Safe Area & Insets**:
   - Always wrap screens with `react-native-safe-area-context`'s `useSafeAreaInsets()`.
   - Use `paddingBottom: insets.bottom + 80` for scrollable content above the tab bar.
3. **Platform-Specific Code**:
   - Use `.web.tsx` and `.native.tsx` extensions only when native APIs (like iOS Liquid Glass frames or custom camera hardware) diverge significantly.
   - For simple checks: `Platform.OS === 'web'` or `Platform.select({ web: ..., default: ... })`.

---

## 4. Hardware & Native APIs

- **Camera & Photo Library**: `expo-camera` and `expo-image-picker` for scanning recipes from physical cookbooks.
- **Haptics**: `expo-haptics` for tactile feedback when checking off ingredients or completing a recipe step.
- **Keep Screen Awake**: `expo-keep-awake` during active cooking mode so the screen doesn't turn off while cooking.
- **Web PWA (launch target #1)**: Configure web manifest, icons and a service worker for standalone home-screen installation on iOS Safari and Android Chrome. Every MVP feature must work on web; native APIs need a web fallback (e.g. `expo-image-picker` → file input, haptics → no-op).
