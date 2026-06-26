import { FileText } from "lucide-react";
import { CaseSelector } from "@/components/cases/CaseSelector";

export default function Reports() {
  return (
    <div className="h-full">
      <CaseSelector 
        intent="reports" 
        title="Generated Reports" 
        description="Select a project to view case summaries, forensic findings, and export documents." 
        icon={FileText} 
      />
    </div>
  );
}
