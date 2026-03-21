"use client";

import { useBioStore } from "@/store/bioStore";
import { Zap, Shield, Activity } from "lucide-react";

export function NeuralBridge() {
  const { status, backendUrl, setBackendUrl, checkConnection } = useBioStore();

  return (
    <div className="flex items-center gap-4">
      <div className="text-right hidden sm:block">
        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest leading-tight">Neural Bridge</p>
        <p className={`text-[10px] font-mono ${status?.status === 'healthy' ? 'text-emerald-400' : 'text-red-400'}`}>
          {status?.status === 'healthy' ? 'STABLE' : 'OFFLINE'}
        </p>
      </div>
      <div className="flex bg-zinc-900/80 p-1 rounded-xl border border-zinc-800/50 shadow-inner">
        <input 
          type="text" 
          value={backendUrl}
          onChange={(e) => setBackendUrl(e.target.value)}
          className="bg-transparent px-3 py-1 text-[10px] font-mono text-zinc-400 focus:outline-none w-32"
        />
        <button 
          onClick={checkConnection}
          className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition-all active:scale-95"
        >
          <Zap size={14} />
        </button>
      </div>
    </div>
  );
}
