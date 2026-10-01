import { PLAN_LIMITS } from '@/config/plans';

describe('Plan Limits Configuration', () => {
  test('defines limits for free plan', () => {
    expect(PLAN_LIMITS.free).toBeDefined();
    expect(PLAN_LIMITS.free.maxRecipes).toBe(50);
    expect(PLAN_LIMITS.free.maxMembers).toBe(2);
    expect(PLAN_LIMITS.free.aiImportsPerMonth).toBe(10);
    expect(PLAN_LIMITS.free.maxOwnedHouseholds).toBe(3);
    expect(PLAN_LIMITS.free.canTranslate).toBe(false);
  });

  test('defines limits for premium plan', () => {
    expect(PLAN_LIMITS.premium).toBeDefined();
    expect(PLAN_LIMITS.premium.maxRecipes).toBe(1_000_000);
    expect(PLAN_LIMITS.premium.maxMembers).toBe(6);
    expect(PLAN_LIMITS.premium.aiImportsPerMonth).toBe(100);
    expect(PLAN_LIMITS.premium.maxOwnedHouseholds).toBe(10);
    expect(PLAN_LIMITS.premium.canTranslate).toBe(true);
  });
});
