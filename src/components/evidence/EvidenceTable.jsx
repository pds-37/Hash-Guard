import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { truncateHash, getEventColor } from '../../utils/formatters';
import { ExternalLink, Copy, Check } from 'lucide-react';

export const EvidenceTable = ({ evidenceList = [] }) => {
  const [copiedHash, setCopiedHash] = useState(null);

  const handleCopy = (hash, e) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="rounded-lg bg-ce-surface border border-ce-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-ce-border bg-ce-surface-subtle text-ce-text-muted text-[10px] uppercase tracking-wider font-mono">
              <th className="py-3 px-4 font-semibold">Evidence ID</th>
              <th className="py-3 px-4 font-semibold">Case ID</th>
              <th className="py-3 px-4 font-semibold">Evidence Type</th>
              <th className="py-3 px-4 font-semibold">Source Org</th>
              <th className="py-3 px-4 font-semibold">Current Custodian</th>
              <th className="py-3 px-4 font-semibold">SHA-256 Hash</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Last Event</th>
              <th className="py-3 px-4 font-semibold">Logged Date</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ce-border">
            {evidenceList.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-ce-surface-subtle transition-colors group"
              >
                <td className="py-3 px-4 font-mono font-medium text-ce-text-primary whitespace-nowrap">
                  <Link
                    to={`/evidence/${item.id}`}
                    className="hover:text-ce-brand-hover transition-colors flex items-center gap-1.5"
                  >
                    <span>{item.id}</span>
                    {item.isDerived && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-ce-brand/10 text-ce-brand border border-ce-brand/30">
                        DERIVED
                      </span>
                    )}
                  </Link>
                </td>
                <td className="py-3 px-4 font-mono text-xs text-ce-brand font-semibold whitespace-nowrap">
                  {item.caseId || 'CASE-2026-9012'}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="text-ce-text-primary font-medium text-sm">{item.type}</div>
                  <div className="text-xs text-ce-text-secondary truncate max-w-[180px]">
                    {item.title}
                  </div>
                </td>
                <td className="py-3 px-4 text-ce-text-secondary whitespace-nowrap">
                  {item.sourceOrg}
                </td>
                <td className="py-3 px-4 text-ce-text-secondary whitespace-nowrap">
                  {item.currentCustodian}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 rounded font-mono text-xs ${
                        item.status === 'COMPROMISED'
                          ? 'bg-ce-danger/10 text-ce-danger border border-ce-danger/30'
                          : 'bg-ce-bg text-ce-text-muted border border-ce-border'
                      }`}
                      title={item.hash}
                    >
                      {truncateHash(item.hash, 5, 5)}
                    </span>
                    <button
                      onClick={(e) => handleCopy(item.hash, e)}
                      className="p-1 rounded text-ce-text-muted hover:text-ce-text-primary hover:bg-ce-bg transition-colors"
                      title="Copy full hash"
                      aria-label="Copy SHA-256 Hash"
                    >
                      {copiedHash === item.hash ? (
                        <Check className="w-3.5 h-3.5 text-ce-success" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <Badge status={item.status} />
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${getEventColor(
                      item.lastEvent
                    )}`}
                  >
                    {item.lastEvent}
                  </span>
                </td>
                <td className="py-3 px-4 text-ce-text-muted font-mono whitespace-nowrap">
                  {item.createdAt.split(' ')[0]}
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <Link
                    to={`/evidence/${item.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-ce-bg border border-ce-border text-xs text-ce-text-secondary hover:text-ce-text-primary hover:border-ce-brand/50 transition-all"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
