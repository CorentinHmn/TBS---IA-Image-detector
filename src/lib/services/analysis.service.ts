import type { Analysis, AnalysisSignal, RiskLevel } from "@/types";
import { mockAnalyses } from "@/lib/mock-data";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function getRiskLevel(p: number): RiskLevel {
  if (p >= 70) return "high";
  if (p >= 40) return "medium";
  return "low";
}

function rnd(min: number, max: number) { return Math.floor(Math.random() * (max - min) + min); }

function mockSignals(): AnalysisSignal[] {
  return [
    { id: crypto.randomUUID(), model: "iris", name: "Color Distribution",     score: rnd(10, 45),  status: "not_detected", description: "Saturation uniformity and RGB channel balance. AI images tend to have unnaturally smooth or vivid color distributions." },
    { id: crypto.randomUUID(), model: "iris", name: "Noise & Texture Profile", score: rnd(35, 65),  status: "inconclusive", description: "High-frequency noise residual and 8-neighbour texture smoothness. AI images often lack natural sensor noise." },
    { id: crypto.randomUUID(), model: "iris", name: "Metadata Consistency",   score: rnd(40, 70),  status: "inconclusive", description: "EXIF data presence and camera fingerprint. AI-generated images typically lack authentic capture metadata." },
    { id: crypto.randomUUID(), model: "iris", name: "Compression Artifacts",  score: rnd(20, 55),  status: "not_detected", description: "JPEG/WebP DCT coefficient distribution. Synthetic images show atypical compression patterns vs. real camera output." },
    { id: crypto.randomUUID(), model: "iris", name: "Edge Sharpness Profile", score: rnd(30, 60),  status: "inconclusive", description: "Sub-pixel edge sharpness analysis. GAN and diffusion upsampling leave characteristic over-sharpening signatures." },
    { id: crypto.randomUUID(), model: "omni", name: "Deep Neural Analysis",    score: rnd(55, 95),  status: "detected",     description: "ConvNeXt-Tiny model trained on 40 000 labelled images. Primary detection signal via learned feature extraction." },
    { id: crypto.randomUUID(), model: "omni", name: "Frequency Signature (FFT)", score: rnd(60, 99), status: "detected",    description: "DCT/FFT energy distribution across frequency bands. Generative models leave characteristic spectral footprints." },
    { id: crypto.randomUUID(), model: "omni", name: "GAN Fingerprint",         score: rnd(50, 90),  status: "detected",     description: "Residual traces of generative model upsampling detectable in high-frequency bands via spectral analysis." },
    { id: crypto.randomUUID(), model: "omni", name: "Semantic Consistency",    score: rnd(40, 75),  status: "inconclusive", description: "Cross-region semantic coherence and object boundary plausibility. Diffusion models sometimes produce illogical spatial relations." },
    { id: crypto.randomUUID(), model: "omni", name: "Facial & Object Artifacts", score: rnd(55, 92), status: "detected",   description: "High-frequency artifacts near edges and anatomical regions. Characteristic of diffusion model and GAN synthesis." },
  ];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function analyzeImage(file: File): Promise<Analysis> {
  if (!API_URL) return analyzeImageMock(file);

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/analyze`, { method: "POST", body: formData });
  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(`API error ${res.status}: ${detail}`);
  }

  const data = await res.json();
  return {
    ...data,
    imageUrl: URL.createObjectURL(file),
    createdAt: new Date(data.createdAt ?? Date.now()),
    riskLevel: data.riskLevel as RiskLevel,
  } satisfies Analysis;
}

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
