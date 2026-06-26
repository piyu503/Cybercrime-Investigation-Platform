import { Fingerprint } from "lucide-react";
import { CaseSelector } from "@/components/cases/CaseSelector";

export default function Evidence() {
  return (
    <div className="h-full">
      <CaseSelector 
        intent="evidence" 
        title="Evidence Vault" 
        description="Select a project to view and process digital evidence, documents, and extracted metadata." 
        icon={Fingerprint} 
      />
    </div>
  );
}
