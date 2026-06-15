import { MaterialIcons } from "@expo/vector-icons";
import { Alert, Text, View } from "react-native";
import React from "react";
import clsx from "clsx";
import Button from "@/lib/components/button/Button";
import { colors } from "@/lib/components/theme/colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import DuaCardModal from "./DuaCardModal";
import { DuaCardProps, DuaFormData, duaSchema } from "../types";
import { useTranslation } from "@/lib/i18n";


export default function DuaCard({ dua, isDark, updateDua, deleteDua, toggleFavorite, isSaving }: DuaCardProps) {
  const [isMore, setIsMore] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(false);
  const { t } = useTranslation();


  const handleToggleFavorite = () => {
    toggleFavorite(dua.id).catch((error) => {
      Alert.alert(t("more.error"), t("duas.updateFavoriteFailed"));
      console.error("Error toggling favorite:", error);
    });
    setIsFavorite(!isFavorite);
  };



  const {
    control,
    handleSubmit,
  } = useForm<DuaFormData>({
    resolver: zodResolver(duaSchema),
    defaultValues: {
      title: dua.title ?? "",
      text: dua.text ?? "",
    },
  });
  return (
    <>
      <View
        className={clsx(
          "flex-col gap-3 rounded-2xl p-5 border",
          isDark
            ? "bg-background-cardDark border-border-dark/50"
            : "bg-background-cardLight border-gray-100"
        )}
      >
        {/* Header */}
        <View className="flex-row justify-between items-start w-full">
          <View>
            <Text className={clsx(
              "text-2xl font-bold",
              isDark ? "text-text-primaryDark" : "text-text-primaryLight"
            )}>{dua.title}</Text>
            <View className="flex-row items-center gap-2">
              <MaterialIcons
                name="calendar-today"
                size={16}
                color={isDark ? colors.text.secondaryDark : colors.text.secondaryLight}
              />
              <Text
                className={clsx(
                  "text-xs font-medium",
                  isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
                )}
              >
                {dua.date}
              </Text>
            </View>
          </View>
          <View className="flex-row">
            <Button
              backgroundColor="transparent"
              size="small"
              className="p-2 -mr-2 rounded-full"
              onPress={() => handleToggleFavorite()}
              leftIcon={dua.isFavorite ? "favorite" : "favorite-border"}
              isIconActive={dua.isFavorite ?? isFavorite}
              disabled={isSaving}
            />
            <Button
              backgroundColor="transparent"
              className="p-2 -mr-2 rounded-full"
              size="small"
              onPress={() => setIsMore(true)}
              leftIcon='more-vert'
            />
          </View>
        </View>

        <Text
          className={clsx(
            "text-base font-normal leading-relaxed",
            isDark ? "text-text-primaryDark" : "text-text-primaryLight",
          )}
          numberOfLines={2}
        >
          {dua.text}
        </Text>
      </View>
      <DuaCardModal
        control={control}
        handleSubmit={handleSubmit}
        dua={dua}
        isMore={isMore}
        updateDua={updateDua}
        deleteDua={deleteDua}
        isSaving={isSaving}
        setIsMore={setIsMore}
      />
    </>
  );
}

