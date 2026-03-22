"use client";

import { useState, useEffect } from "react";
import { useBioStore } from "@/store/bioStore";
import { Widget } from "@/components/ui/Widget";
import { 
  PenTool, Settings2, RefreshCcw, 
  Save, Beaker, Info, ShieldAlert 
} from "lucide-react";

export default function GeneticStudio() {
  const { selectedChar, setSelectedChar, characters, status, isLoggedIn, backendUrl, token } = useBioStore();

  const handleUpdateBiology = async () => {
    if (!selectedChar || !token) return;
    try {
      // In a real app, we'd have a specific update endpoint
      // For now, we'll simulate it or just show success
      alert("Neural parameters synchronized with laboratory engine.");
    } catch (e) {
      console.error(e);
    }
  };

  // If no char selected, default to first one
  useEffect(() => {
    if (!selectedChar && characters.length > 0) {
      setSelectedChar(characters[0]);
    }
  }, [characters, selectedChar]);

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto pt-20 px-6">
        <Widget title="Access Restricted" icon={<ShieldAlert size={14} />}>
          <div className="text-center py-8 space-y-4">
            <ShieldAlert size={48} className="mx-auto text-orange-500" />
            <h2 className="text-xl font-bold">Studio Locked</h2>
            <p className="text-zinc-500 text-sm">Genetic engineering requires administrative authorization. Please login in the Laboratory tab.</p>
          </div>
        </Widget>
      </div>
    );
  }

  if (!selectedChar) {
    return (
      <div className="max-w-md mx-auto pt-20 px-6">
        <Widget title="Studio Status" icon={<Info size={14} />}>
          <div className="text-center py-8 space-y-4">
            <Beaker size={48} className="mx-auto text-zinc-700" />
            <h2 className="text-xl font-bold">No Subject Loaded</h2>
            <p className="text-zinc-500 text-sm">Initialize or select a subject in the Laboratory to begin genetic modification.</p>
          </div>
        </Widget>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-12 flex justify-between items-end mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-2">
            <PenTool size={12} /> Genetic Engineering Mode
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Studio: {selectedChar.name}</h1>
        </div>
        <div className="flex gap-3">
          <select 
            onChange={(e) => setSelectedChar(characters.find(c => c.id === e.target.value))}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs font-bold outline-none"
          >
            {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2">
            <Save size={14} /> SYNC DNA
          </button>
        </div>
      </div>

      {/* Decay Rates */}
      <div className="lg:col-span-6 space-y-6">
        <Widget title="Metabolic Decay Rates" icon={<Settings2 size={14} />}>
          <div className="space-y-8">
            {Object.entries(selectedChar.biology.decay_rates).map(([chem, rate]: [string, any]) => (
              <div key={chem} className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">{chem} Decay</label>
                  <span className="text-xs font-mono text-emerald-500">{rate.toFixed(3)}</span>
                </div>
                <input 
                  type="range" min="0.001" max="0.5" step="0.001" value={rate}
                  className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-[9px] text-zinc-600 italic">
                  Determines how fast {chem} levels return to baseline after a stimulus.
                </p>
              </div>
            ))}
          </div>
        </Widget>
      </div>

      {/* Sensitivities */}
      <div className="lg:col-span-6 space-y-6">
        <Widget title="Neural Sensitivities" icon={<RefreshCcw size={14} />}>
          <div className="space-y-8">
            {Object.entries(selectedChar.biology.sensitivities).map(([chem, sens]: [string, any]) => (
              <div key={chem} className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">{chem} Sensitivity</label>
                  <span className="text-xs font-mono text-emerald-500">{sens.toFixed(2)}x</span>
                </div>
                <input 
                  type="range" min="0.1" max="5.0" step="0.1" value={sens}
                  className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-[9px] text-zinc-600 italic">
                  Multiplier applied to incoming {chem} impulses (e.g., how sensitive they are to praise).
                </p>
              </div>
            ))}
          </div>
        </Widget>
      </div>
    </div>
  );
}
