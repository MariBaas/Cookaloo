import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useHousehold } from '@/hooks/useHousehold';
import { supabase } from '@/services/supabase';
import { Card, Button, Input, Badge } from '@/components/ui';
import {
  Home,
  Users,
  Settings,
  LogOut,
  Sparkles,
  Copy,
  Check,
  ChevronRight,
  ArrowRight,
  User as UserIcon,
} from 'lucide-react-native';

export default function MoreScreen() {
  const router = useRouter();
  const { user, profile, household, signOut, refreshProfile } = useAuth();
  const { createInvite, acceptInvite, getHouseholdMembers } = useHousehold();

  // Sub-view navigation: null = main menu, 'household' = household details, 'settings' = preferences
  const [subView, setSubView] = useState<'household' | 'settings' | null>(null);

  // Invite state
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Join state
  const [joinCode, setJoinCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joinSuccess, setJoinSuccess] = useState(false);

  // Members list
  const [members, setMembers] = useState<any[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);

  const unitSystem = profile?.unit_system || 'metric';
  const uiLanguage = profile?.ui_language || 'sv';

  const householdId = household?.id;

  useEffect(() => {
    let isSubscribed = true;
    if (householdId) {
      getHouseholdMembers(householdId).then((m) => {
        if (isSubscribed) {
          setMembers(m);
          setMembersLoading(false);
        }
      });
    }
    return () => {
      isSubscribed = false;
    };
  }, [householdId, getHouseholdMembers]);

  const handleGenerateInvite = async () => {
    if (!household?.id) return;
    setInviteLoading(true);
    setInviteError(null);
    try {
      const code = await createInvite(household.id);
      setGeneratedCode(code);
    } catch (err: any) {
      setInviteError(err.message || 'Kunde inte skapa inbjudningskod.');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (generatedCode) {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
        navigator.clipboard.writeText(generatedCode);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleJoinHousehold = async () => {
    if (!joinCode.trim()) {
      setJoinError('Vänligen ange en inbjudningskod.');
      return;
    }
    setJoinLoading(true);
    setJoinError(null);
    setJoinSuccess(false);
    try {
      await acceptInvite(joinCode.trim());
      setJoinSuccess(true);
      setJoinCode('');
      await refreshProfile();
      if (householdId) {
        setMembersLoading(true);
        const m = await getHouseholdMembers(householdId);
        setMembers(m);
        setMembersLoading(false);
      }
    } catch (err: any) {
      setJoinError(err.message || 'Ogiltig eller utgången kod.');
    } finally {
      setJoinLoading(false);
    }
  };

  const handleSaveUnitSystem = async (sys: 'metric' | 'us') => {
    if (user?.id) {
      await supabase.from('profiles').update({ unit_system: sys, updated_at: new Date().toISOString() }).eq('user_id', user.id);
      await refreshProfile();
    }
  };

  const handleSaveLanguage = async (lang: 'sv' | 'en') => {
    if (user?.id) {
      await supabase.from('profiles').update({ ui_language: lang, updated_at: new Date().toISOString() }).eq('user_id', user.id);
      await refreshProfile();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const householdName = household?.name || 'Mitt hushåll';
  const memberInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]?.toUpperCase()).slice(0, 2).join('');
  };

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerStyle={{ paddingBottom: 140 }}>
      <View className="max-w-2xl mx-auto w-full px-5 pt-14">
        {/* =========================================================================
            1. MAIN MORE VIEW
           ========================================================================= */}
        {subView === null && (
          <View>
            <Text className="font-newsreader text-4xl font-medium text-ink mb-6">
              Mer
            </Text>

            {/* Household Summary Card */}
            <Pressable
              onPress={() => setSubView('household')}
              className="bg-surface rounded-card p-5 border border-line flex-row items-center mb-5 active:opacity-90 shadow-sm"
            >
              {/* Member Avatars Stack */}
              <View className="flex-row mr-4">
                {members.length > 0 ? (
                  members.slice(0, 3).map((m) => (
                    <View
                      key={m.id}
                      className="w-10 h-10 rounded-full bg-surface2 border-2 border-surface items-center justify-center -mr-2.5"
                    >
                      <Text className="font-figtree font-bold text-xs text-ink">
                        {memberInitials(m.profile?.display_name)}
                      </Text>
                    </View>
                  ))
                ) : (
                  <View className="w-10 h-10 rounded-full bg-acc-soft items-center justify-center">
                    <Home size={20} color="#B4472A" />
                  </View>
                )}
              </View>

              <View className="flex-1">
                <Text className="font-figtree font-bold text-lg text-ink">
                  {householdName}
                </Text>
                <Text className="font-figtree text-sm text-muted">
                  {members.length > 0 ? `${members.length} medlemmar` : '1 medlem'} • {household?.plan === 'premium' ? 'Premium' : 'Gratis'}
                </Text>
              </View>

              <ChevronRight size={20} color="#6E6259" />
            </Pressable>

            {/* Menu List */}
            <View className="bg-surface rounded-card border border-line overflow-hidden mb-6 shadow-sm">
              <Pressable
                onPress={() => setSubView('household')}
                className="flex-row items-center p-4.5 border-b border-line active:bg-surface2"
              >
                <View className="w-9 h-9 rounded-xl bg-acc-soft items-center justify-center mr-3.5">
                  <Users size={18} color="#B4472A" />
                </View>
                <Text className="font-figtree font-semibold text-base text-ink flex-1">
                  Hushåll & inbjudningar
                </Text>
                <ChevronRight size={18} color="#B5A899" />
              </Pressable>

              <Pressable
                onPress={() => setSubView('settings')}
                className="flex-row items-center p-4.5 border-b border-line active:bg-surface2"
              >
                <View className="w-9 h-9 rounded-xl bg-surface2 items-center justify-center mr-3.5">
                  <Settings size={18} color="#2A211B" />
                </View>
                <Text className="font-figtree font-semibold text-base text-ink flex-1">
                  Inställningar & måttenheter
                </Text>
                <ChevronRight size={18} color="#B5A899" />
              </Pressable>

              <Pressable
                onPress={handleSignOut}
                className="flex-row items-center p-4.5 active:bg-surface2"
              >
                <View className="w-9 h-9 rounded-xl bg-acc-soft/40 items-center justify-center mr-3.5">
                  <LogOut size={18} color="#B4472A" />
                </View>
                <Text className="font-figtree font-semibold text-base text-acc-text flex-1">
                  Logga ut
                </Text>
              </Pressable>
            </View>

            {/* App Version Info */}
            <Text className="font-figtree text-xs text-muted text-center mt-4">
              Cookaloo v1.0 • PWA & Mobile
            </Text>
          </View>
        )}

        {/* =========================================================================
            2. HOUSEHOLD SUB-VIEW
           ========================================================================= */}
        {subView === 'household' && (
          <View>
            <Pressable
              onPress={() => setSubView(null)}
              className="flex-row items-center mb-4 active:opacity-70 self-start"
            >
              <Text className="font-figtree text-acc-text font-semibold text-sm">
                ← Tillbaka till Mer
              </Text>
            </Pressable>

            <Text className="font-newsreader text-3xl font-medium text-ink mb-1">
              {householdName}
            </Text>
            <Text className="font-figtree text-muted text-sm mb-6">
              Hantera medlemmar och inbjudningskoder för familjen.
            </Text>

            {/* Member List Section */}
            <Text className="font-figtree font-bold text-xs uppercase tracking-wider text-muted mb-2 px-1">
              Medlemmar i hushållet
            </Text>
            <Card className="p-0 overflow-hidden mb-6 shadow-sm">
              {membersLoading ? (
                <View className="py-6 items-center">
                  <ActivityIndicator size="small" color="#B4472A" />
                </View>
              ) : members.length > 0 ? (
                members.map((m, idx) => (
                  <View
                    key={m.id}
                    className={`flex-row items-center p-4 ${
                      idx !== members.length - 1 ? 'border-b border-line' : ''
                    }`}
                  >
                    <View className="w-10 h-10 rounded-full bg-surface2 items-center justify-center mr-3.5">
                      <Text className="font-figtree font-bold text-sm text-ink">
                        {memberInitials(m.profile?.display_name)}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-figtree font-semibold text-base text-ink">
                        {m.profile?.display_name || 'Användare'}
                      </Text>
                      <Text className="font-figtree text-xs text-muted">
                        {m.user_id === user?.id ? 'Du' : 'Familjemedlem'}
                      </Text>
                    </View>
                    <Badge
                      label={m.role === 'owner' ? 'Ägare' : 'Medlem'}
                      variant={m.role === 'owner' ? 'herb' : 'default'}
                      size="sm"
                    />
                  </View>
                ))
              ) : (
                <View className="p-4 items-center">
                  <Text className="font-figtree text-sm text-muted">Inga medlemmar hittades.</Text>
                </View>
              )}
            </Card>

            {/* Invite Section */}
            <Text className="font-figtree font-bold text-xs uppercase tracking-wider text-muted mb-2 px-1">
              Bjud in familjemedlem
            </Text>
            <Card className="p-5 mb-6 shadow-sm">
              <Text className="font-figtree text-sm text-ink mb-4 leading-relaxed">
                Skapa en inbjudningskod som din partner eller familj kan ange för att gå med i <Text className="font-bold">{householdName}</Text>.
              </Text>

              {inviteError && (
                <Text className="font-figtree text-xs text-acc-text mb-3">{inviteError}</Text>
              )}

              {generatedCode ? (
                <View className="bg-surface2 rounded-2xl p-4 items-center mb-2">
                  <Text className="font-figtree text-xs text-muted uppercase tracking-wider mb-1">
                    Inbjudningskod (gäller i 7 dagar)
                  </Text>
                  <Text className="font-mono text-2xl font-bold text-acc tracking-widest my-1">
                    {generatedCode}
                  </Text>
                  <Pressable
                    onPress={handleCopyCode}
                    className="flex-row items-center bg-surface border border-line2 rounded-full py-2 px-4 mt-2 active:bg-surface2"
                  >
                    {copied ? (
                      <>
                        <Check size={16} color="#2F6A43" />
                        <Text className="font-figtree text-herb-text font-semibold text-xs ml-1.5">
                          Kopierad till urklipp!
                        </Text>
                      </>
                    ) : (
                      <>
                        <Copy size={16} color="#2A211B" />
                        <Text className="font-figtree text-ink font-semibold text-xs ml-1.5">
                          Kopiera kod
                        </Text>
                      </>
                    )}
                  </Pressable>
                </View>
              ) : (
                <Button
                  title="Skapa inbjudningskod"
                  variant="primary"
                  loading={inviteLoading}
                  onPress={handleGenerateInvite}
                  icon={<Sparkles size={18} color="#FFFFFF" />}
                  className="w-full"
                />
              )}
            </Card>

            {/* Join Another Household Section */}
            <Text className="font-figtree font-bold text-xs uppercase tracking-wider text-muted mb-2 px-1">
              Gå med i ett annat hushåll
            </Text>
            <Card className="p-5 shadow-sm">
              <Text className="font-figtree text-sm text-ink mb-3 leading-relaxed">
                Har du fått en inbjudningskod från ett annat hushåll? Ange den här:
              </Text>

              {joinError && (
                <Text className="font-figtree text-xs text-acc-text mb-3">{joinError}</Text>
              )}
              {joinSuccess && (
                <Text className="font-figtree text-xs text-herb-text font-semibold mb-3">
                  ✓ Du har gått med i hushållet!
                </Text>
              )}

              <Input
                placeholder="T.ex. BAARD-7K2QMP8Z"
                value={joinCode}
                onChangeText={setJoinCode}
                autoCapitalize="characters"
                containerClassName="mb-3"
              />

              <Button
                title="Gå med i hushåll"
                variant="outline"
                loading={joinLoading}
                onPress={handleJoinHousehold}
                icon={<ArrowRight size={16} color="#2A211B" />}
                className="w-full"
              />
            </Card>
          </View>
        )}

        {/* =========================================================================
            3. SETTINGS SUB-VIEW
           ========================================================================= */}
        {subView === 'settings' && (
          <View>
            <Pressable
              onPress={() => setSubView(null)}
              className="flex-row items-center mb-4 active:opacity-70 self-start"
            >
              <Text className="font-figtree text-acc-text font-semibold text-sm">
                ← Tillbaka till Mer
              </Text>
            </Pressable>

            <Text className="font-newsreader text-3xl font-medium text-ink mb-1">
              Inställningar
            </Text>
            <Text className="font-figtree text-muted text-sm mb-6">
              Måttenheter, språk och app-inställningar.
            </Text>

            {/* Unit System */}
            <Text className="font-figtree font-bold text-xs uppercase tracking-wider text-muted mb-2 px-1">
              Standard måttsystem
            </Text>
            <View className="flex-row gap-3 mb-6">
              <Pressable
                onPress={() => handleSaveUnitSystem('metric')}
                className={`flex-1 p-4 rounded-2xl border ${
                  unitSystem === 'metric' ? 'bg-acc-soft/40 border-acc' : 'bg-surface border-line'
                }`}
              >
                <Text className="font-figtree font-bold text-base text-ink mb-0.5">
                  Metriskt
                </Text>
                <Text className="font-figtree text-xs text-muted">
                  dl, msk, tsk, g, kg, l
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleSaveUnitSystem('us')}
                className={`flex-1 p-4 rounded-2xl border ${
                  unitSystem === 'us' ? 'bg-acc-soft/40 border-acc' : 'bg-surface border-line'
                }`}
              >
                <Text className="font-figtree font-bold text-base text-ink mb-0.5">
                  US
                </Text>
                <Text className="font-figtree text-xs text-muted">
                  cups, tbsp, tsp, oz, lb
                </Text>
              </Pressable>
            </View>

            {/* Language */}
            <Text className="font-figtree font-bold text-xs uppercase tracking-wider text-muted mb-2 px-1">
              Språk
            </Text>
            <View className="flex-row gap-3 mb-6">
              <Pressable
                onPress={() => handleSaveLanguage('sv')}
                className={`flex-1 p-3.5 rounded-2xl border items-center ${
                  uiLanguage === 'sv' ? 'bg-acc-soft/40 border-acc' : 'bg-surface border-line'
                }`}
              >
                <Text className="font-figtree font-semibold text-ink">🇸🇪 Svenska</Text>
              </Pressable>

              <Pressable
                onPress={() => handleSaveLanguage('en')}
                className={`flex-1 p-3.5 rounded-2xl border items-center ${
                  uiLanguage === 'en' ? 'bg-acc-soft/40 border-acc' : 'bg-surface border-line'
                }`}
              >
                <Text className="font-figtree font-semibold text-ink">🇬🇧 English</Text>
              </Pressable>
            </View>

            {/* Account Info Card */}
            <Text className="font-figtree font-bold text-xs uppercase tracking-wider text-muted mb-2 px-1">
              Konto
            </Text>
            <Card className="p-4 mb-6 shadow-sm">
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 rounded-full bg-surface2 items-center justify-center mr-3">
                  <UserIcon size={20} color="#2A211B" />
                </View>
                <View className="flex-1">
                  <Text className="font-figtree font-semibold text-base text-ink">
                    {profile?.display_name || 'Användare'}
                  </Text>
                  <Text className="font-figtree text-xs text-muted">
                    {user?.email || 'Ingen e-post'}
                  </Text>
                </View>
              </View>

              <Button
                title="Logga ut"
                variant="outline"
                size="sm"
                onPress={handleSignOut}
                icon={<LogOut size={16} color="#B4472A" />}
                className="w-full mt-2"
              />
            </Card>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
