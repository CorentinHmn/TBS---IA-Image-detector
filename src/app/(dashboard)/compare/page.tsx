"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/components/analysis/UploadDropzone";
import { ModelColumn } from "@/components/analysis/ModelColumn";
import { analyzeImageMock } from "@/lib/services/analysis.service";
import type { Analysis } from "@/types";
import { GitCompare, RotateCcw, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";

type Stage = "idle" | "selected" | "analyzing" | "result";

function Consensus({ iris, omni }: { iris: Analysis; omni: Analysis }) {
  const delta = Math.abs(iris.aiProbability - omni.aiProbability);
  const avg = Math.round((iris.aiProbability + omni.aiProbability) / 2);
  const agree = iris.riskLevel === omni.riskLevel;

  if (agree && delta <= 15) {
    const Icon = avg >= 70 ? ShieldAlert : avg >= 40 ? AlertTriangle : CheckCircle2;
    const color = avg >= 70 ? "text-red-400 border-red-400/30 bg-red-400/5" : avg >= 40 ? "text-amber-400 border-amber-400/30 bg-amber-400/5" : "text-emerald-400 border-emerald-400/30 bg-emerald-400/5";
    return (
      <div className={`flex items-center gap-3 p-4 rounded-xl border ${color}`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold">Both models agree — {iris.riskLevel.toUpperCase()} RISK</p>
          <p className="text-xs opacity-70">Average confidence: {avg}% · Δ {delta}pts between models</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-400/30 bg-amber-400/5 text-amber-400">
      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
      <div>
        <p className="text-sm font-semibold">Models diverge — manual review recommended</p>
        <p className="text-xs opacity-70">
          Iris: {iris.aiProbability}% ({iris.riskLevel}) · Omni: {omni.aiProbability}% ({omni.riskLevel}) · Δ {delta}pts
        </p>
      </div>
    </div>
  );
}

export default function ComparePage() {
  const [stage, setStage]         = useState<Stage>("idle");
  const [file, setFile]           = useState<File | null>(null);
  const [preview, setPreview]     = useState<string | null>(null);
  const [irisResult, setIrisResult] = useState<Analysis | null>(null);
  const [omniResult, setOmniResult] = useState<Analysis | null>(null);
  const [irisLoading, setIrisLoading] = useState(false);
  const [omniLoading, setOmniLoading] = useState(false);

  const handleSelect = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStage("selected");
    setIrisResult(null);
    setOmniResult(null);
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setStage("idle");
    setIrisResult(null);
    setOmniResult(null);
  };

  const handleCompare = async () => {
    if (!file) return;
    setStage("analyzing");
    setIrisLoading(true);
    setOmniLoading(true);

    // Run both models in parallel
    const [iris, omni] = await Promise.all([
      analyzeImageMock(file, "iris").finally(() => setIrisLoading(false)),
      analyzeImageMock(file, "omni").finally(() => setOmniLoading(false)),
    ]);

    setIrisResult(iris);
    setOmniResult(omni);
    setStage("result");
  };

  const isAnalyzing = stage === "analyzing";
  const isDone      = stage === "result";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      {stage === "idle" || stage === "selected" ? (
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Compare models</h2>
          <p className="text-sm text-muted-foreground">
            Run Iris and Omni in parallel on the same image and compare their signals side-by-side.
          </p>
        </div>
      ) : null}

      {/* Upload — visible during idle/selected only */}
      {(stage === "idle" || stage === "selected") && (
        <>
          <UploadDropzone
            onFileSelect={handleSelect}
            selectedFile={file}
            preview={preview}
            onClear={handleClear}
          />
          {stage === "selected" && (
            <Button onClick={handleCompare} className="w-full" size="lg">
              <GitCompare className="w-4 h-4 mr-2" />
              Run comparison — Iris vs Omni
            </Button>
          )}
        </>
      )}

      {/* Image preview strip during analysis / result */}
      {(isAnalyzing || isDone) && preview && (
        <div className="rounded-xl overflow-hidden border border-border h-40">
          <img src={preview} alt="Analyzed image" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Side-by-side columns */}
      {(isAnalyzing || isDone) && (
        <div className="flex gap-4 items-start flex-col sm:flex-row">
          <ModelColumn model="iris" result={irisResult} loading={irisLoading} />
          <ModelColumn model="omni" result={omniResult} loading={omniLoading} />
        </div>
      )}

      {/* Consensus banner */}
      {isDone && irisResult && omniResult && (
        <Consensus iris={irisResult} omni={omniResult} />
      )}

      {/* Reset */}
      {isDone && (
        <Button variant="outline" onClick={handleClear} className="w-full">
          <RotateCcw className="w-4 h-4 mr-2" />Compare another image
        </Button>
      )}
    </div>
  );
}
