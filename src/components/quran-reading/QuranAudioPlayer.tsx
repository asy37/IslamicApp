import { MaterialIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export default function AudioPlayer({ isDark }: { isDark: boolean }) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // Örnek audio URL - gerçek uygulamada props veya state'den gelecek
  const audioUrl =
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  useEffect(() => {
    // Audio modunu ayarla
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });

    return () => {
      // Cleanup: ses dosyasını unload et
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadAudio = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false },
        (status) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis || 0);
            setDuration(status.durationMillis || 0);
            setIsPlaying(status.isPlaying || false);

            // Oynatma bittiğinde
            if (status.didJustFinish) {
              setIsPlaying(false);
              setPosition(0);
            }
          }
        }
      );
      setSound(newSound);
    } catch (error) {
      console.error("Audio yükleme hatası:", error);
    }
  };

  const togglePlayPause = async () => {
    if (!sound) {
      await loadAudio();
      return;
    }

    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      console.error("Oynatma hatası:", error);
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View className="absolute left-4 right-4 bottom-6 z-20">
      <View
        className={
          "rounded-2xl border p-4 shadow-xl " +
          (isDark
            ? "border-border-dark/40 bg-background-cardDark/95"
            : "border-border-light bg-background-cardLight/95")
        }
      >
        <View className="mb-3 flex flex-row items-center gap-4">
          <Pressable
            onPress={togglePlayPause}
            className="flex size-12 items-center justify-center rounded-full bg-primary-500 shadow-[0_4px_12px_rgba(31,143,95,0.3)] active:scale-95"
          >
            <MaterialIcons
              name={isPlaying ? "pause" : "play-arrow"}
              size={24}
              color={isDark ? colors.background.dark : colors.background.light}
            />
          </Pressable>

          <View className="min-w-0 flex-1 flex-col justify-center">
            <Text
              className={
                "truncate text-base font-bold leading-tight " +
                (isDark ? "text-text-primaryDark" : "text-text-primaryLight")
              }
            >
              Surah Al-Mulk
            </Text>
            <Text
              className={
                "mt-1 truncate text-xs font-medium tracking-wide " +
                (isDark
                  ? "text-text-secondaryDark"
                  : "text-text-secondaryLight")
              }
            >
              Mishary Rashid Alafasy
            </Text>
          </View>

          <View className="flex flex-row items-center gap-2">
            <Pressable className="rounded-full p-2">
              <MaterialIcons
                name="skip-previous"
                size={22}
                color={isDark ? "#B4C6BC" : "#6B7F78"}
              />
            </Pressable>
            <Pressable className="rounded-full p-2">
              <MaterialIcons
                name="skip-next"
                size={22}
                color={isDark ? "#B4C6BC" : "#6B7F78"}
              />
            </Pressable>
          </View>
        </View>

        <View className="pt-1">
          <View
            className={
              "relative h-1 w-full overflow-hidden rounded-full " +
              (isDark ? "bg-text-secondaryDark/20" : "bg-border-light")
            }
          >
            <View
              className="absolute left-0 top-0 h-full rounded-full bg-primary-500"
              style={StyleSheet.flatten([{ width: `${progressPercentage}%` }])}
            />
          </View>
          <View className="mt-1.5 flex flex-row justify-between">
            <Text
              className={
                "text-[10px] font-medium tracking-wider " +
                (isDark
                  ? "text-text-secondaryDark"
                  : "text-text-secondaryLight")
              }
            >
              {formatTime(position)}
            </Text>
            <Text
              className={
                "text-[10px] font-medium tracking-wider " +
                (isDark
                  ? "text-text-secondaryDark"
                  : "text-text-secondaryLight")
              }
            >
              {formatTime(duration)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
