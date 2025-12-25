import { ScrollView, useColorScheme, View } from "react-native";
import clsx from "clsx";
import MoreHeader from "@/components/more/MoreHeader";
import MenuSection from "@/components/more/MenuSection";
import PremiumCard from "@/components/more/PremiumCard";
import VersionInfo from "@/components/more/VersionInfo";

const TOOLS_ITEMS = [
  {
    key: "dhikr",
    title: "Zikirmatik",
    subtitle: "Günlük tesbihatlarınız",
    icon: "timer",
    iconBg: "primary" as const,
    route: "./dhikr",
  },
  {
    key: "daily-verse",
    title: "Günlük Ayet",
    subtitle: "Günün ilhamı",
    icon: "menu-book",
    iconBg: "primary" as const,
    route: "./daily-verse",
  },
  {
    key: "prayers",
    title: "Dualarım",
    subtitle: "Kaydedilen dualar",
    icon: "volunteer-activism",
    iconBg: "primary" as const,
    route: "./duas",
  },
] as const;

const LOCATION_ITEMS = [
  {
    key: "qibla",
    title: "Kıble Bulucu",
    icon: "explore",
    
    iconBg: "primary" as const,
    route: "./qibla",
  },
  {
    key: "mosques",
    title: "Yakındaki Camiler",
    icon: "mosque",
    iconBg: "primary" as const,
    route: "../adhan",
  },
] as const;

const ACCOUNT_ITEMS = [
  {
    key: "profile",
    title: "Profil",
    icon: "person",
    iconBg: "gray" as const,
    route: "./profile",
  },
  {
    key: "settings",
    title: "Ayarlar",
    icon: "settings",
    iconBg: "gray" as const,
    route: "./settings",
  },
] as const;

export default function MoreScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <ScrollView
      className={clsx(
        "flex-1",
        isDark ? "bg-background-dark" : "bg-background-light"
      )}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <MoreHeader isDark={isDark} />
      <View className="flex-1 px-4 mt-4 space-y-6">
        <MenuSection title="" items={TOOLS_ITEMS} isDark={isDark} />
        <MenuSection
          title="Konum Servisleri"
          items={LOCATION_ITEMS}
          isDark={isDark}
        />
        <MenuSection title="Hesap" items={ACCOUNT_ITEMS} isDark={isDark} />
        <PremiumCard isDark={isDark} />
        <VersionInfo isDark={isDark} />
      </View>
    </ScrollView>
  );
}
