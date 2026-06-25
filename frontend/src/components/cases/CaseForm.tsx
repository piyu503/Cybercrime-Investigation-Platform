import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// ─── Schema ────────────────────────────────────────────────────────────────────
const caseSchema = z.object({
  case_name: z.string().min(1, "Case name is required"),
  description: z.string().min(1, "Description is required"),
});

export type CaseFormValues = z.infer<typeof caseSchema>;

// ─── Props ─────────────────────────────────────────────────────────────────────
interface CaseFormProps {
  onSubmit: (values: CaseFormValues) => void;
  isLoading: boolean;
  error?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function CaseForm({ onSubmit, isLoading, error }: CaseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CaseFormValues>({
    resolver: zodResolver(caseSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Case Name */}
      <div className="space-y-1.5">
        <Label htmlFor="case_name" className="text-xs font-medium text-white/60 uppercase tracking-widest">
          Case Name
        </Label>
        <Input
          id="case_name"
          placeholder="e.g. Operation Blacksite 2024"
          autoComplete="off"
          {...register("case_name")}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 h-10 text-sm"
        />
        {errors.case_name && (
          <p className="text-xs text-red-400 mt-1">{errors.case_name.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-xs font-medium text-white/60 uppercase tracking-widest">
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Provide a brief summary of this investigation…"
          rows={4}
          {...register("description")}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 text-sm resize-none"
        />
        {errors.description && (
          <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Submission error */}
      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {/* Submit */}
      <div className="pt-1">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium h-10 px-6 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Case…
            </>
          ) : (
            "Create Case"
          )}
        </Button>
      </div>
    </form>
  );
}
