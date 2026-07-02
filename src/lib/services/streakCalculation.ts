/**
 * Streak calculation from Supabase prayer_logs (authoritative).
 * Islamic day boundary: use effectiveToday; never reset streak for incomplete today.
 */

export interface PrayerLogRow {
  date: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

const MAX_STREAK_DAYS = 10000;

export function isDayComplete(log: PrayerLogRow): boolean {
  return (
    log.fajr === true &&
    log.dhuhr === true &&
    log.asr === true &&
    log.maghrib === true &&
    log.isha === true
  );
}

export interface DailyCompletionRow {
  date: string;
  complete: boolean;
}

/**
 * Calculate streak from a merged set of completion rows (Supabase-synced days
 * plus local days not yet synced). A date counts as complete if ANY source
 * reports it complete. This avoids undercounting the streak while a day is
 * still sitting in the local sync queue (e.g. right after the imsak reset,
 * or after being offline for a few days), which would otherwise look
 * "missing" from Supabase's perspective and break the streak early.
 */
export function calculateStreakFromMergedLogs(
  rows: DailyCompletionRow[],
  effectiveToday: string
): number {
  const byDate = new Map<string, boolean>();
  for (const row of rows) {
    byDate.set(row.date, byDate.get(row.date) === true || row.complete);
  }

  const todayComplete = byDate.get(effectiveToday) === true;
  const startDate = todayComplete ? effectiveToday : getPreviousDateString(effectiveToday);

  let streak = 0;
  let checkDate = startDate;
  let iterations = 0;

  while (iterations < MAX_STREAK_DAYS) {
    iterations++;
    if (byDate.get(checkDate) !== true) break;
    streak++;
    checkDate = getPreviousDateString(checkDate);
  }

  return streak;
}

export function getPreviousDateString(yyyyMmDd: string): string {
  const [y, m, d] = yyyyMmDd.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - 1);
  const py = date.getFullYear();
  const pm = String(date.getMonth() + 1).padStart(2, '0');
  const pd = String(date.getDate()).padStart(2, '0');
  return `${py}-${pm}-${pd}`;
}
