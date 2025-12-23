import { Text } from "react-native";

export default function CalibrationHint({ isDark }: { isDark: boolean }) {
  return (
    <Text
      className="text-center text-[10px] mt-4 max-w-[200px] mx-auto leading-relaxed"
      style={{
        color: isDark ? "rgba(143, 166, 160, 0.6)" : "#9CA3AF",
      }}
    >
      Daha iyi sonuçlar için telefonunuzu 8 şeklinde hareket ettirin.
    </Text>
  );
}

