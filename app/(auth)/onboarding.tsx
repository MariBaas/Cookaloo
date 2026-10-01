import React, { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useHousehold } from '@/hooks/useHousehold';
import { supabase } from '@/services/supabase';
import { Input, Button, Card } from '@/components/ui';
import { Home, Users, Settings2, Copy, Check, ArrowRight, Sparkles } from 'lucide-react-native';

type OnboardingStep = 'household' | 'preferences' | 'invite';

export default function OnboardingScreen() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();
  const { createHousehold, acceptInvite, createInvite } = useHousehold();

  const [step, setStep] = useState<OnboardingStep>('household');
  const [householdMode, setHouseholdMode] = useState<'create' | 'join'>('create');
  const [householdName, setHouseholdName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [createdHouseholdId, setCreatedHouseholdId] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [unitSystem, setUnitSystem] = useState<'metric' | 'us'>('metric');
  const [uiLanguage, setUiLanguage] = useState<'sv' | 'en'>('sv');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Household Handler
  const handleHouseholdSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      if (householdMode === 'create') {
        if (!householdName.trim()) {
          setError('Vänligen ange ett namn för hushållet.');
          setLoading(false);
          return;
        }
        const hId = await createHousehold(householdName.trim());
        setCreatedHouseholdId(hId);
        await refreshProfile();
        setStep('preferences');
      } else {
        if (!inviteCode.trim()) {
          setError('Vänligen ange inbjudningskoden.');
          setLoading(false);
          return;
        }
        const hId = await acceptInvite(inviteCode.trim());
        setCreatedHouseholdId(hId);
        await refreshProfile();
        setStep('preferences');
      }
    } catch (err: any) {
      setError(err.message || 'Ett fel uppstod.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Preferences Handler
  const handlePreferencesSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      if (user?.id) {
        await supabase
          .from('profiles')
          .update({
            unit_system: unitSystem,
            ui_language: uiLanguage,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);
        await refreshProfile();
      }
      setStep('invite');
    } catch (err: any) {
      setError(err.message || 'Kunde inte spara preferenser.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Generate Invite Code
  const handleGenerateInvite = async () => {
    const targetHouseholdId = createdHouseholdId || profile?.active_household_id;
    if (!targetHouseholdId) {
      setError('Inget aktivt hushåll hittades.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const code = await createInvite(targetHouseholdId);
      setGeneratedCode(code);
    } catch (err: any) {
      setError(err.message || 'Kunde inte generera inbjudningskod.');
    } finally {
      setLoading(false);
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

  const handleFinish = () => {
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-bg"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        className="px-6 py-12"
      >
        <View className="w-full max-w-md mx-auto">
          {/* Step Indicator */}
          <View className="flex-row items-center justify-center gap-2 mb-8">
            <View
              className={`w-8 h-2 rounded-full ${
                step === 'household' ? 'bg-acc' : 'bg-herb'
              }`}
            />
            <View
              className={`w-8 h-2 rounded-full ${
                step === 'preferences'
                  ? 'bg-acc'
                  : step === 'invite'
                  ? 'bg-herb'
                  : 'bg-line'
              }`}
            />
            <View
              className={`w-8 h-2 rounded-full ${
                step === 'invite' ? 'bg-acc' : 'bg-line'
              }`}
            />
          </View>

          {/* STEP 1: CREATE OR JOIN HOUSEHOLD */}
          {step === 'household' && (
            <Card className="p-6">
              <View className="items-center mb-6">
                <View className="w-14 h-14 rounded-full bg-acc-soft items-center justify-center mb-3">
                  <Home size={28} color="#B4472A" />
                </View>
                <Text className="font-newsreader text-2xl font-medium text-ink text-center">
                  Välkommen till Cookaloo!
                </Text>
                <Text className="font-figtree text-muted text-sm text-center mt-1">
                  Skapa ett nytt familjehushåll eller gå med i ett befintligt.
                </Text>
              </View>

              {/* Mode Switcher */}
              <View className="flex-row bg-surface2 rounded-full p-1 mb-6">
                <Pressable
                  className={`flex-1 py-2 rounded-full items-center ${
                    householdMode === 'create' ? 'bg-surface shadow-xs' : ''
                  }`}
                  onPress={() => {
                    setHouseholdMode('create');
                    setError(null);
                  }}
                >
                  <Text
                    className={`font-figtree text-sm ${
                      householdMode === 'create'
                        ? 'font-semibold text-ink'
                        : 'text-muted'
                    }`}
                  >
                    Skapa nytt
                  </Text>
                </Pressable>
                <Pressable
                  className={`flex-1 py-2 rounded-full items-center ${
                    householdMode === 'join' ? 'bg-surface shadow-xs' : ''
                  }`}
                  onPress={() => {
                    setHouseholdMode('join');
                    setError(null);
                  }}
                >
                  <Text
                    className={`font-figtree text-sm ${
                      householdMode === 'join'
                        ? 'font-semibold text-ink'
                        : 'text-muted'
                    }`}
                  >
                    Gå med med kod
                  </Text>
                </Pressable>
              </View>

              {error && (
                <Text className="font-figtree text-acc-text text-sm mb-4">
                  {error}
                </Text>
              )}

              {householdMode === 'create' ? (
                <View>
                  <Input
                    label="Hushållets namn"
                    placeholder='T.ex. "Familjen Baard" eller "Gatan 12"'
                    value={householdName}
                    onChangeText={setHouseholdName}
                    containerClassName="mb-6"
                  />
                  <Button
                    title="Skapa hushåll & fortsätt"
                    loading={loading}
                    onPress={handleHouseholdSubmit}
                    icon={<ArrowRight size={18} color="#FFFFFF" />}
                    className="w-full"
                  />
                </View>
              ) : (
                <View>
                  <Input
                    label="Inbjudningskod"
                    placeholder="T.ex. BAARD-K8M3NP7Q"
                    value={inviteCode}
                    onChangeText={setInviteCode}
                    autoCapitalize="characters"
                    containerClassName="mb-6"
                    hint="Koden är 8 tecken lång och gäller i 7 dagar"
                  />
                  <Button
                    title="Gå med i hushåll"
                    loading={loading}
                    onPress={handleHouseholdSubmit}
                    icon={<ArrowRight size={18} color="#FFFFFF" />}
                    className="w-full"
                  />
                </View>
              )}
            </Card>
          )}

          {/* STEP 2: PREFERENCES */}
          {step === 'preferences' && (
            <Card className="p-6">
              <View className="items-center mb-6">
                <View className="w-14 h-14 rounded-full bg-acc-soft items-center justify-center mb-3">
                  <Settings2 size={28} color="#B4472A" />
                </View>
                <Text className="font-newsreader text-2xl font-medium text-ink text-center">
                  Välj dina måttenheter
                </Text>
                <Text className="font-figtree text-muted text-sm text-center mt-1">
                  Du kan när som helst byta mellan metriskt och US i recepten.
                </Text>
              </View>

              {error && (
                <Text className="font-figtree text-acc-text text-sm mb-4">
                  {error}
                </Text>
              )}

              {/* Unit System Toggle */}
              <Text className="font-figtree text-sm font-semibold text-ink mb-2">
                Standard måttsystem
              </Text>
              <View className="flex-row gap-3 mb-6">
                <Pressable
                  className={`flex-1 p-4 rounded-2xl border ${
                    unitSystem === 'metric'
                      ? 'bg-acc-soft/30 border-acc'
                      : 'bg-surface border-line2'
                  }`}
                  onPress={() => setUnitSystem('metric')}
                >
                  <Text className="font-figtree font-bold text-ink text-base mb-1">
                    Metriskt
                  </Text>
                  <Text className="font-figtree text-xs text-muted">
                    dl, msk, tsk, g, kg, l
                  </Text>
                </Pressable>

                <Pressable
                  className={`flex-1 p-4 rounded-2xl border ${
                    unitSystem === 'us'
                      ? 'bg-acc-soft/30 border-acc'
                      : 'bg-surface border-line2'
                  }`}
                  onPress={() => setUnitSystem('us')}
                >
                  <Text className="font-figtree font-bold text-ink text-base mb-1">
                    US
                  </Text>
                  <Text className="font-figtree text-xs text-muted">
                    cups, tbsp, tsp, oz, lb
                  </Text>
                </Pressable>
              </View>

              {/* UI Language */}
              <Text className="font-figtree text-sm font-semibold text-ink mb-2">
                Appens språk
              </Text>
              <View className="flex-row gap-3 mb-8">
                <Pressable
                  className={`flex-1 p-3.5 rounded-2xl border items-center ${
                    uiLanguage === 'sv'
                      ? 'bg-acc-soft/30 border-acc'
                      : 'bg-surface border-line2'
                  }`}
                  onPress={() => setUiLanguage('sv')}
                >
                  <Text className="font-figtree font-semibold text-ink">
                    🇸🇪 Svenska
                  </Text>
                </Pressable>

                <Pressable
                  className={`flex-1 p-3.5 rounded-2xl border items-center ${
                    uiLanguage === 'en'
                      ? 'bg-acc-soft/30 border-acc'
                      : 'bg-surface border-line2'
                  }`}
                  onPress={() => setUiLanguage('en')}
                >
                  <Text className="font-figtree font-semibold text-ink">
                    🇬🇧 English
                  </Text>
                </Pressable>
              </View>

              <Button
                title="Spara & fortsätt"
                loading={loading}
                onPress={handlePreferencesSubmit}
                icon={<ArrowRight size={18} color="#FFFFFF" />}
                className="w-full"
              />
            </Card>
          )}

          {/* STEP 3: INVITE FAMILY */}
          {step === 'invite' && (
            <Card className="p-6 items-center">
              <View className="w-14 h-14 rounded-full bg-herb-soft items-center justify-center mb-3">
                <Users size={28} color="#2F6A43" />
              </View>
              <Text className="font-newsreader text-2xl font-medium text-ink text-center">
                Bjud in familjemedlemmar
              </Text>
              <Text className="font-figtree text-muted text-sm text-center mt-1 mb-6">
                Dela en inbjudningskod så kan din familj synka recept och inköpslista i realtid.
              </Text>

              {error && (
                <Text className="font-figtree text-acc-text text-sm mb-4">
                  {error}
                </Text>
              )}

              {generatedCode ? (
                <View className="w-full bg-surface2 border border-line rounded-2xl p-4 items-center mb-6">
                  <Text className="font-figtree text-xs text-muted mb-1 uppercase tracking-wider">
                    Inbjudningskod (gäller i 7 dagar)
                  </Text>
                  <Text className="font-mono text-2xl font-bold text-acc tracking-widest my-2">
                    {generatedCode}
                  </Text>
                  <Pressable
                    className="flex-row items-center bg-surface border border-line2 rounded-full py-2 px-4 mt-2 active:bg-surface2"
                    onPress={handleCopyCode}
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
                  variant="outline"
                  loading={loading}
                  onPress={handleGenerateInvite}
                  icon={<Sparkles size={18} color="#B4472A" />}
                  className="w-full mb-4"
                />
              )}

              <Button
                title="Gå till receptsamlingen"
                variant="primary"
                onPress={handleFinish}
                icon={<ArrowRight size={18} color="#FFFFFF" />}
                className="w-full"
              />
            </Card>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
