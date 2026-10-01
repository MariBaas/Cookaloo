/**
 * Plan limits configuration.
 * Single source of truth for Free / Premium quotas.
 * Mirrors plan_limits table in Supabase.
 */

export type PlanType = 'free' | 'premium';

export interface PlanLimits {
  maxRecipes: number;
  maxMembers: number;
  aiImportsPerMonth: number;
  maxOwnedHouseholds: number;
  canTranslate: boolean;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxRecipes: 50,
    maxMembers: 2,
    aiImportsPerMonth: 10,
    maxOwnedHouseholds: 3,
    canTranslate: false,
  },
  premium: {
    maxRecipes: 1_000_000,
    maxMembers: 6,
    aiImportsPerMonth: 100,
    maxOwnedHouseholds: 10,
    canTranslate: true,
  },
} as const;
