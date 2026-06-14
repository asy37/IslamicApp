import React from "react";
import { View, Alert } from "react-native";
import Button from "@/components/button/Button";
import ModalComponent from "@/components/modal/ModalComponent";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DuaFormData, duaSchema } from "@/components/duas/schema";
import DuaForm from "@/components/duas/DuaForm";
import { useTranslation } from "@/i18n";

type FloatingActionButtonProps = Readonly<{
  createDua: (title: string, text: string, isFavorite?: boolean) => Promise<void>;
  isSaving: boolean;
}>;

export default function FloatingActionButton({ createDua, isSaving }: FloatingActionButtonProps) {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    reset,
  } = useForm<DuaFormData>({
    resolver: zodResolver(duaSchema),
    defaultValues: {
      title: "",
      text: "",
    },
  });

  const onSubmit = async (data: DuaFormData) => {
    console.log(data);
    try {
      await createDua(data.title, data.text, false);
      reset();
      setIsModalVisible(false);
    } catch (error) {
      Alert.alert(t("more.error"), t("duas.createFailed"));
      console.error("Error creating dua:", error);
    }
  };
  return (
    <View className="absolute bottom-6 right-6 z-50">
      <Button onPress={() => setIsModalVisible(true)} leftIcon="add" size="large" backgroundColor="primary" />
      <ModalComponent visible={isModalVisible} onClose={() => setIsModalVisible(false)} title={t("duas.addDuaTitle")} isLoading={isSaving} scrollable={true}>
        <DuaForm control={control} />
        <Button
          onPress={handleSubmit(onSubmit)}
          text={t("duas.addButton")}
          leftIcon="add"
          backgroundColor="primary"
          size="medium"
          disabled={isSaving}
        />
      </ModalComponent>
    </View>
  );
}

