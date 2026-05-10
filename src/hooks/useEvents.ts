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

function asArray<T = any>(value: unknown): T[] {
  return Array.isArray(value) ? value as T[] : [];
}

function safeIsoDate(value: unknown): string {
  const date = value ? new Date(String(value)) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toISOString() : new Date().toISOString();
}

function mapEvent(row: any): UiEvent {
  const safe = row || {};
  return {
    id: String(safe.event_id ?? safe.id ?? ""),
    name: String(safe.event_name ?? safe.name ?? "Untitled event"),
    category: categoryMap[safe.category] || safe.category || "General",
    excerpt: String(safe.description || "").slice(0, 160),
    description: String(safe.description || ""),
    date: safeIsoDate(safe.event_date ?? safe.date),
    fee: Number(safe.registration_fee ?? safe.fee ?? 0),
    capacity: Number(safe.max_participants ?? safe.capacity ?? 0),
    registered: Number(safe.registered_participants ?? safe.registered ?? 0),
    venueId: safe.venue_id == null ? null : Number(safe.venue_id),
    venueName: String(safe.venue_name || "TBD"),
    rules: [],
    prizePool: Number(safe.total_prize_pool ?? safe.prize_pool ?? 0),
  };
}

export function useEvents(filters?: { category?: UiCategory }) {
  return useQuery({
    queryKey: ["events", filters],
    queryFn: async () => {
      const params: any = {};
      if (filters?.category) params.category = dbCategoryMap[filters.category];
      const res = await api.get("/events", { params });
      return asArray(res.data?.data).map(mapEvent) as UiEvent[];
    },
  });
}

export function useEvent(eventId: string) {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const res = await api.get(`/events/${eventId}`);
      const payload = res.data?.data || {};
      const event = payload.event || {};
      return {
        event: mapEvent(event),
        rounds: asArray(payload.rounds).map((r: any) => ({
          name: String(r.round_type),
          date: safeIsoDate(r.round_date),
          venue: event.venue_name || "TBD",
        })),
        leaderboard: asArray(payload.leaderboard),
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
      return asArray(res.data?.data);
    },
  });
}
