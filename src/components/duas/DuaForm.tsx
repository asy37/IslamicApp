import { TextInput } from "react-native";
import { Control, Controller } from "react-hook-form";
import { DuaFormData } from "@/components/duas/schema";
import { useTranslation } from "@/i18n";

type DuaFormProps = {
    readonly control: Control<DuaFormData>;
};
export default function DuaForm({ control }: DuaFormProps) {
    const { t } = useTranslation();

    return (
        <>
            <Controller control={control} name="title" render={({ field: { onChange, onBlur, value } }) => (
                <TextInput placeholder={t("duas.duaTitlePlaceholder")} className="w-full bg-white text-text-secondaryLight p-4 rounded-lg border border-border-light" multiline={true} value={value} onChangeText={onChange} onBlur={onBlur} />
            )} />
            <Controller control={control} name="text" render={({ field: { onChange, onBlur, value } }) => (
                <TextInput placeholder={t("duas.duaTextPlaceholder")} className="w-full bg-white text-text-secondaryLight p-4 rounded-lg border border-border-light" multiline={true} value={value} onChangeText={onChange} onBlur={onBlur} />
            )} />
        </>
    );
}