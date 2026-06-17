"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAnalysisByIdMock } from "@/lib/services/analysis.service";
import type { Analysis } from "@/types";
import { RiskBadge } from "@/components/analysis/RiskBadge";
import { ConfidenceMeter } from "@/components/analysis/ConfidenceMeter";
import { SignalBreakdown } from "@/components/analysis/SignalBreakdown";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Download, Clock, FileImage } from "lucide-react";

export default function AnalysisDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => { getAnalysisByIdMock(id).then((d) => { setAnalysis(d); setLoading(false); }); }, [id]);

  if (loading) return (
    <div className="max-w-3xl mx-auto space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}</div>
  );
  if (!analysis) return (
    <div className="text-center py-16">
      <p className="text-muted-foreground">Analysis not found.</p>
      <Button variant="ghost" onClick={() => router.push("/history")} className="mt-4">Back to history</Button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="ghost" size="icon" onClick={() => router.push("/history")}><ArrowLeft className="w-4 h-4" /></Button>
        <div className="flex-1">
          <h2 className="text-base font-semibold text-foreground">{analysis.fileName}</h2>
          <p className="text-xs text-muted-foreground">{analysis.createdAt.toLocaleString()}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => alert("PDF export coming soon")}>
          <Download className="w-4 h-4 mr-1" />Export PDF
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <RiskBadge level={analysis.riskLevel} size="lg" />
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />Processed in {(analysis.processingTime / 1000).toFixed(1)}s
          </span>
        </div>
        <ConfidenceMeter score={analysis.aiProbability} animated={false} />
      </div>

      <div className="rounded-xl overflow-hidden border border-border">
        <img src={analysis.imageUrl} alt={analysis.fileName} className="w-full max-h-64 object-cover" />
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <SignalBreakdown signals={analysis.signals} />
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileImage className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Technical Metadata</h3>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {Object.entries(analysis.metadata).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-2 py-1.5 border-b border-border/50">
              <span className="text-xs text-muted-foreground">{k}</span>
              <span className="text-xs text-foreground font-medium">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
