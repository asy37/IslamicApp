import { KeyboardAvoidingView, Platform, Text, TextInput, View, Alert, ActivityIndicator } from "react-native";
import ModalComponent from "@/lib/components/modal/ModalComponent";
import clsx from "clsx";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Dhikr, DhikrAddProps } from "@/features/dhikir/types";
import Button from "@/lib/components/button/Button";
import { generateSlug, generateUUID, validate } from "@/features/dhikir/utils/utils";
import { useTheme } from "@/lib/storage/useThemeStore";
import { colors } from "@/lib/components/theme/colors";
import { useTranslation } from "@/lib/i18n";
import { dhikrRepo } from "@/lib/database/dhikr/repository";

export default function DhikrAdd({ openAddDhikrModal, setOpenAddDhikrModal, onDhikrAdded }: DhikrAddProps) {
    const { isDark } = useTheme();
    const { user } = useAuth();
    const { t } = useTranslation();
    const userId = user?.id || null;

    const [label, setLabel] = useState("");
    const [targetCount, setTargetCount] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ label?: string; targetCount?: string }>({});



    const handleSubmit = async () => {
        if (!validate(label, targetCount, setErrors)) {
            return;
        }

        if (!userId) {
            Alert.alert(t("more.error"), t("dhikr.loginRequired"));
            return;
        }

        setIsSubmitting(true);

        try {
            // Generate UUID and slug
            const id = generateUUID();
            const slug = generateSlug(label.trim());

            // Check if slug already exists for this user
            const existing = await dhikrRepo.getDhikrBySlug(userId, slug);
            if (existing) {
                Alert.alert(t("more.error"), t("dhikr.alreadyExists"));
                setIsSubmitting(false);
                return;
            }

            // Create new dhikr
            const target = Number.parseInt(targetCount.trim(), 10);
            const now = Date.now();
            const newDhikr: Dhikr = {
                id,
                slug,
                label: label.trim(),
                target_count: target,
                current_count: 0,
                status: 'active',
                started_at: now,
                completed_at: null,
            };

            // Save to SQLite
            await dhikrRepo.upsertDhikr({
                ...newDhikr,
                user_id: userId,
                is_dirty: true,
                last_synced_at: null,
                updated_at: now,
            });

            // Notify parent
            if (onDhikrAdded) {
                onDhikrAdded(newDhikr);
            }

            // Reset form and close modal
            setLabel("");
            setTargetCount("");
            setErrors({});
            setOpenAddDhikrModal(false);
        } catch (error) {
            console.error('[DhikrAdd] Error creating dhikr:', error);
            Alert.alert(t("more.error"), t("dhikr.createFailed"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (isSubmitting) return;
        setLabel("");
        setTargetCount("");
        setErrors({});
        setOpenAddDhikrModal(false);
    };

    return (
        <ModalComponent visible={openAddDhikrModal} onClose={handleClose} title={t("dhikr.addDhikr")} scrollable={true}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className={clsx(
                    "flex-1 w-full gap-4",
                    isDark ? "bg-background-dark" : "bg-background-light"
                )}
            >
                <View className="gap-4">
                    <View>
                        <Text className={clsx(
                            "text-sm font-medium mb-2",
                            isDark ? "text-text-primaryDark" : "text-text-primaryLight"
                        )}>
                            {t("dhikr.dhikrName")}
                        </Text>
                        <TextInput
                            value={label}
                            onChangeText={(text) => {
                                setLabel(text);
                                if (errors.label) {
                                    setErrors(prev => ({ ...prev, label: undefined }));
                                }
                            }}
                            autoCapitalize="words"
                            keyboardType="default"
                            inputMode="text"
                            editable={!isSubmitting}
                            className={clsx(
                                "w-full h-14 rounded-xl border px-4 text-base",
                                errors.label ? "border-error" : "",
                                isDark ? "bg-background-cardDark border-border-dark text-text-primaryDark" : "bg-white border-gray-200 text-text-primaryLight"
                            )}
                            placeholder={t("dhikr.dhikrNamePlaceholder")}
                            placeholderTextColor={isDark ? colors.text.secondaryDark : colors.text.secondaryLight}
                        />
                        {errors.label && (
                            <Text className="text-error text-xs mt-1 ml-1">{errors.label ? t(errors.label) : ""}</Text>
                        )}
                    </View>

                    <View>
                        <Text className={clsx(
                            "text-sm font-medium mb-2",
                            isDark ? "text-text-primaryDark" : "text-text-primaryLight"
                        )}>
                            {t("dhikr.targetCount")}
                        </Text>
                        <TextInput
                            value={targetCount}
                            onChangeText={(text) => {
                                // Only allow numbers
                                const numericText = text.replaceAll(/\D/g, '');
                                setTargetCount(numericText);
                                if (errors.targetCount) {
                                    setErrors(prev => ({ ...prev, targetCount: undefined }));
                                }
                            }}
                            inputMode="numeric"
                            autoCapitalize="none"
                            keyboardType="numeric"
                            editable={!isSubmitting}
                            className={clsx(
                                "w-full h-14 rounded-xl border px-4 text-base",
                                errors.targetCount ? "border-error" : "",
                                isDark ? "bg-background-cardDark border-border-dark text-text-primaryDark" : "bg-white border-gray-200 text-text-primaryLight"
                            )}
                            placeholder={t("dhikr.targetCountPlaceholder")}
                            placeholderTextColor={isDark ? colors.text.secondaryDark : colors.text.secondaryLight}
                        />
                        {errors.targetCount && (
                            <Text className="text-error text-xs mt-1 ml-1">{errors.targetCount ? t(errors.targetCount) : ""}</Text>
                        )}
                    </View>

                    <View className="mt-4">
                        <Button
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                            size="large"
                            backgroundColor="primary"
                        >
                            {isSubmitting ? (
                                <View className="flex-row items-center gap-2">
                                    <ActivityIndicator size="small" color="white" />
                                    <Text className="text-white font-semibold">{t("dhikr.creating")}</Text>
                                </View>
                            ) : (
                                <Text className="text-white font-semibold">{t("dhikr.createButton")}</Text>
                            )}
                        </Button>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ModalComponent>
    );
}
