import React, { useState } from 'react';
import {
  FileCode,
  Fingerprint,
  KeyRound,
  ShieldCheck,
  Database,
  Boxes,
  History,
  ArrowLeftRight,
  CheckCircle2,
  GitBranch,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';

export const DataFlowExplorer = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      shortTitle: 'Evidence Selected',
      title: '01. Digital Evidence Selected',
      actor: 'First Responder / Analyst',
      layer: 'Presentation Layer',
      icon: FileCode,
      summary: 'Forensic operator selects raw digital evidence (e.g. disk image .E01, memory dump .raw, network capture .pcap, or malware binary .bin) in HashGuard UI.',
      technicalDetails: 'File handle read into browser memory chunk stream via WebCrypto / HTML5 File API. No raw data is yet committed to disk or network.',
      onChain: false
    },
    {
      id: 2,
      shortTitle: 'Evidence Hashed',
      title: '02. SHA-256 Bitstream Hashing',
      actor: 'Browser WebCrypto API / Hasher',
      layer: 'Cryptographic Integrity Layer',
      icon: Fingerprint,
      summary: 'A deterministic 256-bit SHA-256 cryptographic digest is calculated across the exact binary bitstream of the evidence.',
      technicalDetails: 'SHA-256 (FIPS 180-4) output: 32-byte hexadecimal string (e.g. 8f3a91bc72f4cd2a4e9b671a5c28e930f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6). Any bit change alters this hash entirely.',
      onChain: false
    },
    {
      id: 3,
      shortTitle: 'Identity Authenticated',
      title: '03. Identity Authenticated via DID',
      actor: 'W3C DID (did:ethr)',
      layer: 'Identity & Access Control',
      icon: KeyRound,
      summary: 'The operator\'s decentralized identity (did:ethr:<address>) is resolved, and session token / cryptographic keypair signature is validated.',
      technicalDetails: 'Identity anchored via secp256k1 public key matching on-chain DID Document hash. Eliminates centralized IAM single points of failure.',
      onChain: false
    },
    {
      id: 4,
      shortTitle: 'Authorization Checked',
      title: '04. RBAC & Tenant Scoping Checked',
      layer: 'Application / API Layer',
      actor: 'RBAC Authorization Engine',
      icon: ShieldCheck,
      summary: 'System validates whether the active identity holds appropriate permissions (e.g. canCollectEvidence, canSealEvidence) in the active organization enclave.',
      technicalDetails: 'Evaluates RBAC role matrix (FIRST_RESPONDER, FORENSIC_ANALYST, EVIDENCE_CUSTODIAN, INVESTIGATOR, AUDITOR, ADMINISTRATOR) before allowing ingestion.',
      onChain: false
    },
    {
      id: 5,
      shortTitle: 'Metadata Registered',
      title: '05. Evidence & Metadata Ingested Off-Chain',
      actor: 'Node.js Express / MinIO S3',
      layer: 'Off-Chain Storage Enclave',
      icon: Database,
      summary: 'Heavy raw evidence payload is stored in encrypted off-chain storage (MinIO S3 bucket / local vault). Case metadata and hash records are logged.',
      technicalDetails: 'Storage path: s3://org-vault/ev-001.bin. Metadata hash (metadataHash) calculated across JSON descriptor to lock case attributes.',
      onChain: false
    },
    {
      id: 6,
      shortTitle: 'Proof Anchored',
      title: '06. Proof Anchored & Asset NFT Minted',
      actor: 'Solidity Smart Contract (HASHGUARD.sol)',
      layer: 'Blockchain / Smart Contract Layer',
      icon: Boxes,
      summary: 'Smart contract mintAssetNFT() or registerEvidence() transaction is broadcasted to EVM, minting a unique ERC-721 token bound to contentHash.',
      technicalDetails: 'EVM Sepolia Contract: 0x3592925Cf64E7C3c68d4911b2ebC722c2Ea67052. Emits AssetNFTMinted(tokenId, assetId, to, contentHash, timestamp) event.',
      onChain: true
    },
    {
      id: 7,
      shortTitle: 'Custody Recorded',
      title: '07. Custody Handover & Event Recorded',
      actor: 'Originating Custodian',
      layer: 'Chain of Custody Layer',
      icon: History,
      summary: 'Initial custody state is locked to the seizing custodian DID. Custody timeline begins recording immutable state transitions.',
      technicalDetails: 'assetCustodian[tokenId] mapping updated. On-chain event ActivityLogged / CustodyTransferred permanently committed to block header.',
      onChain: true
    },
    {
      id: 8,
      shortTitle: 'Evidence Transferred',
      title: '08. Cross-Organization Transfer Initiated',
      actor: 'Dispatching Node → Receiving Node',
      layer: 'Cross-Agency Transfer Protocol',
      icon: ArrowLeftRight,
      summary: 'Evidence transfer manifest dispatched over mutual TLS to receiving agency (e.g. CERT-Alpha → Cyber Defense Lab B).',
      technicalDetails: 'Transfer queue records challenge hash. Custody lock transitions atomically once receiving agency satisfies cryptographic verification.',
      onChain: true
    },
    {
      id: 9,
      shortTitle: 'Evidence Re-verified',
      title: '09. Inbound Bitstream Re-Verification',
      actor: 'Receiving Forensic Node / Auditor',
      layer: 'Independent Verification Layer',
      icon: CheckCircle2,
      summary: 'Receiving node re-computes SHA-256 hash from received binary and compares against on-chain sealed root before custody acceptance.',
      technicalDetails: 'Expected SHA-256 vs Observed SHA-256 evaluation. If 100% match, transfer accepts; if bit-mismatch occurs, tamper breach alert fires.',
      onChain: true
    },
    {
      id: 10,
      shortTitle: 'Audit & Lineage Updated',
      title: '10. Audit Ledger & Lineage DAG Updated',
      actor: 'Consortium Network & Forensic DAG',
      layer: 'Audit & Lineage Layer',
      icon: GitBranch,
      summary: 'Completed transfer and subsequent derived forensic analysis (decompilations, YARA rules) are mapped onto the Lineage DAG and immutable audit stream.',
      technicalDetails: '@xyflow/react DAG updates parent-child node pointers. Audit event sealed to dual-stream (PostgreSQL relational + EVM transaction receipt).',
      onChain: true
    }
  ];

  const activeData = steps[activeStep];

  return (
    <div className="w-full bg-[#040812]/90 border border-slate-800 rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-xl shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
              END-TO-END TRACE
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-mono font-black text-white">
            DATA FLOW EXPLORER
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Click each step in the pipeline to trace how evidence flows from physical seizure to courtroom audit.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition-colors cursor-pointer"
          >
            ← Previous
          </button>
          <button
            onClick={() => setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
            className="px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono text-xs font-bold transition-colors cursor-pointer"
          >
            Next Step →
          </button>
        </div>
      </div>

      {/* 10 Step Progress Scroller */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-thin scrollbar-thumb-slate-800">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === activeStep;
          const isDone = idx < activeStep;

          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-mono transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : isDone
                  ? 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
                  : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isActive ? 'bg-cyan-400 text-slate-950' : isDone ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
              }`}>
                {step.id}
              </span>
              <span className="whitespace-nowrap">{step.shortTitle}</span>
            </button>
          );
        })}
      </div>

      {/* Active Step Detailed Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-6 rounded-xl bg-slate-950/80 border border-slate-800">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                <activeData.icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block font-bold">
                  STEP {activeData.id} OF 10 • {activeData.layer}
                </span>
                <h4 className="text-lg font-mono font-bold text-white">
                  {activeData.title}
                </h4>
              </div>
            </div>

            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${
              activeData.onChain ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
            }`}>
              {activeData.onChain ? 'ON-CHAIN EVENT' : 'OFF-CHAIN EXECUTION'}
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed font-sans bg-slate-900/60 p-4 rounded-lg border border-slate-800">
            {activeData.summary}
          </p>

          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1 font-mono text-xs">
            <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
              TECHNICAL PROTOCOL / EXECUTION SPECIFICATION
            </div>
            <p className="text-slate-300 leading-relaxed">
              {activeData.technicalDetails}
            </p>
          </div>
        </div>

        {/* Step Metadata Sidebar */}
        <div className="lg:col-span-4 flex flex-col justify-between p-4 rounded-lg bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="space-y-3 font-mono text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Executing Actor</span>
              <span className="text-white font-bold">{activeData.actor}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">System Layer</span>
              <span className="text-cyan-300">{activeData.layer}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Verification Property</span>
              <span className="text-emerald-400 font-bold">Cryptographic Non-Repudiation</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Step {activeStep + 1} of 10</span>
            <button
              onClick={() => setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold"
            >
              <span>Advance Trace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
