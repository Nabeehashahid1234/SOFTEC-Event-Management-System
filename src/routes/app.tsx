import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { TopBar } from "@/components/TopBar";
import { AUTH_TOKEN_KEY } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/format";

export const Route = createFileRoute("/app")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) throw redirect({ to: "/login" });
    }
  },
  component: AppShell,
});

function AppShell() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className={cn("min-h-screen flex bg-background", isAdmin && "dark")}>
      {isAdmin ? <AdminSidebar /> : <Sidebar />}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 animate-fade-in overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
