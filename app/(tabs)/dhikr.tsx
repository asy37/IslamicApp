import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DhikrScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background px-4">
      <View className="flex-1 items-center justify-center">
        <View className="w-full max-w-md rounded-3xl bg-white/90 p-6 shadow-sm">
          <Text className="mb-2 text-center text-xs font-medium uppercase tracking-[0.2em] text-text-secondary">
            Zikir Matik
          </Text>

          <Text className="mb-6 text-center text-2xl font-semibold text-text">
            Yakında inşallah ✨
          </Text>

          <Text className="text-center text-sm text-text-secondary">
            Burada günlük zikir hedeflerini takip edebilecek, preset ve özel zikirler
            oluşturabileceksin.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}


