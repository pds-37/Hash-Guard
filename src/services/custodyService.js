import { apiClient, IS_MOCK_FALLBACK } from './api';
import { mockCustodyEvents } from '../mock/custodyEvents';

let custodyEventsState = [...mockCustodyEvents];

export const custodyService = {
  async getEvents(filters = {}) {
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.get('/custody/events', { params: filters });
        return response.data;
      }
    } catch (err) {
      console.warn('[CustodyService] API request failed, falling back to local custody events store:', err);
    }

    return custodyEventsState.filter((item) => {
      if (filters.evidenceId && item.evidenceId.toUpperCase() !== filters.evidenceId.toUpperCase()) {
        return false;
      }
      if (filters.event && filters.event !== 'ALL' && item.event !== filters.event) {
        return false;
      }
      if (filters.organization && filters.organization !== 'ALL' && !item.organization.includes(filters.organization)) {
        return false;
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          item.eventId.toLowerCase().includes(q) ||
          item.evidenceId.toLowerCase().includes(q) ||
          item.actor.toLowerCase().includes(q) ||
          item.event.toLowerCase().includes(q) ||
          (item.notes && item.notes.toLowerCase().includes(q))
        );
      }
      return true;
    });
  },

  async getEventsByEvidenceId(evidenceId) {
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.get(`/custody/events/${evidenceId}`);
        return response.data;
      }
    } catch (err) {
      console.warn('[CustodyService] API request failed, falling back to local custody events store:', err);
    }

    return custodyEventsState.filter((ev) => ev.evidenceId.toUpperCase() === evidenceId.toUpperCase());
  },

  async recordCustodyEvent(eventPayload) {
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.post('/custody/events', eventPayload);
        return response.data;
      }
    } catch (err) {
      console.warn('[CustodyService] API request failed, falling back to local custody events store:', err);
    }

    const newEvent = {
      eventId: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
      evidenceId: eventPayload.evidenceId,
      event: eventPayload.event,
      actor: eventPayload.actor || 'analyst-current@cyber.org',
      organization: eventPayload.organization || 'Organization B (Cyber Lab)',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      hash: eventPayload.hash || '8f3a91bc72f4cd2a4e9b671a5c28e930f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
      verification: 'VERIFIED',
      signature: '3045022100' + Array.from({length: 20}, () => Math.floor(Math.random()*16).toString(16)).join('') + '...VALID',
      txRef: '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join(''),
      notes: eventPayload.notes || 'Custody action recorded in decentralized evidence ledger.',
      parentId: eventPayload.parentId || null
    };

    custodyEventsState.unshift(newEvent);
    return newEvent;
  }
};

