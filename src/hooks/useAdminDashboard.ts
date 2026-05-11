import { useDashboard } from "./useDashboard";

// Thin wrapper so legacy AdminDashboard component can import this without crashing.
// All admin data is served by useDashboard when user.role === "admin".
export function useAdminDashboard() {
  const { loading, error, data } = useDashboard();
  return { data, loading, error };
}
