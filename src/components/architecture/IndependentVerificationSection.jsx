import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  ArrowDown,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Fingerprint,
  KeyRound,
  History,
  GitBranch,
  Clock,
  Sparkles
} from 'lucide-react';

export const IndependentVerificationSection = () => {
  const [tamperSimulated, setTamperSimulated] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Exact exhibit test hashes
  const expectedHash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  const observedHash = tamperSimulated
    ? "5d41402abc4b2a76b9719d911017c592b21ee4c4a4e5257e8419c8fb92994116"
    : "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

  const isVerified = expectedHash === observedHash;

  const detailedChecks = [
    {
      title: '01. Cryptographic Integrity',
      pass: isVerified,
      icon: Fingerprint,
      detail: isVerified
        ? 'Observed file SHA-256 hash strictly matches on-chain contentHash root.'
        : 'Bitstream mismatch: 1 or more bytes altered in payload. Integrity seal broken.'
    },
    {
      title: '02. Identity & Signature Validation',
      pass: true,
      icon: KeyRound,
      detail: 'Registered secp256k1 key signature verified against on-chain DID Document.'
    },
    {
      title: '03. Custody Continuity',
      pass: true,
      icon: History,
      detail: 'Sequential dual-authorization handovers without gaps or unverified transfer hops.'
    },
    {
      title: '04. Monotonic Sequence & Block Timestamps',
      pass: true,
      icon: Clock,
      detail: 'EVM block timestamps progress monotonically without retroactive manipulation.'
    },
    {
      title: '05. DAG Lineage Parent-Child Proof',
      pass: true,
      icon: GitBranch,
      detail: 'Derived forensic artifacts cryptographically resolve to original seized exhibit root.'
    }
  ];

  return (
    <section id="verification" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-ce-border dark:border-slate-800/80">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">
              SECTION 04 &bull; ZERO-TRUST AUDIT
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-mono font-black text-slate-950 dark:text-white">
            INDEPENDENT VERIFICATION ENGINE
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans mt-1 max-w-3xl">
            Anyone can independently verify evidence without trusting police servers, cloud databases, or administrative credentials. The mathematics alone determine authenticity.
          </p>
        </div>

        {/* Interactive Tamper Toggle */}
        <button
          onClick={() => setTamperSimulated(!tamperSimulated)}
          className={`px-4 py-2 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            tamperSimulated
              ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-sm dark:bg-rose-500/20 dark:border-rose-500/50 dark:text-rose-300 dark:shadow-[0_0_20px_rgba(244,63,94,0.3)]'
              : 'bg-white border-slate-300 text-slate-800 hover:text-blue-900 hover:border-slate-400 shadow-xs dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:text-cyan-300'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>{tamperSimulated ? 'Reset to Legitimate Evidence' : 'Simulate Evidence Tampering'}</span>
        </button>
      </div>

      {/* ─── MAIN VISUALIZATION: SEALED vs CURRENT → COMPARE → VERDICT ─── */}
      <div className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 ${
        isVerified
          ? 'bg-white border-slate-200/90 shadow-premium dark:bg-gradient-to-b dark:from-[#030d12] dark:via-[#040812] dark:to-black dark:border-emerald-500/40 dark:shadow-[0_0_40px_rgba(16,185,129,0.12)]'
          : 'bg-white border-rose-300 shadow-premium dark:bg-gradient-to-b dark:from-[#140306] dark:via-[#040812] dark:to-black dark:border-rose-500/50 dark:shadow-[0_0_40px_rgba(244,63,94,0.18)]'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch relative">
          {/* Card 1: SEALED REFERENCE → EXPECTED SHA-256 */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 dark:bg-slate-950/90 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-blue-900 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-700 dark:text-cyan-400" />
                  <span>SEALED REFERENCE</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 dark:bg-cyan-500/10 dark:text-cyan-300">
                  On-Chain State
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-sans mb-3">
                Immutable reference digest sealed during registration inside the smart contract:
              </p>
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-500 uppercase mb-1 font-semibold">
                EXPECTED SHA-256:
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono text-xs text-slate-950 font-bold break-all select-all shadow-xs dark:bg-black/80 dark:border-slate-800 dark:text-cyan-300">
                {expectedHash}
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-500 block mt-3">
              Source: HASHGUARD.sol &bull; contentHash
            </span>
          </div>

          {/* Card 2: CURRENT ASSET → RECOMPUTED SHA-256 */}
          <div className={`p-5 rounded-2xl bg-slate-50/80 border flex flex-col justify-between ${
            isVerified ? 'border-slate-200/90 dark:border-slate-800' : 'border-rose-400'
          } dark:bg-slate-950/90`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-slate-200 flex items-center gap-1.5">
                  <Fingerprint className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>CURRENT ASSET</span>
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                  isVerified
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
                    : 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30'
                }`}>
                  {isVerified ? 'Bitstream Valid' : 'Modified Payload'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-sans mb-3">
                Recomputed SHA-256 digest calculated live directly from presented bytes:
              </p>
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-500 uppercase mb-1 font-semibold">
                RECOMPUTED SHA-256:
              </div>
              <div className={`p-3 rounded-xl border font-mono text-xs break-all select-all shadow-xs ${
                isVerified
                  ? 'bg-white border-slate-200 text-slate-950 font-bold dark:bg-black/80 dark:border-slate-800 dark:text-emerald-300'
                  : 'bg-rose-50 border-rose-300 text-rose-900 font-bold dark:bg-black/80 dark:border-rose-500/50 dark:text-rose-300'
              }`}>
                {observedHash}
              </div>
            </div>
            <span className={`text-[10px] font-mono block mt-3 ${isVerified ? 'text-slate-500 dark:text-slate-500' : 'text-rose-800 dark:text-rose-400 font-bold'}`}>
              Source: WebCrypto API live bitstream recomputation
            </span>
          </div>
        </div>

        {/* Central Compare Flow Block */}
        <div className="flex flex-col items-center justify-center my-8">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/90 font-mono text-xs text-slate-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 mb-4 shadow-card">
            <ArrowDown className="w-3.5 h-3.5 text-blue-700 dark:text-cyan-400 animate-bounce" />
            <span className="font-semibold">COMPARE EQUALITY</span>
          </div>

          {/* FINAL VERDICT: MATCH = TRUST VERIFIED | MISMATCH = TRUST COMPROMISED */}
          <div className={`w-full max-w-xl p-5 rounded-2xl border text-center transition-all ${
            isVerified
              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-sm dark:bg-emerald-950/60 dark:border-emerald-500/50 dark:text-emerald-300 dark:shadow-[0_0_35px_rgba(16,185,129,0.25)]'
              : 'bg-rose-50/90 border-rose-300 text-rose-950 shadow-sm dark:bg-rose-950/60 dark:border-rose-500/60 dark:text-rose-300 dark:shadow-[0_0_35px_rgba(244,63,94,0.3)]'
          }`}>
            <div className="flex items-center justify-center gap-2.5 mb-1.5">
              {isVerified ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <XCircle className="w-7 h-7 text-rose-600 dark:text-rose-400" />
              )}
              <h3 className="font-mono text-xl sm:text-2xl font-black tracking-wider uppercase">
                {isVerified ? 'MATCH → VERIFIED' : 'MISMATCH → INTEGRITY FAILURE'}
              </h3>
            </div>
            <p className="text-xs font-mono font-medium opacity-90 max-w-md mx-auto mt-1">
              {isVerified
                ? 'The presented digital asset matches the anchored on-chain baseline byte-for-byte.'
                : 'Cryptographic hash mismatch. 1 or more bits altered. Asset seal compromised!'}
            </p>
          </div>
        </div>

        {/* ─── PROGRESSIVE DISCLOSURE: "VIEW VERIFICATION DETAILS" BUTTON ─── */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-col items-center">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <span>{showDetails ? 'Hide Verification Inspection' : 'View Verification Inspection (Ownership, Custody, Provenance, Audit)'}</span>
            {showDetails ? <ChevronUp className="w-4 h-4 text-blue-700 dark:text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-blue-700 dark:text-cyan-400" />}
          </button>

          {/* Expandable Deeper Inspection Vectors */}
          {showDetails && (
            <div className="w-full mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 space-y-4 animate-in fade-in duration-300">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block text-left">
                INSPECTION VECTORS &bull; CRYPTOGRAPHIC INTEGRITY, OWNERSHIP, CUSTODY, PROVENANCE &amp; AUDIT
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
                {detailedChecks.map((c, i) => {
                  const CheckIcon = c.icon;
                  return (
                    <div
                      key={i}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                        c.pass
                          ? 'bg-slate-50/80 border-slate-200/90 text-slate-950 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-300'
                          : 'bg-rose-50/80 border-rose-300 text-rose-950 dark:bg-rose-950/30 dark:border-rose-500/40 dark:text-rose-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <CheckIcon className={`w-4 h-4 ${c.pass ? 'text-blue-700 dark:text-cyan-400' : 'text-rose-600 dark:text-rose-400'}`} />
                          {c.pass ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                          )}
                        </div>
                        <div className="font-bold text-[11px] mb-1">{c.title}</div>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                          {c.detail}
                        </p>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-200/80 dark:border-slate-800/80 text-[9px] font-bold">
                        {c.pass ? <span className="text-emerald-700 dark:text-emerald-400">VERIFIED ✓</span> : <span className="text-rose-700 dark:text-rose-400">FAILED ✗</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
