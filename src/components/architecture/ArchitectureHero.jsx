import React from 'react';
import {
  Layers,
  ShieldCheck,
  Cpu,
  Binary,
  GitBranch,
  Key,
  CheckCircle2,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const ArchitectureHero = ({ activeLayerCount = 9, onScrollToDiagram }) => {
  return (
    <section className="relative pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-cyan-500/8 blur-[120px] pointer-events-none -z-10" />

      <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-4">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold uppercase tracking-wider shadow-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            TECHNICAL ARCHITECTURE
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-mono text-[11px]">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>9 System Layers Mapped</span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-mono uppercase">
          HASHGUARD <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">SYSTEM ARCHITECTURE</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl font-sans">
          Understand how HashGuard connects identity, access control, cryptographic integrity, digital asset ownership, custody, verification, and blockchain-based auditability into a unified trust layer.
        </p>

        {/* Secondary Text */}
        <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>From evidence ingestion to independently verifiable trust.</span>
        </div>

        {/* Implementation Status Banner (Section 10 requirement) */}
        <div className="w-full max-w-2xl mt-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[11px]">
              Architecture elements are marked according to their current implementation status.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              ✓ IMPLEMENTED
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
              CONCEPTUAL
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
