import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";
import { Pressable, Text, View } from "react-native";

type PageIndicatorProps = Readonly<{
  goPrev: () => void;
  goNext: () => void;
  isDark: boolean;
  numberOfSurah: number;
}>;
export default function PageIndicator({
  goPrev,
  goNext,
  isDark,
  numberOfSurah,
}: PageIndicatorProps) {
  return (
    <View className="py-10 flex flex-row items-center justify-between">
      <Pressable
        disabled={numberOfSurah === 114}
        className={clsx(
          "w-10 h-10  rounded-full p-2",
          isDark ? "bg-white text-primary-500" : "bg-primary-500 text-white",
          numberOfSurah === 114 ? "opacity-50 cursor-not-allowed" : ""
        )}
        onPress={() => goNext()}
      >
        <MaterialIcons name="arrow-back" size={24} color="white" />
      </Pressable>
      <Text
        className={
          "text-center text-sm font-medium tracking-[0.2em] uppercase " +
          (isDark
            ? "text-text-secondaryDark/40"
            : "text-text-secondaryLight/60")
        }
      >
        {/* Page {page} / 604 */}
      </Text>
      <Pressable
        disabled={numberOfSurah === 1}
        className={clsx(
          "w-10 h-10  rounded-full p-2",
          isDark ? "bg-white text-primary-500" : "bg-primary-500 text-white",
          numberOfSurah === 1 ? "opacity-50 cursor-not-allowed" : ""
        )}
        onPress={() => goPrev()}
      >
        <MaterialIcons name="arrow-forward" size={24} color="white" />
      </Pressable>
    </View>
  );
}
