import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  RefreshCw, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  AlertCircle,
  Plus,
  ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { verificationService } from '../../services/verificationService';
import { evidenceService } from '../../services/evidenceService';
import { VerificationReportModal } from './VerificationReportModal';
import { NewEvidenceModal } from '../evidence/NewEvidenceModal';
import { Badge } from '../common/Badge';
import { useApp } from '../../context/AppContext';

export const IndependentVerificationPanel = ({ defaultId = '' }) => {
  const { isSandboxMode, refreshTrigger, triggerRefresh } = useApp();
  
  // In sandbox mode, default to pre-loaded EV-001; in genuine mode start blank
  const [evidenceId, setEvidenceId] = useState(() => (isSandboxMode ? (defaultId || 'EV-001') : ''));
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [notFoundId, setNotFoundId] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  // Ledger exhibits state
  const [availableEvidence, setAvailableEvidence] = useState([]);
  const [loadingLedger, setLoadingLedger] = useState(true);

  const loadLedgerState = async () => {
    setLoadingLedger(true);
    try {
      const list = await evidenceService.getAllEvidence();
      setAvailableEvidence(list || []);
      // If genuine mode and we have items, don't force EV-001
      if (!isSandboxMode && list && list.length > 0 && !evidenceId) {
        // Leave empty until user picks or types
      }
    } catch (err) {
      console.error('Failed to query ledger evidence items:', err);
    } finally {
      setLoadingLedger(false);
    }
  };

  useEffect(() => {
    loadLedgerState();
  }, [refreshTrigger, isSandboxMode]);

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const clean = (evidenceId || '').trim();
    if (!clean) {
      setError("Please enter a valid Evidence ID or Artifact ID to verify.");
      setNotFoundId(null);
      setResult(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setNotFoundId(null);
    setResult(null);

    try {
      const res = await verificationService.verifyArtifact(clean);
      setResult(res);
      setNotFoundId(null);
      setError(null);
    } catch (err) {
      setResult(null);
      if (err.code === 'NOT_FOUND' || err.response?.status === 404 || err.message?.toLowerCase().includes('not found')) {
        setNotFoundId(clean);
        setError(null);
      } else {
        setError(err.message || 'Verification failed. Exhibit could not be validated.');
        setNotFoundId(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If ledger is empty in genuine mode (0 evidence recorded in the ledger)
  const isLedgerEmpty = !loadingLedger && availableEvidence.length === 0;

  return (
    <div className="space-y-6">
      {/* 1. If 0 evidence present in ledger: Explicit Clean "No Evidence" State */}
      {isLedgerEmpty ? (
        <div className="rounded-xl bg-ce-surface border border-ce-border p-8 text-center shadow-lg animate-in fade-in duration-300">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 shadow-inner">
            <ShieldAlert className="w-8 h-8 text-amber-400" />
          </div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 px-2.5 py-1 rounded bg-amber-400/10 border border-amber-400/30">
            LEDGER STATUS: NO EVIDENCE REGISTERED
          </span>
          <h3 className="text-lg font-bold font-mono text-ce-text-primary tracking-wide uppercase mt-3">
            No Evidence Recorded in Ledger
          </h3>
          <p className="text-xs text-ce-text-secondary mt-2 max-w-lg mx-auto leading-relaxed font-sans">
            There are currently no evidence exhibits present in the cryptographic audit ledger. Independent zero-knowledge verification requires an existing evidence exhibit sealed with an immutable SHA-256 digest and ECDSA manifest.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setShowRegisterModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-mono font-bold transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Collect & Seal Initial Evidence</span>
            </button>
            <Link
              to="/evidence"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-ce-surface-subtle border border-ce-border hover:border-ce-brand/50 text-ce-text-secondary hover:text-ce-text-primary text-xs font-mono font-bold transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>View Evidence Repository</span>
            </Link>
          </div>
        </div>
      ) : (
        /* 2. Verification Query Box when exhibits are present in ledger */
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
                    if (notFoundId) setNotFoundId(null);
                  }}
                  placeholder={
                    isSandboxMode 
                      ? "Enter Evidence ID (e.g. EV-001, EV-009)" 
                      : (availableEvidence[0] ? `Enter Evidence ID (e.g. ${availableEvidence[0].id})` : "Enter Registered Evidence ID")
                  }
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

            {/* Quick Demo Presets for Sandbox Mode */}
            {isSandboxMode ? (
              <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-ce-text-muted">
                <span>Quick Demo Presets:</span>
                <button
                  type="button"
                  onClick={() => {
                    setEvidenceId('EV-001');
                    setError(null);
                    setNotFoundId(null);
                  }}
                  className="text-ce-brand hover:underline font-bold cursor-pointer"
                >
                  EV-001 (Valid Malware)
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    setEvidenceId('EV-009');
                    setError(null);
                    setNotFoundId(null);
                  }}
                  className="text-ce-danger hover:underline font-bold cursor-pointer"
                >
                  EV-009 (Simulated Tamper)
                </button>
              </div>
            ) : (
              /* Genuine Mode: Quick select from available registered exhibits in the ledger */
              availableEvidence.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-mono text-ce-text-muted">
                  <span className="font-semibold text-ce-text-secondary">Registered in Ledger:</span>
                  {availableEvidence.slice(0, 4).map((ev) => (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => {
                        setEvidenceId(ev.id);
                        setError(null);
                        setNotFoundId(null);
                      }}
                      className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        evidenceId === ev.id
                          ? 'bg-ce-brand/20 border-ce-brand text-ce-brand font-bold'
                          : 'bg-ce-surface-subtle border-ce-border hover:border-ce-brand/50 text-ce-text-primary'
                      }`}
                    >
                      {ev.id}
                    </button>
                  ))}
                  {availableEvidence.length > 4 && (
                    <span className="text-[10px] text-ce-text-muted">+{availableEvidence.length - 4} more</span>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Explicit "No Evidence Found" notification when searched ID does not exist in ledger */}
      {notFoundId && (
        <div className="rounded-lg p-5 border border-amber-500/40 bg-amber-500/10 text-amber-200 animate-in fade-in duration-200 shadow-sm flex items-start gap-3.5">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
          <div className="space-y-1">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              No Evidence Found in Ledger
            </h4>
            <p className="text-xs text-ce-text-primary font-sans leading-relaxed">
              No digital evidence exhibit matching identifier <strong className="font-mono text-amber-300 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/30">"{notFoundId}"</strong> exists in the cryptographic audit ledger.
            </p>
            <p className="text-[11px] font-mono text-ce-text-muted pt-1">
              Check the identifier spelling or ingest the exhibit from the evidence repository before performing independent zero-knowledge verification.
            </p>
          </div>
        </div>
      )}

      {/* Error Alert Box for operational / cryptographic validation errors */}
      {error && (
        <div className="rounded-lg p-5 border border-ce-danger/40 bg-ce-danger/10 text-ce-danger animate-in fade-in duration-200 shadow-sm flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-ce-danger" />
          <div className="space-y-1">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
              Cryptographic Verification Error
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

      {/* Collect / Seal Initial Evidence Modal */}
      <NewEvidenceModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onCreated={() => {
          triggerRefresh();
          loadLedgerState();
        }}
      />
    </div>
  );
};
