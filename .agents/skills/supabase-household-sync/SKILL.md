---
name: supabase-household-sync
description: Guide for database architecture, Row-Level Security (RLS), real-time sync for shared shopping lists, and multi-user household invitations using Supabase.
---

# Supabase Realtime & Multi-User Household Sync

This skill outlines how to build a collaborative, offline-resilient backend for shared households (Cookaloo) using Supabase PostgreSQL, Realtime, and Row-Level Security.

---

## 1. Database Schema

```sql
-- 1. Households (Familj / Hushåll)
create table households (
  id uuid primary key default gen_random_uuid(),
  name text not null,                       -- e.g. "Familjen Baard"
  plan text not null default 'free' check (plan in ('free','premium')),
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- 1b. Invites (expiring, single-household)
create table household_invites (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households(id) on delete cascade not null,
  code text unique not null,                -- e.g. "BAARD-7K2Q"
  email text,                               -- optional: invite by email
  created_by uuid references auth.users(id),
  expires_at timestamptz not null default now() + interval '7 days',
  used_at timestamptz
);

-- 1c. Profiles (per-user settings)
create table profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  ui_language text not null default 'sv' check (ui_language in ('sv','en')),
  unit_system text not null default 'metric' check (unit_system in ('metric','us')),
  active_household_id uuid references households(id) on delete set null
);

-- 2. Household Members (User-to-Household mapping)
create table household_members (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text default 'member',               -- 'owner' | 'member'
  joined_at timestamptz default now(),
  unique(household_id, user_id)
);

-- 3. Recipes (Recept)
create table recipes (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households(id) on delete cascade not null,
  title text not null,
  description text,
  image_url text,
  servings int not null default 4,          -- ORIGINAL servings from the source; display default is 4
  servings_estimated boolean default false,
  prep_time_minutes int,
  cook_time_minutes int,
  source_url text,
  source_name text,                         -- e.g. "smakrikt.se", always shown as credit
  category text not null check (category in ('starter','main','dessert','snack','breakfast','baking','drink','side')),
  tags text[] default '{}',
  language text not null default 'sv',
  import_source text,                       -- 'url_jsonld' | 'url_ai' | 'photo' | 'pdf' | 'text' | 'manual'
  -- NOTE: no rating / tried / last_cooked here — those are per user (see recipe_user_state, cook_log)
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- 4. Recipe Ingredients & Steps (Stored as relational tables or JSONB)
create table recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references recipes(id) on delete cascade not null,
  item text not null,
  quantity numeric(10,3),
  quantity_max numeric(10,3),               -- ranges "2–3"
  unit text,                                -- normalized code
  note text,
  ingredient_group text,                    -- "Sås", "Topping"
  original_text text,
  aisle text default 'other',               -- produce, dairy, meat_fish, pantry, spices, bakery, frozen, other
  sort_order int default 0
);

-- Per-user rating / tried / private note
create table recipe_user_state (
  recipe_id uuid references recipes(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  rating int check (rating between 1 and 5),
  tried boolean default false,
  note text,
  updated_at timestamptz default now(),
  primary key (recipe_id, user_id)
);

-- "Vi lagade den idag" log
create table cook_log (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references recipes(id) on delete cascade not null,
  household_id uuid references households(id) on delete cascade not null,
  cooked_by uuid references auth.users(id),
  cooked_on date not null default current_date
);

-- Cached AI translations (Premium)
create table recipe_translations (
  recipe_id uuid references recipes(id) on delete cascade not null,
  language text not null,
  content jsonb not null,                   -- translated text fields only
  created_at timestamptz default now(),
  primary key (recipe_id, language)
);

-- Global caches shared by all users (not household data; read-only for clients)
create table aisle_cache (item_key text primary key, aisle text not null);
create table density_cache (item_key text primary key, grams_per_dl numeric not null, estimated boolean default true);

-- AI usage log (cost control, plan limits)
create table ai_usage (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households(id) on delete cascade not null,
  user_id uuid references auth.users(id),
  feature text not null,                    -- 'import_photo' | 'import_pdf' | 'import_text' | 'import_url_ai' | 'translate'
  model text,
  input_tokens int,
  output_tokens int,
  cost_estimate numeric(10,5),
  created_at timestamptz default now()
);

create table recipe_steps (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references recipes(id) on delete cascade not null,
  step_number int not null,
  instruction text not null,
  duration_minutes int
);

-- 5. Shared Shopping List (Inköpslista)
create table shopping_items (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households(id) on delete cascade not null,
  item text not null,
  quantity numeric(10,3),
  unit text,
  aisle text default 'other',               -- aisle sorting
  servings int,                             -- servings chosen when added from a recipe
  checked boolean default false,
  checked_by uuid references auth.users(id),
  checked_at timestamptz,
  recipe_id uuid references recipes(id) on delete set null,
  created_at timestamptz default now()
);
```

---

## 2. Row Level Security (RLS)

Enable RLS on all tables to prevent cross-household leakage:

```sql
alter table households enable row level security;
alter table household_members enable row level security;
alter table recipes enable row level security;
alter table recipe_ingredients enable row level security;
alter table recipe_steps enable row level security;
alter table shopping_items enable row level security;
alter table household_invites enable row level security;
alter table profiles enable row level security;
alter table recipe_user_state enable row level security;
alter table cook_log enable row level security;
alter table recipe_translations enable row level security;
alter table ai_usage enable row level security;
alter table aisle_cache enable row level security;
alter table density_cache enable row level security;
-- Write policies for ALL of the above (recipe_user_state: user_id = auth.uid(); ai_usage: insert only from Edge Functions via service role;
-- caches: select for authenticated, write only via service role). Add tests that a user cannot read another household's rows.

-- Helper function to check household membership
create or replace function is_household_member(h_id uuid)
returns boolean language sql security definer
set search_path = public
stable as $$
  select exists (
    select 1 from household_members
    where household_id = h_id
    and user_id = auth.uid()
  );
$$;

-- Policy for recipes
create policy "Household members can read and edit recipes"
on recipes for all
using (is_household_member(household_id))
with check (is_household_member(household_id));

-- Policy for shopping items
create policy "Household members can manage shopping list"
on shopping_items for all
using (is_household_member(household_id))
with check (is_household_member(household_id));
```

---

## 3. Realtime Sync for Shopping List

When in the supermarket, instant updates allow multiple partners to shop concurrently:

```typescript
import { supabase } from './supabase';

export function subscribeToShoppingList(householdId: string, onUpdate: () => void) {
  const channel = supabase
    .channel(`shopping:${householdId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'shopping_items',
        filter: `household_id=eq.${householdId}`
      },
      (payload) => {
        onUpdate();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
```

---

## 4. Offline Resilience

- Use **TanStack Query** with `persistQueryClient` or **AsyncStorage** / **MMKV** to cache recipes and shopping lists locally.
- Implement optimistic updates for item checkoffs so the UI responds immediately even with spotty cellular reception in grocery stores.
