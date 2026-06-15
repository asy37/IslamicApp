import { AdhanView } from "@/features/adhan/view/AdhanView";
import { ErrorView } from "@/lib/components/error";
import { usePrayerTimesStore } from "@/lib/storage/prayerTimesStore";

export default function AdhanScreen() {
  const todayData = usePrayerTimesStore((state) => state.getTodayData());

  if (!todayData) {
    return (
      <ErrorView text="adhan.error.message" />
    )
  }
  return (
    <AdhanView todayData={todayData} />
  );
}
