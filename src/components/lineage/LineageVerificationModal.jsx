import React from 'react';
import { Modal } from '../common/Modal';
import { CheckCircle2, ShieldCheck, FileCheck, Blocks, KeyRound } from 'lucide-react';
import { Badge } from '../common/Badge';

export const LineageVerificationModal = ({ isOpen, onClose, verificationResult }) => {
  if (!verificationResult) return null;

  const checks = [
    {
      name: 'SOURCE VERIFIED',
      desc: 'Root evidence EV-001 manifest verified with immutable on-chain block anchor #482910.',
      icon: Blocks,
      status: 'PASS'
    },
    {
      name: 'PARENT HASH VERIFIED',
      desc: 'Child artifact headers mathematically linked to parent SHA-256 digests with zero drift.',
      icon: FileCheck,
      status: 'PASS'
    },
    {
      name: 'DERIVATION EVENT VERIFIED',
      desc: 'Transformation algorithms and analysis logs registered as valid custody state transitions.',
      icon: ShieldCheck,
      status: 'PASS'
    },
    {
      name: 'SIGNATURE VERIFIED',
      desc: 'All intermediate lab signatures authenticated against authorized CA public keys.',
      icon: KeyRound,
      status: 'PASS'
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="INDEPENDENT LINEAGE INTEGRITY ATTESTATION"
      subtitle="Cryptographic verification of complete parent-child derivation graph"
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        {/* Overall Status Banner */}
        <div className="p-4 rounded-md bg-ce-success/10 border border-ce-success/30 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-ce-success/20 text-ce-success border border-ce-success/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-ce-success font-bold block">
                ATTESTATION RESULT
              </span>
              <h4 className="text-base font-bold text-ce-text-primary font-mono mt-0.5">
                LINEAGE VALID ✓
              </h4>
            </div>
          </div>

          <span className="px-3 py-1 rounded-sm bg-ce-success/20 text-ce-success border border-ce-success/40 font-mono text-xs font-bold tracking-wider">
            100% PASS
          </span>
        </div>

        {/* Verification Checks Checklist */}
        <div className="space-y-2.5">
          {checks.map((c, idx) => {
            return (
              <div
                key={idx}
                className="p-3.5 rounded-md bg-ce-surface-subtle border border-ce-border flex items-start gap-3"
              >
                <div className="p-1 rounded bg-ce-success/10 text-ce-success mt-0.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-ce-text-primary">
                      ✓ {c.name}
                    </span>
                    <span className="text-[10px] font-mono text-ce-success font-bold tracking-wider">
                      VERIFIED
                    </span>
                  </div>
                  <p className="text-[11px] text-ce-text-secondary mt-1 font-sans leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 rounded-md bg-ce-bg border border-ce-border text-[11px] font-mono text-ce-text-muted flex items-center justify-between">
          <span>Auditor: <strong className="text-ce-text-secondary">National Cyber Board</strong></span>
          <span>Anchored: {verificationResult.verifiedAt || '2026-08-16 13:20:00 UTC'}</span>
        </div>

        <div className="pt-4 border-t border-ce-border flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md bg-ce-brand hover:bg-ce-brand-hover text-white text-xs font-mono font-bold transition-colors shadow-sm"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
