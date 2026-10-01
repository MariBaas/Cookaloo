import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Search, SlidersHorizontal, Clock, Star, Check, ChevronDown } from 'lucide-react-native';

const CATEGORIES = [
  'Alla',
  'Förrätt',
  'Huvudrätt',
  'Efterrätt',
  'Snacks',
  'Frukost',
  'Bakning',
  'Dryck',
  'Tillbehör',
];

// Sample UI Shell recipe cards matching prototype — // TODO(phase-2): replace with Supabase database query
const SAMPLE_RECIPES = [
  {
    id: 'bowl',
    title: 'Rostad grönsaksskål med quinoa & tahinidressing',
    category: 'Huvudrätt',
    prepTime: 15,
    cookTime: 30,
    rating: 4.3,
    tried: true,
    lastCooked: '9 dgr sedan',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=70&auto=format&fit=crop',
  },
  {
    id: 'pasta',
    title: 'Pasta med kyckling och soltorkade tomater',
    category: 'Huvudrätt',
    prepTime: 10,
    cookTime: 25,
    rating: 4.0,
    tried: true,
    lastCooked: '12 dgr sedan',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=70&auto=format&fit=crop',
  },
  {
    id: 'skagen',
    title: 'Toast Skagen',
    category: 'Förrätt',
    prepTime: 20,
    cookTime: 5,
    rating: 4.8,
    tried: false,
    lastCooked: 'Ej lagad',
    image: null,
    initials: 'TS',
  },
  {
    id: 'kladd',
    title: 'Kladdkaka',
    category: 'Bakning',
    prepTime: 10,
    cookTime: 18,
    rating: 5.0,
    tried: true,
    lastCooked: '2 mån sedan',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=70&auto=format&fit=crop',
  },
];

export default function RecipeLibraryScreen() {
  const router = useRouter();
  const { profile, household } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alla');

  const householdName = household?.name || 'Familjen Baard';
  const userInitial = profile?.display_name ? profile.display_name[0]?.toUpperCase() : 'M';

  // Filter sample recipes
  const filteredRecipes = SAMPLE_RECIPES.filter((r) => {
    const matchesCategory = selectedCategory === 'Alla' || r.category === selectedCategory;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerStyle={{ paddingBottom: 140 }}>
      <View className="max-w-2xl mx-auto w-full pt-14">
        {/* Top Header */}
        <View className="px-5 flex-row justify-between items-end mb-4">
          <View>
            <Text className="font-figtree text-sm font-semibold text-muted">
              {householdName}
            </Text>
            <Text className="font-newsreader text-4xl font-medium text-ink tracking-tight">
              Recept
            </Text>
          </View>

          <Pressable
            onPress={() => router.push('/(tabs)/more')}
            className="w-11 h-11 rounded-full bg-surface2 items-center justify-center border border-line active:opacity-80"
          >
            <Text className="font-figtree font-bold text-base text-ink">
              {userInitial}
            </Text>
          </Pressable>
        </View>

        {/* Search Bar & Filter */}
        <View className="px-5 flex-row gap-2.5 mb-4">
          <View className="flex-1 h-12.5 rounded-2xl bg-surface border border-line flex-row items-center px-3.5 shadow-sm">
            <Search size={18} color="#6E6259" />
            <TextInput
              className="flex-1 ml-2.5 font-figtree text-base text-ink"
              placeholder="Sök recept, ingrediens..."
              placeholderTextColor="#6E6259"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <Pressable className="w-12.5 h-12.5 rounded-2xl bg-ink items-center justify-center active:opacity-90 shadow-sm">
            <SlidersHorizontal size={18} color="#F6F1E9" />
          </Pressable>
        </View>

        {/* Horizontal Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-3"
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                className={`h-10 px-4 rounded-full items-center justify-center border ${
                  isSelected
                    ? 'bg-ink border-ink'
                    : 'bg-surface border-line active:bg-surface2'
                }`}
              >
                <Text
                  className={`font-figtree text-sm font-semibold ${
                    isSelected ? 'text-bg' : 'text-ink'
                  }`}
                >
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Count & Sort Row */}
        <View className="px-5 flex-row justify-between items-center py-2 mb-1">
          <Text className="font-figtree text-sm text-muted">
            {filteredRecipes.length} recept
          </Text>

          <Pressable className="flex-row items-center gap-1 active:opacity-70">
            <Text className="font-figtree text-sm font-semibold text-ink">
              Nyast
            </Text>
            <ChevronDown size={14} color="#2A211B" />
          </Pressable>
        </View>

        {/* Recipe Cards List */}
        <View className="px-5 flex-col gap-3">
          {filteredRecipes.map((recipe) => (
            <Pressable
              key={recipe.id}
              onPress={() => router.push(`/recipe/${recipe.id}` as any)}
              className="bg-surface rounded-card p-3 border border-line flex-row gap-3.5 shadow-sm active:opacity-95"
            >
              {/* Recipe Image or Monogram */}
              <View className="w-24 h-24 rounded-2xl overflow-hidden bg-surface2 items-center justify-center">
                {recipe.image ? (
                  <Image
                    source={{ uri: recipe.image }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <View className="w-16 h-16 rounded-full border border-line2 items-center justify-center">
                    <Text className="font-newsreader italic text-2xl text-muted">
                      {recipe.initials || 'R'}
                    </Text>
                  </View>
                )}
              </View>

              {/* Recipe Info */}
              <View className="flex-1 justify-center py-0.5">
                <Text
                  className="font-newsreader text-xl font-medium text-ink leading-tight mb-1.5"
                  numberOfLines={2}
                >
                  {recipe.title}
                </Text>

                {/* Metadata Row */}
                <View className="flex-row items-center flex-wrap gap-2.5 mb-1.5">
                  <Text className="font-figtree text-xs text-muted">
                    {recipe.category}
                  </Text>
                  <View className="flex-row items-center gap-1">
                    <Clock size={12} color="#6E6259" />
                    <Text className="font-figtree text-xs text-muted">
                      {recipe.prepTime + recipe.cookTime} min
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-0.5">
                    <Star size={12} color="#B4472A" fill="#B4472A" />
                    <Text className="font-figtree text-xs font-bold text-ink">
                      {recipe.rating.toFixed(1)}
                    </Text>
                  </View>
                </View>

                {/* Tried Badge / Last Cooked */}
                <View className="flex-row items-center gap-2">
                  {recipe.tried && (
                    <View className="flex-row items-center bg-herb-soft px-2 py-0.5 rounded-full">
                      <Check size={10} color="#24573A" strokeWidth={3} />
                      <Text className="font-figtree text-[11px] font-bold text-herb-text ml-1">
                        Provat
                      </Text>
                    </View>
                  )}
                  <Text className="font-figtree text-xs text-muted">
                    {recipe.lastCooked}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
