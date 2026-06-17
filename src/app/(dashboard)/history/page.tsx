"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAnalysesMock, deleteAnalysisMock } from "@/lib/services/analysis.service";
import type { Analysis, RiskLevel } from "@/types";
import { RiskBadge } from "@/components/analysis/RiskBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { History, Search, Trash2, Eye, Download } from "lucide-react";

const PER = 5;

export default function HistoryPage() {
  const [all, setAll]           = useState<Analysis[]>([]);
  const [filtered, setFiltered] = useState<Analysis[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [risk, setRisk]         = useState<RiskLevel | "all">("all");
  const [page, setPage]         = useState(1);

  useEffect(() => { getAnalysesMock().then((d) => { setAll(d); setFiltered(d); setLoading(false); }); }, []);

  useEffect(() => {
    let r = all;
    if (search) r = r.filter((a) => a.fileName.toLowerCase().includes(search.toLowerCase()));
    if (risk !== "all") r = r.filter((a) => a.riskLevel === risk);
    setFiltered(r); setPage(1);
  }, [search, risk, all]);

  const paged      = filtered.slice((page - 1) * PER, page * PER);
  const totalPages = Math.ceil(filtered.length / PER);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this analysis?")) return;
    await deleteAnalysisMock(id);
    setAll((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by filename…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-card border-border" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "low", "medium", "high"] as const).map((l) => (
            <Button key={l} variant={risk === l ? "default" : "outline"} size="sm" onClick={() => setRisk(l)} className="capitalize">
              {l === "all" ? "All" : l}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={History} title="No analyses found" description="Try adjusting your search or filters." />
      ) : (
        <>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">File</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Score</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Risk</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paged.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3"><span className="text-sm font-medium text-foreground truncate max-w-[160px] block">{a.fileName}</span></td>
                    <td className="px-4 py-3 hidden md:table-cell"><span className="text-sm text-muted-foreground">{a.createdAt.toLocaleDateString()}</span></td>
                    <td className="px-4 py-3"><span className="text-sm font-semibold text-foreground">{a.aiProbability}%</span></td>
                    <td className="px-4 py-3 hidden sm:table-cell"><RiskBadge level={a.riskLevel} size="sm" /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild className="w-8 h-8"><Link href={`/history/${a.id}`} aria-label="View"><Eye className="w-3.5 h-3.5" /></Link></Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => alert("Report download coming soon")} aria-label="Download"><Download className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive" onClick={() => handleDelete(a.id)} aria-label="Delete"><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{filtered.length} analyses</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>Previous</Button>
                <span className="text-sm text-muted-foreground flex items-center px-2">{page} / {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>Next</Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
