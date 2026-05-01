import Link from "next/link";
import { Activity } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-[#1e1e35] bg-[#0a0a0f] flex flex-col shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-4 border-b border-[#1e1e35] font-bold text-indigo-400"
        >
          <Activity className="w-5 h-5" />
          AgentLens
        </Link>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white bg-[#131320] font-medium"
          >
            Overview
          </Link>
        </nav>
        <div className="px-5 py-4 border-t border-[#1e1e35]">
          <Link
            href="/pricing"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Upgrade Plan
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 p-6 lg:p-8">{children}</main>
    </div>
  );
}
