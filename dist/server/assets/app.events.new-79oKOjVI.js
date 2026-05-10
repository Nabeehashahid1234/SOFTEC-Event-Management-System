import { r as reactExports, W as jsxRuntimeExports } from "./server-DF9qAbDw.js";
import { E as Eyebrow } from "./ui-bits-JagVtLz-.js";
import { j as useVenues, b as useEvents, k as useCreateEvent, t as toast } from "./router-BDNVtE_0.js";
import { c as cn, f as fmtDate } from "./format-CIANsOqg.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "util";
import "stream";
import "path";
import "http";
import "https";
import "url";
import "fs";
import "crypto";
import "http2";
import "assert";
import "./worker-entry-so00yvqm.js";
import "node:events";
import "os";
import "zlib";
import "events";
const STEPS = ["Basics", "Schedule", "Venue", "Judges", "Pricing", "Review"];
function NewEvent() {
  const [step, setStep] = reactExports.useState(0);
  const {
    data: venues = []
  } = useVenues();
  const {
    data: events = []
  } = useEvents();
  const createEvent = useCreateEvent();
  const [venueId, setVenueId] = reactExports.useState(null);
  const [date, setDate] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const [name, setName] = reactExports.useState("");
  const [desc, setDesc] = reactExports.useState("");
  const [fee, setFee] = reactExports.useState(0);
  const [capacity, setCapacity] = reactExports.useState(100);
  const [category, setCategory] = reactExports.useState("Tech Events");
  const month = new Date(date).getMonth();
  const year = new Date(date).getFullYear();
  const days = new Date(year, month + 1, 0).getDate();
  const venueEvents = events.filter((e) => e.venueId === venueId);
  const submit = async () => {
    if (!name.trim() || !venueId) {
      toast.error("Name and venue are required.");
      return;
    }
    try {
      await createEvent.mutateAsync({
        event_name: name,
        description: desc,
        category,
        event_date: date,
        max_participants: capacity,
        venue_id: venueId,
        registration_fee: fee
      });
      toast.success("Programme created.");
      setStep(0);
      setName("");
      setDesc("");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Could not create programme.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1280px] mx-auto px-6 lg:px-10 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "New programme" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl font-semibold mt-3", children: [
      "Create a ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "italic", children: "programme" }),
      "."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 mb-10 flex items-center gap-2", children: STEPS.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("font-mono text-[10px] uppercase tracking-wider", i === step ? "text-primary" : "text-muted-foreground"), children: [
        String(i + 1).padStart(2, "0"),
        " · ",
        s
      ] }),
      i < STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex-1 h-px", i < step ? "bg-primary" : "bg-border") })
    ] }, s)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 rounded-lg border border-border bg-card p-7 space-y-5", children: [
        step === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Programme name", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "inp", value: name, onChange: (e) => setName(e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Excerpt", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 3, className: "inp", value: desc, onChange: (e) => setDesc(e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Category", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "inp", value: category, onChange: (e) => setCategory(e.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Tech Events", children: "Tech Events" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Business Competitions", children: "Business Competitions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Gaming Tournaments", children: "Gaming Tournaments" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "General Events", children: "General Events" })
          ] }) })
        ] }),
        step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Date", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", className: "inp", value: date, onChange: (e) => setDate(e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Time", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "time", className: "inp", defaultValue: "10:00" }) })
        ] }),
        step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Venue", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "inp", value: venueId ?? "", onChange: (e) => setVenueId(Number(e.target.value)), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: "Select venue" }),
            venues.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: v.venue_id, children: [
              v.venue_name,
              " · capacity ",
              v.capacity
            ] }, v.venue_id))
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Conflict prevention shown on the right →" })
        ] }),
        step >= 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Registration fee (PKR)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 0, className: "inp", value: fee, onChange: (e) => setFee(Number(e.target.value)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Max participants", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 1, className: "inp", value: capacity, onChange: (e) => setCapacity(Number(e.target.value)) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-5 border-t border-border flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep((s) => Math.max(0, s - 1)), className: "text-sm text-muted-foreground hover:text-foreground", children: "← Back" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => step < STEPS.length - 1 ? setStep((s) => s + 1) : submit(), className: "bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-medium hover:bg-primary-dark disabled:opacity-60", disabled: createEvent.isPending, children: step < STEPS.length - 1 ? "Continue →" : createEvent.isPending ? "Publishing..." : "Publish" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "rounded-lg border border-border bg-card p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "Venue schedule" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-base font-medium mt-2", children: venues.find((v) => v.venue_id === venueId)?.venue_name || "Select venue" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-1", children: new Date(year, month).toLocaleString("en-GB", {
          month: "long",
          year: "numeric"
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid grid-cols-7 gap-1", children: Array.from({
          length: days
        }).map((_, i) => {
          const d = new Date(year, month, i + 1);
          const conflict = venueEvents.some((e) => new Date(e.date).toDateString() === d.toDateString());
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { title: conflict ? "Booked" : "Free", className: cn("aspect-square rounded grid place-items-center font-mono text-[10px] tabular border", conflict ? "bg-rose/15 text-rose border-rose/30" : "bg-sage/10 text-sage border-sage/20"), children: i + 1 }, i);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-3 text-[10px] font-mono uppercase tracking-wider", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-sm bg-sage" }),
            " Free"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-sm bg-rose" }),
            " Booked"
          ] })
        ] }),
        venueEvents.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 pt-4 border-t border-border space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground", children: "Existing bookings" }),
          venueEvents.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: e.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] tabular text-muted-foreground", children: fmtDate(e.date) })
          ] }, e.id))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `.inp{margin-top:.5rem;width:100%;background:transparent;border:0;border-bottom:1px solid var(--border);outline:none;padding:.5rem 0;font-size:.875rem;transition:border-color .2s}.inp:focus{border-color:var(--primary)}` })
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
    children
  ] });
}
export {
  NewEvent as component
};
