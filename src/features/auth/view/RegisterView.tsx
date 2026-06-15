import {
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import clsx from "clsx";
import RegisterForm from "@/features/auth/components/register/RegisterForm";
import { useTheme } from "@/lib/storage/useThemeStore";

export const RegisterView = () => {
    const { isDark } = useTheme();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className={clsx("flex-1", isDark ? "bg-background-dark" : "bg-background-light")}
        >
            <RegisterForm />
        </KeyboardAvoidingView>
    );
};