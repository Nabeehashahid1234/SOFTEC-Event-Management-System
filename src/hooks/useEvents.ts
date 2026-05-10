import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type UiCategory = "Tech" | "Business" | "Gaming" | "General";

export interface UiEvent {
  id: string;
  name: string;
  category: UiCategory;
  excerpt: string;
  description: string;
  date: string;
  fee: number;
  capacity: number;
  registered: number;
  venueId: number | null;
  venueName: string;
  rules: string[];
  prizePool: number;
}

const categoryMap: Record<string, UiCategory> = {
  "Tech Events": "Tech",
  "Business Competitions": "Business",
  "Gaming Tournaments": "Gaming",
  "General Events": "General",
};

const dbCategoryMap: Record<UiCategory, string> = {
  Tech: "Tech Events",
  Business: "Business Competitions",
  Gaming: "Gaming Tournaments",
  General: "General Events",
};

function mapEvent(row: any): UiEvent {
  return {
    id: String(row.event_id),
    name: String(row.event_name),
    category: categoryMap[row.category] || "General",
    excerpt: String(row.description || "").slice(0, 160),
    description: String(row.description || ""),
    date: new Date(row.event_date).toISOString(),
    fee: Number(row.registration_fee || 0),
    capacity: Number(row.max_participants || 0),
    registered: Number(row.registered_participants || 0),
    venueId: row.venue_id == null ? null : Number(row.venue_id),
    venueName: String(row.venue_name || "TBD"),
    rules: [],
    prizePool: 0,
  };
}

export function useEvents(filters?: { category?: UiCategory }) {
  return useQuery({
    queryKey: ["events", filters],
    queryFn: async () => {
      const params: any = {};
      if (filters?.category) params.category = dbCategoryMap[filters.category];
      const res = await api.get("/events", { params });
      return (res.data.data || []).map(mapEvent) as UiEvent[];
    },
  });
}

export function useEvent(eventId: string) {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const res = await api.get(`/events/${eventId}`);
      const payload = res.data.data;
      return {
        event: mapEvent(payload.event),
        rounds: (payload.rounds || []).map((r: any) => ({
          name: String(r.round_type),
          date: new Date(r.round_date).toISOString(),
          venue: payload.event.venue_name || "TBD",
        })),
        leaderboard: payload.leaderboard || [],
      };
    },
    enabled: Boolean(eventId),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      event_name: string;
      description?: string;
      category: "Tech Events" | "Business Competitions" | "Gaming Tournaments" | "General Events";
      event_date: string;
      max_participants: number;
      venue_id: number;
      registration_fee: number;
    }) => {
      const res = await api.post("/events", payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useVenues() {
  return useQuery({
    queryKey: ["venues"],
    queryFn: async () => {
      const res = await api.get("/venues");
      return res.data.data || [];
    },
  });
}
