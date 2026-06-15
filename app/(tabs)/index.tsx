import { usePrayerTrackingLocal, convertToPrayerTrackingData } from "@/features/prayer-tracking/hooks/usePrayerTrackingLocal";
import { useAutoSync } from "@/features/adhan/hooks/usePrayerSync";
import { PrayView } from "@/features/prayer-tracking/view";
import { ErrorView } from "@/lib/components/error";


export default function PrayerTrackingScreen() {


  // Setup auto sync
  useAutoSync();

  // Get local prayer state
  const { data: localState, isLoading, error } = usePrayerTrackingLocal();

  // Convert local state to PrayerTrackingData format
  const data = localState ? convertToPrayerTrackingData(localState) : null;
  if (error || !data) {
    return (
      <ErrorView text="prayer.errorLoading" />
    );
  }
  return (
    <PrayView data={data} isLoading={isLoading} error={error} />
  );
}
