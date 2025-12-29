import { MaterialIcons } from "@expo/vector-icons";
import {
  Image,
  Modal,
  Pressable,
  Text,
  View,
  useColorScheme,
} from "react-native";
import clsx from "clsx";
import { useLocation } from "@/lib/hooks/useLocation";

type LocationPermissionModalProps = {
  readonly visible: boolean;
  readonly onManualEntry: () => void;
  readonly onClose: () => void;
};

export default function LocationPermissionModal({
  visible,
  onManualEntry,
  onClose,
}: LocationPermissionModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { requestLocation } = useLocation();
  const handleRequestPermission = async () => {
    await requestLocation();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/60 px-6">
        <View
          className={clsx(
            "w-full max-w-md rounded-3xl overflow-hidden",
            isDark ? "bg-background-dark" : "bg-background-light"
          )}
        >
          {/* Image Section */}
          <View className="relative items-center justify-center w-full py-8">
            <View
              className="absolute w-64 h-64 rounded-full blur-3xl"
              style={{
                backgroundColor: isDark
                  ? "rgba(76, 175, 122, 0.1)"
                  : "rgba(31, 143, 95, 0.1)",
              }}
            />
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9fE1Xovp9VwziN1mba7pVKP903EzR-MYa7Uo8lvgrEAUHOu-Do02cZbkIAK-OBNEdBs31X4wBFMiJYZzfj-WDYk1Pc9nNQw1TDywJ1EyqnyLLdrvSDKhXBVbor2-9OkSOvTjNfcBIeUXrml0HJ5TKIKOsZ_uubLM4TuPOfKdCl2-rJ5c3ECX2ScrVQdAzVa2f0KWc0ttX4RoAQqBRUWEZpQiy5chZ_oFrCCch7GyJhW2VulZsOCm67JWBm4uFH7udAmzjLwVJIZ8p",
              }}
              className="relative z-10 w-full max-w-[280px] aspect-square rounded-xl"
              resizeMode="contain"
            />
          </View>

          {/* Content Section */}
          <View className="px-6 pb-8 items-center gap-4">
            <Text
              className={clsx(
                "text-3xl font-extrabold leading-tight tracking-tight text-center",
                isDark ? "text-text-primaryDark" : "text-text-primaryLight"
              )}
            >
              Konum Erişimi
            </Text>
            <Text
              className={clsx(
                "text-base font-normal leading-relaxed text-center max-w-[340px]",
                isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
              )}
            >
              Doğru namaz vakitleri ve kıble yönü için konumunuza ihtiyacımız
              var. Gizliliğinize saygı gösteriyoruz.
            </Text>

            {/* Buttons */}
            <View className="w-full items-center gap-4 mt-4">
              <Pressable
                onPress={handleRequestPermission}
                className={clsx(
                  "flex-row items-center justify-center gap-2 w-full max-w-[320px] h-14 px-6 rounded-full shadow-lg active:scale-95",
                  isDark ? "bg-primary-500" : "bg-primary-500"
                )}
                style={{
                  shadowColor: isDark ? "#4CAF84" : "#1F8F5F",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <MaterialIcons name="near-me" size={20} color="#FFFFFF" />
                <Text className="text-base font-bold text-white tracking-wide">
                  Konum Erişimine İzin Ver
                </Text>
              </Pressable>

              <Pressable
                onPress={onManualEntry}
                className="py-3 px-4 rounded-lg"
              >
                <Text
                  className={clsx(
                    "text-sm font-semibold text-center underline underline-offset-4 decoration-2",
                    isDark
                      ? "text-primary-500/90 decoration-primary-500/30"
                      : "text-text-secondaryLight decoration-text-secondaryLight/20"
                  )}
                >
                  Şehrimi manuel olarak gireceğim
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
