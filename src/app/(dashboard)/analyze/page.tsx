"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/components/analysis/UploadDropzone";
import { analyzeImage } from "@/lib/services/analysis.service";
import type { Analysis } from "@/types";
import { RotateCcw, Zap, Eye } from "lucide-react";

type Stage = "idle" | "selected" | "analyzing" | "result" | "error";
type ModelId = "iris" | "omni";

const MODELS: { id: ModelId; name: string; tagline: string; icon: typeof Zap }[] = [
  { id: "iris", name: "Iris",  tagline: "Fast · Real-time",       icon: Zap },
  { id: "omni", name: "Omni",  tagline: "Deep · Multi-signal",    icon: Eye },
];

function ScoreDisplay({ score, riskLevel }: { score: number; riskLevel: Analysis["riskLevel"] }) {
  const color = riskLevel === "high" ? "#EF4444" : riskLevel === "medium" ? "#F59E0B" : "#10B981";
  const label = riskLevel === "high" ? "Likely AI-generated" : riskLevel === "medium" ? "Inconclusive" : "Likely authentic";
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <span className="text-[clamp(5rem,18vw,9rem)] font-[800] tracking-[-0.04em] leading-none tabular-nums" style={{ color }}>
        {score}%
      </span>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

export default function AnalyzePage() {
  const [stage, setStage]   = useState<Stage>("idle");
  const [file, setFile]     = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult]   = useState<Analysis | null>(null);
  const [errMsg, setErrMsg]   = useState<string | null>(null);
  const [model, setModel]     = useState<ModelId>("iris");

  const handleSelect = (f: File) => {
    setFile(f); setPreview(URL.createObjectURL(f)); setStage("selected"); setResult(null); setErrMsg(null);
  };
  const handleClear = () => { setFile(null); setPreview(null); setStage("idle"); setResult(null); };
  const handleAnalyze = async () => {
    if (!file) return;
    setStage("analyzing");
    try {
      const r = await analyzeImage(file, model);
      setResult(r); setStage("result");
    } catch {
      setErrMsg("Analysis failed. Please try again."); setStage("error");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">

      {/* Model selector */}
      {(stage === "idle" || stage === "selected") && (
        <div className="flex gap-2">
          {MODELS.map((m) => {
            const Icon = m.icon;
            const active = model === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setModel(m.id)}
                className={`flex-1 flex items-center gap-2.5 px-4 py-3 rounded-lg border text-left transition-all ${
                  active ? "border-primary/40 bg-primary/5 text-foreground" : "border-border bg-card text-muted-foreground hover:border-border hover:text-foreground"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? "text-primary" : ""}`} />
                <div>
                  <p className={`text-sm font-semibold leading-none mb-0.5 ${active ? "text-primary" : ""}`}>{m.name}</p>
                  <p className="text-[11px] text-muted-foreground">{m.tagline}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Upload */}
      {(stage === "idle" || stage === "selected") && (
        <>
          <UploadDropzone onFileSelect={handleSelect} selectedFile={file} preview={preview} onClear={handleClear} />
          {stage === "selected" && (
            <Button onClick={handleAnalyze} className="w-full" size="lg">
              Analyze with {MODELS.find((m) => m.id === model)?.name}
            </Button>
          )}
        </>
      )}

      {/* Analyzing */}
      {stage === "analyzing" && (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm">Analyzing…</p>
        </div>
      )}

      {/* Error */}
      {stage === "error" && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{errMsg}</p>
          <Button variant="ghost" size="sm" onClick={handleClear} className="mt-2">Try again</Button>
        </div>
      )}

      {/* Result — score only */}
      {stage === "result" && result && (
        <div className="space-y-4">
          {preview && (
            <div className="rounded-xl overflow-hidden border border-border h-48">
              <img src={preview} alt="Analyzed" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="bg-card rounded-xl border border-border">
            <ScoreDisplay score={result.aiProbability} riskLevel={result.riskLevel} />
            <div className="px-6 pb-5 text-center">
              <p className="text-xs text-muted-foreground">
                {result.fileName} · via {MODELS.find((m) => m.id === model)?.name} · probabilistic result
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleClear} className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />Analyze another image
          </Button>
        </div>
      )}
    </div>
  );
}
