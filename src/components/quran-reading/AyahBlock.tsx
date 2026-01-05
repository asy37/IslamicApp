import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { Ayah } from "@/types/quran";
import clsx from "clsx";

type AyahBlockProps = Readonly<{
  ayah: Ayah;
  isDark: boolean;
}>;

export default function AyahBlock({ ayah, isDark }: AyahBlockProps) {
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
              ? "bg-background-cardDark text-text-secondaryDark"
              : "bg-primary-400 text-white")
          }
        >
          <Text
            className={clsx(isDark ? colors.background.light : "text-white")}
          >
            {ayah.number}
          </Text>
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
        {ayah.text}
      </Text>
      <Text
        className={
          "text-[17px] leading-relaxed tracking-wide " +
          (isDark ? "text-text-secondaryDark" : "text-text-secondaryLight")
        }
      >
        {ayah.text}
      </Text>
    </View>
  );
}
