import clsx from "clsx";
import { Text } from "react-native";

type CalibrationHintProps = Readonly<{
  readonly isDark: boolean;
  readonly shouldShow: boolean;
}>;
export default function CalibrationHint({
  isDark,
  shouldShow,
}: CalibrationHintProps) {
  if (!shouldShow) return null;

  return (
    <Text
      className={clsx(
        "text-center text-[10px] mt-4 max-w-[200px] mx-auto leading-relaxed",
        isDark ? "text-text-secondaryDark/60" : "text-text-secondaryLight/60"
      )}
    >
      Daha iyi sonuçlar için telefonunuzu 8 yönünde hareket ettirin.
    </Text>
  );
}
