import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface ApiUser {
  user_id: number;
  name: string;
  email: string;
  role: "admin" | "participant" | "organizer" | "judge" | "sponsor";
  status: "active" | "inactive" | "suspended";
  created_at: string;
}

export function useUsers(filters?: { role?: string; q?: string }) {
  return useQuery({
    queryKey: ["users", filters?.role || "all", filters?.q || ""],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters?.role && filters.role !== "all") params.role = filters.role;
      if (filters?.q) params.q = filters.q;
      const res = await api.get("/users", { params });
      return (res.data.data || []) as ApiUser[];
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: number; data: Partial<Pick<ApiUser, "name" | "role" | "status">> }) => {
      const res = await api.patch(`/users/${userId}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: number) => {
      const res = await api.delete(`/users/${userId}`);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
