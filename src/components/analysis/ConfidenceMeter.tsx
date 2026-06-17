"use client";
import { useEffect, useState } from "react";

interface ConfidenceMeterProps { score: number; animated?: boolean; }

export function ConfidenceMeter({ score, animated = true }: ConfidenceMeterProps) {
  const [display, setDisplay] = useState(animated ? 0 : score);
  useEffect(() => {
    if (!animated) return;
    const t = setTimeout(() => setDisplay(score), 100);
    return () => clearTimeout(t);
  }, [score, animated]);

  const color = score >= 70 ? "#EF4444" : score >= 40 ? "#F59E0B" : "#10B981";

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground uppercase tracking-wider">AI Generation Probability</p>
      <span className="text-5xl font-bold" style={{ color }}>{display}%</span>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${display}%`, backgroundColor: color }} />
      </div>
      <p className="text-xs text-muted-foreground">Based on probabilistic signal analysis · Not definitive</p>
    </div>
  );
}
