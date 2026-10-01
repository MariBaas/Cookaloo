-- ============================================================================
-- Migration: 002_phase1_fixes.sql
-- Description: Phase 1 Review Fixes:
--              1. Cryptographically secure random invite codes with collision retry
--              2. Automatic user profile creation on auth.users signup
-- ============================================================================

-- Enable pgcrypto in extensions schema if not already present
create extension if not exists pgcrypto with schema extensions;

-- ============================================================================
-- 1. SECURE INVITE CODE GENERATION
-- ============================================================================

create or replace function public.create_invite(p_household_id uuid)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_code text;
  v_prefix text;
  v_chars text := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; -- 32 unambiguous chars (excludes 0, 1, I, O)
  v_random text;
  v_bytes bytea;
  v_byte int;
  i int;
  v_attempts int := 0;
  v_max_attempts int := 10;
begin
  if not is_household_member(p_household_id) then
    raise exception 'Unauthorized: Only household members can generate invite codes.';
  end if;

  -- Sanitize prefix from household name (3 to 6 chars)
  select upper(regexp_replace(name, '[^a-zA-Z0-9]', '', 'g')) into v_prefix
  from public.households where id = p_household_id;

  if length(v_prefix) < 3 then
    v_prefix := 'COOK';
  else
    v_prefix := substring(v_prefix from 1 for 6);
  end if;

  loop
    v_attempts := v_attempts + 1;
    v_random := '';
    v_bytes := gen_random_bytes(8);

    for i in 0..7 loop
      v_byte := get_byte(v_bytes, i);
      v_random := v_random || substr(v_chars, (v_byte % 32) + 1, 1);
    end loop;

    v_code := v_prefix || '-' || v_random;

    begin
      insert into public.household_invites (household_id, code, created_by, expires_at)
      values (p_household_id, v_code, auth.uid(), now() + interval '7 days');
      return v_code;
    exception when unique_violation then
      if v_attempts >= v_max_attempts then
        raise exception 'Failed to generate a unique invite code after % attempts.', v_max_attempts;
      end if;
    end;
  end loop;
end;
$$;

-- ============================================================================
-- 2. AUTOMATIC PROFILE CREATION ON SIGN-UP
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_display_name text;
begin
  -- Extract display name from OAuth metadata or fallback to email username
  v_display_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  insert into public.profiles (user_id, display_name, ui_language, unit_system)
  values (
    new.id,
    v_display_name,
    'sv',
    'metric'
  )
  on conflict (user_id) do update
  set
    display_name = coalesce(profiles.display_name, excluded.display_name),
    updated_at = now();

  return new;
end;
$$;

-- Trigger on auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill any existing users who signed up before the trigger was created
insert into public.profiles (user_id, display_name, ui_language, unit_system)
select
  u.id,
  coalesce(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name',
    split_part(u.email, '@', 1)
  ),
  'sv',
  'metric'
from auth.users u
where not exists (
  select 1 from public.profiles p where p.user_id = u.id
)
on conflict (user_id) do nothing;
