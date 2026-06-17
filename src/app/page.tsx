"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, ScanSearch, FileBarChart, ChevronRight, Check, Newspaper, ShoppingBag, GraduationCap, MessageSquareWarning, Building2, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#F0F2F8]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 h-16 border-b border-[#1E2028] bg-[#0A0B0D]/90 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#4F6BFF] flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-sm">Prism</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild className="text-[#8B92A8] hover:text-[#F0F2F8] text-sm h-9"><Link href="/login">Sign in</Link></Button>
          <Button asChild className="bg-[#4F6BFF] hover:bg-[#4F6BFF]/90 text-white text-sm h-9"><Link href="/signup">Get started</Link></Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#4F6BFF 1px,transparent 1px),linear-gradient(90deg,#4F6BFF 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-[#4F6BFF] bg-[#4F6BFF]/10 border border-[#4F6BFF]/20 px-3 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F6BFF] animate-pulse" />
            Forensic-grade AI image detection
          </span>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
            Detect AI-generated<br />
            <span style={{ color: "#4F6BFF" }}>images with confidence</span>
          </h1>
          <p className="text-lg text-[#8B92A8] max-w-2xl mx-auto mb-10 leading-relaxed">
            Enterprise-grade forensic analysis to identify synthetic images. Built for journalists, marketplaces, and compliance teams who need probabilistic, auditable results.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button asChild size="lg" className="bg-[#4F6BFF] hover:bg-[#4F6BFF]/90 text-white h-12 px-8">
              <Link href="/analyze">Start analyzing <ChevronRight className="w-4 h-4 ml-1" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-[#1E2028] text-[#8B92A8] hover:text-[#F0F2F8] hover:border-[#4F6BFF]/50 h-12 px-8">
              <Link href="/dashboard">View demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 border-t border-[#1E2028]">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold text-[#4F6BFF] uppercase tracking-widest text-center mb-4">How it works</p>
          <h2 className="text-3xl font-bold text-center mb-12">Three steps to a forensic assessment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: "01", icon: ScanSearch,    title: "Upload an image",           desc: "Submit any JPG, PNG, or WebP image up to 10 MB via the interface or API." },
              { n: "02", icon: FileBarChart,  title: "Run forensic analysis",     desc: "Our detection pipeline analyzes texture, metadata, compression and object artifacts." },
              { n: "03", icon: Shield,        title: "Review confidence signals", desc: "Receive a probabilistic score with full signal breakdown — never a definitive verdict." },
            ].map((s) => (
              <div key={s.n} className="p-6 bg-[#111318] rounded-xl border border-[#1E2028] space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#4F6BFF]">{s.n}</span>
                  <div className="w-8 h-8 rounded-lg bg-[#4F6BFF]/10 flex items-center justify-center">
                    <s.icon className="w-4 h-4 text-[#4F6BFF]" />
                  </div>
                </div>
                <h3 className="text-base font-semibold">{s.title}</h3>
                <p className="text-sm text-[#8B92A8] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20 px-6 border-t border-[#1E2028]">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold text-[#4F6BFF] uppercase tracking-widest text-center mb-4">Use cases</p>
          <h2 className="text-3xl font-bold text-center mb-12">Built for professionals who need certainty</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: Newspaper,            title: "Journalism",          desc: "Verify image authenticity before publication."          },
              { icon: ShoppingBag,          title: "Marketplaces",        desc: "Screen product listings for synthetic content."         },
              { icon: GraduationCap,        title: "Education",           desc: "Detect AI-generated submissions and materials."        },
              { icon: MessageSquareWarning, title: "Content Moderation",  desc: "Flag potentially synthetic images at scale."           },
              { icon: ShieldCheck,          title: "Insurance & Fraud",   desc: "Audit claim photos for manipulation signals."           },
              { icon: Building2,            title: "Enterprise",          desc: "Integrate forensic analysis into existing workflows."   },
            ].map((uc) => (
              <div key={uc.title} className="p-5 bg-[#111318] rounded-xl border border-[#1E2028] space-y-2">
                <uc.icon className="w-5 h-5 text-[#4F6BFF]" />
                <h3 className="text-sm font-semibold">{uc.title}</h3>
                <p className="text-xs text-[#8B92A8]">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-20 px-6 border-t border-[#1E2028]">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold text-[#00D4AA] uppercase tracking-widest text-center mb-4">Trust & Privacy</p>
          <h2 className="text-3xl font-bold text-center mb-12">Designed for audit-ready workflows</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Privacy-first",              desc: "Images are never stored publicly or shared with third parties."            },
              { title: "No public image sharing",    desc: "Your uploads remain private throughout the analysis process."             },
              { title: "Audit-ready workflow",       desc: "Full analysis history with timestamped, exportable reports."              },
              { title: "Human review recommended",   desc: "Results are probabilistic. We always recommend human oversight."         },
            ].map((t) => (
              <div key={t.title} className="flex gap-4 p-5 bg-[#111318] rounded-xl border border-[#1E2028]">
                <div className="w-5 h-5 rounded-full bg-[#00D4AA]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#00D4AA]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1">{t.title}</h3>
                  <p className="text-xs text-[#8B92A8]">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-[#1E2028]">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#4F6BFF] flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold">Prism</span>
          </div>
          <p className="text-xs text-[#8B92A8]">© 2025 Prism · Results are probabilistic · Human review recommended</p>
        </div>
      </footer>
    </div>
  );
}
