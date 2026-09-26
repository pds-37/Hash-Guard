import React from 'react';
import { ChevronRight } from 'lucide-react';

export const NativeProcessSteps = ({ onLaunchRole }) => {
  const steps = [
    {
      number: '01',
      title: 'Register Evidence',
      description: 'Upload & cryptographically seal forensic exhibits',
      role: 'ORG_A',
      path: '/evidence',
      renderIcon: () => (
        <svg viewBox="0 0 160 100" className="w-full h-24 filter drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
          <defs>
            <linearGradient id="pedGrad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="fileGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
          </defs>
          {/* Base Holographic Rings */}
          <ellipse cx="80" cy="78" rx="65" ry="16" fill="url(#pedGrad1)" stroke="#22d3ee" strokeWidth="1.5" />
          <ellipse cx="80" cy="78" rx="48" ry="11" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 2" />
          <ellipse cx="80" cy="78" rx="30" ry="7" fill="#22d3ee" fillOpacity="0.3" />

          {/* Floating Document */}
          <rect x="62" y="24" width="36" height="46" rx="4" fill="#07182c" stroke="#38bdf8" strokeWidth="1.8" />
          <path d="M 86 24 L 98 36 L 86 36 Z" fill="#22d3ee" opacity="0.6" />
          
          {/* Upload Arrow */}
          <path d="M 80 56 L 80 38 M 73 45 L 80 38 L 87 45" stroke="#22d3ee" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="68" y="58" width="24" height="2" rx="1" fill="#38bdf8" />
        </svg>
      )
    },
    {
      number: '02',
      title: 'Track Custody',
      description: 'Monitor inter-agency transfers in real time',
      role: 'ORG_B',
      path: '/transfers',
      renderIcon: () => (
        <svg viewBox="0 0 160 100" className="w-full h-24 filter drop-shadow-[0_0_12px_rgba(59,130,246,0.4)]">
          <defs>
            <linearGradient id="pedGrad2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {/* Base Holographic Rings */}
          <ellipse cx="80" cy="78" rx="65" ry="16" fill="url(#pedGrad2)" stroke="#38bdf8" strokeWidth="1.5" />
          <ellipse cx="80" cy="78" rx="48" ry="11" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 2" />

          {/* 3 Interconnected User Nodes */}
          {/* Node 1 Top */}
          <circle cx="80" cy="30" r="11" fill="#081e3a" stroke="#38bdf8" strokeWidth="1.6" />
          <circle cx="80" cy="28" r="4" fill="#38bdf8" />
          <path d="M 74 37 C 74 34 86 34 86 37" stroke="#38bdf8" strokeWidth="1.2" fill="none" />

          {/* Node 2 Left */}
          <circle cx="56" cy="54" r="11" fill="#081e3a" stroke="#38bdf8" strokeWidth="1.6" />
          <circle cx="56" cy="52" r="4" fill="#38bdf8" />
          <path d="M 50 61 C 50 58 62 58 62 61" stroke="#38bdf8" strokeWidth="1.2" fill="none" />

          {/* Node 3 Right */}
          <circle cx="104" cy="54" r="11" fill="#081e3a" stroke="#38bdf8" strokeWidth="1.6" />
          <circle cx="104" cy="52" r="4" fill="#38bdf8" />
          <path d="M 98 61 C 98 58 110 58 110 61" stroke="#38bdf8" strokeWidth="1.2" fill="none" />

          {/* Interconnecting Network Lines */}
          <line x1="72" y1="38" x2="62" y2="46" stroke="#60a5fa" strokeWidth="1.4" strokeDasharray="3 2" />
          <line x1="88" y1="38" x2="98" y2="46" stroke="#60a5fa" strokeWidth="1.4" strokeDasharray="3 2" />
          <line x1="68" y1="54" x2="92" y2="54" stroke="#60a5fa" strokeWidth="1.4" strokeDasharray="3 2" />
        </svg>
      )
    },
    {
      number: '03',
      title: 'Verify Integrity',
      description: 'Detect tampering with cryptographic proofs',
      role: 'AUDITOR',
      path: '/verification',
      renderIcon: () => (
        <svg viewBox="0 0 160 100" className="w-full h-24 filter drop-shadow-[0_0_14px_rgba(6,182,212,0.45)]">
          <defs>
            <linearGradient id="pedGrad3" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="shieldFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#08253b" />
              <stop offset="100%" stopColor="#04121d" />
            </linearGradient>
          </defs>
          {/* Base Holographic Rings */}
          <ellipse cx="80" cy="78" rx="65" ry="16" fill="url(#pedGrad3)" stroke="#22d3ee" strokeWidth="1.5" />
          <ellipse cx="80" cy="78" rx="46" ry="10" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="4 2" />

          {/* Cyber Shield */}
          <path d="M 80 20 L 102 29 C 102 48 80 62 80 62 C 80 62 58 48 58 29 Z" fill="url(#shieldFill)" stroke="#22d3ee" strokeWidth="2" strokeLinejoin="round" />
          
          {/* Glowing Checkmark */}
          <path d="M 71 39 L 77 46 L 90 32" stroke="#34d399" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="drop-shadow(0 0 6px #10b981)" />
        </svg>
      )
    },
    {
      number: '04',
      title: 'Maintain Trust',
      description: 'Support legal, audit, and judicial oversight',
      role: 'AUDITOR',
      path: '/audit',
      renderIcon: () => (
        <svg viewBox="0 0 160 100" className="w-full h-24 filter drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]">
          <defs>
            <linearGradient id="pedGrad4" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {/* Base Holographic Rings */}
          <ellipse cx="80" cy="78" rx="65" ry="16" fill="url(#pedGrad4)" stroke="#c084fc" strokeWidth="1.5" />
          <ellipse cx="80" cy="78" rx="46" ry="10" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 2" />

          {/* Neoclassical Judicial Courthouse / Bank Pillars */}
          {/* Roof Pediment */}
          <polygon points="80,24 55,34 105,34" fill="#0d1b33" stroke="#c084fc" strokeWidth="1.8" />
          <rect x="53" y="34" width="54" height="3" fill="#a855f7" />

          {/* 4 Pillars */}
          <rect x="58" y="37" width="5" height="23" fill="#c084fc" opacity="0.9" />
          <rect x="71" y="37" width="5" height="23" fill="#c084fc" opacity="0.9" />
          <rect x="84" y="37" width="5" height="23" fill="#c084fc" opacity="0.9" />
          <rect x="97" y="37" width="5" height="23" fill="#c084fc" opacity="0.9" />

          {/* Base Steps */}
          <rect x="52" y="60" width="56" height="4" fill="#a855f7" rx="1" />
          <rect x="48" y="64" width="64" height="4" fill="#7e22ce" rx="1" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {steps.map((step) => (
        <div
          key={step.number}
          onClick={() => onLaunchRole(step.role, step.path, true)}
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-gradient-to-b dark:from-[#060e1d]/90 dark:to-[#030712]/95 hover:bg-white dark:hover:from-[#09152b] dark:hover:to-[#050b18] hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300 cursor-pointer group flex flex-col justify-between h-full relative"
        >
          <div>
            {/* Header: Step Pill + Title */}
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25">
                {step.number}
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-sans group-hover:text-cyan-400 transition-colors">
                {step.title}
              </h4>
            </div>

            {/* Custom Glowing Cybernetic Pedestal Icon */}
            <div className="my-3 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              {step.renderIcon()}
            </div>
          </div>

          {/* Description + Hover Arrow */}
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/60">
            <span className="leading-relaxed font-sans">{step.description}</span>
            <ChevronRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ml-1.5" />
          </div>
        </div>
      ))}
    </div>
  );
};
