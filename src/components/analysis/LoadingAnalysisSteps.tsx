"use client";
import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Uploading image",           ms: 800  },
  { id: 2, label: "Preprocessing image",        ms: 1000 },
  { id: 3, label: "Running detection model",    ms: 1500 }, // TODO: connect deep learning backend
  { id: 4, label: "Generating report",          ms: 700  },
];

export function LoadingAnalysisSteps({ imagePreview }: { imagePreview?: string }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    let total = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((s, i) => {
      total += s.ms;
      timers.push(setTimeout(() => setCurrent(i + 1), total));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="space-y-5">
      {imagePreview && (
        <div className="relative rounded-lg overflow-hidden border border-border max-h-44 bg-muted">
          <img src={imagePreview} alt="Analyzing" className="w-full h-44 object-cover opacity-50" />
          <div className="scan-line absolute left-0 right-0 h-0.5 bg-primary/80 shadow-[0_0_12px_4px_rgba(79,107,255,0.5)]" style={{ top: 0 }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-primary bg-background/80 px-2 py-1 rounded font-medium">Scanning…</span>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {STEPS.map((step, i) => {
          const done   = current > i;
          const active = current === i;
          return (
            <div key={step.id} className={cn("flex items-center gap-3 p-3 rounded-lg transition-colors", active && "bg-primary/5 border border-primary/20")}>
              <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0", done ? "border-emerald-500 bg-emerald-500/10" : active ? "border-primary" : "border-border")}>
                {done   ? <Check className="w-3 h-3 text-emerald-400" /> : active ? <Loader2 className="w-3 h-3 text-primary animate-spin" /> : null}
              </div>
              <span className={cn("text-sm", done ? "text-muted-foreground" : active ? "text-foreground font-medium" : "text-muted-foreground")}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
