"use client";

import { useBioStore } from "@/store/bioStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Brain, Activity, Globe, FlaskConical } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { isLoggedIn, status } = useBioStore();
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-6 pt-20 text-center space-y-12">
      <div className="space-y-6">
        <div className="w-24 h-24 rounded-[2rem] bg-emerald-600 mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-pulse">
          <Brain size={48} className="text-white" />
        </div>
        <h1 className="text-6xl font-bold tracking-tighter bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          BioAI Network
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          The world's first open-source neural engine for biological AI interaction. 
          Create, engineer, and broadcast living entities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Link href="/hub" className="p-8 rounded-[2rem] bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/50 transition-all group">
          <Globe className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
          <h2 className="text-xl font-bold mb-2">Discovery Hub</h2>
          <p className="text-sm text-zinc-500">Interact with entities broadcasted by the community.</p>
        </Link>
        <Link href="/lab" className="p-8 rounded-[2rem] bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/50 transition-all group">
          <FlaskConical className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
          <h2 className="text-xl font-bold mb-2">Private Lab</h2>
          <p className="text-sm text-zinc-500">Initialize and manage your own biological subjects.</p>
        </Link>
      </div>

      <div className="pt-12 flex flex-col items-center gap-4">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${status?.status === 'healthy' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          <Activity size={14} className={status?.status === 'healthy' ? 'animate-pulse' : ''} />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Neural Engine: {status?.status === 'healthy' ? 'CONNECTED' : 'OFFLINE'}
          </span>
        </div>
        <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-[0.2em]">
          Ultra-Modular Backend • Community Driven • Zero Budget Production
        </p>
      </div>
    </div>
  );
}
