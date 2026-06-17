import type { Analysis, AnalysisSignal, DashboardStats, PricingPlan, User, ApiKey } from "@/types";

const baseSignals: AnalysisSignal[] = [
  { id: "s1", name: "Texture Inconsistencies", score: 87, status: "detected", description: "Unnatural texture patterns detected, inconsistent with optical lens characteristics." },
  { id: "s2", name: "Metadata Anomalies", score: 72, status: "detected", description: "EXIF metadata shows inconsistencies with claimed capture device and timestamp." },
  { id: "s3", name: "Lighting Coherence", score: 34, status: "inconclusive", description: "Lighting sources appear mostly consistent, though minor shadows show potential synthetic origin." },
  { id: "s4", name: "Facial / Object Artifacts", score: 91, status: "detected", description: "High-frequency artifacts near object edges typical of GAN upsampling." },
  { id: "s5", name: "Compression Pattern Mismatch", score: 45, status: "inconclusive", description: "DCT coefficient distribution partially matches synthetic generation signatures." },
];

const lowSignals: AnalysisSignal[] = baseSignals.map((s) => ({
  ...s,
  score: Math.max(4, Math.round(s.score * 0.18)),
  status: "not_detected" as const,
}));

const medSignals: AnalysisSignal[] = baseSignals.map((s) => ({
  ...s,
  score: Math.round(s.score * 0.62),
  status: "inconclusive" as const,
}));

export const mockAnalyses: Analysis[] = [
  { id: "a1", fileName: "portrait_headshot.jpg", fileSize: 2400000, imageUrl: "https://picsum.photos/seed/aiv1/800/600", aiProbability: 82, riskLevel: "high", status: "completed", signals: baseSignals, createdAt: new Date("2024-01-15T10:30:00"), processingTime: 3240, metadata: { Width: "1920px", Height: "1080px", Format: "JPEG", "File size": "2.4 MB", "Color space": "sRGB", "EXIF Camera": "Unknown", "EXIF Date": "2024-01-14", Compression: "Standard" } },
  { id: "a2", fileName: "landscape_mountains.png", fileSize: 5100000, imageUrl: "https://picsum.photos/seed/aiv2/800/600", aiProbability: 23, riskLevel: "low", status: "completed", signals: lowSignals, createdAt: new Date("2024-01-14T14:15:00"), processingTime: 2890, metadata: { Width: "3840px", Height: "2160px", Format: "PNG", "File size": "5.1 MB", "Color space": "sRGB", "EXIF Camera": "Canon EOS R5", "EXIF Date": "2024-01-12", Compression: "Lossless" } },
  { id: "a3", fileName: "product_photo.webp", fileSize: 1200000, imageUrl: "https://picsum.photos/seed/aiv3/800/600", aiProbability: 55, riskLevel: "medium", status: "completed", signals: medSignals, createdAt: new Date("2024-01-13T09:00:00"), processingTime: 3100, metadata: { Width: "2048px", Height: "2048px", Format: "WebP", "File size": "1.2 MB", "Color space": "sRGB", "EXIF Camera": "Unknown", "EXIF Date": "N/A", Compression: "Lossy" } },
  { id: "a4", fileName: "news_photo_event.jpg", fileSize: 3200000, imageUrl: "https://picsum.photos/seed/aiv4/800/600", aiProbability: 91, riskLevel: "high", status: "completed", signals: baseSignals.map((s) => ({ ...s, score: Math.min(99, s.score + 8) })), createdAt: new Date("2024-01-12T16:45:00"), processingTime: 3890, metadata: { Width: "2400px", Height: "1600px", Format: "JPEG", "File size": "3.2 MB", "Color space": "Adobe RGB", "EXIF Camera": "Unknown", "EXIF Date": "2024-01-11", Compression: "Standard" } },
  { id: "a5", fileName: "social_media_post.jpg", fileSize: 890000, imageUrl: "https://picsum.photos/seed/aiv5/800/600", aiProbability: 67, riskLevel: "medium", status: "completed", signals: baseSignals.map((s) => ({ ...s, score: Math.round(s.score * 0.75) })), createdAt: new Date("2024-01-11T11:20:00"), processingTime: 2650, metadata: { Width: "1080px", Height: "1080px", Format: "JPEG", "File size": "890 KB", "Color space": "sRGB", "EXIF Camera": "Unknown", "EXIF Date": "N/A", Compression: "High" } },
  { id: "a6", fileName: "architecture_building.jpg", fileSize: 4100000, imageUrl: "https://picsum.photos/seed/aiv6/800/600", aiProbability: 12, riskLevel: "low", status: "completed", signals: lowSignals, createdAt: new Date("2024-01-10T08:30:00"), processingTime: 3420, metadata: { Width: "4000px", Height: "3000px", Format: "JPEG", "File size": "4.1 MB", "Color space": "sRGB", "EXIF Camera": "Sony A7R IV", "EXIF Date": "2024-01-09", Compression: "Minimal" } },
];

export const mockUser: User = { id: "u1", name: "Alex Martin", email: "alex.martin@company.com", organization: "MediaVerify Corp", plan: "pro" };

export const mockStats: DashboardStats = { totalAnalyses: 247, avgAiProbability: 63, highRiskCount: 18, reportsExported: 42 };

export const mockPricingPlans: PricingPlan[] = [
  { id: "free", name: "Free", price: 0, currency: "USD", interval: "month", features: ["10 analyses/month", "Basic signals", "PDF export", "Email support"], limit: 10, current: false },
  { id: "pro", name: "Pro", price: 49, currency: "USD", interval: "month", features: ["500 analyses/month", "Full signal breakdown", "API access", "Priority support", "Batch processing", "Advanced metadata"], limit: 500, current: true },
  { id: "business", name: "Business", price: 199, currency: "USD", interval: "month", features: ["Unlimited analyses", "Custom model fine-tuning", "Dedicated API", "SLA guarantee", "SSO / SAML", "Audit logs", "Custom exports"], limit: -1, current: false },
];

export const mockApiKey: ApiKey = { id: "key1", name: "Production API Key", key: "aiv_live_sk_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p", createdAt: new Date("2024-01-01"), lastUsed: new Date("2024-01-15T09:15:00") };
