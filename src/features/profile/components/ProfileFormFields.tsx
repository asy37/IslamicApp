import React, { useState } from "react";
import { Control, FieldErrors } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "@/lib/i18n";
import { useTheme } from "@/lib/storage/useThemeStore";
import FormField from "@/lib/components/form/FormField";
import { ProfileFormData } from "../types";

interface ProfileFormFieldsProps {
  control: Control<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  isBusy: boolean;
  isAnonymous: boolean;
}

export default function ProfileFormFields({
  control,
  errors,
  isBusy,
  isAnonymous,
}: ProfileFormFieldsProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const passwordRightIcon = (
    <TouchableOpacity
      onPress={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2"
    >
      <MaterialIcons
        name={showPassword ? "visibility-off" : "visibility"}
        size={20}
        color={isDark ? "#8FA6A0" : "#6B7F78"}
      />
    </TouchableOpacity>
  );

  return (
    <View className="w-full flex-1">
      <FormField
        label={t("profile.nameLabel")}
        name="name"
        control={control}
        placeholder={t("profile.namePlaceholder")}
        isLoading={isBusy}
        autoCapitalize="words"
      />

      <FormField
        label={t("profile.surnameLabel")}
        name="surname"
        control={control}
        placeholder={t("profile.surnamePlaceholder")}
        isLoading={isBusy}
        autoCapitalize="words"
      />

      <FormField
        label={isAnonymous ? t("profile.emailLabelUpgrade") : t("profile.emailLabel")}
        name="email"
        control={control}
        placeholder={t("auth.emailPlaceholder")}
        error={errors.email?.message ? t(errors.email.message) : undefined}
        isLoading={isBusy}
        keyboardType="email-address"
        autoComplete="email"
        rightIcon={<MaterialIcons name="mail" size={20} color={isDark ? "#8FA6A0" : "#6B7F78"} />}
      />

      <FormField
        label={isAnonymous ? t("profile.passwordLabelUpgrade") : t("profile.passwordLabel")}
        name="password"
        control={control}
        placeholder={t("auth.passwordPlaceholder")}
        error={errors.password?.message ? t(errors.password.message) : undefined}
        isLoading={isBusy}
        autoComplete="password"
        secureTextEntry={!showPassword}
        rightIcon={passwordRightIcon}
      />
    </View>
  );
}
