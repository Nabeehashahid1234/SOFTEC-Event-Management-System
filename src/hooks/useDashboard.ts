import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import type { AxiosError } from "axios";

function fallbackDashboard(role?: string) {
  if (role === "admin") {
    return { kpi: {}, roleDistribution: [], categoryDistribution: [], venueUtilization: [], topPrograms: [], revenueBreakdown: [], pendingSponsorships: [], sponsorshipHistory: [], recentActivity: [], paymentStatus: [], allEvents: [] };
  }
  if (role === "participant") {
    return { myEvents: [], upcomingEvents: [], payments: [], accommodation: [], teams: [], passes: [], leaderboards: [], stats: {} };
  }
  if (role === "organizer") {
    return { events: [], judges: [], rounds: [], venueConflicts: [], participants: [], stats: {} };
  }
  if (role === "judge") {
    return { assigned: [], submitted: [], pending: [], leaderboard: [], participants: [], stats: {} };
  }
  if (role === "sponsor") {
    return { sponsorInfo: null, sponsoredEvents: [], payments: [], history: [], stats: {} };
  }
  return {};
}

const ENDPOINTS: Record<string, string> = {
  admin:       "/dashboard/admin",
  participant: "/dashboard/participant",
  organizer:   "/dashboard/organizer",
  judge:       "/dashboard/judge",
  sponsor:     "/dashboard/sponsor",
};

export function useDashboard() {
  const { user, loading: authLoading } = useAuth();

  const { isLoading, error, data } = useQuery({
    queryKey: ["dashboard", user?.role],
    queryFn: async () => {
      if (!user) return fallbackDashboard();
      const endpoint = ENDPOINTS[user.role];
      if (!endpoint) throw new Error(`Unknown role: ${user.role}`);

      const response = await api.get(endpoint);
      if (response.data.success) {
        return response.data.data ?? fallbackDashboard(user.role);
      }
      throw new Error(response.data.error || "Failed to load dashboard");
    },
    enabled: !authLoading && Boolean(user),
    staleTime: 30_000,
    gcTime: 60_000,
    retry: 1,
  });

  const errorMessage = error
    ? error instanceof Error
      ? error.message
      : ((error as AxiosError<any>)?.response?.data?.error ?? "Failed to load dashboard")
    : null;

  return {
    loading: isLoading,
    error: errorMessage,
    data: data ?? null,
  };
}
