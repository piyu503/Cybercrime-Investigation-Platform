import { Search as SearchIcon } from "lucide-react";
import { CaseSelector } from "@/components/cases/CaseSelector";

export default function Search() {
  return (
    <div className="h-full">
      <CaseSelector 
        intent="search" 
        title="Global Search" 
        description="Select a project to search across evidence, timelines, and extracted entities." 
        icon={SearchIcon} 
      />
    </div>
  );
}
