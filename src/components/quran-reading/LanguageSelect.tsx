import clsx from "clsx";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { ModalHeader } from "../modal/ModalHeader";
import { QuranApiResponse } from "@/types/quran";
import { LANGUAGE_LABELS } from "./utils";

type LanguageSelectType = {
  isDark: boolean;
  onClose: () => void;
  isLoading: boolean;
  languageData?: QuranApiResponse<string[]>;
  openLanguage: boolean;
  setOpenLanguage: (value: boolean) => void;
  languageText: string | null;
  handleSelectLanguage: (item: { code: string; label: string }) => void;
};
export const LanguageSelect = ({
  isDark,
  onClose,
  isLoading,
  openLanguage,
  setOpenLanguage,
  languageData,
  handleSelectLanguage,
  languageText,
}: LanguageSelectType) => {
  const languages =
    languageData?.data?.map((code) => ({
      code,
      label: LANGUAGE_LABELS[code] ?? code.toUpperCase(),
    })) ?? [];
  return (
    <View
      className={clsx(
        "absolute left-0 right-0 bottom-0 z-50 rounded-t-3xl shadow-2xl h-[700px]",
        isDark ? "bg-background-cardDark" : "bg-background-light"
      )}
    >
      <ModalHeader isDark={isDark} onClose={onClose} title="Dil Seç">

      </ModalHeader>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        openLanguage && (
          <View className="absolute inset-0 bg-black/40 justify-end">
            <View
              className={clsx(
                "rounded-t-3xl max-h-[700px]",
                isDark ? "bg-background-cardDark" : "bg-background-light"
              )}
            >
              <ModalHeader
                isDark={isDark}
                onClose={() => setOpenLanguage(false)}
                title="Dil seç"
              />
              <FlatList
                data={languages}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <Pressable
                    className={clsx(
                      "w-full flex-row items-center gap-4 px-6 py-4 border-b border-primary-200",
                      isDark ? "bg-primary-400/50" : "bg-primary-200/50"
                    )}
                    onPress={() => handleSelectLanguage(item)}
                  >
                    <Text>{item.label}</Text>
                  </Pressable>
                )}
              />
            </View>
          </View>
        )
      )}
    </View>
  );
};
