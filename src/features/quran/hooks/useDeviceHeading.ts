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
export function useDeviceHeading(updateIntervalMs: number = 100): HeadingState {
  const [heading, setHeading] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    let lastUpdateTime = 0;
    let timeoutId: NodeJS.Timeout | null = null;
    let pendingData: { heading: number; accuracy: number | null } | null = null;

    const commitData = (h: number, acc: number | null) => {
      setHeading(h);
      setAccuracy(acc);
      lastUpdateTime = Date.now();
      pendingData = null;
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      subscription = await Location.watchHeadingAsync((data) => {
        const h = data.trueHeading >= 0 ? data.trueHeading : data.magHeading;
        const acc = data.accuracy >= 0 ? data.accuracy : null;
        const now = Date.now();

        if (now - lastUpdateTime >= updateIntervalMs) {
          commitData(h, acc);
        } else {
          pendingData = { heading: h, accuracy: acc };
          if (!timeoutId) {
            timeoutId = setTimeout(() => {
              if (pendingData) {
                commitData(pendingData.heading, pendingData.accuracy);
              }
            }, updateIntervalMs - (now - lastUpdateTime));
          }
        }
      });
    })();

    return () => {
      subscription?.remove();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [updateIntervalMs]);

  return { heading, accuracy };
}

