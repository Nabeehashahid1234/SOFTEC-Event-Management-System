import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { USERS, type Role } from "@/lib/mock";
import { Eyebrow, Pill } from "@/components/ui-bits";
import { cn } from "@/lib/format";

export const Route = createFileRoute("/app/users")({ component: Members });

function Members() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState<"all" | Role>("all");
  const list = USERS.filter(u =>
    (role === "all" || u.role === role) &&
    (u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()))
  );
  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
      <Eyebrow>Roster</Eyebrow>
      <h1 className="font-display text-4xl font-semibold mt-3">Member <em className="italic">Roster</em>.</h1>

      <div className="mt-6 flex flex-wrap gap-3 items-center">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search members…" className="px-4 py-2 rounded-md border border-border bg-card text-sm w-64 outline-none focus:border-primary" />
        {(["all","admin","participant","organizer","judge","sponsor"] as const).map(r => (
          <button key={r} onClick={() => setRole(r)} className={cn(
            "px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider",
            role === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}>{r}</button>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
            <th className="p-4">Name</th><th>Email</th><th>Role</th><th>ID</th>
          </tr></thead>
          <tbody>
            {list.map(u => (
              <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer">
                <td className="p-4 font-medium">{u.name}</td>
                <td className="text-muted-foreground">{u.email}</td>
                <td><Pill tone={u.role === "admin" ? "ink" : u.role === "sponsor" ? "gold" : u.role === "judge" ? "rose" : "muted"}>{u.role}</Pill></td>
                <td className="font-mono text-xs tabular text-muted-foreground">{u.rollNumber ?? u.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
