import "@/lib/utils/debugLogInit";
import "../global.css";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";

import * as SplashScreen from "expo-splash-screen";
import { QueryClientProvider } from "@tanstack/react-query";
import { initI18n } from "@/i18n";
import PrayerHeader from "@/components/layout/header";
import { queryClient } from "@/lib/query/queryClient";
import { setupQueryManagers } from "@/lib/query/setup";
import { useAuthFlow } from "@/lib/hooks/auth/useAuth";
import EmailConfirmationProvider from "@/components/auth/email/EmailConfirmationProvider";
import LocationPermissionProvider from "@/components/location/LocationPermissionProvider";
import { useThemeStore } from "@/lib/storage/useThemeStore";
import { getDb } from "@/lib/database/sqlite/db";
import { usePrayerTimesRefreshOnReconnect } from "@/lib/hooks/adhan/usePrayerTimesRefreshOnReconnect";
import { useDhikrSync } from "@/lib/hooks/dhikir/useDhikrSync";
import { useDuaSync } from "@/lib/hooks/duas/useDuaSync";
import { useProfileSync } from "@/lib/hooks/profile/useProfileSync";
import { useNotificationSetup } from "@/lib/hooks/layout/useNotificationSetup";
import { usePrayerTimesPrefetch } from "@/lib/hooks/layout/usePrayerTimesPrefetch";
import { useStalePrayerTimesModal } from "@/lib/hooks/layout/useStalePrayerTimesModal";
import { useTranslationInit } from "@/lib/hooks/layout/useTranslationInit";
import { DebugErrorBoundary } from "@/components/DebugErrorBoundary";
import StalePrayerTimesModal from "@/components/adhan/StalePrayerTimesModal";
import { QuranAudioProvider } from "@/contexts/QuranAudioContext";
import { storage } from "@/lib/storage/mmkv";

const ONBOARDING_COMPLETED_KEY = "onboarding_completed";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { shouldShowRegister, canAccessApp, isLoading } = useAuthFlow();
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const [i18nReady, setI18nReady] = useState(false);
  const [dbReady, setDbReady] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    initI18n().then(() => setI18nReady(true)).catch(() => setI18nReady(true));
    
    // Check onboarding status
    storage.getString(ONBOARDING_COMPLETED_KEY).then((val) => {
      setOnboardingCompleted(val === "true");
    });
  }, []);

  const appReady = !isLoading && i18nReady && dbReady && onboardingCompleted !== null;

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    useThemeStore.getState().applyTheme();
  }, []);

  useEffect(() => {
    const run = () => {
      // 3 saniyelik bir timeout ekliyoruz. Eğer DB kilitlenirse sonsuza kadar beklemesin.
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("DB Timeout")), 3000)
      );
      
      Promise.race([getDb(), timeoutPromise])
        .then(() => setDbReady(true))
        .catch((err) => {
          console.error("DB Init error or timeout in _layout:", err);
          setDbReady(true); // Veritabanı başlatılamasa bile uygulamanın açılmasını sağla
        });
    };
    // Production APK ilk açılışta requestIdleCallback bazen gecikiyor; doğrudan setTimeout kullan.
    const timeoutId = setTimeout(run, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    setupQueryManagers();
  }, []);

  // appReady olunca YALNIZCA BİR KERE çalışır, ilk yönlendirmeyi yapar ve splash'ı kapatır.
  useEffect(() => {
    if (!appReady) return;

    // İlk yönlendirmeyi yapıyoruz
    if (!onboardingCompleted) {
      router.replace("/onboarding");
    } else if (shouldShowRegister) {
      router.replace("/auth/register");
    } else if (canAccessApp) {
      router.replace("/(tabs)");
    }

    // Yönlendirme tetiklendikten sonra kısa gecikmeyle splash kapat
    const timer = setTimeout(() => {
      SplashScreen.hideAsync().finally(() => setIsNavigationReady(true));
    }, 50);

    return () => clearTimeout(timer);
  }, [appReady]); // Sadece appReady bağımlılığı var, race condition olmaz.

  // Runtime'da auth durumu veya segment değişirse yönlendirmeleri yönet (örneğin logout olunca)
  useEffect(() => {
    if (!isNavigationReady) return; // Sadece uygulama tam açıldıktan sonra
    
    const inOnboarding = segments[0] === "onboarding";
    if (!onboardingCompleted) {
      if (!inOnboarding) router.replace("/onboarding");
      return;
    }
    
    const inAuth = segments[0] === "auth";
    const inTabs = segments[0] === "(tabs)";
    
    if (inOnboarding) return;
    
    if (shouldShowRegister && !inAuth) {
      router.replace("/auth/register");
    } else if (canAccessApp && !inTabs && !inAuth) {
      router.replace("/(tabs)");
    }
  }, [shouldShowRegister, canAccessApp, segments, isNavigationReady, onboardingCompleted, router]);

  useNotificationSetup(router);
  usePrayerTimesPrefetch(dbReady);
  useTranslationInit(dbReady);

  const [showStaleModal, closeStaleModal] = useStalePrayerTimesModal(
    canAccessApp,
    segments,
    isNavigationReady
  );

  return (
    <DebugErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <QuranAudioProvider>
          <EmailConfirmationProvider />
          <LocationPermissionProvider />
          <DhikrSyncProvider />
          <DuaSyncProvider />
          {segments[0] !== "onboarding" && segments[0] !== "auth" && <PrayerHeader />}
          <StalePrayerTimesModal
            visible={showStaleModal}
            onClose={closeStaleModal}
          />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="auth" />
          </Stack>
        </QuranAudioProvider>
      </QueryClientProvider>
    </DebugErrorBoundary>
  );
}

function DhikrSyncProvider() {
  useDhikrSync();
  usePrayerTimesRefreshOnReconnect();
  return null;
}

function DuaSyncProvider() {
  useDuaSync();
  useProfileSync();
  return null;
}
