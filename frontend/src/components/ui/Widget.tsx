"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WidgetProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

export function Widget({ title, icon, children, className, onClose }: WidgetProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative flex flex-col rounded-3xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl overflow-hidden",
        "shadow-[0_8px_32px_rgba(0,0,0,0.3)] group transition-all hover:border-emerald-500/20",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 bg-zinc-900/20">
        <div className="flex items-center gap-3">
          {icon && <div className="text-emerald-500">{icon}</div>}
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{title}</h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors">
            <span className="sr-only">Close</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto custom-scrollbar">
        {children}
      </div>

      {/* Neural Decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
      </div>
    </motion.div>
  );
}
