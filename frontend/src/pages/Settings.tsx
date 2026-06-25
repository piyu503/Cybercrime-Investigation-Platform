import { Settings as SettingsIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlaceholderPanel } from "@/components/layout/PlaceholderPanel";

export default function Settings() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Module 06"
        title="Settings"
        description="Officer preferences, unit configuration, and system access controls."
      />
      <PlaceholderPanel icon={SettingsIcon} module="Settings" />
    </div>
  );
}
