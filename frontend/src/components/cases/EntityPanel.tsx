import { FileMetadata } from "@/types/case.types";
import { Badge } from "@/components/ui/badge";
import { Users, Phone, Car, MapPin, Calendar, Clock, Building, Mail, DollarSign, Fingerprint } from "lucide-react";

interface EntityPanelProps {
  file: FileMetadata;
}

const ENTITY_CONFIG = {
  persons: { icon: Users, label: "Persons", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  phones: { icon: Phone, label: "Phones", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  vehicles: { icon: Car, label: "Vehicles", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
  locations: { icon: MapPin, label: "Locations", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  dates: { icon: Calendar, label: "Dates", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  times: { icon: Clock, label: "Times", color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
  organizations: { icon: Building, label: "Organizations", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
  emails: { icon: Mail, label: "Emails", color: "text-sky-400 bg-sky-500/10 border-sky-500/20" },
  money: { icon: DollarSign, label: "Money", color: "text-green-400 bg-green-500/10 border-green-500/20" },
  evidence_ids: { icon: Fingerprint, label: "Evidence IDs", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
};

export default function EntityPanel({ file }: EntityPanelProps) {
  const entities = file.processed_data?.entities;
  if (!entities) return null;

  // Typecast since we know confidence exists as a dictionary now
  const confidences = (entities as any).confidence || {};

  return (
    <div className="p-4 bg-white/[0.02] border-t border-white/5 space-y-4">
      <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider">Extracted Entities</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.keys(ENTITY_CONFIG) as Array<keyof typeof ENTITY_CONFIG>).map((key) => {
          const config = ENTITY_CONFIG[key];
          // Assert that the array is string[] based on our new types
          const items = (entities as any)[key] as string[] || [];
          const Icon = config.icon;
          
          if (items.length === 0) return null;

          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center gap-2 text-white/50 text-xs">
                <Icon className="h-3.5 w-3.5" />
                <span>{config.label} ({items.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {items.map((item, idx) => {
                  const confValue = confidences[item];
                  return (
                    <Badge key={idx} variant="outline" className={`text-[10px] ${config.color}`}>
                      {item} {confValue !== undefined && <span className="opacity-50 ml-1">{Math.round(confValue * 100)}%</span>}
                    </Badge>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      {file.processed_data?.extracted_text && (
         <div className="pt-2">
             <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Raw Text Snippet</h4>
             <p className="text-xs text-white/40 font-mono bg-black/40 p-3 rounded border border-white/5 line-clamp-3">
                 {file.processed_data.extracted_text}
             </p>
         </div>
      )}
    </div>
  );
}
