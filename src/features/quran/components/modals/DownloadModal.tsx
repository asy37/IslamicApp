import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getEditions, getCompleteQuran } from "@/lib/api/services/quranApi";
import { queryKeys } from "@/lib/query/queryKeys";
import { QuranEdition } from "@/types/quran";
import { LanguageSelect } from "./LanguageSelect";
import { EditionsSelect } from "./EditionsSelect";
import clsx from "clsx";
import { saveQuranTranslation } from "@/lib/database/translation/repository";
import ModalComponent from "@/lib/components/modal/ModalComponent";
import Button from "@/lib/components/button/Button";
import { useTranslation } from "@/lib/i18n";

type DownloadModalType = {
  readonly visible: boolean;
  readonly onClose: () => void;
};
export const DownloadModal = ({
  visible,
  onClose,
}: DownloadModalType) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [editionsData, setEditionsData] = useState<QuranEdition[]>();
  const [openEditions, setOpenEditions] = useState(false);
  const [editionsText, setEditionsText] = useState<string | null>(null);
  const [selectedIde, setSelectedIde] = useState<string | null>(null);

  const [openLanguage, setOpenLanguage] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [languageText, setLanguageText] = useState<string | null>(null);

  const { mutate: fetchTranslationQuran, isPending: isQuranPending } =
    useMutation({
      mutationFn: (identifier: string) => getCompleteQuran(identifier),
      onSuccess: async (res) => {
        await saveQuranTranslation({
          edition_identifier: res.data.edition.identifier,
          language: res.data.edition.language,
          name: res.data.edition.name,
          direction: res.data.edition.direction ?? "ltr",
          data: res.data, // surahs array
        });

        await queryClient.invalidateQueries({
          queryKey: queryKeys.translation.downloaded(),
        });

        Alert.alert(t("common.success"), t("quran.downloadSuccess"));
      },
    });

  const { mutate: fetchEditions, isPending } = useMutation({
    mutationFn: (language: string) =>
      getEditions({
        format: "text",
        language: language,
        type: "translation",
      }),
    onSuccess: (res) => {
      setEditionsData(res.data);
    },
  });

  const handleSelectLanguage = (item: { code: string; label: string }) => {
    setLanguageText(item.label);
    setSelectedLanguage(item.code);
    setOpenLanguage(false);
    setSelectedIde(null);
    setEditionsText(null);
  };

  const handleSelectIde = (item: QuranEdition) => {
    setEditionsText(item.name);
    setSelectedIde(item.identifier);
    setOpenEditions(false);
  };

  const handleGetTranslation = () => {
    if (!selectedLanguage) return;
    setOpenEditions(true);
    fetchEditions(selectedLanguage);
  };

  const handleDownloadQuran = () => {
    if (!selectedIde) return;
    fetchTranslationQuran(selectedIde);
  };

  return (
    <ModalComponent
      visible={visible}
      onClose={onClose}
      title={t("quran.downloadTranslationTitle")}
    >
      <View className="flex-1 items-center gap-2 w-full">
        <Button
          text={languageText ?? t("quran.selectLanguage")}
          onPress={() => setOpenLanguage(true)}
          backgroundColor="primary"
          rightIcon="chevron-right"
          size="large"
        />
        <Button
          text={editionsText ?? t("quran.selectAuthor")}
          onPress={handleGetTranslation}
          rightIcon="chevron-right"
          backgroundColor="primary"
          size="large"
        />

        <TouchableOpacity
          onPress={handleDownloadQuran}
          disabled={!selectedIde || isQuranPending}
          className={clsx(
            "w-6/12 mx-auto p-4  rounded-full",
            selectedIde ? "bg-primary-500" : "bg-primary-200"
          )}
        >
          {isQuranPending ? (
            <ActivityIndicator />
          ) : (
            <Text className="text-white text-center">{t("quran.download")}</Text>
          )}
        </TouchableOpacity>
      </View>
      {openLanguage && (
        <LanguageSelect
          openLanguage={openLanguage}
          setOpenLanguage={setOpenLanguage}
          handleSelectLanguage={handleSelectLanguage}
        />
      )}
      {openEditions && (
        <EditionsSelect
          isLoading={isPending}
          openEditions={openEditions}
          setOpenEditions={setOpenEditions}
          editionsData={editionsData}
          handleSelectIde={handleSelectIde}
        />
      )}
    </ModalComponent>
  );
};
