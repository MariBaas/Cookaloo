import { useState, useCallback } from 'react';
import { supabase } from '@/services/supabase';
import type { Database } from '@/services/database.types';

type HouseholdMember = Database['public']['Tables']['household_members']['Row'] & {
  profile?: Database['public']['Tables']['profiles']['Row'];
};

export function useHousehold() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createHousehold = useCallback(async (name: string): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: rpcError } = await supabase.rpc('create_household', {
        name,
      });

      if (rpcError) throw rpcError;
      return data;
    } catch (err: any) {
      const message = err.message || 'Kunde inte skapa hushåll.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const acceptInvite = useCallback(async (code: string): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const trimmedCode = code.trim().toUpperCase();
      const { data, error: rpcError } = await supabase.rpc('accept_invite', {
        code: trimmedCode,
      });

      if (rpcError) throw rpcError;
      return data;
    } catch (err: any) {
      const message = err.message || 'Ogiltig eller utgången inbjudningskod.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createInvite = useCallback(async (householdId: string): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: rpcError } = await supabase.rpc('create_invite', {
        p_household_id: householdId,
      });

      if (rpcError) throw rpcError;
      return data;
    } catch (err: any) {
      const message = err.message || 'Kunde inte skapa inbjudningskod.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getHouseholdMembers = useCallback(async (householdId: string): Promise<HouseholdMember[]> => {
    setLoading(true);
    setError(null);
    try {
      const { data: members, error: mError } = await supabase
        .from('household_members')
        .select('*')
        .eq('household_id', householdId)
        .order('joined_at', { ascending: true });

      if (mError) throw mError;
      if (!members || members.length === 0) return [];

      const userIds = members.map((m) => m.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);

      const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));

      return members.map((m) => ({
        ...m,
        profile: profileMap.get(m.user_id),
      }));
    } catch (err: any) {
      const message = err.message || 'Kunde inte hämta hushållsmedlemmar.';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createHousehold,
    acceptInvite,
    createInvite,
    getHouseholdMembers,
  };
}
