"use client";

import { useEffect } from "react";
import { useBioStore } from "@/store/bioStore";
import { Widget } from "@/components/ui/Widget";
import { Globe, Heart, Activity, Sparkles, User } from "lucide-react";
import Link from "next/link";

export default function DiscoveryHub() {
  const { gallery, fetchGallery, status } = useBioStore();

  useEffect(() => {
    if (status?.status === 'healthy') fetchGallery();
  }, [status]);

  return (
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Trending Header */}
      <div className="lg:col-span-12 flex flex-col items-center text-center mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
          <Globe size={12} /> Global Discovery Active
        </div>
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          The Bio-Network
        </h1>
        <p className="text-zinc-500 max-w-lg">
          Explore entities broadcasted from private laboratories across the neural bridge.
        </p>
      </div>

      {/* Main Gallery Grid */}
      <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
        {gallery.map((char) => (
          <Widget key={char.id} title={char.name} icon={<Sparkles size={14} />} className="h-full">
            <div className="flex flex-col h-full space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center border border-zinc-700 text-emerald-500">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 line-clamp-2">{char.description}</p>
                </div>
              </div>

              {/* Bio-Preview */}
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(char.current_state.chemicals).slice(0, 3).map(([chem, val]: [string, any]) => (
                  <div key={chem} className="p-2 rounded-xl bg-black/20 border border-zinc-800/50">
                    <p className="text-[8px] uppercase font-bold text-zinc-600 mb-1">{chem}</p>
                    <p className="text-xs font-mono text-emerald-400">{Math.round(val)}%</p>
                  </div>
                ))}
              </div>

              <Link 
                href={`/chat/${char.id}`}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all text-center"
              >
                ENTER INTERACTION CHAMBER
              </Link>
            </div>
          </Widget>
        ))}

        {gallery.length === 0 && (
          <div className="col-span-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-[2.5rem] text-zinc-600">
            <Globe size={48} className="mb-4 opacity-20" />
            <p className="text-sm">Waiting for entities to broadcast to the network...</p>
          </div>
        )}
      </div>

      {/* Sidebar Analytics */}
      <div className="lg:col-span-3 space-y-6">
        <Widget title="Network Stats" icon={<Activity size={14} />}>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
              <span className="text-zinc-500 text-[10px] uppercase font-bold">Online Entities</span>
              <span className="text-emerald-400 font-mono text-sm">{gallery.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
              <span className="text-zinc-500 text-[10px] uppercase font-bold">Avg Stability</span>
              <span className="text-zinc-300 font-mono text-sm">84%</span>
            </div>
          </div>
        </Widget>

        <Widget title="Recent Spikes" icon={<Heart size={14} className="text-red-500" />}>
          <div className="flex flex-col items-center justify-center h-32 text-zinc-700 italic text-[10px]">
            No recent biological anomalies detected.
          </div>
        </Widget>
      </div>
    </div>
  );
}
