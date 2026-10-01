import { View, Text, Pressable, TextInput } from "react-native";
import { useState } from "react";

type Step = "household" | "preferences" | "invite";

export default function OnboardingScreen() {
  const [step, setStep] = useState<Step>("household");
  const [householdName, setHouseholdName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [unitSystem, setUnitSystem] = useState<"metric" | "us">("metric");
  const [language, setLanguage] = useState<"sv" | "en">("sv");

  return (
    <View className="flex-1 bg-bg items-center justify-center px-6">
      {step === "household" && (
        <View className="w-full items-center">
          <Text className="font-newsreader text-2xl text-ink mb-6">
            Välkommen till Cookaloo!
          </Text>

          <TextInput
            className="w-full bg-surface border border-line2 rounded-2xl py-3.5 px-4 font-figtree text-ink text-base mb-3"
            placeholder='T.ex. "Familjen Baard"'
            placeholderTextColor="#B5A899"
            value={householdName}
            onChangeText={setHouseholdName}
          />
          <Pressable
            className="w-full bg-acc rounded-full py-3.5 items-center mb-6"
            onPress={() => setStep("preferences")}
          >
            <Text className="font-figtree text-acc-ink font-semibold text-base">
              Skapa hushåll
            </Text>
          </Pressable>

          <View className="flex-row items-center w-full my-2">
            <View className="flex-1 h-px bg-line" />
            <Text className="font-figtree text-muted text-sm mx-4">eller</Text>
            <View className="flex-1 h-px bg-line" />
          </View>

          <TextInput
            className="w-full bg-surface border border-line2 rounded-2xl py-3.5 px-4 font-figtree text-ink text-base mb-3 mt-4"
            placeholder="Ange inbjudningskod"
            placeholderTextColor="#B5A899"
            value={inviteCode}
            onChangeText={setInviteCode}
            autoCapitalize="characters"
          />
          <Pressable
            className="w-full bg-surface border border-acc rounded-full py-3.5 items-center"
            onPress={() => setStep("preferences")}
          >
            <Text className="font-figtree text-acc font-semibold text-base">
              Gå med i hushåll
            </Text>
          </Pressable>
        </View>
      )}

      {step === "preferences" && (
        <View className="w-full items-center">
          <Text className="font-newsreader text-2xl text-ink mb-6">
            Välj dina preferenser
          </Text>

          {/* Unit System */}
          <Text className="font-figtree text-muted text-sm mb-2 self-start">Måttsystem</Text>
          <View className="flex-row w-full mb-6">
            <Pressable
              className={`flex-1 py-3 rounded-l-full items-center border ${
                unitSystem === "metric"
                  ? "bg-acc border-acc"
                  : "bg-surface border-line2"
              }`}
              onPress={() => setUnitSystem("metric")}
            >
              <Text
                className={`font-figtree font-semibold ${
                  unitSystem === "metric" ? "text-acc-ink" : "text-ink"
                }`}
              >
                Metriskt
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 py-3 rounded-r-full items-center border ${
                unitSystem === "us"
                  ? "bg-acc border-acc"
                  : "bg-surface border-line2"
              }`}
              onPress={() => setUnitSystem("us")}
            >
              <Text
                className={`font-figtree font-semibold ${
                  unitSystem === "us" ? "text-acc-ink" : "text-ink"
                }`}
              >
                US
              </Text>
            </Pressable>
          </View>

          {/* Language */}
          <Text className="font-figtree text-muted text-sm mb-2 self-start">Språk</Text>
          <View className="flex-row w-full mb-8">
            <Pressable
              className={`flex-1 py-3 rounded-l-full items-center border ${
                language === "sv"
                  ? "bg-acc border-acc"
                  : "bg-surface border-line2"
              }`}
              onPress={() => setLanguage("sv")}
            >
              <Text
                className={`font-figtree font-semibold ${
                  language === "sv" ? "text-acc-ink" : "text-ink"
                }`}
              >
                Svenska
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 py-3 rounded-r-full items-center border ${
                language === "en"
                  ? "bg-acc border-acc"
                  : "bg-surface border-line2"
              }`}
              onPress={() => setLanguage("en")}
            >
              <Text
                className={`font-figtree font-semibold ${
                  language === "en" ? "text-acc-ink" : "text-ink"
                }`}
              >
                English
              </Text>
            </Pressable>
          </View>

          <Pressable
            className="w-full bg-acc rounded-full py-3.5 items-center"
            onPress={() => setStep("invite")}
          >
            <Text className="font-figtree text-acc-ink font-semibold text-base">
              Fortsätt
            </Text>
          </Pressable>
        </View>
      )}

      {step === "invite" && (
        <View className="w-full items-center">
          <Text className="font-newsreader text-2xl text-ink mb-2">
            Bjud in familjen
          </Text>
          <Text className="font-figtree text-muted text-base mb-8 text-center">
            Dela en inbjudningskod så kan de gå med direkt. Du kan också göra detta senare.
          </Text>

          <Pressable className="w-full bg-surface border border-line2 rounded-full py-3.5 items-center mb-4">
            <Text className="font-figtree text-ink font-semibold text-base">
              Skapa inbjudningskod
            </Text>
          </Pressable>

          <Pressable className="w-full bg-acc rounded-full py-3.5 items-center">
            <Text className="font-figtree text-acc-ink font-semibold text-base">
              Gå till receptsamlingen
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
