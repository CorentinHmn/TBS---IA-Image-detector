"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] selection:bg-[#4F6BFF]/30">

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center px-8 h-14">
        <span className="text-sm font-semibold tracking-tight">Prism</span>
      </nav>

      {/* Hero */}
      <section className="flex flex-col justify-center min-h-screen px-8 pt-14">
        <div className="max-w-5xl">
          <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#616161] mb-8">
            Forensic AI image detection
          </p>
          <h1 className="text-[clamp(2.6rem,6vw,5.5rem)] font-[800] tracking-[-0.04em] leading-[0.98] mb-8 text-[#F5F5F5] max-w-4xl">
            Pour les boomers qui savent pas différencier une photo IA d&apos;une{" "}
            <span className="text-[#4F6BFF]">vraie photo.</span>
          </h1>
          <p className="text-lg text-[#616161] max-w-lg leading-relaxed mb-12 font-[400]">
            Probabilistic forensic analysis to identify AI-generated images. Built for teams who need auditable results.
          </p>
          <div className="flex items-center gap-4">
            <Button size="lg" asChild className="bg-[#4F6BFF] hover:bg-[#4F6BFF]/90 text-white h-11 px-8 text-sm font-medium rounded-lg">
              <Link href="/analyze">Start analyzing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Statement */}
      <section className="px-8 py-32 border-t border-[#1A1A1A]">
        <div className="max-w-5xl">
          <p className="text-[clamp(1.6rem,3.5vw,3rem)] font-[600] tracking-[-0.025em] leading-[1.2] text-[#F5F5F5] max-w-3xl">
            Two detection models. One decisive answer. Iris for speed, Omni for depth.
          </p>
        </div>
      </section>

      {/* Use cases — text only, no cards */}
      <section className="px-8 py-32 border-t border-[#1A1A1A]">
        <div className="max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#616161] mb-10">Built for</p>
            <ul className="space-y-5">
              {["Journalism & fact-checking", "Marketplace integrity", "Insurance fraud detection", "Academic integrity", "Content moderation", "Enterprise compliance"].map((u) => (
                <li key={u} className="text-xl font-[500] text-[#F5F5F5] tracking-tight">{u}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#616161] mb-10">Principles</p>
            <ul className="space-y-5">
              {["Probabilistic — never a verdict", "Privacy-first — no image storage", "Audit-ready — timestamped reports", "Human review recommended"].map((p) => (
                <li key={p} className="text-xl font-[500] text-[#F5F5F5] tracking-tight">{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-10 border-t border-[#1A1A1A] flex items-center justify-between">
        <span className="text-sm font-semibold">Prism</span>
        <p className="text-xs text-[#616161]">Results are probabilistic · Human review recommended</p>
      </footer>
    </div>
  );
}
