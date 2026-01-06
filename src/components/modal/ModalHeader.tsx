import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";
import { Pressable, Text, View } from "react-native";
import { colors } from "../theme/colors";
import React from "react";

type ModalHeaderType = {
  readonly isDark: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly children?: React.ReactNode;
};
export const ModalHeader = ({
  isDark,
  onClose,
  children,
  title,
}: ModalHeaderType) => {
  return (
    <View className="pb-2 pt-3">
      <View className="flex-row items-center justify-between px-6 pb-3">
        <Text
          className={clsx(
            "text-xl font-bold tracking-tight ",
            isDark ? "text-text-primaryDark" : "text-text-primaryLight"
          )}
        >
          {title}
        </Text>
        <Pressable onPress={onClose} className="rounded-full p-2" hitSlop={10}>
          <MaterialIcons
            name="close"
            size={26}
            color={isDark ? colors.text.muted : colors.text.primaryLight}
          />
        </Pressable>
      </View>

      {children}
    </View>
  );
};
