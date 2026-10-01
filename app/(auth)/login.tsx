import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { Input, Button, Card } from '@/components/ui';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react-native';

export default function LoginScreen() {
  const { signInWithGoogle, signInWithOtp } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkSent, setLinkSent] = useState(false);

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Inloggning med Google misslyckades.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email || !email.includes('@')) {
      setError('Vänligen ange en giltig e-postadress.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await signInWithOtp(email.trim().toLowerCase());
      setLinkSent(true);
    } catch (err: any) {
      setError(err.message || 'Kunde inte skicka magisk länk.');
    } finally {
      setLoading(false);
    }
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
        <View className="w-full max-w-md mx-auto items-center">
          {/* Logo & Header */}
          <Text className="font-bricolage text-5xl font-extrabold text-ink tracking-tight mb-2">
            C<Text className="text-acc">oo</Text>kal<Text className="text-acc">oo</Text>
          </Text>
          <Text className="font-newsreader text-xl italic text-muted text-center mb-10">
            Familjens samlade recept & måltider
          </Text>

          {linkSent ? (
            <Card className="w-full items-center py-8 px-6 text-center">
              <View className="w-16 h-16 rounded-full bg-herb-soft items-center justify-center mb-4">
                <CheckCircle2 size={32} color="#2F6A43" />
              </View>
              <Text className="font-newsreader text-2xl text-ink font-medium mb-2 text-center">
                Kolla din inkorg!
              </Text>
              <Text className="font-figtree text-muted text-center text-sm mb-6 leading-relaxed">
                Vi har skickat en magisk inloggningslänk till{' '}
                <Text className="font-semibold text-ink">{email}</Text>. Klicka på länken i mailet för att logga in.
              </Text>
              <Button
                title="Skicka igen"
                variant="outline"
                size="sm"
                onPress={() => setLinkSent(false)}
              />
            </Card>
          ) : (
            <Card className="w-full p-6">
              {error && (
                <View className="bg-acc-soft/40 border border-acc/20 rounded-xl p-3 flex-row items-center mb-4">
                  <AlertCircle size={18} color="#B4472A" />
                  <Text className="font-figtree text-acc-text text-sm ml-2 flex-1">
                    {error}
                  </Text>
                </View>
              )}

              {/* Google Sign In */}
              <Button
                title="Logga in med Google"
                variant="outline"
                loading={googleLoading}
                onPress={handleGoogleSignIn}
                className="w-full mb-4"
              />

              {/* Divider */}
              <View className="flex-row items-center w-full my-3">
                <View className="flex-1 h-px bg-line" />
                <Text className="font-figtree text-muted text-xs mx-3 uppercase tracking-wider">
                  eller med e-post
                </Text>
                <View className="flex-1 h-px bg-line" />
              </View>

              {/* Magic Link */}
              <Input
                label="E-postadress"
                placeholder="namn@exempel.se"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError(null);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                containerClassName="mb-4"
              />

              <Button
                title="Skicka magisk länk"
                variant="primary"
                loading={loading}
                onPress={handleMagicLink}
                icon={<Mail size={18} color="#FFFFFF" />}
                className="w-full"
              />
            </Card>
          )}

          {/* Privacy Note */}
          <Text className="font-figtree text-xs text-muted text-center mt-8 px-4 leading-normal">
            Genom att logga in godkänner du Cookaloos användarvillkor och integritetspolicy.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
