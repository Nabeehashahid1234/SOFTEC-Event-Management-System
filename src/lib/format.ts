export const fmtPKR = (n: number) =>
  "PKR " + new Intl.NumberFormat("en-PK").format(n);

export const fmtNum = (n: number) => new Intl.NumberFormat("en-US").format(n);

export const fmtDate = (iso: string, opts?: Intl.DateTimeFormatOptions) =>
  new Date(iso).toLocaleDateString("en-GB", opts ?? { day: "2-digit", month: "short", year: "numeric" });

export const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

export function countdown(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, past: true };
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return { d, h, m, past: false };
}

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
