import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Navigate } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/AdminDashboard";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <Navigate to="/app/dashboard" />;
  }

  return <AdminDashboard />;
}