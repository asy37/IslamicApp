import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import clsx from "clsx";
import * as ImagePicker from "expo-image-picker";

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Fotoğraf seçmek için izin gerekli!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      alert("Lütfen tüm alanları doldurun");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement Supabase registration
      // For now, navigate to confirmation
      router.push("/auth/confirmation");
    } catch (error) {
      alert("Kayıt olurken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className={clsx("flex-1", isDark ? "bg-background-dark" : "bg-background-light")}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-12 pb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className={clsx(
              "w-10 h-10 rounded-full items-center justify-center",
              isDark ? "bg-background-cardDark" : "bg-white"
            )}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={isDark ? "#EAF3F0" : "#1C2A26"}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Text
              className={clsx(
                "text-sm font-semibold",
                isDark ? "text-primary-400" : "text-primary-500"
              )}
            >
              Yardım
            </Text>
          </TouchableOpacity>
        </View>

        <View className="px-6 pt-4">
          {/* Avatar Upload Section */}
          <View className="items-center py-6" style={{ gap: 16 }}>
            <TouchableOpacity
              onPress={pickImage}
              className={clsx(
                "w-28 h-28 rounded-full border-2 border-dashed items-center justify-center",
                isDark
                  ? "bg-background-cardDark border-border-dark"
                  : "bg-white border-gray-300"
              )}
            >
              {avatar ? (
                <Image source={{ uri: avatar }} className="w-full h-full rounded-full" />
              ) : (
                <MaterialIcons
                  name="add-a-photo"
                  size={32}
                  color={isDark ? "#8FA6A0" : "#6B7F78"}
                />
              )}
            </TouchableOpacity>
            <Text
              className={clsx(
                "text-sm font-medium",
                isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
              )}
            >
              Fotoğraf ekle (isteğe bağlı)
            </Text>
          </View>

          {/* Headlines */}
          <View className="items-center mb-8">
            <Text
              className={clsx(
                "text-[32px] font-bold leading-tight mb-3",
                isDark ? "text-text-primaryDark" : "text-text-primaryLight"
              )}
            >
              Hoş Geldin
            </Text>
            <Text
              className={clsx(
                "text-base font-normal leading-relaxed text-center px-4",
                isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
              )}
            >
              İbadetlerini takip et ve günlük motivasyonunu bul.
            </Text>
          </View>

          {/* Form Fields */}
          <View style={{ gap: 20 }}>
            {/* Email Field */}
            <View style={{ gap: 8 }}>
              <Text
                className={clsx(
                  "text-sm font-medium ml-1",
                  isDark ? "text-text-secondaryDark" : "text-text-primaryLight"
                )}
              >
                Email Adresi
              </Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  className={clsx(
                    "w-full h-14 rounded-xl border px-4 pr-12 text-base",
                    isDark
                      ? "bg-background-cardDark border-border-dark text-text-primaryDark"
                      : "bg-white border-gray-200 text-text-primaryLight"
                  )}
                  placeholder="ornek@email.com"
                  placeholderTextColor={isDark ? "#8FA6A0" : "#6B7F78"}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
                <View style={{ position: "absolute", right: 16, top: "50%", marginTop: -10 }}>
                  <MaterialIcons
                    name="mail"
                    size={20}
                    color={isDark ? "#8FA6A0" : "#6B7F78"}
                  />
                </View>
              </View>
            </View>

            {/* Password Field */}
            <View style={{ gap: 8 }}>
              <Text
                className={clsx(
                  "text-sm font-medium ml-1",
                  isDark ? "text-text-secondaryDark" : "text-text-primaryLight"
                )}
              >
                Şifre
              </Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  className={clsx(
                    "w-full h-14 rounded-xl border px-4 pr-12 text-base",
                    isDark
                      ? "bg-background-cardDark border-border-dark text-text-primaryDark"
                      : "bg-white border-gray-200 text-text-primaryLight"
                  )}
                  placeholder="••••••••"
                  placeholderTextColor={isDark ? "#8FA6A0" : "#6B7F78"}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 16, top: "50%", marginTop: -10 }}
                >
                  <MaterialIcons
                    name={showPassword ? "visibility-off" : "visibility"}
                    size={20}
                    color={isDark ? "#8FA6A0" : "#6B7F78"}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Primary Action Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={isLoading}
              className={clsx(
                "mt-4 h-14 rounded-xl items-center justify-center shadow-sm",
                isLoading
                  ? "bg-primary-400"
                  : isDark
                  ? "bg-primary-500"
                  : "bg-primary-500"
              )}
            >
              <Text className="text-white text-base font-bold">
                {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-8" style={{ gap: 16 }}>
            <View
              className={clsx(
                "flex-1 h-px",
                isDark ? "bg-border-dark" : "bg-gray-200"
              )}
            />
            <Text
              className={clsx(
                "text-xs font-medium uppercase",
                isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
              )}
            >
              veya
            </Text>
            <View
              className={clsx(
                "flex-1 h-px",
                isDark ? "bg-border-dark" : "bg-gray-200"
              )}
            />
          </View>

          {/* Social Login Buttons (Disabled) */}
          <View className="flex-row mb-6 opacity-50" style={{ gap: 16 }}>
            <TouchableOpacity
              disabled
              className={clsx(
                "flex-1 h-12 rounded-xl border items-center justify-center gap-2",
                isDark
                  ? "bg-background-cardDark border-border-dark"
                  : "bg-white border-gray-200"
              )}
            >
              <Text
                className={clsx(
                  "text-sm font-medium",
                  isDark ? "text-text-primaryDark" : "text-text-primaryLight"
                )}
              >
                Google
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled
              className={clsx(
                "flex-1 h-12 rounded-xl border items-center justify-center gap-2",
                isDark
                  ? "bg-background-cardDark border-border-dark"
                  : "bg-white border-gray-200"
              )}
            >
              <Text
                className={clsx(
                  "text-sm font-medium",
                  isDark ? "text-text-primaryDark" : "text-text-primaryLight"
                )}
              >
                Apple
              </Text>
            </TouchableOpacity>
          </View>

          {/* Guest Link */}
          <View className="items-center mt-auto mb-4">
            <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
              <Text
                className={clsx(
                  "text-sm font-semibold",
                  isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
                )}
              >
                Misafir olarak devam et
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

