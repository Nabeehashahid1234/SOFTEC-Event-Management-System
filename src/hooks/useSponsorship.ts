import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface ApiSponsor {
  sponsor_id: number;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string | null;
  sponsorship_level: "Gold" | "Silver" | "Bronze";
  amount: number;
  total_sponsored?: number;
  events_count?: number;
}

export interface ApiSponsorship {
  sponsorship_id: number;
  sponsor_id: number;
  event_id: number | null;
  sponsorship_type: "Gold" | "Silver" | "Title";
  amount: number;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  event_name?: string;
  event_date?: string;
  category?: string;
  company_name?: string;
}

export function useSponsors() {
  return useQuery({
    queryKey: ["sponsors"],
    queryFn: async () => {
      const res = await api.get("/sponsorships/sponsors");
      return (res.data.data || []) as ApiSponsor[];
    },
  });
}

export function useMySponsorships() {
  return useQuery({
    queryKey: ["my-sponsorships"],
    queryFn: async () => {
      const res = await api.get("/sponsorships");
      return (res.data.data || []) as ApiSponsorship[];
    },
  });
}

export function useCreateSponsorship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { event_id: number; sponsorship_type: "Gold" | "Silver" | "Title"; amount: number }) => {
      const res = await api.post("/sponsorships", payload);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-sponsorships"] });
      qc.invalidateQueries({ queryKey: ["sponsors"] });
    },
  });
}

export function useSponsorProfile() {
  return useQuery({
    queryKey: ["sponsor-profile"],
    queryFn: async () => {
      const res = await api.get("/sponsorships/my-profile");
      return res.data.data as ApiSponsor | null;
    },
  });
}

export function useUpsertSponsorProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      company_name: string;
      contact_person: string;
      email: string;
      phone?: string;
      sponsorship_level: "Gold" | "Silver" | "Bronze";
      amount: number;
    }) => {
      const res = await api.post("/sponsorships/profile", payload);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sponsor-profile"] });
    },
  });
}