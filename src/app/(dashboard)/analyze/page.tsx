"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/components/analysis/UploadDropzone";
import { LoadingAnalysisSteps } from "@/components/analysis/LoadingAnalysisSteps";
import { ConfidenceMeter } from "@/components/analysis/ConfidenceMeter";
import { RiskBadge } from "@/components/analysis/RiskBadge";
import { SignalBreakdown } from "@/components/analysis/SignalBreakdown";
import { analyzeImageMock } from "@/lib/services/analysis.service";
import type { Analysis } from "@/types";
import { ScanSearch, Download, Save, RotateCcw, Info } from "lucide-react";

type Stage = "idle" | "selected" | "analyzing" | "result" | "error";

export default function AnalyzePage() {
  const [stage, setStage] = useState<Stage>("idle");
  const [file, setFile]   = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult]   = useState<Analysis | null>(null);
  const [errMsg, setErrMsg]   = useState<string | null>(null);

  const handleSelect = (f: File) => {
    setFile(f); setPreview(URL.createObjectURL(f)); setStage("selected"); setResult(null); setErrMsg(null);
  };
  const handleClear = () => { setFile(null); setPreview(null); setStage("idle"); setResult(null); };
  const handleAnalyze = async () => {
    if (!file) return;
    setStage("analyzing");
    try {
      const r = await analyzeImageMock(file);
      setResult(r); setStage("result");
    } catch {
      setErrMsg("Analysis failed. Please try again."); setStage("error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {stage !== "result" && (
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Upload an image</h2>
          <p className="text-sm text-muted-foreground">Supported formats: JPG, PNG, WebP · Max 10 MB</p>
        </div>
      )}

      {(stage === "idle" || stage === "selected") && (
        <>
          <UploadDropzone onFileSelect={handleSelect} selectedFile={file} preview={preview} onClear={handleClear} />
          {stage === "selected" && (
            <Button onClick={handleAnalyze} className="w-full" size="lg">
              <ScanSearch className="w-4 h-4 mr-2" />Analyze image
            </Button>
          )}
        </>
      )}

      {stage === "analyzing" && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Analysis in progress</h3>
          <LoadingAnalysisSteps imagePreview={preview ?? undefined} />
        </div>
      )}

      {stage === "error" && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{errMsg}</p>
          <Button variant="ghost" size="sm" onClick={handleClear} className="mt-2">Try again</Button>
        </div>
      )}

      {stage === "result" && result && (
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs text-muted-foreground mb-2">{result.fileName}</p>
                <RiskBadge level={result.riskLevel} size="lg" />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => alert("PDF export coming soon")}>
                  <Download className="w-4 h-4 mr-1" />Download report
                </Button>
                <Button variant="outline" size="sm" onClick={() => alert("Analysis saved")}>
                  <Save className="w-4 h-4 mr-1" />Save
                </Button>
              </div>
            </div>
            <ConfidenceMeter score={result.aiProbability} animated />
            <div className="flex gap-3 p-3 bg-muted/50 rounded-lg border border-border">
              <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-foreground mb-1">Interpretation guidance</p>
                <p className="text-xs text-muted-foreground">
                  This image shows several signals commonly associated with synthetic generation. This result is probabilistic and should not be treated as definitive. Human review is recommended before any consequential decision.
                </p>
              </div>
            </div>
          </div>

          {preview && (
            <div className="rounded-xl overflow-hidden border border-border">
              <img src={preview} alt="Analyzed image" className="w-full max-h-64 object-cover" />
            </div>
          )}

          <div className="bg-card rounded-xl border border-border p-6">
            <SignalBreakdown signals={result.signals} />
          </div>

          <Button variant="outline" onClick={handleClear} className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />Analyze another image
          </Button>
        </div>
      )}
    </div>
  );
}
