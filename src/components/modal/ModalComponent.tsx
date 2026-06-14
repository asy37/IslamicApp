import { ModalHeader } from "@/components/modal/ModalHeader";
import clsx from "clsx";
import { ActivityIndicator, Modal, Pressable, View, ScrollView } from "react-native";
import { useTheme } from "@/lib/storage/useThemeStore";

type ModalComponentProps = {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly children: React.ReactNode;
  readonly title: string;
  readonly isLoading?: boolean;
  readonly scrollable?: boolean;
};

export default function ModalComponent({
  visible,
  onClose,
  children,
  title,
  isLoading,
  scrollable = false,
}: ModalComponentProps) {
  const { isDark } = useTheme();
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
          "absolute left-0 right-0 bottom-0 rounded-t-3xl shadow-2xl h-[700px] max-h-[85%]",
          isDark ? "bg-background-cardDark" : "bg-background-light"
        )}
      >
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <>
            <ModalHeader isDark={isDark} onClose={onClose} title={title} />
            {scrollable ? (
              <ScrollView
                className="flex-1 w-full px-6"
                contentContainerStyle={{ gap: 8, paddingBottom: 32 }}
                showsVerticalScrollIndicator={true}
              >
                {children}
              </ScrollView>
            ) : (
              <View className="flex-1 items-center gap-2 px-6">
                {children}
              </View>
            )}
          </>
        )}
      </View>
    </Modal>
  );
}
