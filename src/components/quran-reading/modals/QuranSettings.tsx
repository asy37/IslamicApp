import ModalComponent from "@/components/modal/ModalComponent";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { DownloadModal } from "./DownloadModal";
import Button from "@/components/button/Button";

type QuranSettingsProps = {
  readonly isDark: boolean;
  readonly visible: boolean;
  readonly onClose: () => void;
};

export default function QuranSettings({
  isDark,
  visible,
  onClose,
}: QuranSettingsProps) {
  const [showDownloadModal, setShowDownloadModal] = React.useState(false);
  return (
    <ModalComponent
      isDark={isDark}
      visible={visible}
      onClose={onClose}
      title="Quran Settings"
    >
      <Button
        className="w-full py-4"
        text="Download Translation"
        onPress={() => setShowDownloadModal(true)}
        isDark={isDark}
        icon="chevron-right"
      />
      <Button
        className="w-full py-4"
        text="Select Translation"
        onPress={() => setShowDownloadModal(true)}
        isDark={isDark}
        icon="chevron-right"
      />

      <DownloadModal
        visible={showDownloadModal}
        isDark={isDark}
        onClose={() => setShowDownloadModal(false)}
      />
    </ModalComponent>
  );
}
