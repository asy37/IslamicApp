import clsx from "clsx";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { ModalHeader } from "../modal/ModalHeader";
import { QuranEdition } from "@/types/quran";

type EditionsSelectType = {
  isDark: boolean;
  onClose: () => void;
  isLoading: boolean;
  editionsData: QuranEdition[] | undefined;
  openEditions: boolean;
  setOpenEditions: (value: boolean) => void;
  editionsText: string | null;
  handleSelectIde: (item: QuranEdition) => void;
};
export const EditionsSelect = ({
  isDark,
  onClose,
  isLoading,
  openEditions,
  setOpenEditions,
  editionsData,
  handleSelectIde,
  editionsText,
}: EditionsSelectType) => {
  return (
    <View
      className={clsx(
        "absolute left-0 right-0 bottom-0 rounded-t-3xl shadow-2xl min-h-[700px]",
        isDark ? "bg-background-cardDark" : "bg-background-light"
      )}
    >
      <ModalHeader
        isDark={isDark}
        onClose={onClose}
        title="Yazar Seç"
      ></ModalHeader>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        openEditions && (
          <View className="absolute inset-0 bg-black/40 justify-end">
            <View
              className={clsx(
                "rounded-t-3xl min-h-[700px]",
                isDark ? "bg-background-cardDark" : "bg-background-light"
              )}
            >
              <ModalHeader
                isDark={isDark}
                onClose={() => setOpenEditions(false)}
                title="Yazar Seç"
              />
              <FlatList
                data={editionsData}
                keyExtractor={(item) => item.identifier}
                renderItem={({ item }) => (
                  <Pressable
                    className={clsx(
                      "w-full flex-row items-center gap-4 px-6 border-b border-primary-200 py-4",
                      isDark ? "bg-primary-400/50" : "bg-primary-200/50"
                    )}
                    onPress={() => handleSelectIde(item)}
                  >
                    <Text>{item.name}</Text>
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
