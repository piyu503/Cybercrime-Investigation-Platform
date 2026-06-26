import { History } from "lucide-react";
import { CaseSelector } from "@/components/cases/CaseSelector";

export default function Timeline() {
  return (
    <div className="h-full">
      <CaseSelector 
        intent="timeline" 
        title="Global Timeline" 
        description="Select a project to view the chronological reconstruction of events and actions." 
        icon={History} 
      />
    </div>
  );
}
