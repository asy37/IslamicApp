import { Stack } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "../global.css";
import "../src/lib/notifications/NotificationService";
import PrayerHeader from "@/components/layout/header";
import { NativeStackNavigationOptions } from "react-native-screens/lib/typescript/native-stack/types";

// Keep splash screen visible while loading fonts
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Fonts are optional - app will work without them
  const [fontsLoaded] = useFonts({
    // Comment out if font files are not available yet
    // 'Amiri-Regular': require('../assets/fonts/Amiri-Regular.ttf'),
    // 'Amiri-Bold': require('../assets/fonts/Amiri-Bold.ttf'),
    // 'ScheherazadeNew-Regular': require('../assets/fonts/ScheherazadeNew-Regular.ttf'),
    // 'ScheherazadeNew-Bold': require('../assets/fonts/ScheherazadeNew-Bold.ttf'),
  });

  useEffect(() => {
    // Hide splash screen immediately if fonts are not used
    // or after fonts are loaded
    if (fontsLoaded !== undefined) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded && fontsLoaded !== undefined) {
    return null;
  }

  return (
    <>
      <PrayerHeader />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

