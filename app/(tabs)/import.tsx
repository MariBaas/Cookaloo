import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { Card, Button } from '@/components/ui';
import { Link as LinkIcon, Camera, FileText, AlignLeft, PlusCircle, ArrowRight, Sparkles } from 'lucide-react-native';

export default function ImportScreen() {
  const [linkOpen, setLinkOpen] = useState(false);
  const [url, setUrl] = useState('');

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerStyle={{ paddingBottom: 140 }}>
      <View className="max-w-2xl mx-auto w-full px-5 pt-14">
        {/* Header */}
        <Text className="font-newsreader text-4xl font-medium text-ink mb-1.5">
          Importera recept
        </Text>
        <Text className="font-figtree text-muted text-base mb-5">
          Spara recept från vilken webbplats som helst, kokboksfoton eller PDF:er.
        </Text>

        {/* Quota indicator */}
        <View className="bg-surface rounded-2xl p-3.5 border border-line flex-row items-center gap-3 mb-6 shadow-xs">
          <View className="w-2.5 h-2.5 rounded-full bg-herb" />
          <View className="flex-1">
            <View className="h-1.5 rounded-full bg-surface2 overflow-hidden mb-1">
              <View className="h-full bg-herb w-1/3 rounded-full" />
            </View>
            <Text className="font-figtree text-xs text-muted">
              Gratisplan: 7 av 10 AI-importer kvar denna månad
            </Text>
          </View>
        </View>

        {/* Source Cards */}
        <View className="flex-col gap-3">
          {/* Web Link Card (Expandable) */}
          <Card className="p-0 overflow-hidden shadow-sm">
            <Pressable
              onPress={() => setLinkOpen(!linkOpen)}
              className="p-4 flex-row items-center gap-3.5 active:bg-surface2"
            >
              <View className="w-13 h-13 rounded-2xl bg-acc-soft items-center justify-center">
                <LinkIcon size={24} color="#B4472A" />
              </View>
              <View className="flex-1">
                <Text className="font-figtree font-bold text-lg text-ink">
                  Webblänk
                </Text>
                <Text className="font-figtree text-xs text-muted mt-0.5">
                  ICA, Arla, Köket, Allt om Mat, bloggar...
                </Text>
              </View>
            </Pressable>

            {linkOpen && (
              <View className="px-4 pb-4 pt-1 flex-col gap-2.5 border-t border-line">
                <TextInput
                  className="h-12 rounded-xl bg-bg border border-line2 px-3.5 font-figtree text-sm text-ink"
                  placeholder="Klistra in länk här (https://...)"
                  placeholderTextColor="#6E6259"
                  value={url}
                  onChangeText={setUrl}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Button
                  title="Hämta & tolka recept"
                  variant="primary"
                  size="md"
                  icon={<Sparkles size={16} color="#FFFFFF" />}
                  onPress={() => {
                    // TODO(phase-3): connect to Gemini Edge Function import
                  }}
                />
              </View>
            )}
          </Card>

          {/* Photo Card */}
          <Pressable
            onPress={() => {
              // TODO(phase-3): photo picker
            }}
            className="bg-surface rounded-card p-4 border border-line flex-row items-center gap-3.5 shadow-sm active:opacity-90"
          >
            <View className="w-13 h-13 rounded-2xl bg-surface2 items-center justify-center">
              <Camera size={24} color="#2A211B" />
            </View>
            <View className="flex-1">
              <Text className="font-figtree font-bold text-lg text-ink">
                Fota kokbok eller tidning
              </Text>
              <Text className="font-figtree text-xs text-muted mt-0.5">
                Ta en bild eller välj från kamerarullen
              </Text>
            </View>
            <ArrowRight size={18} color="#B5A899" />
          </Pressable>

          {/* PDF Card */}
          <Pressable
            onPress={() => {
              // TODO(phase-3): document picker
            }}
            className="bg-surface rounded-card p-4 border border-line flex-row items-center gap-3.5 shadow-sm active:opacity-90"
          >
            <View className="w-13 h-13 rounded-2xl bg-surface2 items-center justify-center">
              <FileText size={24} color="#2A211B" />
            </View>
            <View className="flex-1">
              <Text className="font-figtree font-bold text-lg text-ink">
                Ladda upp PDF
              </Text>
              <Text className="font-figtree text-xs text-muted mt-0.5">
                Receptblad, matkasse-menyer eller e-böcker
              </Text>
            </View>
            <ArrowRight size={18} color="#B5A899" />
          </Pressable>

          {/* Raw Text Card */}
          <Pressable
            onPress={() => {
              // TODO(phase-3): raw text input modal
            }}
            className="bg-surface rounded-card p-4 border border-line flex-row items-center gap-3.5 shadow-sm active:opacity-90"
          >
            <View className="w-13 h-13 rounded-2xl bg-surface2 items-center justify-center">
              <AlignLeft size={24} color="#2A211B" />
            </View>
            <View className="flex-1">
              <Text className="font-figtree font-bold text-lg text-ink">
                Klistra in text
              </Text>
              <Text className="font-figtree text-xs text-muted mt-0.5">
                Från anteckningar, meddelanden eller e-post
              </Text>
            </View>
            <ArrowRight size={18} color="#B5A899" />
          </Pressable>

          {/* Manual Recipe Card */}
          <Pressable
            onPress={() => {
              // TODO(phase-2): manual recipe editor
            }}
            className="bg-surface rounded-card p-4 border border-line flex-row items-center gap-3.5 shadow-sm active:opacity-90"
          >
            <View className="w-13 h-13 rounded-2xl bg-herb-soft items-center justify-center">
              <PlusCircle size={24} color="#2F6A43" />
            </View>
            <View className="flex-1">
              <Text className="font-figtree font-bold text-lg text-ink">
                Skriv in manuellt
              </Text>
              <Text className="font-figtree text-xs text-muted mt-0.5">
                Skapa ett eget recept från grunden
              </Text>
            </View>
            <ArrowRight size={18} color="#B5A899" />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
