import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  ArrowDown,
  CheckCircle2,
  XCircle,
  FileSearch,
  KeyRound,
  History,
  GitBranch,
  Clock,
  RotateCcw
} from 'lucide-react';

export const IndependentVerificationSection = () => {
  const [tamperSimulated, setTamperSimulated] = useState(false);

  // Exact exhibit verification test vector
  const expectedHash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  const observedHash = tamperSimulated
    ? "5d41402abc4b2a76b9719d911017c592b21ee4c4a4e5257e8419c8fb92994116"
    : "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

  const isVerified = expectedHash === observedHash;

  const checks = [
    {
      title: 'SHA-256 Bitstream Integrity',
      pass: isVerified,
      detail: isVerified ? 'Observed file hash equals on-chain contentHash root' : 'Cryptographic mismatch: 1 or more bits altered in payload'
    },
    {
      title: 'DID Cryptographic Signature',
      pass: true,
      detail: 'Registered secp256k1 key signature verified against on-chain DID Document'
    },
    {
      title: 'Custody Chain Continuity',
      pass: true,
      detail: 'Sequential dual-authorization handovers without gaps or unverified transfer hops'
    },
    {
      title: 'Monotonic Sequence & Block Timestamps',
      pass: true,
      detail: 'EVM block timestamps progress monotonically without retroactive manipulation'
    },
    {
      title: 'DAG Lineage Parent-Child Proof',
      pass: true,
      detail: 'Derived artifacts cryptographically bind to verified parent exhibit root'
    }
  ];

  return (
    <section id="verification" className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
              ZERO-TRUST AUDIT SUITE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-mono font-black text-white">
            INDEPENDENT ZERO-TRUST VERIFICATION
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-3xl">
            Anyone can independently verify evidence without trusting police servers, cloud databases, or administrative credentials. The mathematics alone determine authenticity.
          </p>
        </div>

        <button
          onClick={() => setTamperSimulated(!tamperSimulated)}
          className={`px-3.5 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            tamperSimulated
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-cyan-300'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{tamperSimulated ? 'Reset to Legitimate Evidence' : 'Simulate Evidence Tampering'}</span>
        </button>
      </div>

      {/* THE DRAMATIC COMPARISON ENGINE */}
      <div className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 mb-8 ${
        isVerified
          ? 'bg-gradient-to-b from-[#030a10] to-[#040812] border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.12)]'
          : 'bg-gradient-to-b from-[#100306] to-[#040812] border-rose-500/50 shadow-[0_0_40px_rgba(244,63,94,0.15)]'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative">
          {/* Left: Sealed Reference */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
                01. SEALED REFERENCE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Ethereum Sepolia Block #
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mb-3">
              Immutable reference digest sealed during evidence registration inside the smart contract:
            </p>
            <div className="p-3 rounded-xl bg-black/70 border border-slate-800 font-mono text-xs text-cyan-300 break-all select-all">
              {expectedHash}
            </div>
            <span className="text-[10px] font-mono text-slate-500 block mt-2">
              Source: HASHGUARD.sol → exhibits[tokenId].contentHash
            </span>
          </div>

          {/* Right: Current Evidence */}
          <div className={`p-5 rounded-2xl bg-slate-900/90 border ${
            isVerified ? 'border-slate-800' : 'border-rose-500/50'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                02. CURRENT EVIDENCE
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                isVerified
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold'
              }`}>
                {isVerified ? 'Bitstream Valid' : 'Modified Bitstream'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mb-3">
              Recomputed SHA-256 digest calculated directly from the presented evidence file:
            </p>
            <div className={`p-3 rounded-xl bg-black/70 border font-mono text-xs break-all select-all ${
              isVerified ? 'border-slate-800 text-emerald-300' : 'border-rose-500/50 text-rose-300'
            }`}>
              {observedHash}
            </div>
            <span className={`text-[10px] font-mono block mt-2 ${isVerified ? 'text-slate-500' : 'text-rose-400 font-bold'}`}>
              Source: WebCrypto API binary bitstream recomputation
            </span>
          </div>
        </div>

        {/* Central Compare Block */}
        <div className="flex flex-col items-center justify-center my-6">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950 border border-slate-800 font-mono text-xs text-slate-400 mb-3">
            <ArrowDown className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
            <span>BITSTREAM EQUALITY COMPARISON</span>
          </div>

          {/* Result Banner */}
          <div className={`w-full max-w-lg p-4 rounded-2xl border text-center transition-all ${
            isVerified
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
              : 'bg-rose-950/60 border-rose-500/60 text-rose-300 shadow-[0_0_30px_rgba(244,63,94,0.25)]'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-1">
              {isVerified ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-400" />
              )}
              <h3 className="font-mono text-lg font-black tracking-wider uppercase">
                {isVerified ? 'INTEGRITY VERIFIED: 100% BIT-LEVEL MATCH' : 'SECURITY ALERT: TAMPER DETECTED'}
              </h3>
            </div>
            <p className="text-xs font-mono opacity-90 max-w-md mx-auto">
              {isVerified
                ? 'The presented evidence is mathematically identical to the sealed reference on Ethereum Sepolia.'
                : 'Cryptographic hash mismatch. Evidence has been modified or corrupted post-seizure. Admissibility revoked!'}
            </p>
          </div>
        </div>

        {/* 5-Point Audit Breakdown Checklist */}
        <div className="pt-6 border-t border-slate-800/80">
          <span className="font-mono text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-3">
            5-POINT ZERO-TRUST VERIFICATION AUDIT SUITE
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
            {checks.map((c, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border ${
                  c.pass
                    ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[11px] truncate">{c.title}</span>
                  {c.pass ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-sans leading-tight mt-1">
                  {c.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
