import type { AnalysisSignal } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig = {
  detected:     { label: "Detected",     cls: "text-red-400"     },
  not_detected: { label: "Not detected", cls: "text-emerald-400" },
  inconclusive: { label: "Inconclusive", cls: "text-amber-400"   },
};

export function SignalBreakdown({ signals, accentColor }: { signals: AnalysisSignal[]; accentColor?: string }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Signal Breakdown</h3>
      <div className="space-y-2">
        {signals.map((s) => {
          const { label, cls } = statusConfig[s.status];
          const barColor = s.status === "not_detected" ? "#10B981" : s.status === "inconclusive" ? "#F59E0B" : (accentColor ?? "#EF4444");
          return (
            <div key={s.id} className="p-3 bg-card rounded-lg border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{s.name}</span>
                <div className="flex items-center gap-3">
                  <span className={cn("text-xs font-medium", cls)}>{label}</span>
                  <span className="text-sm font-semibold text-foreground">{s.score}%</span>
                </div>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${s.score}%`, backgroundColor: barColor }} />
              </div>
              <p className="text-xs text-muted-foreground">{s.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
