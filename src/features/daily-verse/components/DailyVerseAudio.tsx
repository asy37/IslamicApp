import { MaterialIcons } from "@expo/vector-icons";
import { Text, View, TouchableOpacity } from "react-native";
import Button from "@/lib/components/button/Button";
import { Ayah } from "@/types/quran";
import { useAudioStore } from "@/lib/storage/useQuranStore";
import { colors } from "@/lib/components/theme/colors";
import { useTranslation } from "@/lib/i18n";

type DailyVerseAudioProps = Readonly<{
  dailyAyah: Ayah;
  handleAyahPress: (ayahNumber: number) => void;
  onSharePress?: () => void;
  onLikePress?: () => void;
  isLiked?: boolean;
}>;

export const DailyVerseAudio = ({
  dailyAyah,
  handleAyahPress,
  onSharePress,
  onLikePress,
  isLiked = false,
}: DailyVerseAudioProps) => {
  const { isPlaying, activeAyahNumber } = useAudioStore();
  const { t } = useTranslation();

  const isCurrentPlaying = activeAyahNumber === dailyAyah.number && isPlaying;

  return (
    <View className="flex-row items-center justify-between px-4">
      <TouchableOpacity onPress={onSharePress} className="items-center gap-1.5 py-2">
        <MaterialIcons name="share" size={24} color={colors.primary[500]} />
        <Text className="text-xs font-semibold text-primary-500">
          {t("quran.share")}
        </Text>
      </TouchableOpacity>

      <Button onPress={() => handleAyahPress(dailyAyah.number)} className="p-5">
        <MaterialIcons
          name={isCurrentPlaying ? "pause" : "play-arrow"}
          size={24}
          color={colors.primary[500]}
        />
      </Button>

      <TouchableOpacity onPress={onLikePress} className="items-center gap-1.5 py-2">
        <MaterialIcons
          name={isLiked ? "favorite" : "favorite-border"}
          size={24}
          color={isLiked ? "#EF4444" : colors.primary[500]}
        />
        <Text className="text-xs font-semibold text-primary-500">
          {isLiked ? t("quran.liked") : t("quran.like")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};