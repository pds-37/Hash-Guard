import React, { useState } from 'react';
import { ShieldCheck, Search, RefreshCw, FileText, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { verificationService } from '../../services/verificationService';
import { VerificationReportModal } from './VerificationReportModal';
import { Badge } from '../common/Badge';
import { useApp } from '../../context/AppContext';

export const IndependentVerificationPanel = ({ defaultId = 'EV-001' }) => {
  const { isSandboxMode } = useApp();
  // In sandbox mode, default to pre-loaded EV-001; in genuine mode start blank
  const [evidenceId, setEvidenceId] = useState(() => (isSandboxMode ? defaultId : ''));
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const clean = (evidenceId || '').trim();
    if (!clean) {
      setError("Please enter a valid Evidence ID or Artifact ID to verify.");
      setResult(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await verificationService.verifyArtifact(clean);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Verification failed. Exhibit could not be validated.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Verification Query Box */}
      <div className="rounded-lg bg-ce-surface border border-ce-border p-6 shadow-md">
        <div className="max-w-2xl">
          <h2 className="text-lg font-bold text-ce-text-primary font-mono flex items-center gap-2.5 tracking-wide">
            <ShieldCheck className="w-5 h-5 text-ce-brand" />
            INDEPENDENT ZERO-TRUST VERIFICATION
          </h2>
          <p className="text-xs text-ce-text-secondary mt-1.5">
            Verify cryptographic integrity, custody history and lineage proofs without accessing raw off-chain binary files.
          </p>

          <form onSubmit={handleVerify} className="mt-5 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-ce-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={evidenceId}
                onChange={(e) => {
                  setEvidenceId(e.target.value);
                  if (error) setError(null);
                }}
                placeholder={isSandboxMode ? "Enter Evidence ID (e.g. EV-001, EV-009)" : "Enter Registered Evidence ID (e.g. EV-A7X92B)"}
                className="w-full bg-ce-bg border border-ce-border rounded-md pl-9 pr-4 py-2.5 text-xs text-ce-text-primary placeholder:text-ce-text-muted font-mono focus:outline-none focus:border-ce-brand font-semibold uppercase"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-ce-brand hover:bg-ce-brand-hover text-white text-xs font-mono font-bold transition-colors shadow-sm disabled:opacity-50 shrink-0 cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>{isLoading ? 'Running Cryptographic Checks...' : '[ Verify ]'}</span>
            </button>
          </form>

          {/* Quick presets for SIH Demo - strictly visible only in Sandbox Mode */}
          {isSandboxMode && (
            <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-ce-text-muted">
              <span>Quick Demo Presets:</span>
              <button
                type="button"
                onClick={() => {
                  setEvidenceId('EV-001');
                  setError(null);
                }}
                className="text-ce-brand hover:underline font-bold"
              >
                EV-001 (Valid Malware)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setEvidenceId('EV-009');
                  setError(null);
                }}
                className="text-ce-danger hover:underline font-bold"
              >
                EV-009 (Simulated Tamper)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error Alert Box (Zero fake passes when exhibit doesn't exist) */}
      {error && (
        <div className="rounded-lg p-5 border border-ce-danger/40 bg-ce-danger/10 text-ce-danger animate-in fade-in duration-200 shadow-sm flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-ce-danger" />
          <div className="space-y-1">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
              Cryptographic Verification Failed
            </h4>
            <p className="text-xs text-ce-text-primary font-sans leading-relaxed">
              {error}
            </p>
            <p className="text-[11px] font-mono text-ce-text-muted pt-1">
              Zero-Trust Principle: Verification requires an exact mathematical match against a sealed ECDSA manifest on the immutable custody ledger.
            </p>
          </div>
        </div>
      )}

      {/* Verification Result Card */}
      {result && (
        <div
          className={`rounded-lg p-6 border transition-all animate-in fade-in zoom-in-95 duration-200 shadow-md ${
            result.overallStatus === 'COMPROMISED'
              ? 'bg-ce-danger/10 border-ce-danger shadow-[0_0_15px_rgba(239,68,68,0.15)]'
              : 'bg-ce-surface border-ce-border'
          }`}
        >
          {/* Header Summary */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-ce-border">
            <div>
              <span className="text-[10px] uppercase font-mono text-ce-text-muted tracking-widest font-bold">
                AUDIT LAYER ATTESTATION RESULT
              </span>
              <h3 className="text-base font-bold text-ce-text-primary font-mono mt-1 flex items-center gap-2">
                <span>Target Exhibit: {result.identifier}</span>
                <span className="text-xs font-normal text-ce-text-secondary">
                  (On-Chain Anchor Block #{result.onChainBlock})
                </span>
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-ce-text-muted block font-semibold mb-1">
                  Overall Status
                </span>
                <Badge status={result.overallStatus} className="text-sm px-3 py-1" />
              </div>

              <button
                onClick={() => setShowReportModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-ce-surface-subtle border border-ce-border text-xs font-mono font-bold text-ce-brand hover:text-ce-brand-hover hover:border-ce-brand/50 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Generate Verification Report</span>
              </button>
            </div>
          </div>

          {/* 5-Point Cryptographic Check Breakdown */}
          <div className="mt-6 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ce-text-secondary">
              CRYPTOGRAPHIC PROOF CHECKLIST
            </h4>

            <div className="grid grid-cols-1 gap-3">
              {result.checks.map((check) => {
                const isPass = check.status === 'PASS';
                const isFailed = check.status === 'FAILED';

                return (
                  <div
                    key={check.key}
                    className={`p-4 rounded-md border flex flex-col sm:flex-row sm:items-start justify-between gap-3 shadow-sm ${
                      isFailed
                        ? 'bg-ce-danger/10 border-ce-danger/50 text-ce-danger'
                        : isPass
                        ? 'bg-ce-bg border-ce-border text-ce-text-primary'
                        : 'bg-ce-warning/10 border-ce-warning/40 text-ce-warning'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {isPass ? (
                          <CheckCircle2 className="w-4 h-4 text-ce-success" />
                        ) : isFailed ? (
                          <XCircle className="w-4 h-4 text-ce-danger animate-pulse" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-ce-warning" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-mono font-bold text-ce-text-primary">
                            {check.title}
                          </span>
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm tracking-wider ${
                              isPass
                                ? 'bg-ce-success/10 text-ce-success'
                                : 'bg-ce-danger/10 text-ce-danger'
                            }`}
                          >
                            {check.status}
                          </span>
                        </div>

                        <p className="text-xs text-ce-text-secondary mt-1.5 font-sans leading-relaxed">
                          {check.description}
                        </p>

                        {/* Detailed comparison values if failed */}
                        {isFailed && check.actual && (
                          <div className="mt-3 text-[11px] font-mono p-2.5 rounded-md bg-ce-bg border border-ce-danger/30 space-y-1.5 shadow-inner">
                            <div>
                              <span className="text-ce-text-muted uppercase tracking-wider text-[9px] block">Expected Digest:</span>
                              <span className="text-ce-success font-bold break-all block">{check.expected}</span>
                            </div>
                            <div>
                              <span className="text-ce-text-muted uppercase tracking-wider text-[9px] block">Computed Digest (Mismatch):</span>
                              <span className="text-ce-danger font-bold break-all block">{check.actual}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Verification Report Export Modal */}
      <VerificationReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        result={result}
      />
    </div>
  );
};
