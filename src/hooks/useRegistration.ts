import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useMyRegistration(eventId: string | number) {
  return useQuery({
    queryKey: ["my-registration", eventId],
    queryFn: async () => {
      const res = await api.get(`/events/${eventId}/my-registration`);
      return res.data.data as { registered: boolean; registration: any | null };
    },
    enabled: Boolean(eventId),
  });
}

export function useRegisterEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (eventId: string | number) => {
      const res = await api.post(`/events/${eventId}/register`);
      return res.data.data;
    },
    onSuccess: (_data, eventId) => {
      qc.invalidateQueries({ queryKey: ["my-registration", String(eventId)] });
      qc.invalidateQueries({ queryKey: ["event", String(eventId)] });
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useUnregisterEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (eventId: string | number) => {
      const res = await api.delete(`/events/${eventId}/register`);
      return res.data.data;
    },
    onSuccess: (_data, eventId) => {
      qc.invalidateQueries({ queryKey: ["my-registration", String(eventId)] });
      qc.invalidateQueries({ queryKey: ["event", String(eventId)] });
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useConfirmPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: number | { paymentId: number; eventId?: string | number }) => {
      const paymentId = typeof payload === "number" ? payload : payload.paymentId;
      const res = await api.patch(`/payments/${paymentId}/confirm`);
      return res.data.data;
    },
    onSuccess: (_data, payload) => {
      const eventId = typeof payload === "number" ? undefined : payload?.eventId;
      if (eventId) {
        qc.invalidateQueries({ queryKey: ["my-registration", String(eventId)] });
        qc.invalidateQueries({ queryKey: ["event", String(eventId)] });
      }
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["dashboard", "participant"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}