import React from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Code2,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  Lock,
  Boxes,
  Cpu,
  Fingerprint
} from 'lucide-react';

export const ArchitectureDetailDrawer = ({ selectedNode, onClose }) => {
  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-slate-900/40 border border-slate-800 rounded-xl">
        <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-3">
          <Layers className="w-6 h-6 text-cyan-400" />
        </div>
        <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-1">
          Select an Architecture Node
        </h4>
        <p className="text-xs text-slate-400 max-w-xs font-sans">
          Click any architecture component or flow block on the diagram to inspect its technical implementation, flow, and verification properties.
        </p>
      </div>
    );
  }

  const isImplemented = selectedNode.status === 'IMPLEMENTED';
  const isConceptual = selectedNode.status === 'CONCEPTUAL';

  return (
    <div className="h-full flex flex-col bg-[#050b18] border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800/90 bg-slate-900/80 flex items-start justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider uppercase">
              LAYER {selectedNode.layerNumber || '00'}
            </span>
            <span
              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                isImplemented
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : isConceptual
                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              {isImplemented ? '✓ IMPLEMENTED' : selectedNode.status}
            </span>
          </div>
          <h3 className="text-base font-mono font-bold text-white leading-tight">
            {selectedNode.name}
          </h3>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
            {selectedNode.badge}
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close component details"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Drawer Content Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-xs font-sans scrollbar-thin scrollbar-thumb-slate-800">
        {/* Purpose Section */}
        <div>
          <h4 className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>PURPOSE & FUNCTION</span>
          </h4>
          <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
            {selectedNode.summary}
          </p>
        </div>

        {/* Architecture Flow */}
        {selectedNode.flow && selectedNode.flow.length > 0 && (
          <div>
            <h4 className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>ARCHITECTURE FLOW</span>
            </h4>
            <div className="space-y-2">
              {selectedNode.flow.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2 rounded-md bg-slate-900/40 border border-slate-800/70"
                >
                  <span className="shrink-0 w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-[10px] font-bold flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-slate-300 leading-normal">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5-Point Verification Checklist (For Verification Layer) */}
        {selectedNode.fivePointChecklist && (
          <div>
            <h4 className="text-[11px] font-mono font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>5-POINT ZERO-TRUST CHECKLIST</span>
            </h4>
            <div className="space-y-2">
              {selectedNode.fivePointChecklist.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-md bg-rose-950/20 border border-rose-500/20 space-y-1"
                >
                  <div className="flex items-center gap-1.5 font-mono font-bold text-rose-300 text-[11px]">
                    <span>Point {item.point} — {item.title}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Off-Chain vs On-Chain Segregation Map */}
        {selectedNode.storedData && (
          <div>
            <h4 className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5" />
              <span>DATA SEGREGATION BREAKDOWN</span>
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              <div className="p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-500/20">
                <span className="font-mono font-bold text-indigo-300 text-[10px] uppercase block mb-1">
                  OFF-CHAIN (Confidential Data / Object Storage)
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                  {selectedNode.storedData.offChain.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20">
                <span className="font-mono font-bold text-amber-300 text-[10px] uppercase block mb-1">
                  ON-CHAIN (State Proofs / EVM Contract)
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                  {selectedNode.storedData.onChain.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* RBAC Roles Breakdown (For Identity Layer) */}
        {selectedNode.implementedRoles && (
          <div>
            <h4 className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>IMPLEMENTED RBAC ROLES (6 ROLES)</span>
            </h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {selectedNode.implementedRoles.map((r, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-900/60 border border-slate-800 text-[11px]">
                  <div className="flex items-center justify-between font-mono font-bold text-purple-300">
                    <span>{r.title}</span>
                    <span className="text-[9px] text-slate-400">{r.org}</span>
                  </div>
                  <p className="text-slate-400 text-[10px] mt-0.5 font-mono">{r.actions}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7-Stage Custody Lifecycle Breakdown */}
        {selectedNode.lifecycleStages && (
          <div>
            <h4 className="text-[11px] font-mono font-bold text-teal-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>7-STAGE STATE MACHINE</span>
            </h4>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {selectedNode.lifecycleStages.map((s, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-900/60 border border-slate-800 text-[11px]">
                  <div className="flex items-center justify-between font-mono font-bold text-teal-300">
                    <span>{s.name}</span>
                    <span className="text-[9px] text-slate-400">{s.actor}</span>
                  </div>
                  <p className="text-slate-300 text-[10px] mt-0.5">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technologies Breakdown */}
        {selectedNode.technologies && selectedNode.technologies.length > 0 && (
          <div>
            <h4 className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>VERIFIED TECHNOLOGIES</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {selectedNode.technologies.map((tech, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded bg-slate-900/50 border border-slate-800 flex flex-col font-mono"
                >
                  <span className="font-bold text-white text-[11px]">{tech.name}</span>
                  <span className="text-[10px] text-slate-400">{tech.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Why It Matters */}
        {selectedNode.whyItMatters && (
          <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 space-y-1">
            <h4 className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>WHY THIS ARCHITECTURE MATTERS</span>
            </h4>
            <p className="text-slate-300 text-xs leading-relaxed">
              {selectedNode.whyItMatters}
            </p>
          </div>
        )}

        {/* Code References in Repository */}
        {selectedNode.codeReferences && (
          <div>
            <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-slate-400" />
              <span>REPOSITORY CODE ARTIFACTS</span>
            </h4>
            <div className="space-y-1 font-mono text-[10px]">
              {selectedNode.codeReferences.map((ref, idx) => (
                <div
                  key={idx}
                  className="px-2 py-1 rounded bg-slate-950/80 border border-slate-800 text-cyan-300 truncate"
                  title={ref}
                >
                  {ref}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
