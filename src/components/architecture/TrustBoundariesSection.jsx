import React from 'react';
import {
  ShieldCheck,
  Building2,
  Lock,
  Database,
  Boxes,
  ArrowDown,
  ArrowRight,
  Sparkles,
  Layers,
  Fingerprint,
  FileCheck
} from 'lucide-react';

export const TrustBoundariesSection = () => {
  const boundaries = [
    {
      id: 'boundary-user',
      title: 'BOUNDARY 01: USER & ORGANIZATION CONTEXT',
      actor: 'CERT-Alpha • Cyber Lab • Police LEA • Court • Auditor',
      color: 'purple',
      badge: 'Self-Sovereign Identity',
      icon: Building2,
      description: 'The outermost perimeter where external entities interact with the system. Each actor holds a unique W3C Decentralized Identifier (did:ethr) and secp256k1 keypair.',
      isolationRules: [
        'No centralized credential authority (LDAP/Active Directory)',
        'Signatures generated locally by custodian private keys',
        'Strict tenant enclave isolation per participating organization'
      ]
    },
    {
      id: 'boundary-app',
      title: 'BOUNDARY 02: HASHGUARD APPLICATION ENCLAVE',
      actor: 'React 19 Client • Node.js / FastAPI Service Layer',
      color: 'cyan',
      badge: 'Zero-Trust Orchestration',
      icon: Layers,
      description: 'Coordinates forensic pipelines, API routing, RBAC authorization checks, and prepares tamper manifests before cryptographic anchoring.',
      isolationRules: [
        'Validates caller RBAC role before every sensitive operation',
        'Enforces bitstream SHA-256 generation prior to transmission',
        'Manages cross-agency transfer queues with mutual TLS'
      ]
    },
    {
      id: 'boundary-offchain',
      title: 'BOUNDARY 03: OFF-CHAIN EVIDENCE REPOSITORY',
      actor: 'MinIO S3 Bucket • Local Encrypted Vault • PostgreSQL',
      color: 'indigo',
      badge: 'Confidential Storage',
      icon: Database,
      description: 'Stores massive gigabyte-scale disk images (.E01), memory dumps, and PCAP captures. Zero raw evidence payload data ever touches the blockchain.',
      isolationRules: [
        'Confidential case data remains strictly inside agency storage enclaves',
        'Access controlled via presigned expiring URLs and JWTs',
        'Payloads encrypted at rest via AES-256-GCM enclave wrappers'
      ]
    },
    {
      id: 'boundary-blockchain',
      title: 'BOUNDARY 04: BLOCKCHAIN TRUST LAYER',
      actor: 'Ethereum Sepolia (0x3592...7052) • EVM Smart Contract',
      color: 'amber',
      badge: 'Immutable State Machine',
      icon: Boxes,
      description: 'A decentralized, tamper-proof state machine that anchors 32-byte SHA-256 digests, ERC-721 token ownership, and custody transfer receipts.',
      isolationRules: [
        'Only 32-byte cryptographic hashes and state proofs committed on-chain',
        'Bytecode-level AccessControl prevents unauthorized ownership mutation',
        'Mining/validation provides independent, cross-organization mathematical proof'
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
              SECURITY DOMAINS
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-mono font-black text-white">
            TRUST BOUNDARY VISUALIZATION
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            How HashGuard intentionally isolates identity, application logic, confidential binary payloads, and blockchain consensus.
          </p>
        </div>
      </div>

      {/* Trust Boundaries Flow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {boundaries.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div
              key={b.id}
              className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800/90 flex flex-col justify-between space-y-4 relative group hover:border-slate-700 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded border bg-cyan-500/10 text-cyan-300 border-cyan-500/30">
                    {b.badge}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-bold text-white leading-tight">
                    {b.title}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 mt-0.5 block truncate">
                    {b.actor}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {b.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                  ISOLATION GUARANTEES
                </span>
                <ul className="space-y-1 text-[11px] text-slate-400 font-mono">
                  {b.isolationRules.map((rule, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-1.5">
                      <span className="text-cyan-400 mt-0.5">›</span>
                      <span className="leading-tight">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-blue-950/30 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2.5 text-slate-300">
          <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>
            Deliberate architectural separation: Application metadata and binary evidence remain private off-chain, while immutable proofs and ownership live on-chain.
          </span>
        </div>
      </div>
    </div>
  );
};
