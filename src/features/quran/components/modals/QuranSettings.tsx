import ModalComponent from "@/lib/components/modal/ModalComponent";
import React from "react";
import { DownloadModal } from "./DownloadModal";
import Button from "@/lib/components/button/Button";
import TranslationSelect from "./TranslationSelect";
import { useTranslation } from "@/lib/i18n";

type QuranSettingsProps = {
  readonly visible: boolean;
  readonly onClose: () => void;
};

export default function QuranSettings({
  visible,
  onClose,
}: QuranSettingsProps) {
  const [showDownloadModal, setShowDownloadModal] = React.useState(false);
  const [showTranslationSelect, setShowTranslationSelect] =
    React.useState(false);
  const { t } = useTranslation();

  return (
    <ModalComponent
      visible={visible}
      onClose={onClose}
      title={t("quran.quranSettings")}
    >
      <Button
        className="w-full p-4"
        text={t("quran.downloadTranslation")}
        backgroundColor="primary"
        onPress={() => setShowDownloadModal(true)}
        rightIcon="chevron-right"
      />
      <Button
        className="w-full p-4"
        text={t("quran.selectTranslation")}
        backgroundColor="primary"
        onPress={() => setShowTranslationSelect(true)}
        rightIcon="chevron-right"
      />

      <DownloadModal
        visible={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />
      <TranslationSelect
        visible={showTranslationSelect}
        onClose={() => setShowTranslationSelect(false)}
      />
    </ModalComponent>
  );
}
