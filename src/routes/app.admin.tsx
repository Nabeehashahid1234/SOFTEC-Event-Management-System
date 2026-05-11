import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Navigate } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/AdminDashboard";

export const Route = createFileRoute("/app/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { user } = useAuth();

  if (!user || (user.role !== "admin" && user.role !== "organizer")) {
    return <Navigate to="/app/dashboard" />;
  }

  return <AdminDashboard />;
}