import "@/lib/utils/debugLogInit";
import "../global.css";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";

import * as SplashScreen from "expo-splash-screen";
import { QueryClientProvider } from "@tanstack/react-query";
import { initI18n } from "@/lib/i18n";
import PrayerHeader from "@/lib/components/layout/header";
import { queryClient } from "@/lib/query/queryClient";
import { setupQueryManagers } from "@/lib/query/setup";
import { useAuthFlow } from "@/features/auth/hooks/useAuth";
import EmailConfirmationProvider from "@/features/auth/components/email/EmailConfirmationProvider";
import LocationPermissionProvider from "@/lib/components/location/LocationPermissionProvider";
import { useThemeStore } from "@/lib/storage/useThemeStore";
import { usePrayerTimesRefreshOnReconnect } from "@/features/adhan/hooks/usePrayerTimesRefreshOnReconnect";
import { useDhikrSync } from "@/features/dhikir/hooks/useDhikrSync";
import { useDuaSync } from "@/features/my-duas/hooks/useDuaSync";
import { useProfileSync } from "@/features/profile/hooks/useProfileSync";
import { useNotificationSetup } from "@/lib/components/layout/hooks/useNotificationSetup";
import { usePrayerTimesPrefetch } from "@/lib/components/layout/hooks/usePrayerTimesPrefetch";
import { useStalePrayerTimesModal } from "@/lib/components/layout/hooks/useStalePrayerTimesModal";
import { useTranslationInit } from "@/lib/components/layout/hooks/useTranslationInit";
import { useNotificationRefreshOnResume } from "@/lib/components/layout/hooks/useNotificationRefreshOnResume";
import { DebugErrorBoundary } from "@/lib/components/DebugErrorBoundary";
import StalePrayerTimesModal from "@/features/adhan/components/StalePrayerTimesModal";
import { QuranAudioProvider } from "@/lib/components/audio-player/contexts/QuranAudioContext";
import { storage } from "@/lib/storage/mmkv";
import { getDb } from "@/lib/database/db";

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
    const run = async () => {
      // 3 saniyelik bir timeout ekliyoruz. Eğer DB kilitlenirse sonsuza kadar beklemesin.
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("DB Timeout")), 3000)
      );

      try {
        await Promise.race([getDb(), timeoutPromise]);
      } catch (err) {
        console.error("DB Init error or timeout in _layout:", err);
      }
      setDbReady(true);

      // DB hazır olduğunda daily reset kontrolü yap (UI'dan bağımsız)
      try {
        const { dailyResetService } = await import('@/lib/services/dailyReset');
        const { usePrayerTimesStore } = await import('@/lib/storage/prayerTimesStore');
        const todayData = usePrayerTimesStore.getState().getTodayData();
        const prayerTimesResponse = todayData
          ? ({ data: todayData } as any)
          : undefined;
        await dailyResetService.initialize(prayerTimesResponse);
      } catch (err) {
        console.warn('[Layout] Daily reset check failed:', err);
      }
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
  useNotificationRefreshOnResume();
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
