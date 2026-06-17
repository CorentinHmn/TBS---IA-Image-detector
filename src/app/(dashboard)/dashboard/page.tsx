"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ScanSearch, TrendingUp, AlertTriangle, FileDown, History } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { RiskBadge } from "@/components/analysis/RiskBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { mockStats, mockAnalyses } from "@/lib/mock-data";
import type { Analysis } from "@/types";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);

  useEffect(() => {
    const t = setTimeout(() => { setAnalyses(mockAnalyses.slice(0, 5)); setLoading(false); }, 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
        ) : (
          <>
            <StatsCard label="Images Analyzed"      value={mockStats.totalAnalyses}     icon={ScanSearch}      trend="+12%" trendUp />
            <StatsCard label="Avg AI Probability"   value={mockStats.avgAiProbability}  icon={TrendingUp}      suffix="%" trend="+5%" trendUp={false} />
            <StatsCard label="High-Risk Detections" value={mockStats.highRiskCount}     icon={AlertTriangle}   trend="+3"  trendUp={false} />
            <StatsCard label="Reports Exported"     value={mockStats.reportsExported}   icon={FileDown}        trend="+8"  trendUp />
          </>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Recent Analyses</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/history" className="text-sm text-muted-foreground">View all</Link>
          </Button>
        </div>
        {loading ? (
          <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}</div>
        ) : analyses.length === 0 ? (
          <EmptyState icon={History} title="No analyses yet" description="Upload your first image to get started." action={{ label: "Analyze image", href: "/analyze" }} />
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["File", "Date", "Score", "Risk", ""].map((h, i) => (
                    <th key={i} className={`text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider ${i === 1 ? "hidden md:table-cell" : ""} ${i === 3 ? "hidden sm:table-cell" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {analyses.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3"><span className="text-sm font-medium text-foreground truncate max-w-[160px] block">{a.fileName}</span></td>
                    <td className="px-4 py-3 hidden md:table-cell"><span className="text-sm text-muted-foreground">{a.createdAt.toLocaleDateString()}</span></td>
                    <td className="px-4 py-3"><span className="text-sm font-semibold text-foreground">{a.aiProbability}%</span></td>
                    <td className="px-4 py-3 hidden sm:table-cell"><RiskBadge level={a.riskLevel} size="sm" /></td>
                    <td className="px-4 py-3 text-right"><Link href={`/history/${a.id}`} className="text-xs text-primary hover:underline">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
