import Button from "@/components/button/Button";
import ModalComponent from "@/components/modal/ModalComponent";
import {
  getDownloadedTranslations,
  TranslationMetadata,
} from "@/lib/database/sqlite/translation/repository";
import { queryKeys } from "@/lib/query/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { FlatList, View } from "react-native";

type TranslationSelectProps = {
  readonly isDark: boolean;
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly onSelect: (item: TranslationMetadata) => void;
  readonly selectedTranslation: string | null;
};
export default function TranslationSelect({
  isDark,
  visible,
  onClose,
  onSelect,
  selectedTranslation,
}: TranslationSelectProps) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.translation.downloaded(),
    queryFn: getDownloadedTranslations,
  });

  const handleSelect = (item: TranslationMetadata) => {
    onSelect(item);
    onClose();
  };
  return (
    <ModalComponent
      isDark={isDark}
      visible={visible}
      onClose={onClose}
      title="Translation Select"
      isLoading={isLoading}
    >
      <FlatList
        data={data}
        keyExtractor={(item) => item.edition_identifier}
        contentContainerClassName="gap-2 pb-4 w-full"
        renderItem={({ item }) => {
          const isSelected = selectedTranslation === item.edition_identifier;
          return (
            <View className="w-full">
              <Button
                onPress={() => handleSelect(item)}
                isDark={isDark}
                rightIcon={isSelected ? "check" : "chevron-right"}
                text={item.name}
                size="large"
              />
            </View>
          );
        }}
      />
    </ModalComponent>
  );
}
