import { View, Text } from "react-native";

export default function GroceryScreen() {
  return (
    <View className="flex-1 bg-bg items-center justify-center px-6">
      <Text className="font-newsreader text-2xl text-ink mb-2">
        Inköpslista
      </Text>
      <Text className="font-figtree text-muted text-base text-center">
        Din delade inköpslista visas här.
      </Text>
    </View>
  );
}
