import { useEffect, useState } from "react";
import * as Location from "expo-location";

type HeadingState = {
  heading: number | null;
  accuracy: number | null;
};

/**
 * expo-location'ın watchHeadingAsync API'sini kullanarak
 * cihazın gerçek manyetik heading'ini alır.
 * Bu API, platform seviyesinde sensör füzyonu yapar ve
 * magnetometer'dan çok daha güvenilir sonuç verir.
 *
 * heading: 0-360 (Kuzey=0)
 * accuracy: iOS'ta derece cinsinden hata payı, Android'de null olabilir
 */
export function useDeviceHeading(_updateIntervalMs: number = 100): HeadingState {
  const [heading, setHeading] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      subscription = await Location.watchHeadingAsync((data) => {
        // magHeading: manyetik kuzey referanslı heading
        // trueHeading: coğrafi kuzey referanslı (deklinasyon düzeltmeli)
        // trueHeading varsa onu kullan, yoksa magHeading
        const h = data.trueHeading >= 0 ? data.trueHeading : data.magHeading;
        setHeading(h);
        // accuracy: iOS'ta derece cinsinden, Android'de -1 olabilir
        setAccuracy(data.accuracy >= 0 ? data.accuracy : null);
      });
    })();

    return () => {
      subscription?.remove();
    };
  }, []);

  return { heading, accuracy };
}

