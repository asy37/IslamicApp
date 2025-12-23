import { MaterialIcons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import clsx from "clsx";

export default function DailyVerseCard({ isDark }: { isDark: boolean }) {
  const verse = {
    arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    surah: "Surah Al-Fatiha",
    ayah: "1:1",
  };

  return (
    <View className="flex-1 flex-col justify-center px-5 py-4 mb-8">
      <View
        className={clsx(
          "group relative flex-col items-center rounded-3xl overflow-hidden",
          isDark ? "bg-background-cardDark" : "bg-background-cardLight"
        )}
        style={{
          shadowColor: "#1E2D24",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.08,
          shadowRadius: 30,
          elevation: 8,
        }}
      >
        {/* Background Image */}
        <View className="w-full h-32 relative">
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6quXSu1AzEcbqXnkXDTiNfbH4NcJ_iP9TRNIrO1s0F4TOoGd2h0MkrwwZn70DFQ0DbAZKmj1wJsaTo9bW7DS04sI1BANWZN-8BJyEAWXHLzDRtiLmCxmKG0P8NNBd2D6IcjJ8_spcinSS7ejqsruFOTf94spxmko2qcdhJKTKZ4lLRQ_kMCfloozHu_9-9RYxmDyZUH4u7z4F2qdGcbgIqDoG0codKnDWc9QLTQ1y5DFLy0eCgIH3GNvh4m1HM3aMJmaGaQQJnMdk",
            }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
          {/* Gradient Overlay */}
          <View
            className="absolute inset-0"
            style={{
              backgroundColor: isDark
                ? "rgba(15, 31, 26, 0.8)"
                : "rgba(31, 143, 95, 0.1)",
            }}
          />
          <View
            className="absolute inset-0"
            style={{
              backgroundColor: isDark
                ? "transparent"
                : "rgba(255, 255, 255, 0.9)",
            }}
          />
        </View>

        {/* Content */}
        <View className="px-6 pb-8 -mt-8 relative z-10 w-full flex-col items-center text-center">
          {/* Bismillah Label */}
          <Text
            className={clsx(
              "text-xs font-medium uppercase tracking-widest mb-6 opacity-90",
              isDark ? "text-primary-500" : "text-primary-500"
            )}
          >
            Bismillah
          </Text>

          {/* Arabic Text */}
          <View className="w-full mb-6">
            <Text
              className={clsx(
                "text-3xl md:text-4xl font-bold leading-loose py-2 text-right",
                isDark ? "text-text-primaryDark" : "text-text-primaryLight"
              )}
              style={{ lineHeight: 60 }}
            >
              {verse.arabic}
            </Text>
          </View>

          {/* Translation */}
          <View className="mb-8 max-w-[90%]">
            <Text
              className={clsx(
                "text-lg font-normal leading-relaxed",
                isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
              )}
            >
              "{verse.translation}"
            </Text>
          </View>

          {/* Surah Info */}
          <View
            className={clsx(
              "inline-flex items-center justify-center px-5 py-1.5 rounded-full mb-8 border",
              isDark
                ? "bg-primary-500/20 border-primary-500/10"
                : "bg-primary-50 border-primary-500/10"
            )}
          >
            <Text
              className={clsx(
                "text-sm font-semibold tracking-wide",
                isDark ? "text-primary-500" : "text-primary-500"
              )}
            >
              {verse.surah} • {verse.ayah}
            </Text>
          </View>

          {/* Divider */}
          <View
            className="w-full h-px mb-6"
            style={{
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(226, 232, 240, 1)",
            }}
          />

          {/* Action Buttons */}
          <View className="flex-row items-center justify-between w-full px-6 sm:px-10">
            {/* Share Button */}
            <Pressable className="flex-col items-center gap-1">
              <View
                className="p-3 rounded-full"
                style={{
                  backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(248, 250, 252, 1)",
                }}
              >
                <MaterialIcons
                  name="share"
                  size={24}
                  color={isDark ? "#8FA6A0" : "#6B7F78"}
                />
              </View>
              <Text
                className={clsx(
                  "text-[10px] font-medium uppercase tracking-wider",
                  isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
                )}
              >
                Share
              </Text>
            </Pressable>

            {/* Play Button */}
            <Pressable
              className="flex items-center justify-center size-16 rounded-full"
              style={{
                backgroundColor: "#1F8F5F",
                shadowColor: "#1F8F5F",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.25,
                shadowRadius: 15,
                elevation: 8,
              }}
            >
              <MaterialIcons
                name="play-arrow"
                size={32}
                color={isDark ? "#0F1F1A" : "#FFFFFF"}
              />
            </Pressable>

            {/* Save Button */}
            <Pressable className="flex-col items-center gap-1">
              <View
                className="p-3 rounded-full"
                style={{
                  backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(248, 250, 252, 1)",
                }}
              >
                <MaterialIcons
                  name="favorite-border"
                  size={24}
                  color={isDark ? "#8FA6A0" : "#6B7F78"}
                />
              </View>
              <Text
                className={clsx(
                  "text-[10px] font-medium uppercase tracking-wider",
                  isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
                )}
              >
                Save
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

