"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Key, Eye, EyeOff, Copy, RefreshCw, Terminal } from "lucide-react";
import { mockApiKey } from "@/lib/mock-data";

export default function ApiKeysPage() {
  const [show, setShow]     = useState(false);
  const [copied, setCopied] = useState(false);
  const masked = mockApiKey.key.slice(0, 12) + "•".repeat(26);

  const handleCopy = () => {
    navigator.clipboard.writeText(mockApiKey.key);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
        <p className="text-sm text-amber-400 font-medium">API is mocked — real endpoints coming soon</p>
        <p className="text-xs text-muted-foreground mt-1">The endpoints below are planned. Integration with the deep learning backend will be available in a future release.</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Your API Key</h3>
        </div>
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg text-sm">
          <span className="flex-1 text-foreground text-xs break-all">{show ? mockApiKey.key : masked}</span>
          <Button variant="ghost" size="icon" className="w-7 h-7 flex-shrink-0" onClick={() => setShow((v) => !v)}>
            {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="w-7 h-7 flex-shrink-0" onClick={handleCopy}>
            <Copy className="w-3.5 h-3.5" />
          </Button>
        </div>
        {copied && <p className="text-xs text-emerald-400">Copied to clipboard</p>}
        <Button variant="outline" size="sm"><RefreshCw className="w-3.5 h-3.5 mr-1.5" />Generate new key</Button>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Example Request</h3>
        </div>
        <div className="p-4 bg-background rounded-lg border border-border overflow-x-auto">
          <pre className="text-xs text-muted-foreground whitespace-pre">{`curl -X POST https://api.aiverifier.io/v1/analyze \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "image=@/path/to/image.jpg"`}</pre>
        </div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Example Response</h4>
        <div className="p-4 bg-background rounded-lg border border-border overflow-x-auto">
          <pre className="text-xs text-muted-foreground whitespace-pre">{`{
  "id": "analysis_abc123",
  "ai_probability": 82,
  "risk_level": "high",
  "signals": [
    { "name": "Texture Inconsistencies", "score": 87, "status": "detected" },
    { "name": "Metadata Anomalies", "score": 72, "status": "detected" }
  ],
  "processing_time_ms": 3240,
  "created_at": "2024-01-15T10:30:00Z"
}`}</pre>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Planned Endpoints</h3>
        <div className="space-y-2">
          {[
            { method: "POST",   path: "/api/v1/analyze",       desc: "Submit an image for analysis" },
            { method: "GET",    path: "/api/v1/analyses",       desc: "List all analyses"            },
            { method: "GET",    path: "/api/v1/analyses/:id",   desc: "Get a specific analysis"      },
            { method: "DELETE", path: "/api/v1/analyses/:id",   desc: "Delete an analysis"           },
          ].map((ep) => (
            <div key={ep.path} className="flex items-center gap-3 p-3 rounded-lg border border-border">
              <span className={`text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 ${ep.method === "POST" ? "bg-primary/20 text-primary" : ep.method === "DELETE" ? "bg-destructive/20 text-destructive" : "bg-emerald-500/20 text-emerald-400"}`}>
                {ep.method}
              </span>
              <span className="text-sm text-foreground">{ep.path}</span>
              <span className="text-xs text-muted-foreground ml-auto hidden sm:block">{ep.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
