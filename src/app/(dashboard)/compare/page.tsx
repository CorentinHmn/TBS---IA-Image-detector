"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/components/analysis/UploadDropzone";
import { analyzeImage } from "@/lib/services/analysis.service";
import type { Analysis } from "@/types";
import { GitCompare, RotateCcw, Zap, Eye } from "lucide-react";

type Stage = "idle" | "selected" | "analyzing" | "result";

function ScoreCard({ name, icon: Icon, score, riskLevel, loading, accentColor }: {
  name: string;
  icon: typeof Zap;
  score: number | null;
  riskLevel: Analysis["riskLevel"] | null;
  loading: boolean;
  accentColor: string;
}) {
  const color = riskLevel === "high" ? "#EF4444" : riskLevel === "medium" ? "#F59E0B" : riskLevel === "low" ? "#10B981" : accentColor;
  const label = riskLevel === "high" ? "Likely AI-generated" : riskLevel === "medium" ? "Inconclusive" : riskLevel === "low" ? "Likely authentic" : "";

  return (
    <div className="flex-1 bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
        <Icon className="w-3.5 h-3.5" style={{ color: accentColor }} />
        <span className="text-sm font-semibold" style={{ color: accentColor }}>{name}</span>
      </div>
      <div className="flex flex-col items-center justify-center py-12 gap-2">
        {loading ? (
          <div className="w-5 h-5 border-2 border-border border-t-primary rounded-full animate-spin" />
        ) : score !== null ? (
          <>
            <span className="text-[clamp(3.5rem,10vw,6rem)] font-[800] tracking-[-0.04em] leading-none tabular-nums" style={{ color }}>
              {score}%
            </span>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )}
      </div>
    </div>
  );
}

function Consensus({ iris, omni }: { iris: Analysis; omni: Analysis }) {
  const delta = Math.abs(iris.aiProbability - omni.aiProbability);
  const avg = Math.round((iris.aiProbability + omni.aiProbability) / 2);
  const agree = iris.riskLevel === omni.riskLevel;
  const color = avg >= 70 ? "#EF4444" : avg >= 40 ? "#F59E0B" : "#10B981";

  return (
    <div className="flex items-baseline justify-between px-5 py-4 bg-card border border-border rounded-xl">
      <div>
        <p className="text-xs text-muted-foreground mb-1">{agree ? "Models agree" : "Models diverge — review recommended"}</p>
        <p className="text-sm font-semibold text-foreground">
          Average <span style={{ color }}>{avg}%</span> · Δ {delta}pts
        </p>
      </div>
    </div>
  );
}

export default function ComparePage() {
  const [stage, setStage]             = useState<Stage>("idle");
  const [file, setFile]               = useState<File | null>(null);
  const [preview, setPreview]         = useState<string | null>(null);
  const [irisResult, setIrisResult]   = useState<Analysis | null>(null);
  const [omniResult, setOmniResult]   = useState<Analysis | null>(null);
  const [irisLoading, setIrisLoading] = useState(false);
  const [omniLoading, setOmniLoading] = useState(false);

  const handleSelect = (f: File) => {
    setFile(f); setPreview(URL.createObjectURL(f)); setStage("selected");
    setIrisResult(null); setOmniResult(null);
  };
  const handleClear = () => {
    setFile(null); setPreview(null); setStage("idle");
    setIrisResult(null); setOmniResult(null);
  };
  const handleCompare = async () => {
    if (!file) return;
    setStage("analyzing"); setIrisLoading(true); setOmniLoading(true);
    const [iris, omni] = await Promise.all([
      analyzeImage(file, "iris").finally(() => setIrisLoading(false)),
      analyzeImage(file, "omni").finally(() => setOmniLoading(false)),
    ]);
    setIrisResult(iris); setOmniResult(omni); setStage("result");
  };

  const isAnalyzing = stage === "analyzing";
  const isDone      = stage === "result";

  return (
    <div className="max-w-2xl mx-auto space-y-4">

      {(stage === "idle" || stage === "selected") && (
        <>
          <UploadDropzone onFileSelect={handleSelect} selectedFile={file} preview={preview} onClear={handleClear} />
          {stage === "selected" && (
            <Button onClick={handleCompare} className="w-full" size="lg">
              <GitCompare className="w-4 h-4 mr-2" />Run comparison
            </Button>
          )}
        </>
      )}

      {(isAnalyzing || isDone) && preview && (
        <div className="rounded-xl overflow-hidden border border-border h-44">
          <img src={preview} alt="Analyzed image" className="w-full h-full object-cover" />
        </div>
      )}

      {(isAnalyzing || isDone) && (
        <div className="flex gap-3">
          <ScoreCard
            name="Iris" icon={Zap}
            score={irisResult?.aiProbability ?? null}
            riskLevel={irisResult?.riskLevel ?? null}
            loading={irisLoading}
            accentColor="#4F6BFF"
          />
          <ScoreCard
            name="Omni" icon={Eye}
            score={omniResult?.aiProbability ?? null}
            riskLevel={omniResult?.riskLevel ?? null}
            loading={omniLoading}
            accentColor="#8B5CF6"
          />
        </div>
      )}

      {isDone && irisResult && omniResult && (
        <Consensus iris={irisResult} omni={omniResult} />
      )}

      {isDone && (
        <Button variant="outline" onClick={handleClear} className="w-full">
          <RotateCcw className="w-4 h-4 mr-2" />Compare another image
        </Button>
      )}
    </div>
  );
}
