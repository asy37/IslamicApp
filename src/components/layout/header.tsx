import { MaterialIcons } from "@expo/vector-icons";
import {
  Image,
  Modal,
  Pressable,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { usePrayerStreak } from "@/lib/hooks/usePrayerTracking";
import StreakCounter from "../tracking/StreakCounter";
import { useState } from "react";

export default function PrayerHeader() {
  const [isStreakModalVisible, setIsStreakModalVisible] = useState(false);
  const AVATAR_URL = "https://github.com/shadcn.png";
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { data: streakData } = usePrayerStreak();

  return (
    <SafeAreaView
      edges={["top"]}
      className={isDark ? "bg-background-dark" : "bg-background-light"}
    >
      <View
        className={
          "border-b px-4 py-2 " +
          (isDark
            ? "border-border-dark bg-background-dark/95"
            : "border-border-light bg-background-light/95")
        }
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Image
              source={{ uri: AVATAR_URL }}
              className="size-10 rounded-full bg-center bg-cover ring-2 ring-primary-500/20"
            />
            <View>
              <Text
                className={
                  "text-base font-bold " +
                  (isDark ? "text-text-primaryDark" : "text-text-primaryLight")
                }
              >
                Selam, Ahmet
              </Text>
              <Text
                className={
                  "text-xs " +
                  (isDark
                    ? "text-text-secondaryDark"
                    : "text-text-secondaryLight")
                }
              >
                14 Ramazan 1445
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => setIsStreakModalVisible(true)}
            className={
              "flex-row items-center gap-2 rounded-full border px-3 py-1.5 shadow-sm " +
              (isDark
                ? "border-border-dark bg-background-cardDark"
                : "border-border-light bg-background-cardLight")
            }
          >
            <MaterialIcons
              name="local-fire-department"
              size={18}
              color={isDark ? colors.success : colors.primary[500]}
            />
            <Text className="text-sm font-semibold text-success">
              {streakData?.count ?? 0} Gün
            </Text>
          </Pressable>
          <Modal
            visible={isStreakModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setIsStreakModalVisible(false)}
          >
            <Pressable
              className="flex-1 items-center justify-center bg-black/40"
              onPress={() => setIsStreakModalVisible(false)}
            >
              <Pressable
                onPress={() => {}}
                className={
                  "w-[90%] max-w-sm rounded-2xl p-4 shadow-lg " +
                  (isDark
                    ? "bg-background-cardDark"
                    : "bg-background-cardLight")
                }
              >
                {streakData && <StreakCounter streak={streakData} />}
              </Pressable>
            </Pressable>
          </Modal>
        </View>
      </View>
    </SafeAreaView>
  );
}
