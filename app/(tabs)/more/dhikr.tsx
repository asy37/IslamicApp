import { Pressable, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import clsx from "clsx";
import DhikrHeader from "@/components/dhikr/DhikrHeader";
import DhikrCounter from "@/components/dhikr/DhikrCounter";
import DhikrBottomBar from "@/components/dhikr/DhikrBottomBar";

const DHIKR_OPTIONS = [
  { key: "subhanallah", label: "SubhanAllah", target: 100 },
  { key: "alhamdulillah", label: "Alhamdulillah", target: 100 },
  { key: "allahuakbar", label: "Allahu Akbar", target: 100 },
  { key: "astaghfirullah", label: "Astaghfirullah", target: 100 },
] as const;

export default function DhikrScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [currentDhikr] = useState(DHIKR_OPTIONS[0]);
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount((prev) => prev + 1);
  };

  const handleReset = () => {
    setCount(0);
  };

  const progress = (count / currentDhikr.target) * 100;
  const circumference = 2 * Math.PI * 140; // radius = 140
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <SafeAreaView
      className={clsx(
        "flex-1",
        isDark ? "bg-background-dark" : "bg-background-light"
      )}
      edges={["top"]}
    >
      <View className="relative flex-1">
        <DhikrHeader isDark={isDark} />
        <Pressable
          className="flex-1 flex-col items-center justify-center"
          onPress={handleIncrement}
        >
          <DhikrCounter
            count={count}
            dhikrName={currentDhikr.label}
            target={currentDhikr.target}
            progress={progress}
            strokeDashoffset={strokeDashoffset}
            circumference={circumference}
            isDark={isDark}
          />
        </Pressable>
        <DhikrBottomBar
          currentDhikr={currentDhikr}
          dhikrOptions={DHIKR_OPTIONS}
          onReset={handleReset}
          isDark={isDark}
        />
      </View>
    </SafeAreaView>
  );
}

