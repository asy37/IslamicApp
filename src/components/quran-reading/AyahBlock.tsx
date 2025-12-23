import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { Ayah } from "@/types/quran";

export default function AyahBlock({
  ayah,
  isDark,
}: {
  ayah: Ayah;
  isDark: boolean;
}) {
  return (
    <View
      className={
        "group relative flex flex-col gap-6 border-b py-8 " +
        (isDark ? "border-border-dark/30" : "border-border-light")
      }
    >
      <View className="flex flex-row items-center justify-between">
        <View
          className={
            "flex size-9 items-center justify-center rounded-xl text-sm font-bold shadow-sm " +
            (isDark
              ? "bg-background-cardDark text-text-secondaryDark"
              : "bg-primary-100 text-text-primaryLight")
          }
        >
          <Text>{ayah.number}</Text>
        </View>

        <View className="flex flex-row gap-1 opacity-80">
          <Pressable className="rounded-full p-2">
            <MaterialIcons
              name="bookmark-border"
              size={20}
              color={
                isDark ? colors.text.primaryDark : colors.text.primaryLight
              }
            />
          </Pressable>
          <Pressable className="rounded-full p-2">
            <MaterialIcons
              name="share"
              size={20}
              color={
                isDark ? colors.text.primaryDark : colors.text.primaryLight
              }
            />
          </Pressable>
        </View>
      </View>

      <Text
        className={
          "text-right text-4xl leading-[42px] " +
          (isDark ? "text-text-primaryDark" : "text-text-primaryLight")
        }
      >
        {ayah.arabic}
      </Text>
      <Text
        className={
          "text-[17px] leading-relaxed tracking-wide " +
          (isDark ? "text-text-secondaryDark" : "text-text-secondaryLight")
        }
      >
        {ayah.translation}
      </Text>
    </View>
  );
}
