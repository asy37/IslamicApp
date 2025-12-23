import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import clsx from "clsx";

export default function DuasHeader({ isDark }: { isDark: boolean }) {
  const router = useRouter();

  return (
    <View
      className={clsx(
        "sticky top-0 z-10 border-b",
        isDark
          ? "bg-background-dark/95 border-border-dark/20"
          : "bg-background-light/95 border-border-light/20"
      )}
    >
      <View className="flex-row items-center justify-between p-4 pb-2">
        <Pressable
          className="flex size-10 items-center justify-center rounded-full"
          onPress={() => router.back()}
          hitSlop={10}
        >
          <MaterialIcons
            name="arrow-back-ios-new"
            size={20}
            color={isDark ? "#EAF3F0" : "#1C2A26"}
          />
        </Pressable>
        <View className="flex-row gap-3">
          <Pressable
            className="flex size-10 items-center justify-center rounded-full"
            hitSlop={10}
          >
            <MaterialIcons
              name="search"
              size={20}
              color={isDark ? "#EAF3F0" : "#1C2A26"}
            />
          </Pressable>
          <Pressable
            className="flex size-10 items-center justify-center rounded-full"
            hitSlop={10}
          >
            <MaterialIcons
              name="settings"
              size={20}
              color={isDark ? "#EAF3F0" : "#1C2A26"}
            />
          </Pressable>
        </View>
      </View>
      <View className="px-4 pb-4 pt-2">
        <Text
          className={clsx(
            "text-3xl font-bold tracking-tight",
            isDark ? "text-text-primaryDark" : "text-text-primaryLight"
          )}
        >
          My Dua Journal
        </Text>
        <Text
          className={clsx(
            "text-sm mt-1",
            isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
          )}
        >
          "Call upon Me, I will answer you." (Quran 40:60)
        </Text>
      </View>
    </View>
  );
}

