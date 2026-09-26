import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  AlertTriangle, 
  ShieldCheck 
} from 'lucide-react';

export const HeroEvidenceDiagram = ({ 
  onOpenOnChainProof, 
  onOpenTamperBreach,
  onLaunchSandbox 
}) => {
  const [activeStream, setActiveStream] = useState('dual'); // 'dual' | 'verified' | 'tamper'
  const [copiedHash, setCopiedHash] = useState(null); // 'sealed' | 'computed' | null
  const [showDocDetails, setShowDocDetails] = useState(false);

  const sealedHashFull = '8f3a91bc4e8d2f6a7c1e2d9fe4b6c3a77d210984a9e52c801e0a2b8e3a4f6d8c';
  const computedHashFull = '4c8e2d1f9b7a6c3e4d091b3ef2a6d0c4f9eb2a1d8c7e6b5a4f3e2d1c0b9a8f7e';

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(type);
    setTimeout(() => {
      setCopiedHash(null);
    }, 2500);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto select-none group">
      {/* Stream Selector Controls */}
      <div className="mb-3 flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="uppercase tracking-wider font-semibold text-slate-300">Live Dual-Path Verification</span>
        </div>

        <div className="flex items-center bg-[#091122]/90 border border-slate-800 p-0.5 rounded-lg text-[10px] font-mono">
          <button
            onClick={() => setActiveStream('dual')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
              activeStream === 'dual'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dual Stream
          </button>
          <button
            onClick={() => setActiveStream('verified')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1 ${
              activeStream === 'verified'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Verified</span>
          </button>
          <button
            onClick={() => setActiveStream('tamper')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1 ${
              activeStream === 'tamper'
                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            <span>Tamper Alert</span>
          </button>
        </div>
      </div>

      {/* Main Diagram Viewport */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-[#050b16] shadow-2xl backdrop-blur-xl transition-all hover:border-cyan-500/40 hover:shadow-[0_0_35px_rgba(6,182,212,0.15)]">
        {/* Background Image Layer */}
        <div className="relative w-full overflow-hidden">
          <img 
            src="/assets/hero-diagram-final.png" 
            alt="Cryptographic Evidence Flow & Tamper Verification Diagram" 
            className="w-full h-auto object-contain block transition-transform duration-500 group-hover:scale-[1.01]"
          />

          {/* Interactive Overlay Hotspots */}

          {/* 1. EV-001 Document Hotspot */}
          <div 
            onClick={() => setShowDocDetails(!showDocDetails)}
            className="absolute cursor-pointer rounded-xl transition-all z-20 group/ev"
            style={{ left: '6%', top: '15%', width: '25%', height: '70%' }}
            title="Click to inspect EV-001 Exhibit Metadata"
          >
            <div className="w-full h-full rounded-xl border border-transparent hover:border-cyan-400/50 hover:bg-cyan-500/5 transition-all flex items-start justify-end p-2">
              <span className="opacity-0 group-hover/ev:opacity-100 transition-opacity bg-[#081224]/90 text-cyan-300 border border-cyan-500/40 px-1.5 py-0.5 rounded text-[9px] font-mono">
                Inspect ↗
              </span>
            </div>
          </div>

          {/* 2. Sealed Hash Copy Button Hotspot */}
          <div 
            className="absolute z-30"
            style={{ left: '62%', top: '27%', width: '6%', height: '11%' }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(sealedHashFull, 'sealed');
              }}
              className="w-full h-full rounded flex items-center justify-center bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white transition-all cursor-pointer shadow-sm"
              title="Copy Sealed SHA-256 Hash"
            >
              {copiedHash === 'sealed' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* 3. Proof Recorded On-Chain Hotspot */}
          <div 
            onClick={onOpenOnChainProof}
            className={`absolute cursor-pointer rounded-xl transition-all z-20 group/proof ${
              activeStream === 'tamper' ? 'opacity-30 pointer-events-none' : 'opacity-100'
            }`}
            style={{ left: '66%', top: '4%', width: '32%', height: '28%' }}
            title="Click to view On-Chain Ledger Proof"
          >
            <div className="w-full h-full rounded-xl border border-transparent hover:border-cyan-400/60 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-start justify-end p-1.5">
              <span className="opacity-0 group-hover/proof:opacity-100 transition-opacity bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 px-1.5 py-0.5 rounded text-[9px] font-mono flex items-center gap-1 shadow-sm">
                <span>Proof Details</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>

          {/* 4. Computed Hash Copy Button Hotspot */}
          <div 
            className="absolute z-30"
            style={{ left: '62%', top: '59%', width: '6%', height: '11%' }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(computedHashFull, 'computed');
              }}
              className="w-full h-full rounded flex items-center justify-center bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 text-rose-300 hover:text-white transition-all cursor-pointer shadow-sm"
              title="Copy Computed Specimen Hash"
            >
              {copiedHash === 'computed' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* 5. TAMPER DETECTED Card Hotspot */}
          <div 
            onClick={onOpenTamperBreach}
            className={`absolute cursor-pointer rounded-xl transition-all z-20 group/tamper ${
              activeStream === 'verified' ? 'opacity-30 pointer-events-none' : 'opacity-100'
            }`}
            style={{ left: '70%', top: '51%', width: '28%', height: '36%' }}
            title="Click to inspect 1-Bit Tamper Containment Drill"
          >
            <div className="w-full h-full rounded-xl border border-transparent hover:border-rose-500/80 hover:bg-rose-500/15 hover:shadow-[0_0_25px_rgba(239,68,68,0.35)] transition-all flex items-start justify-end p-1.5">
              <span className="opacity-0 group-hover/tamper:opacity-100 transition-opacity bg-rose-950/90 text-rose-300 border border-rose-500/40 px-1.5 py-0.5 rounded text-[9px] font-mono flex items-center gap-1 shadow-sm">
                <span>Tamper Drill</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Highlight Overlays based on Active Stream */}
        {activeStream === 'verified' && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-transparent via-cyan-500/5 to-cyan-500/10" />
        )}
        {activeStream === 'tamper' && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-rose-500/5 to-rose-500/15 animate-pulse" />
        )}

        {/* Floating Copied Toast Alert */}
        {copiedHash && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-cyan-500/50 text-cyan-300 text-xs font-mono px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-2 backdrop-blur-md z-40 animate-in fade-in slide-in-from-bottom-2">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {copiedHash === 'sealed' ? 'Sealed SHA-256 Root Copied!' : 'Computed Tampered Hash Copied!'}
            </span>
          </div>
        )}

        {/* EV-001 Quick Details Popover */}
        {showDocDetails && (
          <div className="absolute top-3 left-3 max-w-xs bg-[#091122]/95 border border-cyan-500/40 p-3 rounded-xl shadow-2xl backdrop-blur-md z-40 text-xs font-mono space-y-1.5">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="font-bold text-white">EXHIBIT EV-001 SPECIMEN</span>
              <button 
                onClick={() => setShowDocDetails(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="text-slate-300"><span className="text-slate-500">File:</span> specimen_lockbit_dump.dd</div>
            <div className="text-slate-300"><span className="text-slate-500">Format:</span> Raw Forensic Disk Image (.dd)</div>
            <div className="text-slate-300"><span className="text-slate-500">Size:</span> 4.2 GB (Chunked WebCrypto Hashed)</div>
            <div className="text-slate-300"><span className="text-slate-500">Vault:</span> Air-gapped AES-256-GCM Object Storage</div>
            <div className="text-emerald-400 pt-1 text-[11px]"><span className="text-slate-500">Integrity:</span> Anchored on Anvil EVM Block #1845201</div>
          </div>
        )}
      </div>

      {/* Diagram Footer Control Strip */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Interactive Hotspots:</span>
          <span className="text-slate-300">Click hashes to copy • Click cards to drill down</span>
        </div>
        <button
          onClick={() => onLaunchSandbox('ORG_B', '/dashboard', true)}
          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
        >
          <span>Open Full Sandbox</span>
          <span className="text-xs">→</span>
        </button>
      </div>
    </div>
  );
};
