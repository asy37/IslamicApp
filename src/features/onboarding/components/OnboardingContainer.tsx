import React from "react";
import { View } from "react-native";
import clsx from "clsx";
import { useTheme } from "@/lib/storage/useThemeStore";
import { OnboardingBackButton } from "./OnboardingBackButton";

interface OnboardingContainerProps {
  children: React.ReactNode;
  showBackButton?: boolean;
}

export const OnboardingContainer = ({
  children,
  showBackButton = false,
}: OnboardingContainerProps) => {
  const { isDark } = useTheme();

  return (
    <View
      className={clsx(
        "flex-1 pt-12 px-8",
        isDark ? "bg-background-dark" : "bg-background-light"
      )}
    >
      {showBackButton && <OnboardingBackButton />}
      {children}
    </View>
  );
};
