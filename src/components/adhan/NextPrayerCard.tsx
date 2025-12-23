import { MaterialIcons } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";
import { PRAYER_SCHEDULE } from "../../../app/(tabs)/adhan";
import clsx from "clsx";

export default function NextPrayerCard({ isDark }: { isDark: boolean }) {
  const nextPrayer = PRAYER_SCHEDULE.find((p) => p.status === "active");
  const timeRemaining = "-00:45:12";

  return (
    <View className={clsx("px-4 mb-8")}>
      <View
        className={clsx(
          "relative w-full rounded-2xl overflow-hidden shadow-lg min-h-[220px]",
          isDark ? "bg-primary-800" : "bg-primary-500"
        )}
      >
        {/* Background Image */}
        <Image
          source={{
            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDix2vXEtoRnIMYBqHq9EI2ldX55lqoo5hA6Z8AIP6JNfspDLcsyKV5qr_civX0SQPd6xx9QtwSdz0ObayRNGFeSNCvUvaD0PxOXxRNAPO0u8xSMEv_qDCyDhDK1rLOI7qMBwiQ9fOFW0o7VfVtu5xvJ6ePbjbcvcricK_aGa5VCqd2hq5xvRTXr-WYZmVjyD7GQ5D3BxASJ1ps_-ootY4sohDdzE-E_hqCjvSS3yFR1ANem622gsXI98ZnTe0229OOzQ1-4eVymHok",
          }}
          className="absolute inset-0"
          resizeMode="cover"
        />
        {/* Gradient Overlay */}
        <View
          className="absolute inset-0"
          style={{
            backgroundColor: isDark
              ? "rgba(15, 31, 26, 0.9)"
              : "rgba(31, 143, 95, 0.9)",
          }}
        />
        {/* Content */}
        <View className="relative p-6 flex-col items-center justify-center min-h-[220px]">
          <View
            className="flex-row items-center gap-2 mb-2 px-3 py-1 rounded-full border"
            style={{
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(255, 255, 255, 0.2)",
              borderColor: isDark
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(255, 255, 255, 0.2)",
            }}
          >
            <MaterialIcons name="schedule" size={14} color="#FFFFFF" />
            <Text className="text-white text-xs font-medium tracking-wider uppercase">
              Next Prayer
            </Text>
          </View>
          <Text className="text-white text-4xl font-bold mt-2 mb-1 tracking-tight">
            {nextPrayer?.name}
          </Text>
          <Text className="text-white/90 text-lg mb-6 font-light">
            {nextPrayer?.time}
          </Text>
          <View className="flex-col items-center">
            <Text className="text-white/80 text-xs uppercase tracking-widest mb-1">
              Time Remaining
            </Text>
            <Text
              className="text-5xl font-bold text-white tracking-tighter"
              style={{
                textShadowColor: isDark
                  ? "rgba(76, 175, 122, 0.3)"
                  : "rgba(31, 143, 95, 0.4)",
                textShadowOffset: { width: 0, height: 4 },
                textShadowRadius: 20,
              }}
            >
              {timeRemaining}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
