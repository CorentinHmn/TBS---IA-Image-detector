"use client";
import type { Analysis } from "@/types";
import { ConfidenceMeter } from "./ConfidenceMeter";
import { RiskBadge } from "./RiskBadge";
import { SignalBreakdown } from "./SignalBreakdown";
import { Zap, Eye, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ModelId = "iris" | "omni";

const MODEL_META = {
  iris: {
    name: "Iris",
    tagline: "Fast · Lightweight · Real-time",
    Icon: Zap,
    accent: "#4F6BFF",
    accentBg: "bg-[#4F6BFF]/10",
    accentText: "text-[#4F6BFF]",
    accentBorder: "border-[#4F6BFF]/30",
    accentRing: "ring-[#4F6BFF]/20",
  },
  omni: {
    name: "Omni",
    tagline: "Deep forensic · Multi-signal",
    Icon: Eye,
    accent: "#8B5CF6",
    accentBg: "bg-[#8B5CF6]/10",
    accentText: "text-[#8B5CF6]",
    accentBorder: "border-[#8B5CF6]/30",
    accentRing: "ring-[#8B5CF6]/20",
  },
} as const;

interface Props {
  model: ModelId;
  result: Analysis | null;
  loading: boolean;
}

export function ModelColumn({ model, result, loading }: Props) {
  const meta = MODEL_META[model];
  const { Icon } = meta;
  const signals = result?.signals.filter((s) => s.model === model) ?? [];

  return (
    <div
      className={cn(
        "flex-1 min-w-0 rounded-xl border bg-card overflow-hidden",
        meta.accentBorder,
        result && `ring-1 ${meta.accentRing}`
      )}
    >
      {/* Header */}
      <div className={cn("flex items-center gap-3 px-5 py-4 border-b", meta.accentBorder, meta.accentBg)}>
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", meta.accentBg)}>
          <Icon className={cn("w-4 h-4", meta.accentText)} />
        </div>
        <div>
          <p className={cn("text-sm font-bold", meta.accentText)}>{meta.name}</p>
          <p className="text-[11px] text-muted-foreground">{meta.tagline}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-5">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <Loader2
              className={cn("w-6 h-6 animate-spin", meta.accentText)}
            />
            <p className="text-xs text-muted-foreground">
              Running {meta.name}…
            </p>
          </div>
        )}

        {!loading && !result && (
          <div className="flex items-center justify-center py-10">
            <p className="text-xs text-muted-foreground">Waiting for image</p>
          </div>
        )}

        {!loading && result && (
          <>
            <RiskBadge level={result.riskLevel} size="lg" />
            <ConfidenceMeter score={result.aiProbability} animated accentColor={meta.accent} />
            <div className="pt-1">
              <SignalBreakdown signals={signals} accentColor={meta.accent} />
            </div>
            <p className="text-[10px] text-muted-foreground text-right tabular-nums">
              {result.processingTime.toLocaleString()} ms
            </p>
          </>
        )}
      </div>
    </div>
  );
}
