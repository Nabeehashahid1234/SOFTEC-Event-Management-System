import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface ApiJudgeAssignment {
  event_id: number;
  event_name: string;
  category: string;
  event_date: string;
  total_rounds: number;
}

export interface ApiPendingParticipant {
  participant_id: number;
  participant_name: string;
  event_name: string;
  event_id: number;
}

export interface ApiScore {
  judging_id: number;
  event_name: string;
  participant_name: string;
  score: number;
  comments: string | null;
  judged_at: string;
  event_id: number;
}

export function useJudgeDashboardData() {
  return useQuery({
    queryKey: ["judge-dashboard"],
    queryFn: async () => {
      const res = await api.get("/dashboard/judge");
      const data = res.data?.data || {};
      return {
        assigned: Array.isArray(data.assigned) ? data.assigned : [],
        submitted: Array.isArray(data.submitted) ? data.submitted : [],
        pending: Array.isArray(data.pending) ? data.pending : [],
        leaderboard: Array.isArray(data.leaderboard) ? data.leaderboard : [],
        stats: data.stats || { assigned_count: 0, submitted_count: 0, pending_count: 0 },
      } as {
        assigned: ApiJudgeAssignment[];
        submitted: ApiScore[];
        pending: ApiPendingParticipant[];
        leaderboard: any[];
        stats: { assigned_count: number; submitted_count: number; pending_count: number };
      };
    },
  });
}

export function useSubmitScore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { event_id: number; participant_id: number; score: number; comments?: string }) => {
      const res = await api.post("/judging", payload);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["judge-dashboard"] });
    },
  });
}
