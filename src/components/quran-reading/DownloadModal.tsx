import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/queryKeys";
import {
  getLanguages,
  getEditions,
  getCompleteQuran,
} from "@/lib/api/services/quranApi";
import { QuranEdition } from "@/types/quran";
import { LanguageSelect } from "./LanguageSelect";
import { EditionsSelect } from "./EditionsSelect";
import { ModalHeader } from "../modal/ModalHeader";
import clsx from "clsx";

type DownloadModalType = {
  readonly visible: boolean;
  readonly isDark: boolean;
  readonly onClose: () => void;
};
export const DownloadModal = ({
  visible,
  onClose,
  isDark,
}: DownloadModalType) => {
  const [editionsData, setEditionsData] = useState<QuranEdition[]>();
  const [openEditions, setOpenEditions] = useState(false);
  const [editionsText, setEditionsText] = useState<string | null>(null);
  const [selectedIde, setSelectedIde] = useState<string | null>(null);

  const [openLanguage, setOpenLanguage] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [languageText, setLanguageText] = useState<string | null>(null);

  const { data: languageData, isLoading } = useQuery({
    queryKey: queryKeys.language.all,
    queryFn: getLanguages,
  });

  const { mutate: fetchTranslationQuran, isPending: isQuranPending } =
    useMutation({
      mutationFn: (identifier: string) => getCompleteQuran(identifier),
      onSuccess: (res) => {},
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
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1">
        <Pressable onPress={onClose} className="absolute inset-0">
          <View className="absolute inset-0 bg-black/40" />
        </Pressable>
        <View className="flex-1 absolute"></View>
      </View>

      <View
        className={clsx(
          "absolute left-0 right-0 bottom-0 rounded-t-3xl shadow-2xl h-[700px]",
          isDark ? "bg-background-cardDark" : "bg-background-light"
        )}
      >
        <ModalHeader isDark={isDark} onClose={onClose} title="Meal İndir" />
        <View className="flex-1 items-center gap-2">
          <Pressable
            onPress={() => setOpenLanguage(true)}
            className="w-11/12 rounded border border-border-dark mx-auto p-4 bg-primary-200 text-white"
          >
            <Text className="text-white">{languageText ?? "Dil seç"}</Text>
          </Pressable>
          <Pressable
            disabled={selectedLanguage === null}
            onPress={handleGetTranslation}
            className="w-11/12 rounded border border-border-dark mx-auto p-4 bg-primary-200 text-white"
          >
            <Text className="text-white">{editionsText ?? "Yazar seç"}</Text>
          </Pressable>
          <TouchableOpacity
            onPress={handleDownloadQuran}
            disabled={!selectedIde || isQuranPending}
            className={clsx(
              "w-6/12 mx-auto p-4  rounded-full",
              selectedIde ? "bg-primary-500" : "bg-primary-200"
            )}
          >
            <Text className="text-white text-center">
              {isQuranPending ? <ActivityIndicator /> : "İndir"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {openLanguage && (
        <LanguageSelect
          isDark={isDark}
          onClose={onClose}
          isLoading={isLoading}
          openLanguage={openLanguage}
          setOpenLanguage={setOpenLanguage}
          languageData={languageData}
          handleSelectLanguage={handleSelectLanguage}
          languageText={languageText}
        />
      )}
      {openEditions && (
        <EditionsSelect
          isDark={isDark}
          onClose={onClose}
          isLoading={isPending}
          openEditions={openEditions}
          setOpenEditions={setOpenEditions}
          editionsData={editionsData}
          handleSelectIde={handleSelectIde}
          editionsText={editionsText}
        />
      )}
    </Modal>
  );
};
