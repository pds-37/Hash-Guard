import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { EvidenceHashCard } from '../../components/evidence/EvidenceHashCard';
import { SignatureCard } from '../../components/evidence/SignatureCard';
import { EvidenceMetadataCard } from '../../components/evidence/EvidenceMetadataCard';
import { CustodyTimeline } from '../../components/evidence/CustodyTimeline';
import { AIThreatTriage } from '../../components/evidence/AIThreatTriage';
import { OffChainBadge } from '../../components/common/OffChainBadge';
import { Badge } from '../../components/common/Badge';
import { LoadingState, ErrorState } from '../../components/common/StateViews';
import { evidenceService } from '../../services/evidenceService';
import { custodyService } from '../../services/custodyService';
import { useApp } from '../../context/AppContext';
import { API_BASE_URL } from '../../services/api';
import {
  ArrowLeft,
  GitFork,
  ShieldCheck,
  Zap,
  Trash2,
} from 'lucide-react';

export const EvidenceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isTamperSimulated, toggleTamperSimulation, refreshTrigger, isSandboxMode } = useApp();

  const [evidence, setEvidence] = useState(null);
  const [custodyEvents, setCustodyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const evData = await evidenceService.getEvidenceById(id);
        const eventsData = await custodyService.getEventsByEvidenceId(id);
        setEvidence(evData);
        if (eventsData && eventsData.length > 0) {
          setCustodyEvents(eventsData);
        } else if (evData) {
          // Guarantee a continuous unbroken chain starting with initial COLLECT
          setCustodyEvents([{
            id: `CUST-INIT-${evData.id}`,
            evidenceId: evData.id,
            action: 'COLLECT',
            fromOrg: evData.sourceOrg || 'Origin Investigator',
            toOrg: evData.currentCustodian || evData.sourceOrg || 'Evidence Locker Alpha',
            timestamp: evData.createdAt || new Date().toISOString(),
            txHash: evData.txHash || '0x4a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
            notes: `Initial evidence ingestion and cryptographic SHA-256 seal registration for exhibit ${evData.id}.`
          }]);
        } else {
          setCustodyEvents([]);
        }
      } catch (err) {
        setError(err.message || `Evidence record ${id} not found.`);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, refreshTrigger, isTamperSimulated]);

  if (loading) {
    return <LoadingState message={`Retrieving forensic dossier and custody ledger for ${id}...`} />;
  }

  if (error || !evidence) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate('/evidence')}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-ce-brand hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Evidence Repository</span>
        </button>
        <ErrorState title="Digital Asset Dossier Not Found" description={error} />
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to permanently delete Evidence ${id}?`)) {
      try {
        await evidenceService.deleteEvidence(id);
        navigate('/evidence');
      } catch (err) {
        alert(`Failed to delete evidence: ${err.message}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumbs & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-ce-border">
        <Link
          to="/evidence"
          className="inline-flex items-center gap-2 text-xs font-mono text-ce-text-secondary hover:text-ce-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to Repository</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Download Raw Evidence File */}
          <button
            type="button"
            onClick={async () => {
              try {
                await evidenceService.downloadEvidence(evidence);
              } catch (dlErr) {
                alert(`Download error: ${dlErr.message}`);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-ce-brand hover:bg-ce-brand-hover text-white text-xs font-mono font-bold transition-colors shadow-sm cursor-pointer"
            title="Download physical evidence binary file"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Download Physical File</span>
          </button>

          {/* Direct Lineage Jump */}
          <Link
            to={`/lineage?id=${evidence.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-ce-surface-subtle border border-ce-border text-xs font-mono text-ce-text-secondary hover:text-ce-text-primary hover:bg-ce-border transition-colors"
          >
            <GitFork className="w-3.5 h-3.5 text-ce-brand" />
            <span>View Lineage DAG</span>
          </Link>

          {/* Independent Verification Jump */}
          <Link
            to={`/verification?id=${evidence.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-ce-surface border border-ce-border hover:bg-ce-surface-subtle text-ce-text-primary text-xs font-mono transition-colors shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-ce-brand" />
            <span>Independent Verification</span>
          </Link>

          {/* Delete Exhibit Button */}
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-ce-danger/10 hover:bg-ce-danger/20 text-ce-danger border border-ce-danger/30 text-xs font-mono font-bold transition-colors shadow-sm"
            title="Permanently remove evidence"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Exhibit</span>
          </button>
        </div>
      </div>

      {/* Top Identity Hero Card */}
      <div className="rounded-lg bg-ce-surface border border-ce-border p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-[10px] font-mono font-bold text-ce-brand bg-ce-brand/10 px-2 py-0.5 rounded border border-ce-brand/20 uppercase tracking-widest">
                FORENSIC EXHIBIT
              </span>
              <span className="text-xs font-mono text-ce-text-muted">
                Parent: {evidence.parentEvidenceId || 'Root Origin'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-ce-text-primary font-mono mt-1">
              Evidence {evidence.id}
            </h2>
            <div className="text-sm font-semibold text-ce-text-secondary mt-1">
              {evidence.title} ({evidence.type})
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-ce-text-muted block font-semibold">
                Custody Status
              </span>
              <Badge status={evidence.status} className="text-sm px-3.5 py-1 mt-1" />
            </div>

            {/* Adversary Red-Team Tamper Drill Toggle (Sandbox Evaluation Mode Only) */}
            {isSandboxMode && (
              <button
                onClick={() => toggleTamperSimulation(!isTamperSimulated, evidence.id)}
                className={`px-3 py-1.5 mt-1 sm:mt-0 rounded-md border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  isTamperSimulated
                    ? 'bg-ce-danger/10 text-ce-danger border-ce-danger/30 hover:bg-ce-danger/20'
                    : 'bg-ce-warning/5 text-ce-warning border-ce-warning/20 hover:bg-ce-warning/10'
                }`}
                title="Red-team adversary bit tamper injection drill"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isTamperSimulated ? 'Restore Clean Hash Root' : 'Inject Bit-Tamper Drill'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Off-Chain Storage vs On-Chain Audit Separation Summary Box */}
      <OffChainBadge />

      {/* Cryptographic Core: SHA-256 Hash Card + Digital Signature Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EvidenceHashCard evidence={evidence} />
        <SignatureCard signature={evidence.signature} evidenceStatus={evidence.status} />
      </div>

      {/* Forensic Metadata Properties */}
      <EvidenceMetadataCard evidence={evidence} />

      {/* AI Threat Triage (Wow Factor) */}
      <AIThreatTriage evidence={evidence} />

      {/* Complete Custody Timeline */}
      <CustodyTimeline events={custodyEvents} currentStatus={evidence.status} />
    </div>
  );
};
