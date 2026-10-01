import { useEffect, useState, useCallback, useSyncExternalStore } from 'react';
import { supabase } from '@/services/supabase';
import type { Database } from '@/services/database.types';
import type { Session, User } from '@supabase/supabase-js';
import { Platform } from 'react-native';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Household = Database['public']['Tables']['households']['Row'];

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  household: Household | null;
  loading: boolean;
  initialized: boolean;
}

let authState: AuthState = {
  session: null,
  user: null,
  profile: null,
  household: null,
  loading: true,
  initialized: false,
};

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

async function fetchUserData(user: User) {
  try {
    // 1. Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    let household: Household | null = null;
    if (profile?.active_household_id) {
      const { data: hData } = await supabase
        .from('households')
        .select('*')
        .eq('id', profile.active_household_id)
        .maybeSingle();
      household = hData;
    }

    authState = {
      ...authState,
      user,
      profile: profile ?? null,
      household,
      loading: false,
      initialized: true,
    };
    emitChange();
  } catch (err) {
    console.error('Error fetching user profile:', err);
    authState = {
      ...authState,
      loading: false,
      initialized: true,
    };
    emitChange();
  }
}

// Subscribe to auth state changes once
let isSubscribed = false;
function initAuthSubscription() {
  if (isSubscribed) return;
  isSubscribed = true;

  supabase.auth.getSession().then(({ data: { session } }) => {
    authState.session = session;
    authState.user = session?.user ?? null;
    if (session?.user) {
      fetchUserData(session.user);
    } else {
      authState.loading = false;
      authState.initialized = true;
      emitChange();
    }
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    authState.session = session;
    authState.user = session?.user ?? null;
    if (session?.user) {
      fetchUserData(session.user);
    } else {
      authState.profile = null;
      authState.household = null;
      authState.loading = false;
      authState.initialized = true;
      emitChange();
    }
  });
}

export function useAuth() {
  useEffect(() => {
    initAuthSubscription();
  }, []);

  const state = useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    () => authState
  );

  const signInWithGoogle = useCallback(async () => {
    const redirectTo =
      Platform.OS === 'web' && typeof window !== 'undefined'
        ? window.location.origin
        : 'cookaloo://login-callback';

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });

    if (error) throw error;
  }, []);

  const signInWithOtp = useCallback(async (email: string) => {
    const emailRedirectTo =
      Platform.OS === 'web' && typeof window !== 'undefined'
        ? window.location.origin
        : 'cookaloo://login-callback';

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo,
      },
    });

    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (state.user) {
      await fetchUserData(state.user);
    }
  }, [state.user]);

  return {
    ...state,
    signInWithGoogle,
    signInWithOtp,
    signOut,
    refreshProfile,
  };
}
