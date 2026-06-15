import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { colors } from "@/lib/components/theme/colors";
import clsx from "clsx";
import { useAudioStore } from "@/lib/storage/useQuranStore";
import { splitAyahText } from "@/features/quran/quran-text/utils/wordSplitter";
import { useMemo } from "react";
import { useTheme } from "@/lib/storage/useThemeStore";
import { AyahBlockProps } from "../types/types";
import { getSpokenIndexMap } from "../utils/utils";

export default function AyahBlock({
  ayah,
  activeWordIndex = -1,
  onAyahPress,
  onLikePress,
  onSharePress,
  isLiked = false,
}: AyahBlockProps) {
  const { isDark } = useTheme();

  const {
    activeAyahNumber,
    isPlaying,
    setIsPlaying,
    setActiveAyahNumber,
  } = useAudioStore();


  // Ayet metnini kelimelere böl
  const words = useMemo(() => splitAyahText(ayah.text), [ayah.text]);
  const spokenIndexMap = useMemo(() => getSpokenIndexMap(words), [words]);

  const handlePress = (number: number) => {
    if (onAyahPress) {
      onAyahPress(number);
      return;
    }

    // Varsayılan davranış: eğer aynı ayet seçiliyse play/pause toggle
    if (activeAyahNumber === number) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveAyahNumber(number);
      setIsPlaying(true);
    }
  };

  // Sadece bu ayet çalıyorsa pause ikonu göster
  const isCurrentAyahPlaying =
    activeAyahNumber === ayah.number && isPlaying;

  return (
    <View
      className={
        "group relative flex flex-col gap-6 border-b py-8 " +
        (isDark ? "bg-border- border-white" : "border-primary-400")
      }
    >
      <View className="flex flex-row items-center justify-between">
        <View
          className={
            "flex p-2 items-center justify-center rounded-full text-sm font-bold shadow-sm " +
            (isDark
              ? "bg-primary-500/20"
              : "bg-primary-400 text-white")
          }
        >
          <Text
            className={clsx("text-white")}
          >
            {ayah.number}
          </Text>
        </View>

        <View className="flex flex-row gap-1 opacity-80">
          <TouchableOpacity
            onPress={() => {
              handlePress(ayah.number);
            }}
            className="rounded-full p-2 bg-primary-500/20"
          >
            <MaterialIcons
              name={isCurrentAyahPlaying ? "pause" : "play-arrow"}
              size={20}
              color={isDark ? colors.text.primaryDark : colors.text.primaryLight}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onLikePress}
            disabled={!onLikePress}
            className="rounded-full p-2"
          >
            <MaterialIcons
              name={isLiked ? "favorite" : "favorite-border"}
              size={20}
              color={
                isLiked
                  ? "#EF4444"
                  : isDark
                    ? colors.text.primaryDark
                    : colors.text.primaryLight
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSharePress}
            disabled={!onSharePress}
            className="rounded-full p-2"
          >
            <MaterialIcons
              name="share"
              size={20}
              color={
                isDark ? colors.text.primaryDark : colors.text.primaryLight
              }
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Kelime bazlı render - RTL (sağdan sola) */}
      <Text
        className={clsx(
          "text-right text-4xl leading-[42px]",
          isDark ? "text-text-primaryDark" : "text-text-primaryLight"
        )}
        style={{
          textAlign: "right",
          writingDirection: "rtl",
        }}
      >
        {words.map((word, index) => {
          const isActive =
            activeAyahNumber === ayah.number &&
            spokenIndexMap[index] === activeWordIndex;
          return (
            <Text
              key={`${ayah.number}-${index}`}
              className={clsx(isActive && "text-primary-500 font-bold")}
            >
              {word.raw}
              {index < words.length - 1 && " "}
            </Text>
          );
        })}
      </Text>
      {ayah.translationText && (
        <Text
          className={
            "text-[17px] leading-relaxed tracking-wide " +
            (isDark ? "text-text-secondaryDark" : "text-text-secondaryLight")
          }
        >
          {ayah.translationText}
        </Text>
      )}
    </View>
  );
}
