import { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useUserId } from "../../auth/hooks/useUser";
import { getDhikrStatsSummary } from "@/lib/sqlite/dhikr/stats.service";
import type { DhikrStats } from "@/features/dhikir/types";

export function useDhikrStats() {
  const { user } = useAuth();
  const { userId } = useUserId();
  const userIdToUse = user?.id ?? userId;

  const [stats, setStats] = useState<DhikrStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userIdToUse) {
      setLoading(false);
      setStats(null);
      return;
    }

    async function load() {
      setLoading(true);
      const data = await getDhikrStatsSummary(userIdToUse);
      setStats(data);
      setLoading(false);
    }

    load();
  }, [userIdToUse]);

  return { stats, loading };
}