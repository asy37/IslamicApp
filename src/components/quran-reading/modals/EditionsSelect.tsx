import { FlatList } from "react-native";
import { QuranEdition } from "@/types/quran";
import ModalComponent from "@/components/modal/ModalComponent";
import Button from "@/components/button/Button";

type EditionsSelectType = {
  isDark: boolean;
  isLoading: boolean;
  editionsData: QuranEdition[] | undefined;
  openEditions: boolean;
  setOpenEditions: (value: boolean) => void;
  handleSelectIde: (item: QuranEdition) => void;
};
export const EditionsSelect = ({
  isDark,
  isLoading,
  openEditions,
  setOpenEditions,
  editionsData,
  handleSelectIde,
}: EditionsSelectType) => {
  
  return (
    <ModalComponent
      isDark={isDark}
      visible={openEditions}
      onClose={() => setOpenEditions(false)}
      title="Select Author"
      isLoading={isLoading}
    >
      <FlatList
        data={editionsData}
        contentContainerClassName="gap-2 pb-4"
        keyExtractor={(item) => item.identifier}
        renderItem={({ item }) => (
          <Button
            text={item.name}
            onPress={() => handleSelectIde(item)}
            isDark={isDark}
            icon="chevron-right"
            size="large"
          />
        )}
      />
    </ModalComponent>
  );
};
