import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps { label: string; value: string | number; icon: LucideIcon; trend?: string; trendUp?: boolean; suffix?: string; }

export function StatsCard({ label, value, icon: Icon, trend, trendUp, suffix }: StatsCardProps) {
  return (
    <div className="p-5 bg-card rounded-xl border border-border">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        {trend && (
          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", trendUp ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10")}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}{suffix && <span className="text-lg ml-0.5">{suffix}</span>}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
