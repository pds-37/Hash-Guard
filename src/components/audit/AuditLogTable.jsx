import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { getEventColor } from '../../utils/formatters';
import { Blocks } from 'lucide-react';

export const AuditLogTable = ({ logs = [] }) => {
  return (
    <div className="rounded-lg bg-ce-surface border border-ce-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-ce-border bg-[#0a0a0c] text-ce-text-muted font-mono uppercase tracking-wider">
              <th className="py-3 px-4 font-bold">Timestamp (UTC)</th>
              <th className="py-3 px-4 font-bold">Event</th>
              <th className="py-3 px-4 font-bold">Custodial Actor</th>
              <th className="py-3 px-4 font-bold">Organization</th>
              <th className="py-3 px-4 font-bold">Evidence ID</th>
              <th className="py-3 px-4 font-bold">Event ID</th>
              <th className="py-3 px-4 font-bold">Verification</th>
              <th className="py-3 px-4 font-bold">On-Chain Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ce-border font-mono">
            {logs.map((log) => {
              const isCompromised = log.verification === 'COMPROMISED';
              return (
                <tr
                  key={log.id}
                  className={`hover:bg-ce-surface-hover transition-colors ${
                    isCompromised ? 'bg-ce-danger/10' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-ce-text-secondary whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold border ${getEventColor(
                        log.event
                      )}`}
                    >
                      {log.event}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-ce-text-primary whitespace-nowrap">
                    {log.actor}
                  </td>
                  <td className="py-3 px-4 text-ce-text-secondary whitespace-nowrap">
                    {log.organization}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <Link
                      to={`/evidence/${log.evidenceId}`}
                      className="text-ce-brand hover:text-ce-brand-hover hover:underline font-bold"
                    >
                      {log.evidenceId}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-ce-text-secondary whitespace-nowrap">
                    {log.eventId}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <Badge status={log.verification} />
                  </td>
                  <td className="py-3 px-4 text-ce-text-muted text-[11px] whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <Blocks className="w-3.5 h-3.5 text-ce-blockchain" />
                      <span>{log.reference}</span>
                    </span>
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
