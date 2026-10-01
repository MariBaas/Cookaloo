import { View, Text, Pressable, TextInput } from "react-native";
import { useState } from "react";

export default function LoginScreen() {
  const [email, setEmail] = useState("");

  return (
    <View className="flex-1 bg-bg items-center justify-center px-6">
      <Text className="font-bricolage text-4xl font-extrabold text-ink tracking-tighter mb-2">
        C<Text className="text-acc">oo</Text>kal<Text className="text-acc">oo</Text>
      </Text>
      <Text className="font-figtree text-muted text-base mb-10">
        Familjens receptsamling
      </Text>

      {/* Google Sign-In */}
      <Pressable className="w-full bg-surface border border-line2 rounded-full py-3.5 px-6 flex-row items-center justify-center mb-3">
        <Text className="font-figtree text-ink font-semibold text-base">
          Logga in med Google
        </Text>
      </Pressable>

      {/* Divider */}
      <View className="flex-row items-center w-full my-4">
        <View className="flex-1 h-px bg-line" />
        <Text className="font-figtree text-muted text-sm mx-4">eller</Text>
        <View className="flex-1 h-px bg-line" />
      </View>

      {/* Magic Link */}
      <TextInput
        className="w-full bg-surface border border-line2 rounded-2xl py-3.5 px-4 font-figtree text-ink text-base mb-3"
        placeholder="din@email.se"
        placeholderTextColor="#B5A899"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Pressable className="w-full bg-acc rounded-full py-3.5 items-center">
        <Text className="font-figtree text-acc-ink font-semibold text-base">
          Skicka magisk länk
        </Text>
      </Pressable>
    </View>
  );
}
