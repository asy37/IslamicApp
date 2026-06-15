import { useRef, useState } from "react";
import { View, Share } from "react-native";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { useTranslation } from "@/lib/i18n";
import { Ayah } from "@/types/quran";
import { generateAyahShareText } from "../utils/utils";

export const useQuranShare = () => {
  const { t } = useTranslation();
  const [shareAyah, setShareAyah] = useState<Ayah | null>(null);
  const shareViewShotRef = useRef<View>(null);

  const handleShare = async (ayah: Ayah) => {
    setShareAyah(ayah);
    // Wait for state rendering off-screen before capture
    setTimeout(async () => {
      try {
        if (!shareViewShotRef.current) return;
        const uri = await captureRef(shareViewShotRef, {
          format: "png",
          quality: 0.9,
        });
        await Sharing.shareAsync(uri);
      } catch (error) {
        console.error("Error sharing quran card image:", error);
        // Fallback to text share
        const text = generateAyahShareText(ayah, t);
        await Share.share({ message: text });
      } finally {
        setShareAyah(null);
      }
    }, 150);
  };

  return {
    shareAyah,
    shareViewShotRef,
    handleShare,
  };
};
