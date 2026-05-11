import { createFileRoute, Navigate } from "@tanstack/react-router";

// Admin dashboard now lives at /app/dashboard (inside the app shell with AdminSidebar)
export const Route = createFileRoute("/admin/dashboard")({
  component: () => <Navigate to="/app/dashboard" />,
});
