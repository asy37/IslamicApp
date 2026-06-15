import { FlatList } from "react-native";
import { LANGUAGE_LABELS } from "../../utils/utils";
import ModalComponent from "@/lib/components/modal/ModalComponent";
import Button from "@/lib/components/button/Button";
import { useQuery } from "@tanstack/react-query";
import { getLanguages } from "@/lib/api/services/quranApi";
import { queryKeys } from "@/lib/query/queryKeys";
import { useTranslation } from "@/lib/i18n";

type LanguageSelectType = {
  openLanguage: boolean;
  setOpenLanguage: (value: boolean) => void;
  handleSelectLanguage: (item: { code: string; label: string }) => void;
};
export const LanguageSelect = ({
  openLanguage,
  setOpenLanguage,
  handleSelectLanguage,
}: LanguageSelectType) => {
  const { t } = useTranslation();
  const { data: languageData, isLoading } = useQuery({
    queryKey: queryKeys.language.all,
    queryFn: getLanguages,
  });

  const languages =
    languageData?.data?.map((code) => ({
      code,
      label: LANGUAGE_LABELS[code] ?? code.toUpperCase(),
    })) ?? [];
  return (
    <ModalComponent
      visible={openLanguage}
      onClose={() => setOpenLanguage(false)}
      title={t("quran.selectLanguage")}
      isLoading={isLoading}
    >
      <FlatList
        className="flex-1"
        contentContainerClassName="gap-2 pb-4"
        data={languages}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <Button
            text={item.label}
            backgroundColor="primary"
            onPress={() => handleSelectLanguage(item)}
            rightIcon="chevron-right"
            size="large"
          />
        )}
      />
    </ModalComponent>
  );
};
