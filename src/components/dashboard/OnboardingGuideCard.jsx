import React, { useState } from 'react';
import { ShieldCheck, Wallet, Upload, CheckCircle2, ChevronRight, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const OnboardingGuideCard = ({ evidenceCount = 0, onRegister }) => {
  const navigate = useNavigate();
  const { walletAddress, did, connectWallet, isSandboxMode } = useApp();
  const [isDismissed, setIsDismissed] = useState(false);

  // Retrieve user profile
  const user = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('cee_user') || '{}');
    } catch {
      return {};
    }
  }, []);

  if (isDismissed) return null;

  const steps = [
    {
      id: 1,
      title: 'Agency Node Authorization',
      status: 'COMPLETED',
      badge: user.name || 'Authorized Operator',
      desc: `Logged in as ${user.name || 'Operator'} (${user.orgName || 'Active Consortium Node'}). Session authenticated.`,
      action: null
    },
    {
      id: 2,
      title: 'Web3 & DID Key Binding',
      status: walletAddress ? 'COMPLETED' : 'PENDING',
      badge: walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}` : 'Wallet Required',
      desc: walletAddress 
        ? `Decentralized Identity bound: ${did}. Ready for on-chain cryptographic manifest signing.`
        : 'Connect MetaMask wallet to bind an ECDSA key for cryptographic sealing & smart contract anchoring.',
      action: !walletAddress ? (
        <button
          onClick={connectWallet}
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold transition-all cursor-pointer"
        >
          <Wallet className="w-3.5 h-3.5 text-amber-400" />
          <span>Connect MetaMask Wallet</span>
        </button>
      ) : null
    },
    {
      id: 3,
      title: 'Ingest & Client-Side Hash Exhibit',
      status: evidenceCount > 0 ? 'COMPLETED' : 'PENDING',
      badge: evidenceCount > 0 ? `${evidenceCount} Sealed` : 'Awaiting Exhibit',
      desc: evidenceCount > 0
        ? `Physical evidence files ingested and hashed locally via WebCrypto SHA-256.`
        : 'Select a forensic file. Binary bytes are hashed directly in browser memory before being anchored.',
      action: evidenceCount === 0 ? (
        <button
          onClick={onRegister}
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold transition-all cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5 text-cyan-400" />
          <span>+ Collect & Seal First Exhibit</span>
        </button>
      ) : null
    },
    {
      id: 4,
      title: 'Zero-Knowledge Independent Verification',
      status: evidenceCount > 0 ? 'READY' : 'LOCKED',
      badge: evidenceCount > 0 ? 'Ready to Verify' : 'Requires Exhibit',
      desc: 'Verify cryptographic root and chain of custody without exposing raw evidence content.',
      action: evidenceCount > 0 ? (
        <button
          onClick={() => navigate('/verification')}
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold transition-all cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Open Verification Enclave</span>
          <ArrowRight className="w-3 h-3 ml-0.5" />
        </button>
      ) : null
    }
  ];

  return (
    <div className="rounded-xl bg-gradient-to-r from-slate-900 via-[#0b1120] to-slate-900 border border-cyan-500/30 p-5 shadow-xl relative overflow-hidden mb-6">
      {/* Background ambient light */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-white tracking-wide flex items-center gap-2">
              <span>AGENCY NODE ACTIVATION RUNBOOK</span>
              {!isSandboxMode && (
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                  GENUINE PRODUCTION MODE
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Follow the 4-step cryptographic pipeline to initialize custody sealing and zero-knowledge verification.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors cursor-pointer"
          title="Dismiss guide"
        >
          ✕
        </button>
      </div>

      {/* 4 Steps Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step) => {
          const isDone = step.status === 'COMPLETED';
          const isReady = step.status === 'READY';
          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-lg border transition-all flex flex-col justify-between ${
                isDone
                  ? 'bg-emerald-500/5 border-emerald-500/30'
                  : isReady
                  ? 'bg-cyan-500/5 border-cyan-500/30'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    STEP 0{step.id}
                  </span>
                  {isDone ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>DONE</span>
                    </span>
                  ) : isReady ? (
                    <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                      READY
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      PENDING
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-white font-mono leading-tight">
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {step.action && <div className="mt-2">{step.action}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
