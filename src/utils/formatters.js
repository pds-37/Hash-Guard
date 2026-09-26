export function truncateHash(hash, startLen = 8, endLen = 8) {
  if (!hash) return '';
  if (hash.length <= startLen + endLen) return hash;
  return `${hash.slice(0, startLen)}...${hash.slice(-endLen)}`;
}

export function formatDateTime(isoString) {
  if (!isoString) return '—';
  return isoString;
}

export function getStatusBadgeVariant(status) {
  const s = (status || '').toUpperCase();
  switch (s) {
    case 'VERIFIED':
    case 'VALID':
    case 'COMPLETED':
    case 'PASS':
      return {
        bg: 'bg-ce-success/10 text-ce-success border-ce-success/30',
        dot: 'bg-ce-success',
        iconText: 'VERIFIED',
        label: 'VERIFIED'
      };
    case 'PENDING':
    case 'TRANSFERRING':
    case 'REQUESTED':
    case 'IN_PROGRESS':
    case 'WARNING':
      return {
        bg: 'bg-ce-warning/10 text-ce-warning border-ce-warning/30',
        dot: 'bg-ce-warning animate-pulse',
        iconText: 'PENDING',
        label: 'PENDING'
      };
    case 'COMPROMISED':
    case 'FAILED':
    case 'INVALID':
    case 'TAMPER DETECTED':
      return {
        bg: 'bg-ce-danger/10 text-ce-danger border-ce-danger/30 shadow-[0_0_8px_rgba(239,68,68,0.2)]',
        dot: 'bg-ce-danger',
        iconText: 'COMPROMISED',
        label: 'COMPROMISED'
      };
    case 'ARCHIVED':
      return {
        bg: 'bg-ce-surface-subtle text-ce-text-muted border-ce-border',
        dot: 'bg-ce-text-muted',
        iconText: 'ARCHIVED',
        label: 'ARCHIVED'
      };
    case 'LEGAL HOLD':
    case 'LEGAL_HOLD':
    case 'ON HOLD':
    case 'SUSPENDED':
      return {
        bg: 'bg-amber-500/15 text-amber-400 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)] font-bold',
        dot: 'bg-amber-400 animate-pulse',
        iconText: 'LEGAL HOLD',
        label: status === 'SUSPENDED' ? 'SUSPENDED' : 'LEGAL HOLD'
      };
    default:
      return {
        bg: 'bg-ce-surface-subtle text-ce-text-secondary border-ce-border',
        dot: 'bg-ce-text-secondary',
        iconText: status,
        label: status
      };
  }
}

export function getEventColor(event) {
  switch (event) {
    case 'COLLECT':
      return 'text-ce-brand bg-ce-brand/10 border-ce-brand/30';
    case 'SEAL':
      return 'text-ce-success bg-ce-success/10 border-ce-success/30';
    case 'TRANSFER':
    case 'RECEIVE':
      return 'text-ce-info bg-ce-info/10 border-ce-info/30';
    case 'ANALYZE':
    case 'DERIVE':
      return 'text-ce-brand bg-ce-brand/10 border-ce-brand/30';
    case 'ARCHIVE':
    case 'EVIDENCE_ARCHIVED':
      return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
    case 'LEGAL_HOLD_APPLIED':
      return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    case 'LEGAL_HOLD_RELEASED':
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    case 'RETENTION_POLICY_CREATED':
    case 'RETENTION_POLICY_UPDATED':
      return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    case 'RETENTION_STARTED':
    case 'RETENTION_EXPIRED':
      return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    case 'EVIDENCE_DELETION_APPROVED':
      return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    default:
      return 'text-ce-text-secondary bg-ce-surface-subtle border-ce-border';
  }
}
