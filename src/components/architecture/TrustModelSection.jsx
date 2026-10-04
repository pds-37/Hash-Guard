import React, { useState } from 'react';
import {
  KeyRound,
  ShieldAlert,
  FileCode,
  Fingerprint,
  HardDrive,
  Blocks,
  ArrowRightLeft,
  ShieldCheck,
  GitBranch,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Info,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';

export const TrustModelSection = ({ onSelectNode }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedMapNode, setSelectedMapNode] = useState('PROOF');

  // The 8-stage Trust Continuum matching the prompt's exact sequence
  const trustStages = [
    {
      id: 'IDENTITY',
      num: '01',
      title: 'IDENTITY',
      question: 'Who acted?',
      icon: KeyRound,
      color: 'blue',
      badge: 'W3C DID • secp256k1',
      summary: 'Establishes cryptographic identity for actors without centralized domain controllers.',
      detail: 'Resolves decentralized identifier (did:ethr) anchored by cryptographic public keypairs. Removes single-point-of-failure LDAP/Active Directory dependencies.'
    },
    {
      id: 'AUTHORIZATION',
      num: '02',
      title: 'AUTHORIZATION',
      question: 'What were they allowed to do?',
      icon: ShieldAlert,
      color: 'purple',
      badge: 'RBAC • Policy Enclave',
      summary: 'Validates granular permissions across 6 roles and organization boundaries.',
      detail: 'Evaluates tenant scoping and role-based permissions matrix before allowing sensitive operations, backed by EVM AccessControl bytecode.'
    },
    {
      id: 'ASSET',
      num: '03',
      title: 'DIGITAL ASSET',
      question: 'Which asset did they act on?',
      icon: FileCode,
      color: 'indigo',
      badge: 'Asset ID • ERC-721',
      summary: 'Tokens and exhibits uniquely indexed and classified by sensitivity.',
      detail: 'Binds raw evidence exhibit (e.g. EV-001) to a unique deterministic identity with Standard, Restricted, or Critical sensitivity governance.'
    },
    {
      id: 'PROOF',
      num: '04',
      title: 'CRYPTOGRAPHIC PROOF',
      question: 'What was its original state?',
      icon: Fingerprint,
      color: 'cyan',
      badge: 'FIPS 180-4 SHA-256',
      summary: 'Computes deterministic 32-byte hash seal over binary bitstream.',
      detail: 'Avalanche effect guarantees that a 1-bit alteration flips the digest entirely. Anchors contentHash and metadataHash as the permanent root baseline.'
    },
    {
      id: 'DATA_SPLIT',
      num: '05',
      title: 'DATA / TRUST SPLIT',
      question: 'Where is data vs trust?',
      icon: HardDrive,
      color: 'indigo',
      badge: 'Off-Chain Data • On-Chain Trust',
      summary: 'Raw confidential files stay in encrypted storage; trust anchors on blockchain.',
      detail: 'Zero raw evidence is ever stored on the blockchain. Anchoring 32-byte hash roots guarantees bit-level integrity with zero confidentiality risk.'
    },
    {
      id: 'CUSTODY',
      num: '06',
      title: 'OWNERSHIP / CUSTODY',
      question: 'Who owned / held it?',
      icon: ArrowRightLeft,
      color: 'amber',
      badge: 'Dual-Auth Handover',
      summary: 'Tracks atomic state handovers between consortium agency nodes.',
      detail: 'Inter-agency transfers require dispatch manifest signing and receiver acceptance, preventing unilateral custody handovers or untracked gaps.'
    },
    {
      id: 'VERIFICATION',
      num: '07',
      title: 'INDEPENDENT VERIFICATION',
      question: 'Can another party verify it?',
      icon: ShieldCheck,
      color: 'emerald',
      badge: 'Zero-Trust Engine',
      summary: 'Independent recomputation compares presented bytes against root proof.',
      detail: 'Auditors, judges, or defense counsel verify integrity mathematically without trusting police servers, databases, or administrative credentials.'
    },
    {
      id: 'PROVENANCE_AUDIT',
      num: '08',
      title: 'PROVENANCE & AUDIT',
      question: 'What happened over its lifecycle?',
      icon: FileSpreadsheet,
      color: 'teal',
      badge: 'DAG + Tamper-Evident Ledger',
      summary: 'Derived artifacts map to parent roots; dual streams guarantee accountability.',
      detail: 'Combines permanent EVM block logs (AssetNFTMinted, CustodyTransferred) with relational operational activity records. Historical audit is preserved forever.'
    }
  ];

  // Main Architecture Map Nodes
  const mapNodes = {
    IDENTITY: {
      title: 'IDENTITY',
      sub: 'W3C DID / secp256k1',
      color: 'blue',
      layer: 'WHO',
      desc: 'Cryptographic root of the actor. Binds human/machine investigator to a decentralized public key.'
    },
    AUTHORIZATION: {
      title: 'AUTHORIZATION',
      sub: 'Role / Policy Gate',
      color: 'purple',
      layer: 'PERMIT',
      desc: 'Enforces dual-layer RBAC at both the API gateway and EVM AccessControl bytecode.'
    },
    ASSET: {
      title: 'ASSET',
      sub: 'Asset ID / ERC-721',
      color: 'indigo',
      layer: 'WHAT',
      desc: 'Digital asset exhibit tokenized with unambiguous ownership and sensitivity classification.'
    },
    PROOF: {
      title: 'CRYPTOGRAPHIC PROOF',
      sub: 'SHA-256 Bitstream Seal',
      color: 'cyan',
      layer: 'INTEGRITY',
      desc: 'Deterministic 32-byte content digest. The immutable mathematical anchor for all trust.'
    },
    OFFCHAIN: {
      title: 'OFF-CHAIN STORAGE',
      sub: 'MinIO S3 / AES-256-GCM',
      color: 'indigo',
      layer: 'DATA',
      desc: 'Confidential multi-GB disk images, PCAPs, and notes isolated off-chain. Zero raw bytes on-chain.'
    },
    ONCHAIN: {
      title: 'ON-CHAIN STATE',
      sub: 'Ethereum Sepolia Contract',
      color: 'amber',
      layer: 'TRUST',
      desc: 'Tamper-evident consensus ledger anchoring content hashes, token custody, and immutable event logs.'
    },
    CUSTODY: {
      title: 'CUSTODY LIFECYCLE',
      sub: 'Dual-Authorized Handover',
      color: 'amber',
      layer: 'CUSTODY',
      desc: 'Unbroken chain of custody verified across dispatch and receipt by consortium agencies.'
    },
    VERIFICATION: {
      title: 'INDEPENDENT VERIFICATION',
      sub: 'Zero-Trust Comparison',
      color: 'emerald',
      layer: 'VERIFY',
      desc: 'Recomputes SHA-256 live from presented bits. Exact match yields TRUST VERIFIED verdict.'
    },
    PROVENANCE: {
      title: 'FORENSIC PROVENANCE',
      sub: 'Interactive Lineage DAG',
      color: 'sky',
      layer: 'ORIGIN',
      desc: 'Parent-child cryptographic lineage connecting derived analysis artifacts to seized exhibits.'
    },
    AUDIT: {
      title: 'AUDIT & EVENT STREAM',
      sub: 'Tamper-Evident Ledger',
      color: 'teal',
      layer: 'RECORD',
      desc: 'Comprehensive dual-stream event history guaranteeing accountability across the lifecycle.'
    }
  };

  const currentMap = mapNodes[selectedMapNode] || mapNodes.PROOF;

  return (
    <section id="trust-model" className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ─── 1. HERO HEADER ─── */}
      <div className="space-y-6 text-center max-w-4xl mx-auto mb-16">
        {/* SIH Problem Statement Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 font-mono text-[11px] font-bold tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>SIH PROBLEM STATEMENT 26125</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">BLOCKCHAIN-BASED IDENTITY, ACCESS & DIGITAL ASSET MANAGEMENT</span>
        </div>

        {/* Product Identity */}
        <div>
          <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-white uppercase">
            HASH<span className="text-cyan-400">GUARD</span>
          </h1>
          <p className="text-xl sm:text-2xl font-mono text-slate-200 font-bold tracking-wide mt-2">
            Verifiable Trust Infrastructure for Digital Assets
          </p>
          <p className="text-sm sm:text-base text-cyan-300/80 font-sans mt-1">
            Demonstrated through digital evidence and cross-organizational chain of custody.
          </p>
        </div>

        {/* Core Product Theses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-3xl mx-auto pt-2">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
              CORE PRODUCT THESIS
            </span>
            <p className="text-sm font-mono font-bold text-white mt-1">
              "Don't just trust the digital asset. Verify it."
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-500/30">
            <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider block">
              ARCHITECTURAL THESIS
            </span>
            <p className="text-sm font-mono font-bold text-white mt-1">
              "Trust Continuity across the asset lifecycle."
            </p>
          </div>
        </div>

        {/* One-Sentence Judge Anchor */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-blue-950/40 border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.12)] text-left">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 tracking-wider block">
                ONE-SENTENCE ARCHITECTURE SUMMARY FOR EVALUATORS
              </span>
              <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                "HashGuard establishes <strong>who is authorized to act</strong>, cryptographically <strong>anchors the identity of the asset</strong>, tracks <strong>ownership and custody</strong>, and lets another party <strong>independently verify</strong> its integrity and history."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. THE CENTERPIECE: 8-STAGE TRUST MODEL FLOW ─── */}
      <div className="mb-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                THE VERIFIABLE TRUST SEQUENCE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-mono font-black text-white">
              TRUST MODEL CONTINUUM
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans mt-0.5">
              Click any stage to inspect the exact question it answers and its technical enforcement mechanism.
            </p>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            PROGRESSIVE DISCLOSURE
          </span>
        </div>

        {/* Connected Horizontal Flow Stream */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {trustStages.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative group flex flex-col justify-between h-36 ${
                  isActive
                    ? 'bg-cyan-950/50 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold text-slate-500 group-hover:text-cyan-400">
                      {stage.num}
                    </span>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  </div>
                  <div className="font-mono text-[11px] font-bold text-white uppercase tracking-wider truncate">
                    {stage.title}
                  </div>
                  <div className="text-[9px] font-mono text-cyan-400 font-semibold mt-0.5 truncate">
                    {stage.question}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 block truncate">
                    {stage.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Drawer / Card */}
        <div className="mt-4 p-5 rounded-2xl bg-[#040812] border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                STAGE {trustStages[activeStep].num} • {trustStages[activeStep].title}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Answers: "{trustStages[activeStep].question}"
              </span>
            </div>
            <p className="text-sm font-sans text-slate-200">
              {trustStages[activeStep].summary}
            </p>
            <p className="text-xs font-sans text-slate-400 leading-relaxed">
              {trustStages[activeStep].detail}
            </p>
          </div>

          <div className="shrink-0 font-mono text-xs text-right">
            <span className="text-[10px] text-slate-500 uppercase block mb-1">Status</span>
            <span className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>IMPLEMENTED</span>
            </span>
          </div>
        </div>
      </div>

      {/* ─── 3. THE MAIN ARCHITECTURE MAP (CENTERPIECE DIAGRAM) ─── */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#02050f]/90 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.08)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                SYSTEM TOPOLOGY
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-mono font-black text-white">
              MAIN ARCHITECTURE MAP
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Interactive topology map. Click any node to inspect its architectural purpose and isolation properties.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            ROOT: <strong className="text-cyan-300">HASHGUARD</strong>
          </span>
        </div>

        {/* Visual Diagram Tree */}
        <div className="flex flex-col items-center max-w-4xl mx-auto space-y-6 font-mono">
          {/* Level 0: HashGuard Core Header */}
          <div className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border border-cyan-400/80 text-cyan-300 font-bold text-sm tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            🛡️ HASHGUARD VERIFIABLE TRUST CORE
          </div>

          {/* Vertical Trunk Line */}
          <div className="w-px h-6 bg-cyan-500/50" />

          {/* Level 1: Triad (Identity, Authorization, Asset) */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setSelectedMapNode('IDENTITY')}
              className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                selectedMapNode === 'IDENTITY'
                  ? 'bg-blue-950/50 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-1 ring-blue-400'
                  : 'bg-slate-950/80 border-slate-800 hover:border-blue-500/50'
              }`}
            >
              <span className="text-[10px] text-blue-400 font-bold block uppercase tracking-wider">WHO?</span>
              <span className="text-sm font-bold text-white block mt-0.5">IDENTITY</span>
              <span className="text-[11px] text-slate-400 block mt-1">W3C DID (did:ethr)</span>
            </button>

            <button
              onClick={() => setSelectedMapNode('AUTHORIZATION')}
              className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                selectedMapNode === 'AUTHORIZATION'
                  ? 'bg-purple-950/50 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] ring-1 ring-purple-400'
                  : 'bg-slate-950/80 border-slate-800 hover:border-purple-500/50'
              }`}
            >
              <span className="text-[10px] text-purple-400 font-bold block uppercase tracking-wider">PERMITTED?</span>
              <span className="text-sm font-bold text-white block mt-0.5">AUTHORIZATION</span>
              <span className="text-[11px] text-slate-400 block mt-1">Role & Quorum Policy</span>
            </button>

            <button
              onClick={() => setSelectedMapNode('ASSET')}
              className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                selectedMapNode === 'ASSET'
                  ? 'bg-indigo-950/50 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)] ring-1 ring-indigo-400'
                  : 'bg-slate-950/80 border-slate-800 hover:border-indigo-500/50'
              }`}
            >
              <span className="text-[10px] text-indigo-400 font-bold block uppercase tracking-wider">WHAT ASSET?</span>
              <span className="text-sm font-bold text-white block mt-0.5">ASSET</span>
              <span className="text-[11px] text-slate-400 block mt-1">Exhibit ID & Sensitivity</span>
            </button>
          </div>

          {/* Triad Convergence Connector */}
          <div className="w-px h-6 bg-cyan-500/50" />

          {/* Level 2: Cryptographic Proof (SHA-256) */}
          <button
            onClick={() => setSelectedMapNode('PROOF')}
            className={`w-full max-w-md p-4 rounded-xl border text-center transition-all cursor-pointer ${
              selectedMapNode === 'PROOF'
                ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                : 'bg-slate-950/80 border-slate-800 hover:border-cyan-500/50'
            }`}
          >
            <span className="text-[10px] text-cyan-400 font-bold block uppercase tracking-wider">ORIGINAL STATE?</span>
            <span className="text-sm font-bold text-white block mt-0.5">CRYPTOGRAPHIC PROOF</span>
            <span className="text-[11px] text-cyan-300 block mt-1">SHA-256 Deterministic Bitstream Fingerprint</span>
          </button>

          {/* Branching to Off-Chain vs On-Chain */}
          <div className="w-px h-6 bg-cyan-500/50" />

          {/* Level 3: Off-Chain Data vs On-Chain Trust Split */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedMapNode('OFFCHAIN')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                selectedMapNode === 'OFFCHAIN'
                  ? 'bg-indigo-950/50 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)] ring-1 ring-indigo-400'
                  : 'bg-slate-950/80 border-slate-800 hover:border-indigo-500/50'
              }`}
            >
              <span className="text-[10px] text-indigo-400 font-bold block uppercase tracking-wider">CONFIDENTIAL DATA</span>
              <span className="text-sm font-bold text-white block mt-0.5">OFF-CHAIN STORAGE</span>
              <span className="text-[11px] text-slate-400 block mt-1">Raw Evidence • MinIO S3 • AES-256-GCM</span>
            </button>

            <button
              onClick={() => setSelectedMapNode('ONCHAIN')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                selectedMapNode === 'ONCHAIN'
                  ? 'bg-amber-950/50 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] ring-1 ring-amber-400'
                  : 'bg-slate-950/80 border-slate-800 hover:border-amber-500/50'
              }`}
            >
              <span className="text-[10px] text-amber-400 font-bold block uppercase tracking-wider">TRUST ANCHOR</span>
              <span className="text-sm font-bold text-white block mt-0.5">ON-CHAIN STATE</span>
              <span className="text-[11px] text-slate-400 block mt-1">Proofs • Tokens • Events • Sepolia/Besu</span>
            </button>
          </div>

          {/* Downward Connector to Lifecycle Phases */}
          <div className="w-px h-6 bg-cyan-500/50" />

          {/* Level 4: Downstream Trust Verification Chain */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setSelectedMapNode('CUSTODY')}
              className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedMapNode === 'CUSTODY'
                  ? 'bg-amber-950/50 border-amber-400 ring-1 ring-amber-400 shadow-lg'
                  : 'bg-slate-950/80 border-slate-800 hover:border-amber-500/50'
              }`}
            >
              <span className="text-[10px] text-amber-400 font-bold block uppercase">WHO HANDLED?</span>
              <span className="text-xs font-bold text-white block mt-0.5">CUSTODY</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Dual-Auth Transfers</span>
            </button>

            <button
              onClick={() => setSelectedMapNode('VERIFICATION')}
              className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedMapNode === 'VERIFICATION'
                  ? 'bg-emerald-950/50 border-emerald-400 ring-1 ring-emerald-400 shadow-lg'
                  : 'bg-slate-950/80 border-slate-800 hover:border-emerald-500/50'
              }`}
            >
              <span className="text-[10px] text-emerald-400 font-bold block uppercase">DID IT CHANGE?</span>
              <span className="text-xs font-bold text-white block mt-0.5">VERIFICATION</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Zero-Trust Match</span>
            </button>

            <button
              onClick={() => setSelectedMapNode('PROVENANCE')}
              className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedMapNode === 'PROVENANCE'
                  ? 'bg-sky-950/50 border-sky-400 ring-1 ring-sky-400 shadow-lg'
                  : 'bg-slate-950/80 border-slate-800 hover:border-sky-500/50'
              }`}
            >
              <span className="text-[10px] text-sky-400 font-bold block uppercase">WHERE FROM?</span>
              <span className="text-xs font-bold text-white block mt-0.5">PROVENANCE</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Lineage DAG</span>
            </button>

            <button
              onClick={() => setSelectedMapNode('AUDIT')}
              className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedMapNode === 'AUDIT'
                  ? 'bg-teal-950/50 border-teal-400 ring-1 ring-teal-400 shadow-lg'
                  : 'bg-slate-950/80 border-slate-800 hover:border-teal-500/50'
              }`}
            >
              <span className="text-[10px] text-teal-400 font-bold block uppercase">WHAT HAPPENED?</span>
              <span className="text-xs font-bold text-white block mt-0.5">AUDIT</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Tamper-Evident Trail</span>
            </button>
          </div>

          {/* Map Node Inspector Drawer */}
          <div className="w-full mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-left">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-mono font-bold text-white uppercase">
                {currentMap.title} &mdash; <span className="text-cyan-400">{currentMap.sub}</span>
              </span>
              <p className="text-xs font-sans text-slate-300 mt-0.5">
                {currentMap.desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
