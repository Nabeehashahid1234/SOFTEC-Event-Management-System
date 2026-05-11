import { useState } from "react";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { useQueryClient } from "@tanstack/react-query";
import { Eyebrow, Pill } from "@/components/ui-bits";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export function AdminDashboard() {
  const { data: adminData } = useAdminDashboard();
  const queryClient = useQueryClient();

  const kpi = adminData?.kpi || {};
  const pendingSponsorships = adminData?.pendingSponsorships || [];
  const sponsorshipHistory = adminData?.sponsorshipHistory || [];

  const handleApproveSponsor = async (sponsorshipId: number) => {
    try {
      const response = await fetch(`/api/sponsorships/${sponsorshipId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_notes: "Approved" }),
      });
      if (response.ok) {
        toast.success("Sponsor approved");
        queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      } else {
        toast.error("Failed to approve sponsor");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleRejectSponsor = async (sponsorshipId: number) => {
    try {
      const response = await fetch(`/api/sponsorships/${sponsorshipId}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rejection_reason: "Not approved", admin_notes: "Rejected" }),
      });
      if (response.ok) {
        toast.success("Sponsor rejected");
        queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      } else {
        toast.error("Failed to reject sponsor");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
      <Eyebrow>Admin Panel</Eyebrow>
      <h1 className="font-display text-4xl font-semibold mt-3">Dashboard</h1>

      <Tabs defaultValue="overview" className="mt-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-display text-xl font-semibold">Total Registrations</h3>
              <p className="text-3xl font-bold text-primary mt-2">{kpi.total_registrations || 0}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-display text-xl font-semibold">Total Revenue</h3>
              <p className="text-3xl font-bold text-primary mt-2">${kpi.revenue_completed || 0}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-display text-xl font-semibold">Pending Tasks</h3>
              <p className="text-3xl font-bold text-primary mt-2">{kpi.pending_sponsorships || 0}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="participants">
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Payment Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsorshipHistory.map((p: any) => (
                  <TableRow key={p.participant_id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.event_name}</TableCell>
                    <TableCell>
                      <Badge variant={p.payment_status === "completed" ? "default" : "secondary"}>
                        {p.payment_status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="sponsors">
          <div className="space-y-4">
            {pendingSponsorships.map((s: any) => (
              <div key={s.sponsorship_id} className="rounded-lg border border-border bg-card p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display text-lg font-semibold">{s.company_name}</h3>
                    <p className="text-sm text-muted-foreground">{s.event_name}</p>
                    <p className="text-sm mt-2">{s.sponsorship_type}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleApproveSponsor(s.sponsorship_id)} size="sm">
                      Approve
                    </Button>
                    <Button onClick={() => handleRejectSponsor(s.sponsorship_id)} variant="destructive" size="sm">
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}