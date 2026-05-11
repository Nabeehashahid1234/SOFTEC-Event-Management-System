import { useQuery } from "@tanstack/react-query";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/admin");
      if (!response.ok) throw new Error("Failed to fetch admin dashboard");
      const data = await response.json();
      return data.data;
    },
  });
}