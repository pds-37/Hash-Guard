import React from 'react';
import {
  Code,
  Server,
  Database,
  KeyRound,
  Fingerprint,
  Boxes,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const TechStackSection = () => {
  const categories = [
    {
      title: 'Frontend Client',
      icon: Code,
      accent: 'cyan',
      techs: [
        { name: 'React 19.2.8', desc: 'Core UI framework with high-performance concurrent rendering', status: 'Implemented' },
        { name: 'Vite 8.2.0', desc: 'Lightning-fast ES module build system and dev server', status: 'Implemented' },
        { name: 'Tailwind CSS 3.4.17', desc: 'Forensic SOC dark/light responsive design token system', status: 'Implemented' },
        { name: '@xyflow/react 12.11.3', desc: 'Interactive node-edge Directed Acyclic Graph (DAG) for Lineage', status: 'Implemented' },
        { name: 'Lucide React 1.31.0', desc: 'Comprehensive technical and cybersecurity iconography', status: 'Implemented' },
        { name: 'Recharts 3.10.1', desc: 'Forensic telemetry and KPI metric data visualization', status: 'Implemented' }
      ]
    },
    {
      title: 'Backend & APIs',
      icon: Server,
      accent: 'blue',
      techs: [
        { name: 'Node.js Express (Port 8001)', desc: 'Microservice API with JSON DB and upload pipeline (`server.js`)', status: 'Implemented' },
        { name: 'Python FastAPI (Port 8000)', desc: 'Asynchronous enterprise ASGI core (`backend/app/main.py`)', status: 'Implemented' },
        { name: 'Multer & File Stream', desc: 'Local evidence upload and binary stream buffer handler', status: 'Implemented' },
        { name: 'Pydantic v2', desc: 'Strict data validation and schema serialization', status: 'Implemented' },
        { name: 'RESTful API v1', desc: 'OpenAPI 3.0 standardized endpoints for evidence and custody', status: 'Implemented' }
      ]
    },
    {
      title: 'Database & Storage',
      icon: Database,
      accent: 'indigo',
      techs: [
        { name: 'MinIO S3 Compatible Storage', desc: 'Encrypted object storage bucket for large evidence payloads', status: 'Implemented' },
        { name: 'PostgreSQL 15', desc: 'Relational state store with SQLAlchemy ORM models', status: 'Implemented' },
        { name: 'JSON Document Store (db.json)', desc: 'Zero-config standalone microservice persistence', status: 'Implemented' },
        { name: 'Browser LocalStorage Sandbox', desc: 'Instant offline evaluation persistence engine', status: 'Implemented' }
      ]
    },
    {
      title: 'Authentication & Identity',
      icon: KeyRound,
      accent: 'purple',
      techs: [
        { name: 'W3C DID v1.0 (did:ethr)', desc: 'Self-Sovereign Decentralized Identifiers for custodians & nodes', status: 'Implemented' },
        { name: 'secp256k1 Keypairs', desc: 'Cryptographic wallet identities & digital signature generation', status: 'Implemented' },
        { name: 'OpenZeppelin AccessControl', desc: 'On-chain RBAC roles: Admin, Manager, Auditor, User', status: 'Implemented' },
        { name: '6 Application RBAC Roles', desc: 'First Responder, Forensic Analyst, Custodian, Investigator, Auditor, Admin', status: 'Implemented' },
        { name: '5 Multi-Org Consortium Nodes', desc: 'CERT-Alpha, Cyber Defense Lab, Police LEA, Court Registry, Audit Board', status: 'Implemented' }
      ]
    },
    {
      title: 'Cryptography',
      icon: Fingerprint,
      accent: 'emerald',
      techs: [
        { name: 'SHA-256 (FIPS 180-4)', desc: 'Deterministic 32-byte content & metadata integrity hashing', status: 'Implemented' },
        { name: 'WebCrypto API', desc: 'Client-side deterministic bitstream acquisition in browser', status: 'Implemented' },
        { name: 'ECDSA secp256k1 Signatures', desc: 'Custodian attestation & transfer manifest signing', status: 'Implemented' },
        { name: 'AES-256-GCM', desc: 'Off-chain vault payload encryption at rest', status: 'Implemented' }
      ]
    },
    {
      title: 'Blockchain & Smart Contracts',
      icon: Boxes,
      accent: 'amber',
      techs: [
        { name: 'Solidity ^0.8.20 (HASHGUARD.sol)', desc: 'Primary smart contract: ERC721 + AccessControl + Audit Events', status: 'Implemented' },
        { name: 'Ethereum Sepolia Testnet', desc: 'Public testnet deployment (Chain ID: 11155111)', status: 'Implemented' },
        { name: 'Live Contract: 0x3592...7052', desc: 'Verified live contract address on Sepolia', status: 'Implemented' },
        { name: 'Ethers.js v6.17.0', desc: 'Web3 JSON-RPC provider client and contract binding', status: 'Implemented' },
        { name: 'Local Anvil EVM (Chain ID 31337)', desc: 'Fast local development blockchain node', status: 'Implemented' },
        { name: 'Target: Hyperledger Besu', desc: 'Production enterprise permissioned consortium EVM', status: 'Conceptual' }
      ]
    },
    {
      title: 'Infrastructure & DevOps',
      icon: Cpu,
      accent: 'sky',
      techs: [
        { name: 'Docker Compose', desc: 'Multi-container orchestration (FastAPI + PostgreSQL + MinIO)', status: 'Implemented' },
        { name: 'Vercel / Static Build', desc: 'Client SPA production hosting deployment pipeline', status: 'Implemented' },
        { name: 'Hardhat & Python Web3', desc: 'Smart contract compilation, testing, and deployment scripts', status: 'Implemented' },
        { name: 'Zero-Config Sandbox Engine', desc: 'Client-side mock fallback allowing instant zero-setup review', status: 'Implemented' }
      ]
    },
    {
      title: 'Security & Forensics Standards',
      icon: ShieldCheck,
      accent: 'rose',
      techs: [
        { name: '5-Point Verification Engine', desc: 'Zero-trust cryptographic audit suite for courtroom readiness', status: 'Implemented' },
        { name: 'Section 65B Indian Evidence Act', desc: 'Electronic evidence forensic certificate generation', status: 'Implemented' },
        { name: 'ISO/IEC 27037 Principles', desc: 'Digital forensic evidence identification, collection, and preservation', status: 'Implemented' },
        { name: 'NIST SP 800-88 & Legal Hold', desc: 'Custody retention policies and immutable preservation orders', status: 'Implemented' }
      ]
    }
  ];

  return (
    <div className="w-full bg-[#040812]/90 border border-slate-800 rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-xl shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
              PROVENANCE & CODEBASE ARTIFACTS
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-mono font-black text-white">
            TECHNOLOGY STACK
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Strictly verified technologies and frameworks discovered in the HashGuard repository.
          </p>
        </div>
      </div>

      {/* Grouped Technology Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800/90 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    {cat.title}
                  </h4>
                </div>

                <div className="space-y-2">
                  {cat.techs.map((t, tIdx) => (
                    <div key={tIdx} className="p-2 rounded bg-slate-900/60 border border-slate-800/80 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono font-bold text-white text-[11px] truncate">
                          {t.name}
                        </span>
                        <span className={`text-[8px] font-mono font-bold px-1 rounded border shrink-0 ${
                          t.status === 'Implemented' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        }`}>
                          {t.status === 'Implemented' ? '✓' : 'Concept'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-sans leading-tight">
                        {t.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
