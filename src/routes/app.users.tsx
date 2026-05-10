import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eyebrow, Pill } from "@/components/ui-bits";
import { cn } from "@/lib/format";
import { useUsers, useUpdateUser, useDeleteUser, type ApiUser } from "@/hooks/useUsers";
import { toast } from "sonner";
import { Loader2, Trash2, ShieldCheck, ShieldOff } from "lucide-react";

export const Route = createFileRoute("/app/users")({ component: Members });

type FilterRole = "all" | ApiUser["role"];

function Members() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState<FilterRole>("all");

  const { data: list = [], isLoading, isError } = useUsers({ role, q });
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const toggleStatus = async (u: ApiUser) => {
    const next = u.status === "active" ? "inactive" : "active";
    try {
      await updateUser.mutateAsync({ userId: u.user_id, data: { status: next } });
      toast.success(`${u.name} set to ${next}`);
    } catch {
      toast.error("Failed to update user");
    }
  };

  const handleDelete = async (u: ApiUser) => {
    if (!window.confirm(`Delete ${u.name}? This cannot be undone.`)) return;
    try {
      await deleteUser.mutateAsync(u.user_id);
      toast.success(`${u.name} deleted`);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to delete user");
    }
  };
  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
      <Eyebrow>Roster</Eyebrow>
      <h1 className="font-display text-4xl font-semibold mt-3">Member <em className="italic">Roster</em>.</h1>

      <div className="mt-6 flex flex-wrap gap-3 items-center">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search members…" className="px-4 py-2 rounded-md border border-border bg-card text-sm w-64 outline-none focus:border-primary" />
        {(["all","admin","participant","organizer","judge","sponsor"] as FilterRole[]).map(r => (
          <button key={r} onClick={() => setRole(r)} className={cn(
            "px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-colors",
            role === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}>{r}</button>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card overflow-hidden">
        {isLoading && <div className="flex items-center justify-center p-8 gap-2 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /><span className="text-sm">Loading members…</span></div>}
        {isError && <p className="p-5 text-sm text-rose-500">Could not load members.</p>}
        {!isLoading && !isError && (
          <table className="w-full text-sm">
            <thead><tr className="text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
              <th className="p-4">Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th className="pr-4 text-right">Actions</th>
            </tr></thead>
            <tbody>
              {list.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground text-sm">No members found.</td></tr>}
              {list.map(u => (
                <tr key={u.user_id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="p-4 font-medium">{u.name}</td>
                  <td className="text-muted-foreground pr-4">{u.email}</td>
                  <td className="pr-4"><Pill tone={u.role === "admin" ? "ink" : u.role === "sponsor" ? "gold" : u.role === "judge" ? "rose" : "muted"}>{u.role}</Pill></td>
                  <td className="pr-4"><span className={cn("font-mono text-[10px] uppercase tracking-wider", u.status === "active" ? "text-green-500" : "text-rose-400")}>{u.status}</span></td>
                  <td className="pr-4 font-mono text-[11px] text-muted-foreground tabular">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="pr-4 text-right"><div className="inline-flex gap-2"><button title={u.status === "active" ? "Deactivate" : "Activate"} onClick={() => toggleStatus(u)} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">{u.status === "active" ? <ShieldOff className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4 text-green-500" />}</button><button title="Delete user" onClick={() => handleDelete(u)} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-rose-500"><Trash2 className="h-4 w-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
