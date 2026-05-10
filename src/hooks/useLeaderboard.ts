import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface ApiLeaderboardRow {
  rank: number;
  participant_id: number;
  name: string;
  score: number;
}

export function useLeaderboard(eventId?: string) {
  return useQuery({
    queryKey: ["leaderboard", eventId],
    queryFn: async () => {
      const res = await api.get(`/reports/leaderboard/${eventId}`);
      return (res.data.data || []) as ApiLeaderboardRow[];
    },
    enabled: Boolean(eventId),
  });
}