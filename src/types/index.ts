export type RiskLevel = "low" | "medium" | "high";
export type AnalysisStatus = "pending" | "processing" | "completed" | "failed";

export interface AnalysisSignal {
  id: string;
  name: string;
  score: number;
  status: "detected" | "not_detected" | "inconclusive";
  description: string;
  model: "iris" | "omni";
}

export interface Analysis {
  id: string;
  fileName: string;
  fileSize: number;
  imageUrl: string;
  aiProbability: number;
  riskLevel: RiskLevel;
  status: AnalysisStatus;
  signals: AnalysisSignal[];
  createdAt: Date;
  processingTime: number;
  metadata: Record<string, string>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  organization: string;
  plan: "free" | "pro" | "business";
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  features: string[];
  limit: number;
  current: boolean;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed?: Date;
}

export interface DashboardStats {
  totalAnalyses: number;
  avgAiProbability: number;
  highRiskCount: number;
  reportsExported: number;
}
