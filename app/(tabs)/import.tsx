import { View, Text } from "react-native";

export default function ImportScreen() {
  return (
    <View className="flex-1 bg-bg items-center justify-center px-6">
      <Text className="font-newsreader text-2xl text-ink mb-2">
        Importera recept
      </Text>
      <Text className="font-figtree text-muted text-base text-center">
        Lägg till recept via länk, foto, PDF eller text.
      </Text>
    </View>
  );
}
