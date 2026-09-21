import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { getEventColor, truncateHash } from '../../utils/formatters';
import { ExternalLink } from 'lucide-react';

export const CustodyExplorerTable = ({ events = [] }) => {
  return (
    <div className="rounded-lg bg-ce-surface border border-ce-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-ce-border bg-ce-bg text-ce-text-muted font-mono tracking-wider">
              <th className="py-3 px-4 font-semibold uppercase">Event ID</th>
              <th className="py-3 px-4 font-semibold uppercase">Evidence ID</th>
              <th className="py-3 px-4 font-semibold uppercase">Event Type</th>
              <th className="py-3 px-4 font-semibold uppercase">Hash Chain Link (Prev → Current)</th>
              <th className="py-3 px-4 font-semibold uppercase">Custodial Actor</th>
              <th className="py-3 px-4 font-semibold uppercase">Organization</th>
              <th className="py-3 px-4 font-semibold uppercase">Timestamp (UTC)</th>
              <th className="py-3 px-4 font-semibold uppercase">Signature</th>
              <th className="py-3 px-4 font-semibold text-right uppercase">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ce-border font-mono">
            {events.map((ev) => {
              const isCompromised = ev.verification === 'COMPROMISED';
              return (
                <tr
                  key={ev.eventId}
                  className={`hover:bg-ce-surface-hover transition-colors group ${
                    isCompromised ? 'bg-ce-danger/5' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold text-ce-text-primary whitespace-nowrap">
                    {ev.eventId}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Link
                      to={`/evidence/${ev.evidenceId}`}
                      className="text-ce-brand hover:text-ce-brand-hover hover:underline font-bold flex items-center gap-1.5"
                    >
                      <span>{ev.evidenceId}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-ce-text-muted group-hover:text-ce-brand-hover transition-colors" />
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold border ${getEventColor(
                        ev.event
                      )}`}
                    >
                      {ev.event}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-ce-text-muted text-[10px] whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span className="bg-ce-surface-subtle px-1.5 py-0.5 rounded border border-ce-border font-bold text-ce-text-muted">
                        {ev.previousHash || 'GENESIS (0x0...)'}
                      </span>
                      <span className="text-ce-brand font-bold">→</span>
                      <span className={`px-1.5 py-0.5 rounded font-bold border ${
                        isCompromised ? 'bg-ce-danger/10 text-ce-danger border-ce-danger/40' : 'bg-ce-brand/10 text-ce-brand border-ce-brand/30'
                      }`}>
                        {truncateHash(ev.hash, 4, 4)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-ce-text-secondary whitespace-nowrap">
                    {ev.actor}
                  </td>
                  <td className="py-3.5 px-4 text-ce-text-muted whitespace-nowrap">
                    {ev.organization}
                  </td>
                  <td className="py-3.5 px-4 text-ce-text-muted text-[11px] whitespace-nowrap">
                    {ev.timestamp}
                  </td>
                  <td className="py-3.5 px-4 text-ce-text-muted whitespace-nowrap">
                    {ev.parentId ? (
                      <Link
                        to={`/evidence/${ev.parentId}`}
                        className="text-ce-blockchain hover:text-ce-blockchain/80 hover:underline font-semibold"
                      >
                        {ev.parentId}
                      </Link>
                    ) : (
                      <span className="text-ce-text-muted">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-ce-text-muted text-[11px] whitespace-nowrap">
                    <span
                      className={`px-1.5 py-0.5 rounded-sm ${
                        isCompromised
                          ? 'bg-ce-danger/10 text-ce-danger border border-ce-danger/30'
                          : 'bg-ce-surface-subtle border border-ce-border text-ce-text-secondary'
                      }`}
                    >
                      {truncateHash(ev.signature, 6, 4)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Badge status={ev.verification} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
