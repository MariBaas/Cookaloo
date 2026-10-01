import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 bg-bg items-center justify-center px-6">
      <Text className="font-newsreader text-2xl text-ink mb-2">
        Recept
      </Text>
      <Text className="font-figtree text-muted text-base text-center">
        Receptdetaljer för {id}
      </Text>
    </View>
  );
}
