import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const NativeHeroDiagram = ({ 
  onOpenOnChainProof, 
  onOpenTamperBreach,
  onLaunchSandbox 
}) => {
  const [copiedHash, setCopiedHash] = useState(null); // 'sealed' | 'computed' | null
  const [activeMode, setActiveMode] = useState('dual'); // 'dual' | 'verified' | 'tamper'

  const sealedHashFull = '8f3a91bc4e8d2f6a7c1e2d9fe4b6c3a77d210984a9e52c801e0a2b8e3a4f6d8c';
  const computedHashFull = '4c8e2d1f9b7a6c3e4d091b3ef2a6d0c4f9eb2a1d8c7e6b5a4f3e2d1c0b9a8f7e';

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(type);
    setTimeout(() => setCopiedHash(null), 2500);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto py-2">
      {/* Stream Controls Pill */}
      <div className="mb-4 flex items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold tracking-wider uppercase text-slate-200">
            Real-Time Cryptographic Verification Matrix
          </span>
        </div>

        <div className="flex items-center bg-[#071120]/90 border border-slate-800 p-1 rounded-lg text-xs font-mono">
          <button
            onClick={() => setActiveMode('dual')}
            className={`px-3 py-1 rounded transition-all cursor-pointer ${
              activeMode === 'dual'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dual Stream
          </button>
          <button
            onClick={() => setActiveMode('verified')}
            className={`px-3 py-1 rounded transition-all cursor-pointer flex items-center gap-1 ${
              activeMode === 'verified'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Stream</span>
          </button>
          <button
            onClick={() => setActiveMode('tamper')}
            className={`px-3 py-1 rounded transition-all cursor-pointer flex items-center gap-1 ${
              activeMode === 'tamper'
                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Tamper Alert</span>
          </button>
        </div>
      </div>

      {/* Main Diagram Area with Dynamic Glassmorphic Canvas */}
      <div className="relative rounded-3xl border border-slate-800/80 bg-gradient-to-br from-[#050b16]/95 via-[#071224]/90 to-[#040812]/95 backdrop-blur-2xl p-6 lg:p-8 shadow-2xl overflow-hidden">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Ambient Raytraced Texture Overlay (blended subtly) */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen bg-cover bg-center"
          style={{ backgroundImage: 'url(/assets/hero-bg-render.png)' }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* ======================================================== */}
          {/* COLUMN 1: EXHIBIT EV-001 HOLOGRAPHIC DOCUMENT ON PEDESTAL */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            {/* 3D Tilted Document Container */}
            <div className="relative group/doc cursor-pointer">
              {/* Glowing Document Card */}
              <div className="relative w-48 sm:w-56 h-64 sm:h-72 rounded-2xl border-2 border-cyan-400/60 bg-gradient-to-b from-[#0a1e38]/90 via-[#071328]/95 to-[#040914] backdrop-blur-xl p-4 sm:p-5 shadow-[0_0_35px_rgba(6,182,212,0.35)] transition-all duration-300 group-hover/doc:scale-105 group-hover/doc:border-cyan-300 group-hover/doc:shadow-[0_0_45px_rgba(6,182,212,0.5)] overflow-hidden">
                
                {/* Dog-ear corner fold */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-cyan-500/20 border-b-2 border-l-2 border-cyan-400/60 rounded-bl-xl backdrop-blur-md" />

                {/* Laser scan line animation */}
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-pulse pointer-events-none top-1/2 -translate-y-1/2" />

                {/* Card Header */}
                <div className="flex flex-col text-left space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm sm:text-base text-white tracking-wider">
                      EV-001
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      SECURED
                    </span>
                  </div>
                  <span className="text-xs text-slate-300 font-medium">Disk Image</span>
                  <span className="text-[11px] font-mono text-slate-400">4.2 GB</span>
                </div>

                {/* Center Biometric Fingerprint Graphic (SVG) */}
                <div className="my-3 sm:my-4 flex items-center justify-center relative">
                  <div className="w-24 h-28 sm:w-28 sm:h-32 relative flex items-center justify-center">
                    <svg viewBox="0 0 100 120" className="w-full h-full filter drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]">
                      <defs>
                        <linearGradient id="fpGrad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#22d3ee" />
                          <stop offset="50%" stopColor="#38bdf8" />
                          <stop offset="100%" stopColor="#0284c7" />
                        </linearGradient>
                      </defs>
                      {/* Fingerprint Arcs */}
                      <path d="M 50 15 A 35 45 0 0 1 85 60 A 35 45 0 0 1 78 85" stroke="url(#fpGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <path d="M 50 15 A 35 45 0 0 0 15 60 A 35 45 0 0 0 25 90" stroke="url(#fpGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <path d="M 50 25 A 25 35 0 0 1 75 60 A 25 35 0 0 1 70 80" stroke="url(#fpGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <path d="M 50 25 A 25 35 0 0 0 25 60 A 25 35 0 0 0 32 82" stroke="url(#fpGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <path d="M 50 35 A 15 25 0 0 1 65 60 A 15 25 0 0 1 60 75" stroke="url(#fpGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <path d="M 50 35 A 15 25 0 0 0 35 60 A 15 25 0 0 0 40 75" stroke="url(#fpGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <path d="M 50 45 A 6 15 0 0 1 56 60 L 56 70" stroke="url(#fpGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <path d="M 50 45 A 6 15 0 0 0 44 60 L 44 70" stroke="url(#fpGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <circle cx="50" cy="55" r="2.5" fill="#38bdf8" />
                    </svg>
                  </div>
                </div>

                {/* Microstatus footer */}
                <div className="pt-2 border-t border-cyan-500/30 flex items-center justify-between text-[10px] font-mono text-cyan-400/80">
                  <span>SHA-256 LOCKED</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>

              {/* 3D Tech Holographic Pedestal */}
              <div className="relative -mt-4 w-56 sm:w-64 h-12 flex flex-col items-center justify-center">
                {/* Outer pedestal rim */}
                <div className="w-full h-8 rounded-full border-2 border-cyan-400/60 bg-gradient-to-r from-cyan-500/20 via-blue-600/30 to-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center">
                  {/* Inner glowing ring */}
                  <div className="w-4/5 h-4 rounded-full border border-cyan-300/80 bg-cyan-400/20 shadow-[0_0_15px_#22d3ee]" />
                </div>
              </div>

              {/* Pedestal Caption */}
              <div className="text-center mt-1">
                <div className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  Original Evidence
                </div>
                <div className="text-[11px] font-mono text-cyan-400/90 font-medium">
                  specimen_lockbit_dump.dd
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* COLUMN 2: TWO DUAL VERIFICATION BRANCHES (CYAN & RED) */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            {/* ------------------------------------------------------ */}
            {/* UPPER BRANCH: VERIFIED ON-CHAIN (CYAN PATH) */}
            {/* ------------------------------------------------------ */}
            <div className={`space-y-3 transition-all duration-300 ${
              activeMode === 'tamper' ? 'opacity-30 pointer-events-none' : 'opacity-100'
            }`}>
              {/* Branch Indicator Badge */}
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SHA-256</span>
                </div>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent" />
              </div>

              {/* Cards Row: Sealed Hash Card + Proof Recorded On-Chain */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Sealed Hash Card */}
                <div className="p-4 rounded-xl border border-cyan-500/40 bg-[#071325]/90 backdrop-blur-xl shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col justify-between space-y-3 hover:border-cyan-400/70 transition-all">
                  <div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-cyan-500/20">
                      <span className="text-xs font-bold text-slate-200 font-mono tracking-wide uppercase">
                        Sealed Hash
                      </span>
                      <button
                        onClick={() => handleCopy(sealedHashFull, 'sealed')}
                        className="p-1 rounded bg-cyan-500/10 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 transition-colors cursor-pointer"
                        title="Copy Sealed Hash"
                      >
                        {copiedHash === 'sealed' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="mt-2.5 font-mono text-xs text-cyan-300 font-bold space-y-0.5 leading-snug">
                      <div className="truncate">8f3a91bc4e8d2f6a7c1e...</div>
                      <div className="truncate">2d9fe4b6c3a77d21...</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold pt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Verified | On-Chain</span>
                  </div>
                </div>

                {/* 2. Proof Recorded On-Chain Card */}
                <div 
                  onClick={onOpenOnChainProof}
                  className="p-4 rounded-xl border border-cyan-500/40 bg-[#071325]/90 backdrop-blur-xl shadow-[0_0_25px_rgba(6,182,212,0.15)] flex items-center gap-3.5 hover:border-cyan-400/80 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all cursor-pointer group/proof"
                >
                  {/* Ethereum 3D Crystal & Blockchain Nodes SVG */}
                  <div className="w-12 h-14 relative flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 50 60" className="w-full h-full filter drop-shadow-[0_0_10px_rgba(56,189,248,0.7)] group-hover/proof:scale-110 transition-transform">
                      {/* Top facets */}
                      <polygon points="25,4 40,26 25,34" fill="#38bdf8" />
                      <polygon points="25,4 10,26 25,34" fill="#22d3ee" opacity="0.8" />
                      {/* Bottom facets */}
                      <polygon points="25,37 40,29 25,52" fill="#0284c7" />
                      <polygon points="25,37 10,29 25,52" fill="#0369a1" />
                      {/* Floating blockchain network cubes */}
                      <circle cx="43" cy="18" r="3" fill="#22d3ee" />
                      <line x1="38" y1="23" x2="43" y2="18" stroke="#38bdf8" strokeWidth="1" />
                      <circle cx="8" cy="38" r="2.5" fill="#38bdf8" />
                      <line x1="12" y1="34" x2="8" y2="38" stroke="#38bdf8" strokeWidth="1" />
                    </svg>
                  </div>

                  {/* Text details */}
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-1.5">
                      <h5 className="text-xs font-bold text-white font-mono leading-tight">
                        Proof Recorded On-Chain
                      </h5>
                      <ExternalLink className="w-3 h-3 text-cyan-400 opacity-0 group-hover/proof:opacity-100 transition-opacity" />
                    </div>
                    <div className="font-mono text-[11px] text-slate-400 space-y-0.5">
                      <div>Tx: 0x3a7...9f2c</div>
                      <div>Block: 1845201</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------ */}
            {/* LOWER BRANCH: TAMPER BREACH ALERT (RED PATH) */}
            {/* ------------------------------------------------------ */}
            <div className={`space-y-3 transition-all duration-300 ${
              activeMode === 'verified' ? 'opacity-30 pointer-events-none' : 'opacity-100'
            }`}>
              {/* Branch Indicator Badge */}
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Modified File</span>
                </div>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-rose-500/50 to-transparent" />
              </div>

              {/* Cards Row: Computed Hash Card + TAMPER DETECTED Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 3. Computed Hash Card */}
                <div className="p-4 rounded-xl border border-rose-500/40 bg-[#190913]/90 backdrop-blur-xl shadow-[0_0_25px_rgba(244,63,94,0.15)] flex flex-col justify-between space-y-3 hover:border-rose-400/70 transition-all">
                  <div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-rose-500/20">
                      <span className="text-xs font-bold text-slate-200 font-mono tracking-wide uppercase">
                        Computed Hash
                      </span>
                      <button
                        onClick={() => handleCopy(computedHashFull, 'computed')}
                        className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 transition-colors cursor-pointer"
                        title="Copy Computed Specimen Hash"
                      >
                        {copiedHash === 'computed' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="mt-2.5 font-mono text-xs text-rose-400 font-bold space-y-0.5 leading-snug">
                      <div className="truncate">4c8e2d1f9b7a6c3e4d0...</div>
                      <div className="truncate">91b3ef2a6d0c4f9e...</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-rose-400 font-mono font-bold pt-1">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Integrity Mismatch</span>
                  </div>
                </div>

                {/* 4. TAMPER DETECTED Card */}
                <div 
                  onClick={onOpenTamperBreach}
                  className="p-4 rounded-xl border-2 border-rose-500/80 bg-[#1c060e]/95 backdrop-blur-xl shadow-[0_0_35px_rgba(244,63,94,0.35)] flex flex-col items-center justify-center text-center space-y-2 hover:border-rose-400 hover:shadow-[0_0_45px_rgba(244,63,94,0.5)] transition-all cursor-pointer group/tamper"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <AlertTriangle className="w-7 h-7 text-rose-500 animate-bounce" />
                    <ExternalLink className="w-3 h-3 text-rose-400 opacity-0 group-hover/tamper:opacity-100 transition-opacity" />
                  </div>

                  {/* Animated Equalizer Waveform */}
                  <div className="flex items-end justify-center gap-1 h-5 w-full max-w-[160px] my-0.5">
                    {[35, 65, 25, 95, 50, 100, 45, 85, 30, 90, 60, 80, 40, 70].map((h, idx) => (
                      <div 
                        key={idx} 
                        className="w-1 bg-rose-500 rounded-full animate-pulse" 
                        style={{ height: `${h}%`, animationDelay: `${idx * 0.1}s` }} 
                      />
                    ))}
                  </div>

                  <span className="font-mono font-black text-rose-500 text-xs sm:text-sm tracking-widest uppercase">
                    TAMPER DETECTED
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Floating Copied Toast Alert */}
        {copiedHash && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-cyan-500/60 text-cyan-300 text-xs font-mono px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-md z-40 animate-in fade-in slide-in-from-bottom-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">
              {copiedHash === 'sealed' ? 'Sealed SHA-256 Digest Root Copied!' : 'Computed Tampered Hash Copied!'}
            </span>
          </div>
        )}
      </div>

      {/* Footer Hotspot Caption */}
      <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-400 px-2">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Interactive:</span>
          <span>Click cards to inspect on-chain ledger proof & tamper breach analytics</span>
        </div>
        <button
          onClick={() => onLaunchSandbox('ORG_B', '/dashboard', true)}
          className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Open Full Sandbox</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
