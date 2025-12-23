import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, useColorScheme, View } from "react-native";
import { colors } from "../theme/colors";

export default function ActiveMaghribCard() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <View
      className={
        "relative overflow-hidden b rounded-2xl border-2  shadow-xl " +
        (isDark
          ? "border-primary-500/30 bg-background-cardDark shadow-primary-500/10"
          : "border-primary-500/20 bg-background-cardLight shadow-primary-500/20")
      }
    >
      <View className="absolute left-0 top-0 h-full w-1.5 bg-primary-500" />

      <View className="p-5 mb-6 flex-row items-start justify-between pl-2">
        <View className="flex-row items-center gap-4">
          <View
            className={
              isDark
                ? "size-12 items-center justify-center rounded-xl bg-background-cardDark"
                : "size-12 items-center justify-center rounded-xl bg-primary-500/10"
            }
          >
            <MaterialIcons
              name="wb-twilight"
              size={26}
              color={isDark ? colors.success : colors.primary[500]}
            />
          </View>
          <View>
            <Text
              className={
                "text-lg font-bold " +
                (isDark ? "text-text-primaryDark" : "text-text-primaryLight")
              }
            >
              Maghrib
            </Text>
            <View className="mt-0.5 flex-row items-center gap-1.5">
              <View className="relative h-2 w-2">
                <View className="absolute h-2 w-2 rounded-full bg-primary-500 opacity-75" />
              </View>
              <Text className="text-sm font-medium text-primary-500">
                Şimdi • 18:15
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="flex-row gap-3 pl-2 m-2">
        <Pressable
          onPress={() => console.log("Kıldım")}
          className="flex-[3] flex-row items-center justify-center gap-2 rounded-xl bg-primary-500 py-3.5 px-4 shadow-[0_4px_14px_rgba(31,143,95,0.3)] active:scale-[0.98]"
        >
          <MaterialIcons name="check" size={20} color="#fff" />
          <Text className="text-sm font-bold text-white">Kıldım</Text>
        </Pressable>
        <Pressable
          onPress={() => console.log("Sonra")}
          className={
            isDark
              ? "flex-[2] flex-row items-center justify-center gap-2 rounded-xl border border-border-dark bg-transparent py-3.5 px-4 active:scale-[0.98]"
              : "flex-[2] flex-row items-center justify-center gap-2 rounded-xl border border-border-light bg-transparent py-3.5 px-4 active:scale-[0.98]"
          }
        >
          <MaterialIcons
            name="alarm"
            size={20}
            color={isDark ? "#EAF3F0" : "#6B7F78"}
          />
          <Text
            className={
              "text-sm font-medium " +
              (isDark ? "text-text-primaryDark" : "text-text-secondaryLight")
            }
          >
            Sonra
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
