import React from 'react';
import {
  Fingerprint,
  KeyRound,
  ShieldCheck,
  History,
  Boxes,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';

export const SecurityPrinciplesSection = () => {
  const principles = [
    {
      number: '01',
      title: 'Cryptographic Integrity',
      subtitle: 'Bitstream Immutability',
      icon: Fingerprint,
      accent: 'emerald',
      description: 'Digital evidence state is captured via deterministic SHA-256 digests. Any single-bit modification completely changes the resulting hash, enabling instant tamper discovery.'
    },
    {
      number: '02',
      title: 'Self-Sovereign Identity',
      subtitle: 'W3C DID Specification',
      icon: KeyRound,
      accent: 'purple',
      description: 'All forensic actions are bound to cryptographic Decentralized Identifiers (did:ethr) and secp256k1 keypairs, eliminating centralized IAM vulnerabilities and single points of failure.'
    },
    {
      number: '03',
      title: 'Granular Authorization',
      subtitle: 'Bytecode RBAC Modifiers',
      icon: Lock,
      accent: 'cyan',
      description: 'Role-based access control (6 roles) and organization tenant isolation are enforced both at the application gateway and directly inside EVM smart contract execution boundaries.'
    },
    {
      number: '04',
      title: 'Verifiable Custody History',
      subtitle: 'Non-Repudiation Stream',
      icon: History,
      accent: 'amber',
      description: 'Every custody handover, transformation, and retention action emits on-chain event logs and structured audit records, establishing an unbreakable chain of custody for court admissibility.'
    },
    {
      number: '05',
      title: 'Separation of Data & Proof',
      subtitle: 'Off-Chain Privacy Model',
      icon: Layers,
      accent: 'indigo',
      description: 'Heavy multi-gigabyte disk images and sensitive case metadata remain securely in encrypted off-chain storage enclaves (MinIO S3), while only 32-byte cryptographic digests are anchored on-chain.'
    },
    {
      number: '06',
      title: 'Independent Verification',
      subtitle: 'Zero-Trust Auditability',
      icon: CheckCircle2,
      accent: 'rose',
      description: 'Judges, defense counsel, and independent auditors can recompute cryptographic hashes and verify custody continuity against on-chain block roots without trusting any central database.'
    }
  ];

  return (
    <div className="w-full bg-[#040812]/90 border border-slate-800 rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-xl shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
              CORE TENETS
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-mono font-black text-white">
            SECURITY PRINCIPLES
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            The foundational architectural guarantees engineered into every layer of HashGuard.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {principles.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.number}
              className="p-5 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    {p.number}
                  </span>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h4 className="text-sm font-mono font-bold text-white mb-0.5">
                  {p.title}
                </h4>
                <span className="text-[10px] font-mono text-slate-400 block mb-2">
                  {p.subtitle}
                </span>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Implemented & Verified</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
