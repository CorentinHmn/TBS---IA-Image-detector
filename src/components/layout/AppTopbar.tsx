"use client";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/analyze":   "Analyze Image",
  "/compare":   "Compare Models",
  "/history":   "Analysis History",
  "/api-keys":  "API Keys",
  "/settings":  "Settings",
};

export function AppTopbar() {
  const path = usePathname();
  const base = "/" + (path.split("/")[1] ?? "");
  const title = titles[base] ?? "Prism";
  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-20">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <Button variant="ghost" size="icon" className="text-muted-foreground" aria-label="Notifications">
        <Bell className="w-4 h-4" />
      </Button>
    </header>
  );
}
