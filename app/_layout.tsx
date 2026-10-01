import "../global.css";
import React, { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useAuth } from "@/hooks/useAuth";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Newsreader: require("../assets/fonts/Newsreader-VariableFont.ttf"),
    Figtree: require("../assets/fonts/Figtree-VariableFont.ttf"),
    BricolageGrotesque: require("../assets/fonts/BricolageGrotesque-VariableFont.ttf"),
  });

  const { user, profile, loading, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (!initialized || loading) return;

    const segmentList = segments as string[];
    const inAuthGroup = segmentList[0] === '(auth)';
    const inOnboarding = segmentList.includes('onboarding');

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && !profile?.active_household_id && !inOnboarding) {
      router.replace('/(auth)/onboarding');
    } else if (user && profile?.active_household_id && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, profile, initialized, loading, segments, router]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <StatusBar style="auto" />
      <Slot />
    </>
  );
}
