import { View, Text } from "react-native";

export default function RecipeLibraryScreen() {
  return (
    <View className="flex-1 bg-bg items-center justify-center px-6">
      <Text className="font-newsreader text-2xl text-ink mb-2">
        Receptbiblioteket
      </Text>
      <Text className="font-figtree text-muted text-base text-center">
        Dina recept kommer visas här.
      </Text>
    </View>
  );
}
