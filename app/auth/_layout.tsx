import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, Text, View } from "react-native";
import clsx from "clsx";
import React from "react";
import SelectButton from "@/lib/components/button/SelectButton";
import { useTheme } from "@/lib/storage/useThemeStore";
import { useTranslation } from "@/lib/i18n";

type AuthMode = "login" | "register";

export default function AuthLayout() {
  const [RegisterOrLogin, setRegisterOrLogin] = React.useState<'register' | 'login'>('register');
  const router = useRouter();
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const authButtons: { key: AuthMode; label: string }[] = [
    { key: "login", label: t("auth.loginTab") },
    { key: "register", label: t("auth.registerTab") },
  ];

  const handleAuthChange = (mode: AuthMode) => {
    setRegisterOrLogin(mode);
    router.replace(`/auth/${mode}`);
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-primary-100">
      {/* Headlines */}
      <View className="items-center gap-4 px-4">
        <Text className={clsx("text-[32px] font-bold leading-tight mb-3", isDark ? "text-text-primaryDark" : "text-text-primaryLight")}>
          {t("auth.welcome")}
        </Text>
        <Text className={clsx("text-base font-normal leading-relaxed text-center px-4", isDark ? "text-text-secondaryDark" : "text-text-secondaryLight")}>
          {t("auth.welcomeSubtitle")}
        </Text>
        <SelectButton<AuthMode>
          buttonData={authButtons}
          selectedFilter={RegisterOrLogin}
          onPress={handleAuthChange}
        />
      </View>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="confirmation" />
      </Stack>
    </SafeAreaView>
  );
}

