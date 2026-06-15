import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ayah } from "@/types/quran";
import { useTranslation } from "@/lib/i18n";

interface ShareCardProps {
  readonly ayah: Ayah;
}

export const ShareCard = React.forwardRef<View, ShareCardProps>(({ ayah }, ref) => {
  const { t } = useTranslation();
  return (
    <View
      ref={ref}
      collapsable={false}
      style={styles.container}
    >
      <LinearGradient
        colors={["#0D9488", "#0F766E", "#115E59"]} // Turquoise gradient
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>Salah</Text>
          <Text style={styles.appSubtitle}>{t("quran.dailyReflection")}</Text>
        </View>

        {/* Besmele */}
        <View style={styles.besmeleContainer}>
          <Text style={styles.besmele}>{t("quran.basmala")}</Text>
        </View>

        {/* Arabic Text */}
        <View style={styles.arabicContainer}>
          <Text style={styles.arabicText} numberOfLines={8}>
            {ayah.text}
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Translation Text */}
        {ayah.translationText && (
          <View style={styles.translationContainer}>
            <Text style={styles.translationText} numberOfLines={6}>
              {ayah.translationText}
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.reference}>
            {ayah.surahArabicName} ({ayah.surahTranslation}) — {t("quran.ayah", { ayah: ayah.numberInSurah })} ({t("quran.juz", { juz: ayah.juz })})
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
});

ShareCard.displayName = "ShareCard";

const styles = StyleSheet.create({
  container: {
    width: 600,
    height: 600,
    backgroundColor: "#fff",
  },
  gradient: {
    flex: 1,
    padding: 40,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    paddingBottom: 12,
  },
  appName: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  appSubtitle: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
  },
  besmeleContainer: {
    alignItems: "center",
    marginVertical: 12,
  },
  besmele: {
    color: "#fff",
    fontSize: 22,
    opacity: 0.9,
  },
  arabicContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  arabicText: {
    color: "#fff",
    fontSize: 26,
    textAlign: "center",
    lineHeight: 46,
    writingDirection: "rtl",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginVertical: 12,
  },
  translationContainer: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },
  translationText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 18,
    textAlign: "center",
    lineHeight: 26,
    fontStyle: "italic",
  },
  footer: {
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    paddingTop: 16,
  },
  reference: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 15,
    fontWeight: "600",
  },
});
