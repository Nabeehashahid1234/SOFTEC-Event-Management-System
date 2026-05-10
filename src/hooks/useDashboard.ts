import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { AxiosError } from "axios";

interface DashboardState {
  loading: boolean;
  error: string | null;
  data: any;
}

function fallbackDashboard(role?: string) {
  if (role === "admin") {
    return { kpi: {}, roleDistribution: [], categoryDistribution: [], venueUtilization: [], topPrograms: [], revenueBreakdown: [], recentActivity: [], paymentStatus: [] };
  }
  if (role === "participant") {
    return { myEvents: [], upcomingEvents: [], payments: [], accommodation: [], teams: [], passes: [], leaderboards: [], stats: {} };
  }
  if (role === "organizer") {
    return { events: [], judges: [], rounds: [], venueConflicts: [], stats: {} };
  }
  if (role === "judge") {
    return { assigned: [], submitted: [], pending: [], leaderboard: [], stats: {} };
  }
  if (role === "sponsor") {
    return { sponsorInfo: null, sponsoredEvents: [], payments: [], history: [], stats: {} };
  }
  return {};
}

export function useDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<DashboardState>({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    if (authLoading || !user) {
      setState({ loading: true, error: null, data: null });
      return;
    }

    const fetchDashboard = async () => {
      try {
        setState({ loading: true, error: null, data: null });

        let endpoint = "";
        switch (user.role) {
          case "admin":
            endpoint = "/dashboard/admin";
            break;
          case "participant":
            endpoint = "/dashboard/participant";
            break;
          case "organizer":
            endpoint = "/dashboard/organizer";
            break;
          case "judge":
            endpoint = "/dashboard/judge";
            break;
          case "sponsor":
            endpoint = "/dashboard/sponsor";
            break;
          default:
            throw new Error(`Unknown role: ${user.role}`);
        }

        const response = await api.get(endpoint);
        if (response.data.success) {
          setState({ loading: false, error: null, data: response.data.data || fallbackDashboard(user.role) });
        } else {
          setState({ loading: false, error: response.data.error || "Failed to load dashboard", data: fallbackDashboard(user.role) });
        }
      } catch (err) {
        const message = err instanceof AxiosError
          ? err.response?.data?.error || err.message
          : err instanceof Error
          ? err.message
          : "Failed to load dashboard";
        setState({ loading: false, error: message, data: fallbackDashboard(user.role) });
      }
    };

    fetchDashboard();
  }, [user, authLoading]);

  return state;
}
