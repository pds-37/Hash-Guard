import React from 'react';
import { KeyRound, ShieldCheck, ShieldAlert, CheckCircle2, FileKey } from 'lucide-react';
import { Badge } from '../common/Badge';

export const SignatureCard = ({ signature, evidenceStatus }) => {
  const isCompromised = evidenceStatus === 'COMPROMISED' || signature?.status === 'INVALID';
  const isValid = !isCompromised;

  return (
    <div
      className={`rounded-lg p-5 border transition-all ${
        isCompromised
          ? 'bg-ce-danger/10 border-ce-danger/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
          : 'bg-ce-surface border-ce-border'
      }`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-ce-border">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-md border ${
              isCompromised
                ? 'bg-ce-danger/20 text-ce-danger border-ce-danger/40'
                : 'bg-ce-brand/10 text-ce-brand border-ce-brand/30'
            }`}
          >
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-ce-text-primary">
              DIGITAL SIGNATURE ATTESTATION
            </h3>
            <span className="text-[10px] text-ce-brand font-mono">
              [Simulated / Fast-Secp256k1 Manifest Seal]
            </span>
          </div>
        </div>

        <Badge
          status={isValid ? 'VERIFIED' : 'COMPROMISED'}
          customLabel={isValid ? 'VALID' : 'INVALID'}
        />
      </div>

      <div className="mt-4 space-y-3 font-mono text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-md bg-ce-bg border border-ce-border">
            <span className="text-[10px] uppercase text-ce-text-muted block font-semibold tracking-wider">
              Originating Signer:
            </span>
            <span className="text-ce-text-primary font-medium text-[11px] mt-1 block truncate">
              {signature?.signer || 'Organization A (CERT-Alpha CA)'}
            </span>
          </div>

          <div className="p-3 rounded-md bg-ce-bg border border-ce-border">
            <span className="text-[10px] uppercase text-ce-text-muted block font-semibold tracking-wider">
              Algorithm:
            </span>
            <span className="text-ce-brand font-medium text-[11px] mt-1 block">
              {signature?.algorithm || 'ECDSA / secp256k1'}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-md bg-ce-bg border border-ce-border">
          <div className="flex items-center justify-between text-[10px] uppercase text-ce-text-muted mb-1.5">
            <span className="font-semibold tracking-wider">Public Key Fingerprint:</span>
            <span className="text-ce-text-secondary font-mono">X.509 CA</span>
          </div>
          <div className="text-ce-text-secondary text-[11px] break-all">
            {signature?.publicKeyFingerprint || 'SHA256:4b9a7c81f3d8a94b2e619c054f281e7d9a3b04c81f2e5a6d7c8b9a0e1f2a3b4c'}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-ce-text-muted pt-2 border-t border-ce-border">
          <span>Signed Manifest ID:</span>
          <span className="text-ce-text-primary font-bold">{signature?.manifestId || 'MNF-2026-0816-001'}</span>
        </div>
      </div>
    </div>
  );
};
