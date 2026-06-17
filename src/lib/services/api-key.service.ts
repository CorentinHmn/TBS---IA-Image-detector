import type { ApiKey } from "@/types";
import { mockApiKey } from "@/lib/mock-data";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// TODO: Replace with GET /api/v1/keys
export async function getApiKeyMock(): Promise<ApiKey> {
  await delay(200);
  return mockApiKey;
}

// TODO: Replace with POST /api/v1/keys
export async function generateApiKeyMock(): Promise<ApiKey> {
  await delay(500);
  return {
    id: crypto.randomUUID(),
    name: "API Key " + new Date().toLocaleDateString(),
    key: "aiv_live_sk_" + crypto.randomUUID().replace(/-/g, "").slice(0, 32),
    createdAt: new Date(),
  };
}
