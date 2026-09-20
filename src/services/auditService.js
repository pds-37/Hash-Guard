import { apiClient, IS_MOCK_FALLBACK } from './api';
import { mockAuditLogs } from '../mock/auditLogs';

let auditLogsState = [...mockAuditLogs];

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

    return auditLogsState.filter((log) => {
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
  }
};
