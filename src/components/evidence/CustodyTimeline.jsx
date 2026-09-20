import React from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  User,
  Building2,
  ShieldCheck,
  ShieldAlert,
  ArrowDown,
  Hash,
  FileKey
} from 'lucide-react';
import { getEventColor } from '../../utils/formatters';

export const CustodyTimeline = ({ events = [], currentStatus = 'VERIFIED' }) => {
  const isOverallCompromised = currentStatus === 'COMPROMISED';

  const fullLifecycle = [
    { type: 'COLLECT', label: 'COLLECTED', stage: 'Acquisition' },
    { type: 'SEAL', label: 'SEALED', stage: 'Manifest HSM Seal' },
    { type: 'TRANSFER', label: 'TRANSFERRED', stage: 'Cross-Org Dispatch' },
    { type: 'RECEIVE', label: 'RECEIVED', stage: 'Integrity Check on Ingestion' },
    { type: 'ANALYZE', label: 'ANALYZED', stage: 'Forensic Enclave Decompile' },
    { type: 'DERIVE', label: 'DERIVED', stage: 'Lineage Artifact Branch' },
    { type: 'ARCHIVE', label: 'ARCHIVED', stage: 'Long-term Ledger Retention' },
  ];

  return (
    <div className="rounded-lg bg-ce-surface border border-ce-border p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-ce-border mb-6">
        <div>
          <h3 className="text-sm font-mono font-bold tracking-wider uppercase text-ce-text-primary flex items-center gap-2">
            <Clock className="w-4 h-4 text-ce-brand" />
            END-TO-END FORENSIC CUSTODY TIMELINE
          </h3>
          <p className="text-xs text-ce-text-muted mt-1">
            Cryptographically signed ledger events validating chain of custody
          </p>
        </div>
        <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-ce-brand/10 text-ce-brand border border-ce-brand/30">
          {events.length} EVENTS RECORDED
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-px before:bg-ce-border">
        {events.map((ev, idx) => {
          const isCompromisedEvent = ev.verification === 'COMPROMISED' || (isOverallCompromised && idx === events.length - 1);
          const isLast = idx === events.length - 1;

          return (
            <div key={ev.eventId || idx} className="relative group">
              {/* Timeline Node Icon Indicator */}
              <div
                className={`absolute -left-6 top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompromisedEvent
                    ? 'bg-ce-danger/20 border-ce-danger text-ce-danger shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-pulse'
                    : 'bg-ce-surface border-ce-success text-ce-success'
                }`}
              >
                {isCompromisedEvent ? (
                  <ShieldAlert className="w-3.5 h-3.5" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Event Card Container */}
              <div
                className={`p-4 rounded-md border transition-all ${
                  isCompromisedEvent
                    ? 'bg-ce-danger/10 border-ce-danger/40 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                    : 'bg-ce-surface-subtle border-ce-border hover:border-ce-brand/40 hover:bg-ce-bg'
                }`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-ce-border">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase border ${getEventColor(
                        ev.event
                      )}`}
                    >
                      {ev.event}
                    </span>
                    <span className="text-xs font-mono font-bold text-ce-text-primary">
                      {ev.eventId}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        isCompromisedEvent
                          ? 'bg-ce-danger/10 text-ce-danger border-ce-danger/40'
                          : 'bg-ce-success/10 text-ce-success border-ce-success/30'
                      }`}
                    >
                      {isCompromisedEvent ? '✕ Tamper Flagged' : '✓ Signature Verified'}
                    </span>
                  </div>
                </div>

                {/* Event Body */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-ce-text-muted block uppercase tracking-wider font-semibold">Organization:</span>
                    <span className="text-ce-text-primary font-medium truncate block mt-1">
                      {ev.organization}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-ce-text-muted block uppercase tracking-wider font-semibold">Custodial Actor:</span>
                    <span className="text-ce-brand truncate block mt-1">
                      {ev.actor}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-ce-text-muted block uppercase tracking-wider font-semibold">Timestamp (UTC):</span>
                    <span className="text-ce-text-secondary block mt-1">
                      {ev.timestamp}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-ce-text-muted block uppercase tracking-wider font-semibold">On-Chain Tx / Ref:</span>
                    <span className="text-ce-text-secondary truncate block mt-1" title={ev.txRef}>
                      {ev.txRef}
                    </span>
                  </div>
                </div>

                {/* Notes if available */}
                {ev.notes && (
                  <div className="mt-4 pt-3 border-t border-ce-border text-xs text-ce-text-primary font-sans flex items-start gap-2.5">
                    <span className="text-[10px] uppercase font-mono text-ce-brand font-bold shrink-0 tracking-wider">
                      Ledger Log:
                    </span>
                    <span>{ev.notes}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
