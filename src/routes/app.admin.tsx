import { createFileRoute, Navigate } from "@tanstack/react-router";

// Admin functionality lives at /app/dashboard — redirect here
export const Route = createFileRoute("/app/admin")({
  component: () => <Navigate to="/app/dashboard" />,
});
