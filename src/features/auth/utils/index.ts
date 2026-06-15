import { i18n } from "@/lib/i18n";
import { resetPasswordForEmail, signInAnonymously, signInWithPassword } from "@/lib/api/services/auth";
import { Alert } from "react-native";
import { loginSchema } from "../components/login/schema";
import { router } from "expo-router";

export async function doSignIn(email: string, password: string) {
    const result = await signInWithPassword(email, password);
    if (result.error) {
        Alert.alert(i18n.t("auth.loginError"), result.error.message);
        return;
    }
    if (result.user || result.session) {
        setTimeout(() => router.replace("/(tabs)"), 500);
    } else {
        Alert.alert(i18n.t("auth.error"), i18n.t("auth.signInError"));
    }
}
export function getValidEmail(raw?: string): string | null {
    const email = raw?.trim();
    if (!email) return null;

    const parsed = loginSchema.shape.email.safeParse(email);
    return parsed.success ? parsed.data : null;
}
export async function sendResetPassword(email: string) {
    const { error } = await resetPasswordForEmail(email);

    if (error) {
        Alert.alert(i18n.t("auth.error"), error.message);
        return;
    }

    Alert.alert(
        i18n.t("auth.forgotPasswordSent"),
        i18n.t("auth.forgotPasswordMessage")
    );
}
export async function doForgotPassword(getEmail: () => string) {
    const email = getValidEmail(getEmail());

    if (!email) {
        Alert.alert(
            i18n.t("auth.invalidEmail"),
            i18n.t("auth.invalidEmailMessage")
        );
        return;
    }

    await sendResetPassword(email);
}

export async function doGuestSignIn() {
    const result = await signInAnonymously();
    if (result.error) {
        Alert.alert(i18n.t("auth.error"), result.error.message);
        return;
    }
    if (result.user || result.session) {
        setTimeout(() => router.replace("/(tabs)"), 500);
    } else {
        Alert.alert(i18n.t("auth.error"), i18n.t("auth.guestSignInError"));
    }
}