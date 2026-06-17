import type { Analysis, AnalysisSignal, RiskLevel } from "@/types";
import { mockAnalyses } from "@/lib/mock-data";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function getRiskLevel(p: number): RiskLevel {
  if (p >= 70) return "high";
  if (p >= 40) return "medium";
  return "low";
}

function mockSignals(): AnalysisSignal[] {
  return [
    { id: crypto.randomUUID(), name: "Texture Inconsistencies", score: Math.floor(Math.random() * 40 + 55), status: "detected", description: "Unnatural texture patterns detected inconsistent with optical lens characteristics." },
    { id: crypto.randomUUID(), name: "Metadata Anomalies", score: Math.floor(Math.random() * 50 + 30), status: "detected", description: "EXIF metadata shows inconsistencies with claimed capture device." },
    { id: crypto.randomUUID(), name: "Lighting Coherence", score: Math.floor(Math.random() * 40 + 10), status: "inconclusive", description: "Lighting sources appear mostly consistent with minor anomalies." },
    { id: crypto.randomUUID(), name: "Facial / Object Artifacts", score: Math.floor(Math.random() * 35 + 60), status: "detected", description: "High-frequency artifacts near object edges typical of GAN upsampling." },
    { id: crypto.randomUUID(), name: "Compression Pattern Mismatch", score: Math.floor(Math.random() * 50 + 20), status: "inconclusive", description: "DCT coefficient distribution partially matches synthetic generation signatures." },
  ];
}

// TODO: Replace with real POST /api/v1/analyze (multipart/form-data) once backend is ready
export async function analyzeImageMock(file: File): Promise<Analysis> {
  await delay(3500);
  const probability = Math.floor(Math.random() * 80 + 15);
  return {
    id: crypto.randomUUID(),
    fileName: file.name,
    fileSize: file.size,
    imageUrl: URL.createObjectURL(file),
    aiProbability: probability,
    riskLevel: getRiskLevel(probability),
    status: "completed",
    signals: mockSignals(),
    createdAt: new Date(),
    processingTime: 3240 + Math.floor(Math.random() * 1000),
    metadata: {
      Width: "Unknown",
      Height: "Unknown",
      Format: file.type.split("/")[1]?.toUpperCase() ?? "Unknown",
      "File size": `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      "Color space": "sRGB",
      "EXIF Camera": "Not detected",
      "EXIF Date": "Not available",
      Compression: "Standard",
    },
  };
}

// TODO: Replace with GET /api/v1/analyses
export async function getAnalysesMock(): Promise<Analysis[]> {
  await delay(300);
  return mockAnalyses;
}

// TODO: Replace with GET /api/v1/analyses/:id
export async function getAnalysisByIdMock(id: string): Promise<Analysis | null> {
  await delay(200);
  return mockAnalyses.find((a) => a.id === id) ?? null;
}

// TODO: Replace with DELETE /api/v1/analyses/:id
export async function deleteAnalysisMock(id: string): Promise<void> {
  await delay(300);
  console.log("Mock: deleted analysis", id);
}

// TODO: Replace with POST /api/v1/reports/:id/export
export async function downloadReportMock(id: string): Promise<void> {
  await delay(500);
  console.log("Mock: downloaded report for", id);
}
