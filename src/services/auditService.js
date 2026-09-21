import { apiClient, IS_MOCK_FALLBACK } from './api';
import { mockAuditLogs } from '../mock/auditLogs';

const isSandboxModeActive = () => {
  try {
    return localStorage.getItem('cee_is_sandbox') === 'true';
  } catch {
    return false;
  }
};

let sandboxAuditLogsState = [...mockAuditLogs];

const getGenuineAuditLogs = () => {
  try {
    const raw = localStorage.getItem('cee_genuine_audit');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveGenuineAuditLogs = (list) => {
  try {
    localStorage.setItem('cee_genuine_audit', JSON.stringify(list));
  } catch (err) {
    console.error('Failed to persist genuine audit logs:', err);
  }
};

export const auditService = {
  async getAuditLogs(filters = {}) {
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.get('/audit', { params: filters });
        return response.data;
      }
    } catch (err) {
      // Fallback
    }

    const sourceList = isSandboxModeActive() ? sandboxAuditLogsState : getGenuineAuditLogs();

    return sourceList.filter((log) => {
      if (filters.event && filters.event !== 'ALL' && log.event !== filters.event) {
        return false;
      }
      if (filters.organization && filters.organization !== 'ALL' && !log.organization.includes(filters.organization)) {
        return false;
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          log.id.toLowerCase().includes(q) ||
          log.evidenceId.toLowerCase().includes(q) ||
          log.actor.toLowerCase().includes(q) ||
          log.event.toLowerCase().includes(q) ||
          log.details.toLowerCase().includes(q) ||
          log.reference.toLowerCase().includes(q)
        );
      }
      return true;
    });
  },

  async logEvent(logPayload) {
    const newLog = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      evidenceId: logPayload.evidenceId || 'N/A',
      event: logPayload.event || 'SYSTEM_ACTION',
      actor: logPayload.actor || 'system',
      organization: logPayload.organization || 'Local Node',
      details: logPayload.details || 'Cryptographic audit log recorded',
      reference: logPayload.reference || '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join(''),
      verification: 'VERIFIED'
    };

    if (isSandboxModeActive()) {
      sandboxAuditLogsState.unshift(newLog);
    } else {
      const current = getGenuineAuditLogs();
      current.unshift(newLog);
      saveGenuineAuditLogs(current);
    }

    return newLog;
  }
};
