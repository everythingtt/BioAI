"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NeuralBridge } from "./NeuralBridge";
import { Globe, FlaskConical, PenTool, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Discovery", href: "/hub", icon: Globe },
    { name: "Laboratory", href: "/lab", icon: FlaskConical },
    { name: "Studio", href: "/studio", icon: PenTool },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform">
            <LayoutDashboard className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tighter leading-tight">BioAI</h1>
            <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-[0.2em] leading-tight">Neuro Engine</p>
          </div>
        </Link>

        {/* Links */}
        <div className="flex bg-zinc-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-zinc-800/50 shadow-2xl">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              href={item.href}
              className={cn(
                "px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                pathname.startsWith(item.href) 
                  ? "bg-emerald-600 text-white shadow-lg" 
                  : "text-zinc-500 hover:text-zinc-200"
              )}
            >
              <item.icon size={14} />
              {item.name}
            </Link>
          ))}
        </div>

        {/* Bridge */}
        <NeuralBridge />
      </div>
    </nav>
  );
}
