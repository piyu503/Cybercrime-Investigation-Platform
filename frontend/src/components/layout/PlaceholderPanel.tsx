import type { ComponentType } from "react";

interface PlaceholderPanelProps {
  icon: ComponentType<{ className?: string }>;
  module: string;
}

export function PlaceholderPanel({ icon: Icon, module }: PlaceholderPanelProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-border bg-card px-6 py-20 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-muted">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">
        {module} module not yet provisioned
      </p>
      <p className="font-mono text-2xs uppercase tracking-wider text-muted-foreground">
        Status: Coming Soon
      </p>
    </div>
  );
}
