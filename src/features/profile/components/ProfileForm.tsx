import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { Alert, ScrollView, Text, View } from "react-native";
import AvatarPicker from "@/lib/components/form/AvatarPicker";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { supabase } from "@/lib/supabase/client";
import {
    useUpgradeAnonymousUser,
    useUploadAvatar,
    useUpdateUserProfile,
    useUserProfile,
} from "@/features/profile/hooks/useUserProfile";
import { getAvatarSignedUrl, getMyProfile } from "@/lib/api/services/profile";
import { queryClient } from "@/lib/query/queryClient";
import { queryKeys } from "@/lib/query/queryKeys";
import { useTranslation } from "@/lib/i18n";

import { ProfileFormData } from "../types";
import {
    profileSchema,
    checkOnline,
    requestPhotoPermission,
    resolveCreatedAt,
} from "../utils";
import ProfileFormFields from "./ProfileFormFields";
import ProfileSubmitButton from "./ProfileSubmitButton";
import { profileRepo } from "@/lib/database/profile/repository";

export default function ProfileForm() {
    const { t } = useTranslation();
    const { user, isLoading: authLoading, isAnonymous } = useAuth();
    const { data: profile, isLoading: profileLoading, error: profileError } = useUserProfile();
    const updateProfileMutation = useUpdateUserProfile();
    const uploadAvatarMutation = useUploadAvatar();
    const upgradeAnonymousMutation = useUpgradeAnonymousUser();

    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const [avatarDirty, setAvatarDirty] = useState(false);
    const [existingAvatarPath, setExistingAvatarPath] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            surname: "",
            email: "",
            password: "",
        },
    });

    const isBusy =
        authLoading ||
        profileLoading ||
        updateProfileMutation.isPending ||
        uploadAvatarMutation.isPending ||
        upgradeAnonymousMutation.isPending;

    const currentEmail = user?.email ?? "";

    useEffect(() => {
        // Initialize form fields when profile/auth is ready
        if (!user || !profile) return;
        reset({
            name: profile.name ?? "",
            surname: profile.surname ?? "",
            email: currentEmail,
            password: "",
        });
    }, [user, profile, reset, currentEmail]);

    useEffect(() => {
        // Load avatar preview from stored path (signed URL)
        const path = profile?.image ?? null;
        setExistingAvatarPath(path);
        setAvatarDirty(false);

        let cancelled = false;
        async function loadAvatar() {
            if (!path) {
                setAvatarUri(null);
                return;
            }
            try {
                const url = await getAvatarSignedUrl(path);
                if (!cancelled) setAvatarUri(url);
            } catch {
                if (!cancelled) setAvatarUri(null);
            }
        }
        loadAvatar();

        return () => {
            cancelled = true;
        };
    }, [profile?.image]);

    const pickImage = async () => {
        const hasPermission = await requestPhotoPermission(
            t("auth.photoPermissionTitle"),
            t("auth.photoPermissionMessage")
        );
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setAvatarUri(result.assets[0].uri);
            setAvatarDirty(true);
        }
    };

    const uploadAvatarIfNeeded = async (): Promise<string | null> => {
        if (!avatarDirty || !avatarUri) return existingAvatarPath;
        const uploaded = await uploadAvatarMutation.mutateAsync(avatarUri);
        return uploaded.path;
    };

    const updateAuthCredentialsIfNeeded = async (email: string, password: string) => {
        if (email && email !== currentEmail) {
            const { error } = await supabase.auth.updateUser({ email });
            if (error) throw new Error(error.message);
        }
        if (password) {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw new Error(error.message);
        }
    };

    const onSubmit = async (data: ProfileFormData) => {
        try {
            if (!user) {
                Alert.alert(t("more.error"), t("profile.sessionNotFound"));
                return;
            }

            const email = (data.email ?? "").trim();
            const password = (data.password ?? "").trim();
            const name = (data.name ?? "").trim();
            const surname = (data.surname ?? "").trim();
            const isOnline = await checkOnline();

            if (isAnonymous) {
                if (!isOnline) {
                    Alert.alert(t("more.error"), t("profile.onlineRequired"));
                    return;
                }
                if (!email) {
                    Alert.alert(t("more.error"), t("profile.emailRequired"));
                    return;
                }
                if (!password) {
                    Alert.alert(t("more.error"), t("profile.passwordRequired"));
                    return;
                }

                const imagePath = await uploadAvatarIfNeeded();
                await upgradeAnonymousMutation.mutateAsync({
                    email,
                    password,
                    name: name || null,
                    surname: surname || null,
                    image: imagePath || null,
                });

                const updatedProfile = await getMyProfile();
                await profileRepo.upsertLocalProfile(user.id, updatedProfile);
                queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });

                Alert.alert(t("common.done"), t("profile.upgradeSuccess"));
                return;
            }

            if (isOnline) {
                try {
                    await updateAuthCredentialsIfNeeded(email, password);
                } catch (e) {
                    Alert.alert(
                        t("more.error"),
                        e instanceof Error ? e.message : t("profile.updateFailed")
                    );
                    return;
                }

                const imagePath = await uploadAvatarIfNeeded();
                await updateProfileMutation.mutateAsync({
                    name: name || null,
                    surname: surname || null,
                    image: imagePath || null,
                });

                Alert.alert(t("common.done"), t("profile.updateSuccess"));
            } else {
                const now = Date.now();
                const createdAt = resolveCreatedAt(profile?.created_at, now);
                const mergedProfile = {
                    id: user.id,
                    name: name || null,
                    surname: surname || null,
                    image: profile?.image ?? null,
                    is_anonymous: profile?.is_anonymous ?? false,
                    created_at: createdAt,
                    updated_at: new Date(now).toISOString(),
                };
                await profileRepo.upsertLocalProfile(user.id, mergedProfile);
                await profileRepo.addToProfileSyncQueue(user.id, {
                    name: name || null,
                    surname: surname || null,
                    image: profile?.image ?? null,
                });
                queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
                Alert.alert(t("common.done"), t("profile.offlineSaved"));
            }
        } catch (e) {
            Alert.alert(t("more.error"), e instanceof Error ? e.message : t("profile.updateFailed"));
        }
    };

    const submitLabel = useMemo(() => {
        if (isBusy) return t("profile.saving");
        return isAnonymous ? t("profile.upgradeButton") : t("profile.saveButton");
    }, [isBusy, isAnonymous, t]);

    return (
        <ScrollView className="flex-1 px-6 w-full" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
            <View className="px-6 pt-4 w-full">
                <AvatarPicker avatar={avatarUri} onPickImage={pickImage} />

                <View className="w-full flex-1 ">
                    <ProfileFormFields
                        control={control}
                        errors={errors}
                        isBusy={isBusy}
                        isAnonymous={isAnonymous}
                    />

                    <ProfileSubmitButton
                        onPress={handleSubmit(onSubmit)}
                        disabled={isBusy}
                        label={submitLabel}
                    />

                    {!!profileError && (
                        <Text className="text-red-500 text-sm mt-3">
                            {t("profile.loadFailed")}
                        </Text>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}
