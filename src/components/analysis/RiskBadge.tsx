import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types";

interface RiskBadgeProps { level: RiskLevel; size?: "sm" | "md" | "lg"; }

const config = {
  low:    { label: "Low Risk",    icon: CheckCircle,  cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  medium: { label: "Medium Risk", icon: AlertCircle,  cls: "bg-amber-500/10  text-amber-400  border-amber-500/20"  },
  high:   { label: "High Risk",   icon: AlertTriangle, cls: "bg-red-500/10    text-red-400    border-red-500/20"    },
};

export function RiskBadge({ level, size = "md" }: RiskBadgeProps) {
  const { label, icon: Icon, cls } = config[level];
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full border font-medium",
      size === "sm" && "px-2 py-0.5 text-xs",
      size === "md" && "px-3 py-1 text-sm",
      size === "lg" && "px-4 py-1.5 text-base",
      cls
    )}>
      <Icon className={cn(size === "sm" ? "w-3 h-3" : "w-4 h-4")} />
      {label}
    </span>
  );
}
