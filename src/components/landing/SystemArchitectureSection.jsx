import React, { useState } from 'react';
import { 
  Layers, 
  Database, 
  ShieldCheck, 
  Cpu, 
  Lock, 
  Binary, 
  GitFork, 
  CheckCircle2, 
  ArrowDown, 
  ArrowRight, 
  Server, 
  Boxes, 
  ChevronRight,
  Terminal,
  Activity,
  Zap,
  Fingerprint
} from 'lucide-react';

export const SystemArchitectureSection = ({ onLaunchSandbox }) => {
  const [activeArchTab, setActiveArchTab] = useState('layers');
  const [selectedTier, setSelectedTier] = useState('tier4');
  const [selectedSpecimen, setSelectedSpecimen] = useState('lockbit');
  const [activeLifecycleStep, setActiveLifecycleStep] = useState(0);

  // 4-Tier Architecture Details
  const tiers = [
    {
      id: 'tier1',
      number: 'TIER 01',
      name: 'Client & Presentation Tier',
      badge: 'React 19 • Web3 UI',
      accent: 'cyan',
      description: 'Single-page forensic SOC interface providing real-time evidence management, multi-role access control, and zero-knowledge verification.',
      components: ['React 19.2 + Vite 8.2', 'Tailwind CSS (Forensic SOC Theme)', '@xyflow/react Lineage DAG', 'Ethers.js v6 Web3 Client', 'Lucide Forensics Iconography'],
      protocols: ['HTTPS / WSS (WebSocket Feeds)', 'Web3 JSON-RPC Provider', 'mTLS Cross-Node Handshakes'],
      security: 'Browser WebCrypto API for client-side deterministic hashing. Strict client-side route guards mapped to smart contract role hierarchies.',
      ports: 'Port 5173 (Development) / Port 443 (Production)',
      compliance: 'ISO/IEC 27037 User Identification & Authentication Guidelines'
    },
    {
      id: 'tier2',
      number: 'TIER 02',
      name: 'Off-Chain Storage & Cryptographic Enclave',
      badge: 'MinIO S3 • Air-Gapped Vault',
      accent: 'blue',
      description: 'Encrypted object storage repository isolating heavy multi-gigabyte disk images, memory dumps, and PCAP captures from the blockchain.',
      components: ['MinIO Object Storage (S3 API)', 'AES-256-GCM Encryption Engine', 'Client-side Chunked Bit Hasher', 'HSM secp256k1 Key Wrapping'],
      protocols: ['S3 API v4 with Presigned Expiring URLs', 'Air-Gapped Local Disk Vaults', 'HMAC-SHA256 Token Auth'],
      security: 'Zero file payload data is ever transmitted or stored on the public blockchain. Only 32-byte cryptographic hashes leave this layer.',
      ports: 'Port 9000 (S3 API) / Port 9001 (Storage Admin Console)',
      compliance: 'NIST SP 800-88 Rev. 1 Sanitization & Cryptographic Erasure'
    },
    {
      id: 'tier3',
      number: 'TIER 03',
      name: 'Core Services & AI Threat Intelligence',
      badge: 'FastAPI • Google Gemini AI',
      accent: 'purple',
      description: 'Asynchronous microservice layer coordinating cross-organization evidence transfers, automated AI threat triage, and lifecycle retention.',
      components: ['FastAPI (Python 3.11+ ASGI)', 'Google Gemini AI Threat Triage Engine', 'PostgreSQL 15 (Relational State)', 'APScheduler Retention Policy Daemon'],
      protocols: ['RESTful API v1 (OpenAPI 3.0)', 'mTLS Mutual Node Authentication', 'JWT Bearer Authorization'],
      security: 'Strict API key segregation, automated Shannon entropy evaluation, and MITRE ATT&CK extraction from raw forensic samples.',
      ports: 'Port 8000 / 8001 (FastAPI Core) / Port 5432 (PostgreSQL)',
      compliance: 'Cryptographically Verifiable Report Compliance Engine'
    },
    {
      id: 'tier4',
      number: 'TIER 04',
      name: 'Permissioned EVM Consensus & ERC-721 Asset Ownership',
      badge: 'Solidity ^0.8.20 • ERC-721',
      accent: 'emerald',
      description: 'Immutable distributed ledger anchoring verifiable Decentralized Identifiers (DIDs), NFT-backed evidence custody, and bytecode-level RBAC.',
      components: ['Solidity ^0.8.20 (HASHGUARD.sol)', 'OpenZeppelin ERC-721 & AccessControl', 'Foundry Anvil / Hyperledger Besu', 'Ethereum-linked decentralized identity representation Registry (did:ethr)'],
      protocols: ['EVM Bytecode Execution', 'JSON-RPC over HTTP/IPC', 'EIP-712 Typed Structured Data'],
      security: 'Non-fungible token reverse lookup (assetIdToTokenId). Modifiers onlyRole(ROLE_ADMIN) and onlyRole(ROLE_MANAGER) prevent privilege escalation.',
      ports: 'Port 8545 (EVM RPC Endpoint)',
      compliance: 'Ethereum-linked decentralized identity representation v1.0 • ERC-721 Standard • FRE Rule 902(13)/(14)'
    }
  ];

  // Specimen Data for Segregation Simulation
  const specimenData = {
    lockbit: {
      name: 'LockBit 3.0 Ransomware Specimen',
      type: 'Raw Memory Dump (.vmem)',
      size: '8.4 GB',
      offChainPath: 'vault://s3-enclave/org-a/seized/EV-2026-0891.vmem',
      encryption: 'AES-256-GCM (HSM Key ID: 0x8F9C21A)',
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      tokenId: '#10891',
      contract: '0x3b91B0dF8A7D938C26532454a8e09e1B9c008f12',
      txHash: '0x9d2a4f61e8c7b39a2d10e5f4c8b7a6e9d2f1c8b3a7e5d9c2a4f61e8c7b39a2d1',
      blockNumber: '#483,192',
      state: 'VERIFIED_SEALED'
    },
    cobalt: {
      name: 'Cobalt Strike C2 Beacon Capture',
      type: 'Full Packet Capture (.pcap)',
      size: '2.1 GB',
      offChainPath: 'vault://s3-enclave/org-a/network/EV-2026-0442.pcap',
      encryption: 'AES-256-GCM (HSM Key ID: 0x3C421B8)',
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      tokenId: '#10442',
      contract: '0x3b91B0dF8A7D938C26532454a8e09e1B9c008f12',
      txHash: '0x4f61e8c7b39a2d10e5f4c8b7a6e9d2f1c8b3a7e5d9c2a4f61e8c7b39a2d10e5f',
      blockNumber: '#483,040',
      state: 'VERIFIED_SEALED'
    },
    disk: {
      name: 'Master Server Physical Disk Image',
      type: 'Expert Witness Disk Image (.E01)',
      size: '124.6 GB',
      offChainPath: 'vault://s3-enclave/org-b/disks/EV-2026-0105.E01',
      encryption: 'AES-256-GCM (Hardware TPM Wrapped)',
      sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      tokenId: '#10105',
      contract: '0x3b91B0dF8A7D938C26532454a8e09e1B9c008f12',
      txHash: '0x1c8b3a7e5d9c2a4f61e8c7b39a2d10e5f4c8b7a6e9d2f1c8b3a7e5d9c2a4f61e',
      blockNumber: '#482,881',
      state: 'TRANSFERRED_INTACT'
    }
  };

  // 7-Stage State Machine Steps
  const lifecycleSteps = [
    {
      stage: 'COLLECT',
      title: 'Physical Seizure & Write-Block',
      actor: 'CERT-Alpha (Collector)',
      action: 'Target storage attached to hardware write-blocker. Forensic image created off-chain.',
      onChainEvent: 'IdentityRegistered',
      solidityCall: 'registerDID(custodianDID, docHash)',
      guarantee: 'Authentic physical acquisition with cryptographic custody timestamp.'
    },
    {
      stage: 'SEAL',
      title: 'Cryptographic Hashing & Bagging',
      actor: 'Primary Custodian',
      action: 'SHA-256 bit digest computed. Digital tamper bag generated with HSM secp256k1 signature.',
      onChainEvent: 'AssetNFTMinted',
      solidityCall: 'mintAssetNFT(custodian, assetId, contentHash, metaHash)',
      guarantee: 'Mathematical root permanently committed to EVM block.'
    },
    {
      stage: 'TRANSFER',
      title: 'Cross-Agency mTLS Dispatch',
      actor: 'Originating Agency',
      action: 'Transfer manifest dispatched over mutual TLS. Receiving agency notified with signature challenge.',
      onChainEvent: 'ActivityLogged',
      solidityCall: 'logTransferInitiated(tokenId, toOrgDID, manifestHash)',
      guarantee: 'Non-repudiation of dispatch with cryptographic sender attestation.'
    },
    {
      stage: 'RECEIVE',
      title: 'Bit-Level Verification on Receipt',
      actor: 'Cyber Defense Lab B',
      action: 'Inbound payload downloaded. Bitstream re-hashed and compared against on-chain root before acceptance.',
      onChainEvent: 'CustodyTransferred',
      solidityCall: 'transferCustody(tokenId, newCustodianAddress)',
      guarantee: 'Custody atomically transitions only if hash comparison is 100% identical.'
    },
    {
      stage: 'ANALYZE',
      title: 'Air-Gapped Reverse Engineering',
      actor: 'Forensic Reverse Engineer',
      action: 'Dynamic detonation in sandbox. Volatile cluster carving and memory string extraction.',
      onChainEvent: 'ActivityLogged',
      solidityCall: 'logForensicAnalysis(tokenId, sandboxId, toolsetHash)',
      guarantee: 'Forensic toolchain versions and examiner notes recorded immutably.'
    },
    {
      stage: 'DERIVE',
      title: 'Lineage DAG Child Registration',
      actor: 'Intelligence Analyst',
      action: 'Derived artifacts (decompiled source, YARA rules, IOC CSVs) link cryptographically to parent.',
      onChainEvent: 'AssetNFTMinted',
      solidityCall: 'mintDerivedAssetNFT(childId, parentTokenId, childHash)',
      guarantee: 'Mathematical parent-child lineage DAG proof verified via @xyflow.'
    },
    {
      stage: 'ARCHIVE',
      title: 'Case Sealing & NIST Retention',
      actor: 'Platform Security Officer',
      action: 'Case finalized. Statutory legal hold applied or NIST SP 800-88 cryptographic shredding scheduled.',
      onChainEvent: 'RetentionEvent',
      solidityCall: 'applyRetentionPolicy(tokenId, retentionYears, isLegalHold)',
      guarantee: 'Court-admissible certificate generated under Cryptographically Verifiable Report.'
    }
  ];

  const currentTierData = tiers.find(t => t.id === selectedTier) || tiers[3];
  const activeSpecimen = specimenData[selectedSpecimen];
  const activeStep = lifecycleSteps[activeLifecycleStep];

  return (
    <section id="architecture" className="relative z-10 py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800/80 transition-colors">
      {/* SECTION HEADER */}
      <div className="text-center max-w-4xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-mono text-[11px] font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Layers className="w-3.5 h-3.5" />
          <span>SYSTEM TOPOLOGY & ARCHITECTURAL BLUEPRINT</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping ml-1" />
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          End-to-End Digital Asset Trust Architecture
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
          Engineered as a decoupled 4-tier stack separating user interfaces, encrypted off-chain storage vaults, asynchronous microservices, and permissioned EVM consensus smart contracts.
        </p>

        {/* 3 Navigation Mode Tabs */}
        <div className="mt-8 inline-flex p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm max-w-full overflow-x-auto">
          <button
            onClick={() => setActiveArchTab('layers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeArchTab === 'layers'
                ? 'bg-white dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-slate-200 dark:border-cyan-500/40 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>4-Tier Architecture Blueprint</span>
          </button>

          <button
            onClick={() => setActiveArchTab('segregation')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeArchTab === 'segregation'
                ? 'bg-white dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-slate-200 dark:border-cyan-500/40 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Off-Chain vs. On-Chain Data Segregation</span>
          </button>

          <button
            onClick={() => setActiveArchTab('lifecycle')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeArchTab === 'lifecycle'
                ? 'bg-white dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-slate-200 dark:border-cyan-500/40 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Custody State Machine Lifecycle</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: 4-TIER ARCHITECTURE BLUEPRINT (INTERACTIVE TIERS + INSPECTOR)      */}
      {/* ========================================================================= */}
      {activeArchTab === 'layers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: 4 Clickable Tiers Diagram (7 cols) */}
          <div className="lg:col-span-7 space-y-3.5">
            {tiers.map((tier, index) => {
              const isSelected = selectedTier === tier.id;
              return (
                <div key={tier.id} className="relative">
                  <div
                    onClick={() => setSelectedTier(tier.id)}
                    className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-white dark:bg-[#0c1324] border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.18)] dark:shadow-[0_0_30px_rgba(6,182,212,0.2)] ring-1 ring-cyan-500/50'
                        : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 shadow-sm'
                    }`}
                  >
                    {/* Top status line */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          {tier.number}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          isSelected 
                            ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}>
                          {tier.badge}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-mono">
                        {isSelected ? (
                          <span className="text-cyan-600 dark:text-cyan-400 font-bold flex items-center gap-1">
                            <span>ACTIVE INSPECTOR</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            Click to inspect
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Tier Name & Quick Summary */}
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected 
                          ? 'bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/30' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        {index === 0 && <Layers className="w-4 h-4" />}
                        {index === 1 && <Database className="w-4 h-4" />}
                        {index === 2 && <Cpu className="w-4 h-4" />}
                        {index === 3 && <ShieldCheck className="w-4 h-4" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                          {tier.name}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {tier.description}
                        </p>
                      </div>
                    </div>

                    {/* Tech Pills */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {tier.components.slice(0, 3).map((comp, ci) => (
                        <span key={ci} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                          {comp}
                        </span>
                      ))}
                      {tier.components.length > 3 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 text-slate-500">
                          +{tier.components.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Flow Connector Arrow between tiers */}
                  {index < tiers.length - 1 && (
                    <div className="flex items-center justify-center my-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-xs">
                        <ArrowDown className="w-3 h-3 text-cyan-500 animate-bounce" />
                        <span>
                          {index === 0 ? 'mTLS Handshake & REST / JSON-RPC' : index === 1 ? 'Zero-Leakage Hashes & Presigned URLs' : 'Bytecode Execution & Indexed EVM Events'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* RIGHT: Tier Deep Inspector Panel (5 cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 p-6 shadow-xl dark:shadow-[0_0_35px_rgba(0,0,0,0.5)] space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                    SPECIFICATION INSPECTOR
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                    {currentTierData.name}
                  </h3>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 text-[11px] font-mono font-bold">
                  {currentTierData.number}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                {currentTierData.description}
              </p>

              {/* Tech Stack List */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                  Core Technologies & Libraries
                </span>
                <div className="grid grid-cols-1 gap-1.5 font-mono text-xs">
                  {currentTierData.components.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Network Protocols & Ports */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                  Protocols & Endpoints
                </span>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs space-y-1.5">
                  <div className="flex items-start gap-2">
                    <Server className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-500">Protocols: </span>
                      <span className="text-slate-700 dark:text-slate-300">{currentTierData.protocols.join(' • ')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    <div>
                      <span className="text-slate-500">Ports: </span>
                      <span className="text-slate-700 dark:text-slate-300">{currentTierData.ports}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Boundary & Cryptographic Guarantee */}
              <div className="p-3.5 rounded-xl bg-cyan-500/5 dark:bg-cyan-950/20 border border-cyan-500/20 space-y-1.5 font-mono text-xs">
                <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-[11px] uppercase">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Security & Privacy Boundary</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  {currentTierData.security}
                </p>
                <div className="pt-1 text-[10px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Compliance: {currentTierData.compliance}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onLaunchSandbox && onLaunchSandbox('ORG_B', '/dashboard', true)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>Test Tier in Live SOC Sandbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: OFF-CHAIN VS ON-CHAIN SEGREGATION (SIMULATION & COMPARISON)       */}
      {/* ========================================================================= */}
      {activeArchTab === 'segregation' && (
        <div className="space-y-6">
          {/* Specimen Selector Banner */}
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Binary className="w-4 h-4 text-cyan-500" />
              <span className="text-xs font-mono text-slate-700 dark:text-slate-300 font-bold uppercase">
                Select Forensic Specimen for Live Segregation Trace:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSpecimen('lockbit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  selectedSpecimen === 'lockbit'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                }`}
              >
                Memory Dump (.vmem)
              </button>
              <button
                onClick={() => setSelectedSpecimen('cobalt')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  selectedSpecimen === 'cobalt'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                }`}
              >
                Network Traffic (.pcap)
              </button>
              <button
                onClick={() => setSelectedSpecimen('disk')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  selectedSpecimen === 'disk'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                }`}
              >
                Disk Image (.E01)
              </button>
            </div>
          </div>

          {/* Two Pillars Grid with Cryptographic Bridge */}
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-stretch">
            {/* PILLAR 1: OFF-CHAIN VAULT (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-[#0c1324] border border-blue-500/30 dark:border-blue-500/40 shadow-lg space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-blue-500 font-bold uppercase">OFF-CHAIN ENCLAVE</span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white font-mono">Encrypted Evidence Vault</h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 font-bold">
                    ISOLATED
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                  Gigabyte/terabyte-scale raw payloads never touch the public or permissioned blockchain. They reside in zero-trust, AES-256-GCM encrypted object vaults accessible only via time-limited presigned URLs.
                </p>

                <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs space-y-2">
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Artifact Name:</span>
                    <span className="text-slate-900 dark:text-white font-bold">{activeSpecimen.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Payload Size:</span>
                    <span className="text-blue-500 font-bold">{activeSpecimen.size}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Vault URI:</span>
                    <span className="text-slate-400 truncate max-w-[200px]">{activeSpecimen.offChainPath}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Storage Engine:</span>
                    <span className="text-slate-700 dark:text-slate-300">MinIO S3 Cluster (AES-256-GCM)</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-500/5 dark:bg-blue-950/20 border border-blue-500/20 text-[11px] font-mono text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Zero File Data Leakage • Air-Gapped Storage Node</span>
              </div>
            </div>

            {/* BRIDGE: CRYPTOGRAPHIC PIPELINE (1 col) */}
            <div className="lg:col-span-1 flex lg:flex-col items-center justify-center gap-2 py-4">
              <div className="h-full w-0.5 bg-gradient-to-b from-blue-500 via-cyan-400 to-emerald-500 hidden lg:block" />
              <div className="p-2.5 rounded-full bg-cyan-500/20 border border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-mono text-slate-500 text-center font-bold">
                SHA-256 DIGEST
              </div>
              <div className="h-full w-0.5 bg-gradient-to-b from-cyan-400 to-emerald-500 hidden lg:block" />
            </div>

            {/* PILLAR 2: ON-CHAIN LEDGER (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-[#0c1324] border border-emerald-500/30 dark:border-emerald-500/40 shadow-lg space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase">ON-CHAIN LEDGER</span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white font-mono">EVM State Machine Proof</h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold">
                    IMMUTABLE
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                  Only the deterministic 32-byte SHA-256 bit digest, custodian DID, and ERC-721 token state transitions are committed to Ethereum/Anvil EVM bytecode.
                </p>

                <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs space-y-2">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Sealed Content Hash (SHA-256):</span>
                    <span className="text-emerald-500 font-bold break-all text-[11px]">{activeSpecimen.sha256}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 pt-1">
                    <span>ERC-721 Token ID:</span>
                    <span className="text-slate-900 dark:text-white font-bold">{activeSpecimen.tokenId}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Ledger Block Height:</span>
                    <span className="text-cyan-500 font-bold">{activeSpecimen.blockNumber}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Custody State:</span>
                    <span className="text-emerald-400 font-bold">{activeSpecimen.state}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 text-[11px] font-mono text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Independently Verifiable • Section 65B Certified</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: CUSTODY STATE MACHINE LIFECYCLE (7 INTERACTIVE STEPS)              */}
      {/* ========================================================================= */}
      {activeArchTab === 'lifecycle' && (
        <div className="space-y-6">
          {/* Step Selector Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {lifecycleSteps.map((step, idx) => {
              const isActive = activeLifecycleStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveLifecycleStep(idx)}
                  className={`p-3 rounded-xl border text-left font-mono transition-all cursor-pointer relative overflow-hidden ${
                    isActive
                      ? 'bg-white dark:bg-[#0c1324] border-cyan-500 shadow-md ring-1 ring-cyan-500/40'
                      : 'bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>STEP 0{idx + 1}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                  </div>
                  <div className={`text-xs font-bold ${isActive ? 'text-cyan-600 dark:text-cyan-300' : 'text-slate-700 dark:text-slate-300'}`}>
                    {step.stage}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Step Deep Inspector */}
          <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-bold uppercase">
                    STAGE: {activeStep.stage}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    Step {activeLifecycleStep + 1} of 7
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-mono">
                  {activeStep.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveLifecycleStep((activeLifecycleStep + 1) % lifecycleSteps.length)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Next Stage</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Grid Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <span className="text-[10px] uppercase text-slate-500 font-bold">Authorized Custodian Role:</span>
                  <div className="text-slate-900 dark:text-white font-bold text-sm">{activeStep.actor}</div>
                  <p className="text-slate-600 dark:text-slate-400 font-sans mt-2">{activeStep.action}</p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-1.5">
                  <span className="text-[10px] uppercase text-emerald-600 dark:text-emerald-400 font-bold">Legal Admissibility Guarantee:</span>
                  <p className="text-slate-700 dark:text-slate-300 font-sans">{activeStep.guarantee}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 space-y-2 font-mono">
                  <span className="text-[10px] uppercase text-cyan-400 font-bold block">Smart Contract Invocation:</span>
                  <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-emerald-400 break-all text-[11px]">
                    {activeStep.solidityCall}
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                    <span>Emitted Event:</span>
                    <span className="text-purple-400 font-bold">{activeStep.onChainEvent}()</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300 text-[11px] font-sans">
                      Want to inspect the complete chain of custody ledger events?
                    </span>
                  </div>
                  <button
                    onClick={() => onLaunchSandbox && onLaunchSandbox('ORG_B', '/custody', true)}
                    className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-300 font-bold whitespace-nowrap cursor-pointer"
                  >
                    Custody Ledger →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SystemArchitectureSection;
