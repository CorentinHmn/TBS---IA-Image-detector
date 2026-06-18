"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ScanSearch, GitCompare, History, Key, Settings, LogOut, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockUser } from "@/lib/mock-data";

const nav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/analyze",   icon: ScanSearch,      label: "Analyze"   },
  { href: "/compare",   icon: GitCompare,      label: "Compare"   },
  { href: "/history",   icon: History,         label: "History"   },
  { href: "/api-keys",  icon: Key,             label: "API Keys"  },
  { href: "/settings",  icon: Settings,        label: "Settings"  },
];

export function AppSidebar() {
  const path = usePathname();
  return (
    <aside className="w-14 h-screen bg-[#050505] border-r border-[#1A1A1A] flex flex-col fixed left-0 top-0 z-30 items-center py-4">
      {/* Home */}
      <div className="mb-4 w-full px-2">
        <Link href="/" title="Back to home" className="w-full flex items-center justify-center h-9 rounded-lg text-[#616161] hover:text-[#F5F5F5] hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col items-center gap-1 w-full px-2">
        {nav.map((item) => {
          const active = path === item.href || path.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "w-full flex items-center justify-center h-9 rounded-lg transition-colors cursor-pointer",
                active
                  ? "bg-[#4F6BFF]/15 text-[#4F6BFF]"
                  : "text-[#616161] hover:text-[#F5F5F5] hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="flex flex-col items-center gap-2 pt-4 border-t border-[#1A1A1A] w-full px-2">
        <div
          className="w-full flex items-center justify-center h-9 rounded-lg text-[#616161] hover:text-[#F5F5F5] hover:bg-white/5 transition-colors cursor-pointer"
          title={mockUser.name}
        >
          <div className="w-6 h-6 rounded-full bg-[#4F6BFF]/20 flex items-center justify-center text-[#4F6BFF] text-[10px] font-semibold">
            {mockUser.name.split(" ").map((n) => n[0]).join("")}
          </div>
        </div>
        <div
          className="w-full flex items-center justify-center h-9 rounded-lg text-[#616161] hover:text-[#F5F5F5] hover:bg-white/5 transition-colors cursor-pointer"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </div>
      </div>
    </aside>
  );
}
