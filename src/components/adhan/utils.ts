// Tailwind color constants from tailwind.config.js

import { colors } from "../theme/colors";


export const getIconColor = (isActive: boolean, isDark: boolean) => {
  if (isActive) return colors.primary[500];
  return isDark ? colors.text.secondaryDark : colors.text.secondaryLight;
};

export const getBackgroundColor = (isActive: boolean,isPast: boolean, isDark: boolean) => {
  if (isPast && !isActive) {
    return isDark ? "bg-background-cardDark" : "bg-background-cardLight/50";  }
  // Non-active prayers use standard card background
  return isDark ? "bg-background-cardDark" : "bg-background-cardLight";
};

export const getIconBackgroundColor = (isActive: boolean, isDark: boolean) => {
  if (isActive) {
    return isDark
      ? `rgba(31, 143, 95, 0.2)` // primary-500 with 0.2 opacity
      : `rgba(31, 143, 95, 0.1)`; // primary-500 with 0.1 opacity
  }
  return isDark
    ? "rgba(255, 255, 255, 0.1)" // white with 0.1 opacity
    : "rgba(255, 255, 255, 0.6)"; // white with 0.6 opacity
};

export const getBorderColor = (isActive: boolean, isDark: boolean) => {
  if (!isActive) return "border-transparent";
  return isDark
    ? "border-primary-500/30" // primary-500 with 0.3 opacity
    : "border-primary-200/50"; // primary-200 with 0.5 opacity (closest to #A7D7B5)
};

export const getNameTextColor = (isActive: boolean, isDark: boolean) => {
  if (isActive) return "text-primary-500 font-bold";
  return isDark ? "text-text-primaryDark" : "text-text-primaryLight";
};

export const getMeaningTextColor = (isActive: boolean, isDark: boolean) => {
  if (isActive) {
    return "text-primary-500/70";
  }
  return isDark ? "text-text-secondaryDark" : "text-text-secondaryLight";
};

export const getTimeTextColor = (
  isActive: boolean,
  isPast: boolean,
  isDark: boolean
) => {
  if (isActive) return "text-lg font-bold text-primary-500";
  if (isPast) {
    return isDark
      ? "text-text-secondaryDark opacity-70"
      : "text-text-secondaryLight opacity-70";
  }
  return isDark ? "text-text-primaryDark" : "text-text-primaryLight";
};

export const getNotificationBadgeBg = (isDark: boolean) => {
  return isDark
    ? "rgba(255, 255, 255, 0.1)" // white with 0.1 opacity
    : "rgba(255, 255, 255, 0.6)"; // white with 0.6 opacity
};

export const getActiveBorderColor = () => {
  return colors.primary[500]; // primary-500 for active prayer left border
};

export const getNotificationIconColor = () => {
  return colors.primary[500]; // primary-500 for notification icon
};
