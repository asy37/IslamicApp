import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quranBookmarkRepo } from "@/lib/sqlite/quran-bookmark/repository";
import { queryKeys } from "@/lib/query/queryKeys";
import { Ayah } from "@/types/quran";
import { Alert } from "react-native";

export const useQuranBookmarks = () => {
  const queryClient = useQueryClient();

  // Query to get all liked/bookmarked Ayah numbers
  const { data: likedAyahNumbers = [], refetch: refetchBookmarks } = useQuery({
    queryKey: queryKeys.quranBookmarks.likedNumbers(),
    queryFn: async () => {
      const list = await quranBookmarkRepo.getBookmarks();
      return list.map((a) => a.number);
    },
  });

  // Mutation to toggle bookmark
  const toggleLikeMutation = useMutation({
    mutationFn: async (ayah: Ayah) => {
      const isCurrentlyLiked = likedAyahNumbers.includes(ayah.number);
      if (isCurrentlyLiked) {
        await quranBookmarkRepo.removeBookmark(ayah.number);
      } else {
        await quranBookmarkRepo.addBookmark(ayah);
      }
    },
    onSuccess: () => {
      refetchBookmarks();
      // Invalidate both dailyVerse queries and bookmarks queries to keep UI in sync
      queryClient.invalidateQueries({ queryKey: queryKeys.quranBookmarks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dailyVerse.all });
    },
    onError: (err) => {
      console.error("[QuranScreen] Error toggling bookmark:", err);
      Alert.alert("Error toggling bookmark", String(err));
    },
  });

  return {
    likedAyahNumbers,
    toggleBookmark: (ayah: Ayah) => toggleLikeMutation.mutate(ayah),
    isToggling: toggleLikeMutation.isPending,
  };
};
