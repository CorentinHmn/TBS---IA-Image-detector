"use client";
import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/analyze":   "Analyze",
  "/compare":   "Compare",
  "/history":   "History",
  "/api-keys":  "API Keys",
  "/settings":  "Settings",
};

export function AppTopbar() {
  const path = usePathname();
  const base = "/" + (path.split("/")[1] ?? "");
  const title = titles[base] ?? "Prism";
  return (
    <header className="h-12 border-b border-[#1A1A1A] flex items-center px-6">
      <h1 className="text-sm font-semibold text-[#F5F5F5] tracking-tight">{title}</h1>
    </header>
  );
}
