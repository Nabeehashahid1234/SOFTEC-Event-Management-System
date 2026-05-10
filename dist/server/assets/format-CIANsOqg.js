const fmtPKR = (n) => "PKR " + new Intl.NumberFormat("en-PK").format(n);
const fmtDate = (iso, opts) => new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const fmtTime = (iso) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
function countdown(iso) {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, past: true };
  const d = Math.floor(diff / 864e5);
  const h = Math.floor(diff % 864e5 / 36e5);
  const m = Math.floor(diff % 36e5 / 6e4);
  return { d, h, m, past: false };
}
const cn = (...c) => c.filter(Boolean).join(" ");
export {
  fmtPKR as a,
  countdown as b,
  cn as c,
  fmtTime as d,
  fmtDate as f
};
