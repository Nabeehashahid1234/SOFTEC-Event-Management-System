import { createFileRoute, Link } from "@tanstack/react-router";
import { Eyebrow } from "@/components/ui-bits";
import { BedDouble } from "lucide-react";

export const Route = createFileRoute("/app/accommodation")({ component: Lodging });

function Lodging() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
      <Eyebrow>On-campus lodging</Eyebrow>
      <h1 className="font-display text-4xl font-semibold mt-3">
        Find a <em className="italic">room</em>.
      </h1>
      <p className="text-muted-foreground mt-3 max-w-2xl">
        On-site accommodation for out-of-town participants.
      </p>

      <div className="mt-10 rounded-lg border border-dashed border-border bg-card p-16 flex flex-col items-center text-center">
        <div className="h-14 w-14 rounded-full bg-muted grid place-items-center mb-5">
          <BedDouble className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="font-display text-xl font-semibold">Bookings open soon</p>
        <p className="text-sm text-muted-foreground mt-3 max-w-sm leading-relaxed">
          Accommodation booking will be available closer to the event date. Check back here or contact the SOFTEC organising committee for arrangements.
        </p>
        <Link
          to="/app/dashboard"
          className="mt-8 text-sm text-primary hover:underline"
        >
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}
