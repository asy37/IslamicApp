import { Pressable, Text, View } from "react-native";
import clsx from "clsx";

export default function PremiumCard({ isDark }: { isDark: boolean }) {
  return (
    <View className="mt-6 mb-8">
      <View
        className="relative overflow-hidden rounded-2xl p-6"
        style={{
          backgroundColor: "#1F8F5F",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        {/* Decorative Circle */}
        <View
          className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white opacity-10"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
          }}
        />
        <View className="relative z-10">
          <Text className="text-lg font-bold text-white mb-1">
            Premium'a Geç
          </Text>
          <Text className="text-white/80 text-sm mb-4 max-w-[80%]">
            Reklamsız deneyim ve özel içerikler için destek olun.
          </Text>
          <Pressable
            className="bg-white px-4 py-2 rounded-lg"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: "#1F8F5F" }}
            >
              Detayları Gör
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

