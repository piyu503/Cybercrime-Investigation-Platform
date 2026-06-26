import { FileMetadata } from "@/types/case.types";
import { Badge } from "@/components/ui/badge";
import { Users, Phone, Car, MapPin, Calendar, Clock, Building, Mail, DollarSign, Fingerprint, TextSearch } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="p-6 bg-white/[0.02] border-t border-white/5 space-y-6 shadow-inner relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]"></div>
      
      <div className="relative z-10">
        <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
           <Fingerprint className="w-4 h-4 text-blue-400" /> Extracted Entities
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {(Object.keys(ENTITY_CONFIG) as Array<keyof typeof ENTITY_CONFIG>).map((key) => {
            const config = ENTITY_CONFIG[key];
            // Assert that the array is string[] based on our new types
            const items = (entities as any)[key] as string[] || [];
            const Icon = config.icon;
            
            if (items.length === 0) return null;

            return (
              <div key={key} className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-2 text-white/60 text-xs font-bold tracking-wider uppercase">
                  <Icon className={`h-4 w-4 ${config.color.split(' ')[0]}`} />
                  <span>{config.label}</span>
                  <span className="bg-white/10 px-1.5 py-0.5 rounded-md text-[10px] ml-auto">{items.length}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((item, idx) => {
                    const confValue = confidences[item];
                    return (
                      <Badge key={idx} variant="outline" className={`text-[11px] px-2 py-1 font-medium ${config.color}`}>
                        {item} {confValue !== undefined && <span className="opacity-60 ml-1 font-mono text-[9px]">{Math.round(confValue * 100)}%</span>}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {file.processed_data?.extracted_text && (
         <div className="pt-4 border-t border-white/5 relative z-10">
             <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3 flex items-center gap-2">
               <TextSearch className="w-4 h-4 text-amber-400" /> Raw Text Snippet
             </h4>
             <p className="text-sm text-white/70 font-mono bg-black/40 p-4 rounded-xl border border-white/10 line-clamp-4 leading-relaxed shadow-inner">
                 {file.processed_data.extracted_text}
             </p>
         </div>
      )}
    </motion.div>
  );
}
