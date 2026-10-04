import React, { useState } from 'react';
import {
  FilePlus,
  Fingerprint,
  Blocks,
  ArrowRightLeft,
  ShieldCheck,
  GitFork,
  Archive,
  ChevronRight,
  Shield,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';

export const AssetLifecycleSection = () => {
  const [selectedStage, setSelectedStage] = useState(0);

  const stages = [
    {
      id: 'register',
      num: '01',
      name: 'REGISTER',
      icon: FilePlus,
      color: 'blue',
      purpose: 'Initial digital evidence intake, physical device seizure, and local bitstream acquisition into isolated memory.',
      input: 'Physical hard drive, memory chip, network capture, or forensic disk image file (.dd/.E01).',
      output: 'Raw binary stream stored in isolated local buffer with initial case metadata and examiner tags.',
      securityProperty: 'Hardware write-block protection ensures pristine physical source preservation (NIST SP 800-86 standard).'
    },
    {
      id: 'seal',
      num: '02',
      name: 'SEAL',
      icon: Fingerprint,
      color: 'cyan',
      purpose: 'Generate deterministic SHA-256 cryptographic bitstream fingerprint and tamper-evident manifest seal.',
      input: 'Complete binary stream from acquisition buffer + canonicalized examiner metadata JSON.',
      output: '32-byte contentHash, metadataHash, and tamper-evident acquisition manifest.',
      securityProperty: 'Mathematical immutability: Any subsequent single-bit flip completely alters the digest output (avalanche effect).'
    },
    {
      id: 'mint',
      num: '03',
      name: 'MINT / REGISTER OWNERSHIP',
      icon: Blocks,
      color: 'amber',
      purpose: 'Anchor exhibit identity on Ethereum Sepolia smart contract as a non-fungible ERC-721 token.',
      input: 'contentHash, metadataHash, initial custodian DID, and organizational enclave ID.',
      output: 'ERC-721 Token ID minted on HASHGUARD.sol; AssetNFTMinted event emitted to public block logs.',
      securityProperty: 'Consensus-level proof of existence and non-repudiable initial ownership record anchored to blockchain.'
    },
    {
      id: 'transfer',
      num: '04',
      name: 'TRANSFER',
      icon: ArrowRightLeft,
      color: 'purple',
      purpose: 'Execute cross-organization custody handover between participating consortium agencies.',
      input: 'Transfer dispatch manifest signed by sender DID + receiver acceptance signature challenge.',
      output: 'Atomic on-chain custodian state transition via transferCustody() contract transaction.',
      securityProperty: 'Dual-authorization requirement: Prevents unilateral transfers, ghost evidence, or unaccounted custody gaps.'
    },
    {
      id: 'verify',
      num: '05',
      name: 'VERIFY',
      icon: ShieldCheck,
      color: 'emerald',
      purpose: 'Zero-trust inbound cryptographic verification before admitting exhibit into evidence vault.',
      input: 'Transferred binary payload + reference contentHash from on-chain smart contract token.',
      output: 'Cryptographic verification report: 100% bit-level match confirms evidence intact.',
      securityProperty: 'Independent verification: Receiving node relies strictly on mathematics, not trust in sender database.'
    },
    {
      id: 'derive',
      num: '06',
      name: 'DERIVE / TRACE',
      icon: GitFork,
      color: 'indigo',
      purpose: 'Generate child forensic artifacts (decompiled binaries, PCAP streams, YARA threat detections).',
      input: 'Sealed primary exhibit analyzed inside air-gapped forensic detonation sandbox.',
      output: 'Derived artifact token with cryptographic parent pointer registered in Forensic Lineage DAG.',
      securityProperty: 'Provenance continuity: Every forensic conclusion traces mathematically back to root seized exhibit.'
    },
    {
      id: 'archive',
      num: '07',
      name: 'ARCHIVE',
      icon: Archive,
      color: 'slate',
      purpose: 'Statutory evidence retention enforcement and court-ordered legal hold preservation.',
      input: 'Retention policy parameters (years) or court-ordered legal hold preservation orders.',
      output: 'Smart contract lock: applyRetentionPolicy() prevents premature deletion or unauthorized release.',
      securityProperty: 'Tamper-proof retention guarantee: Statutory expiry date verified prior to administrative pruning.'
    }
  ];

  const current = stages[selectedStage];
  const Icon = current.icon;

  return (
    <section id="asset-lifecycle" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-ce-border dark:border-slate-800/80">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-teal-700 dark:text-teal-400 uppercase tracking-widest">
              SECTION 03 &bull; LIFECYCLE STATE MACHINE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-mono font-black text-ce-text-primary dark:text-white">
            THE 7-STAGE ASSET LIFECYCLE
          </h2>
          <p className="text-xs sm:text-sm text-ce-text-secondary dark:text-slate-400 font-sans mt-1 max-w-2xl">
            A continuous, connected chain of custody. Click any stage along the timeline to inspect its operational purpose, cryptographic inputs, outputs, and security invariants.
          </p>
        </div>
        <div className="text-xs font-mono text-cyan-800 dark:text-cyan-400 bg-cyan-500/10 dark:bg-cyan-950/40 border border-cyan-500/30 px-3 py-1.5 rounded-full shrink-0 font-bold">
          STAGE {current.num} OF 07 &bull; {current.name}
        </div>
      </div>

      {/* ONE CONNECTED HORIZONTAL TIMELINE */}
      <div className="mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 relative">
          {stages.map((stage, idx) => {
            const StageIcon = stage.icon;
            const isSelected = selectedStage === idx;
            const isPassed = idx < selectedStage;

            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(idx)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between h-28 group ${
                  isSelected
                    ? 'bg-teal-500/15 border-teal-500 text-ce-text-primary shadow-sm dark:bg-teal-950/50 dark:border-teal-400 dark:shadow-[0_0_25px_rgba(20,184,166,0.25)] ring-1 ring-teal-500 dark:ring-teal-400'
                    : isPassed
                    ? 'bg-ce-surface border-ce-border hover:border-teal-500/50 dark:bg-slate-950/90 dark:border-slate-700/80'
                    : 'bg-ce-surface-subtle border-ce-border hover:border-ce-border-strong dark:bg-slate-950/60 dark:border-slate-800 hover:dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-teal-700 dark:text-teal-400' : 'text-ce-text-muted dark:text-slate-500'}`}>
                    {stage.num}
                  </span>
                  <StageIcon className={`w-4 h-4 ${isSelected ? 'text-teal-700 dark:text-teal-400' : 'text-ce-text-muted dark:text-slate-400 group-hover:text-ce-text-primary dark:group-hover:text-slate-200'}`} />
                </div>

                <div>
                  <div className="font-mono text-xs font-bold text-ce-text-primary dark:text-white tracking-wider">
                    {stage.name}
                  </div>
                  <div className="text-[9px] font-mono text-ce-text-muted dark:text-slate-400 truncate mt-0.5">
                    Stage {stage.num}
                  </div>
                </div>

                {/* Bottom Active Indicator Bar */}
                <div className={`h-0.5 w-full rounded-full transition-all ${
                  isSelected ? 'bg-teal-500 dark:bg-teal-400' : isPassed ? 'bg-ce-border-strong dark:bg-slate-600' : 'bg-transparent'
                }`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* DYNAMIC STAGE INSPECTOR (PURPOSE, INPUT, OUTPUT, SECURITY PROPERTY) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-ce-surface border border-teal-500/30 shadow-md dark:bg-[#030712] dark:shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-ce-border dark:border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-400">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-teal-700 dark:text-teal-400 font-bold block">
                STAGE {current.num} &bull; STATE TRANSITION
              </span>
              <h3 className="text-xl font-mono font-black text-ce-text-primary dark:text-white">
                {current.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>DETERMINISTIC INVARIANT</span>
            </span>
          </div>
        </div>

        {/* 4 Invariant Cards: Purpose, Input, Output, Security Property */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PURPOSE */}
          <div className="p-4 rounded-2xl bg-ce-surface-subtle border border-ce-border dark:bg-slate-950/80 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-teal-700 dark:text-teal-400 font-bold block">
              01 &bull; OPERATIONAL PURPOSE
            </span>
            <p className="text-xs sm:text-sm text-ce-text-primary dark:text-slate-200 font-sans leading-relaxed">
              {current.purpose}
            </p>
          </div>

          {/* SECURITY PROPERTY */}
          <div className="p-4 rounded-2xl bg-ce-surface-subtle border border-teal-500/30 dark:bg-slate-950/80 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold block">
              02 &bull; SECURITY INVARIANT / PROPERTY
            </span>
            <p className="text-xs sm:text-sm text-ce-text-primary dark:text-slate-200 font-sans leading-relaxed">
              {current.securityProperty}
            </p>
          </div>

          {/* INPUT */}
          <div className="p-4 rounded-2xl bg-ce-surface-subtle border border-ce-border dark:bg-slate-950/80 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ce-text-muted dark:text-slate-400 font-bold block">
              03 &bull; INCOMING INPUT
            </span>
            <p className="text-xs sm:text-sm text-ce-text-secondary dark:text-slate-300 font-mono leading-relaxed">
              {current.input}
            </p>
          </div>

          {/* OUTPUT */}
          <div className="p-4 rounded-2xl bg-ce-surface-subtle border border-ce-border dark:bg-slate-950/80 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 dark:text-cyan-400 font-bold block">
              04 &bull; EMITTED OUTPUT &amp; PROOF
            </span>
            <p className="text-xs sm:text-sm text-ce-text-secondary dark:text-slate-300 font-mono leading-relaxed">
              {current.output}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
