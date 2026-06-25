import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

/**
 * A persistent, low-noise strip above the main chrome — the kind of
 * classification / system-status banner real investigative tooling
 * (case management, forensic extraction suites) always carries.
 * It is informational, not decorative: it tells an officer which
 * system they're in, on what channel, and what time it is for the
 * audit trail. Mono type, no color beyond the palette's success green
 * for the connection dot.
 */
export function SystemStatusBar() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeLabel = now.toLocaleTimeString("en-GB", {
    timeZone: "UTC",
    hour12: false,
  });

  return (
    <div
      className="flex h-[var(--statusbar-height)] w-full shrink-0 items-center justify-between border-b border-secondary bg-primary px-4 font-mono text-2xs text-primary-foreground/70"
      role="status"
    >
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-3 w-3 text-primary-foreground/50" />
        <span className="uppercase tracking-wider">
          Investigation Forensix &middot; Case Management System
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden items-center gap-1.5 sm:flex">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          <span className="uppercase tracking-wider">Secure Channel</span>
        </span>
        <span className="hidden uppercase tracking-wider text-primary-foreground/50 md:inline">
          Access Level: Restricted
        </span>
        <span className="tabular-nums">{timeLabel} UTC</span>
      </div>
    </div>
  );
}
