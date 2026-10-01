import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui';
import { Plus, Check, Copy } from 'lucide-react-native';

interface GroceryItem {
  id: string;
  name: string;
  amount: string;
  aisle: string;
  checked: boolean;
}

const SAMPLE_ITEMS: GroceryItem[] = [
  { id: '1', name: 'Sötpotatis', amount: '500 g', aisle: 'Frukt & grönt', checked: false },
  { id: '2', name: 'Rödlök', amount: '1 st', aisle: 'Frukt & grönt', checked: false },
  { id: '3', name: 'Babyspenat', amount: '100 g', aisle: 'Frukt & grönt', checked: false },
  { id: '4', name: 'Matlagningsgrädde', amount: '3 dl', aisle: 'Mejeri', checked: false },
  { id: '5', name: 'Riven parmesan', amount: '100 g', aisle: 'Mejeri', checked: true },
  { id: '6', name: 'Kycklingfilé', amount: '500 g', aisle: 'Kött & fisk', checked: false },
  { id: '7', name: 'Quinoa', amount: '200 g', aisle: 'Skafferi', checked: false },
  { id: '8', name: 'Tahini', amount: '60 ml', aisle: 'Skafferi', checked: true },
];

export default function GroceryScreen() {
  const { household } = useAuth();
  const [items, setItems] = useState<GroceryItem[]>(SAMPLE_ITEMS);
  const [newItemText, setNewItemText] = useState('');
  const [copied, setCopied] = useState(false);

  const householdName = household?.name || 'Familjen Baard';

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it))
    );
  };

  const addItem = () => {
    if (!newItemText.trim()) return;
    const newItem: GroceryItem = {
      id: Date.now().toString(),
      name: newItemText.trim(),
      amount: '1 st',
      aisle: 'Övrigt',
      checked: false,
    };
    setItems([newItem, ...items]);
    setNewItemText('');
  };

  // Group active items by aisle
  const activeItems = items.filter((it) => !it.checked);
  const checkedItems = items.filter((it) => it.checked);

  const aisles = Array.from(new Set(activeItems.map((it) => it.aisle)));

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerStyle={{ paddingBottom: 140 }}>
      <View className="max-w-2xl mx-auto w-full px-5 pt-14">
        {/* Header */}
        <Text className="font-figtree text-sm font-semibold text-muted">
          {householdName}
        </Text>
        <Text className="font-newsreader text-4xl font-medium text-ink tracking-tight mb-2">
          Inköpslista
        </Text>

        {/* Live sync banner */}
        <View className="flex-row items-center gap-2 mb-5">
          <View className="w-2.5 h-2.5 rounded-full bg-herb" />
          <Text className="font-figtree text-xs font-semibold text-herb-text">
            Synkas i realtid med hushållet
          </Text>
        </View>

        {/* In-list recipes pills */}
        <Text className="font-figtree font-bold text-xs uppercase tracking-wider text-muted mb-2 px-1">
          Recept i listan (2)
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
          contentContainerStyle={{ gap: 8 }}
        >
          <View className="bg-surface rounded-2xl p-3 border border-line flex-row items-center gap-2.5 shadow-xs w-48">
            <View className="w-9 h-9 rounded-xl bg-acc-soft items-center justify-center">
              <Text className="font-newsreader italic font-bold text-xs text-acc-text">RQ</Text>
            </View>
            <View className="flex-1">
              <Text className="font-figtree font-bold text-xs text-ink" numberOfLines={1}>
                Rostad grönsaksskål
              </Text>
              <Text className="font-figtree text-[11px] text-muted">4 portioner</Text>
            </View>
          </View>

          <View className="bg-surface rounded-2xl p-3 border border-line flex-row items-center gap-2.5 shadow-xs w-48">
            <View className="w-9 h-9 rounded-xl bg-surface2 items-center justify-center">
              <Text className="font-newsreader italic font-bold text-xs text-ink">PK</Text>
            </View>
            <View className="flex-1">
              <Text className="font-figtree font-bold text-xs text-ink" numberOfLines={1}>
                Pasta med kyckling
              </Text>
              <Text className="font-figtree text-[11px] text-muted">4 portioner</Text>
            </View>
          </View>
        </ScrollView>

        {/* Add Quick Item Input */}
        <View className="flex-row gap-2 mb-6">
          <TextInput
            className="flex-1 h-12.5 rounded-2xl bg-surface border border-line px-4 font-figtree text-base text-ink shadow-sm"
            placeholder="Lägg till vara (t.ex. Mjölk 1 liter)..."
            placeholderTextColor="#6E6259"
            value={newItemText}
            onChangeText={setNewItemText}
            onSubmitEditing={addItem}
          />
          <Pressable
            onPress={addItem}
            className="w-12.5 h-12.5 rounded-2xl bg-ink items-center justify-center active:opacity-90 shadow-sm"
          >
            <Plus size={20} color="#F6F1E9" strokeWidth={2.4} />
          </Pressable>
        </View>

        {/* Categorized List by Aisle */}
        {aisles.map((aisle) => {
          const aisleItems = activeItems.filter((it) => it.aisle === aisle);
          return (
            <View key={aisle} className="mb-5">
              <Text className="font-figtree font-bold text-xs uppercase tracking-wider text-acc-text mb-2 px-1">
                {aisle}
              </Text>
              <Card className="p-0 overflow-hidden shadow-sm">
                {aisleItems.map((item, idx) => (
                  <Pressable
                    key={item.id}
                    onPress={() => toggleItem(item.id)}
                    className={`flex-row items-center p-3.5 ${
                      idx !== aisleItems.length - 1 ? 'border-b border-line' : ''
                    } active:bg-surface2`}
                  >
                    <View className="w-6 h-6 rounded-lg border-2 border-line2 mr-3 items-center justify-center" />
                    <Text className="font-figtree text-base text-ink flex-1">
                      <Text className="font-bold">{item.amount}</Text> {item.name}
                    </Text>
                  </Pressable>
                ))}
              </Card>
            </View>
          );
        })}

        {/* Checked Items Section */}
        {checkedItems.length > 0 && (
          <View className="mb-6">
            <Text className="font-figtree font-bold text-xs uppercase tracking-wider text-muted mb-2 px-1">
              Klara varor ({checkedItems.length})
            </Text>
            <Card className="p-0 overflow-hidden opacity-70 shadow-sm">
              {checkedItems.map((item, idx) => (
                <Pressable
                  key={item.id}
                  onPress={() => toggleItem(item.id)}
                  className={`flex-row items-center p-3.5 ${
                    idx !== checkedItems.length - 1 ? 'border-b border-line' : ''
                  } active:bg-surface2`}
                >
                  <View className="w-6 h-6 rounded-lg bg-acc mr-3 items-center justify-center">
                    <Check size={14} color="#FFFFFF" strokeWidth={3} />
                  </View>
                  <Text className="font-figtree text-base text-muted line-through flex-1">
                    <Text className="font-bold">{item.amount}</Text> {item.name}
                  </Text>
                </Pressable>
              ))}
            </Card>
          </View>
        )}

        {/* Online Grocery Copy Card */}
        <View className="bg-surface2 rounded-card p-4.5 border border-line mb-4 shadow-sm">
          <Pressable
            onPress={() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2500);
            }}
            className="bg-acc py-3.5 rounded-full flex-row items-center justify-center gap-2 active:opacity-90"
          >
            <Copy size={16} color="#FFFFFF" />
            <Text className="font-figtree font-bold text-sm text-acc-ink">
              {copied ? 'Kopierad till urklipp!' : 'Kopiera för ICA / Mathem'}
            </Text>
          </Pressable>
          <Text className="font-figtree text-xs text-muted text-center mt-2.5">
            Formaterar alla oavbockade varor med mängder redo att klistras in i din matbutik.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
