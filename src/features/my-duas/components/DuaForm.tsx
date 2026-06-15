import { TextInput } from "react-native";
import { Controller } from "react-hook-form";
import { useTranslation } from "@/lib/i18n";
import { DuaFormProps } from "../types";

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