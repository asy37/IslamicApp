import { Alert, Text, View } from "react-native";
import ModalComponent from "@/lib/components/modal/ModalComponent";
import Button from "@/lib/components/button/Button";
import DuaForm from "./DuaForm";
import React from "react";
import clsx from "clsx";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "@/lib/storage/useThemeStore";
import { useTranslation } from "@/lib/i18n";
import { DuaCardModalProps, DuaFormData } from "../types";

export default function DuaCardModal({ control, handleSubmit, dua, isMore, updateDua, deleteDua, isSaving, setIsMore }: DuaCardModalProps) {
    const { isDark } = useTheme();
    const [isEdit, setIsEdit] = React.useState(false);
    const { t } = useTranslation();

    const handleEditDua = () => {
        setIsEdit(!isEdit);
    };

    const handleSaveEdit = async (data: DuaFormData) => {
        try {
            await updateDua(dua.id, {
                title: data.title.trim(),
                text: data.text.trim(),
            });
            setIsEdit(false);
            setIsMore(false);
            Alert.alert(t("common.success"), t("duas.updateSuccess"));
        } catch (error) {
            Alert.alert(t("more.error"), t("duas.updateFailed"));
            console.error("Error updating dua:", error);
        }
    };

    const handleDeleteDua = () => {
        Alert.alert(
            t("duas.deleteTitle"),
            t("duas.deleteMessage"),
            [
                { text: t("common.cancel"), style: "cancel" },
                {
                    text: t("common.delete"),
                    style: "destructive",
                    onPress: () => {
                        deleteDua(dua.id)
                            .then(() => {
                                setIsMore(false);
                                Alert.alert(t("common.success"), t("duas.deleteSuccess"));
                            })
                            .catch((error) => {
                                Alert.alert(t("more.error"), t("duas.deleteFailed"));
                                console.error("Error deleting dua:", error);
                            });
                    },
                },
            ]
        );
    };

    const handleCopyDua = async () => {
        await Clipboard.setStringAsync(dua.text);
        Alert.alert(t("duas.copiedTitle"), t("duas.copiedMessage"));
    };

    return (
        <ModalComponent
            visible={isMore}
            onClose={() => {
                setIsMore(false);
                setIsEdit(false);
            }}
            title={isEdit ? t("duas.editDuaTitle") : dua.title}
            isLoading={isSaving}
            scrollable={true}
        >
            {isEdit ? (
                <>
                    <DuaForm control={control} />
                    <View className="flex-row gap-2">
                        <Button
                            backgroundColor="transparent"
                            size="small"
                            onPress={() => {
                                setIsEdit(false);
                                control._reset();
                            }}
                            leftIcon="close"
                            text={t("common.cancel")}
                        />
                        <Button
                            backgroundColor="primary"
                            size="small"
                            onPress={handleSubmit(handleSaveEdit)}
                            leftIcon="check"
                            text={t("common.save")}
                            disabled={isSaving}
                        />
                    </View>
                </>
            ) : (
                <>
                    <View className="w-full mb-4">
                        <Text
                            className={clsx(
                                "text-base font-normal leading-relaxed mb-4",
                                isDark ? "text-text-primaryDark" : "text-text-primaryLight"
                            )}
                        >
                            {dua.text}
                        </Text>
                    </View>
                    <View className="flex-row gap-2">
                        <Button
                            backgroundColor="transparent"
                            size="small"
                            onPress={handleCopyDua}
                            leftIcon="content-copy"
                            text={t("common.copy")}
                        />
                        <Button
                            backgroundColor="transparent"
                            size="small"
                            onPress={handleEditDua}
                            leftIcon="edit"
                            text={t("common.edit")}
                        />
                        <Button
                            backgroundColor="transparent"
                            size="small"
                            onPress={handleDeleteDua}
                            leftIcon="delete"
                            text={t("common.delete")}
                        />
                    </View>
                </>
            )}
        </ModalComponent>
    );
}