import React from "react";
import { Text, TouchableOpacity } from "react-native";
import clsx from "clsx";

interface ProfileSubmitButtonProps {
  onPress: () => void;
  disabled: boolean;
  label: string;
}

export default function ProfileSubmitButton({
  onPress,
  disabled,
  label,
}: ProfileSubmitButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={clsx(
        "mt-4 h-14 rounded-xl items-center justify-center shadow-sm",
        disabled ? "bg-primary-400" : "bg-primary-500"
      )}
    >
      <Text className="text-white text-base font-bold">{label}</Text>
    </TouchableOpacity>
  );
}
