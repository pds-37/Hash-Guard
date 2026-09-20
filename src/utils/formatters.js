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
      return 'text-ce-text-muted bg-ce-surface-subtle border-ce-border';
    default:
      return 'text-ce-text-secondary bg-ce-surface-subtle border-ce-border';
  }
}
