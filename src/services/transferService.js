import { apiClient, IS_MOCK_FALLBACK } from './api';
import { mockTransfers } from '../mock/transfers';

let transfersState = [...mockTransfers];

export const transferService = {
  async getTransfers(filters = {}) {
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.get('/transfers', { params: filters });
        return response.data;
      }
    } catch (err) {
      console.warn('[TransferService] API request failed, falling back to local transfers store:', err);
    }

    return transfersState.filter((item) => {
      if (filters.status && filters.status !== 'ALL' && item.status !== filters.status) {
        return false;
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          item.id.toLowerCase().includes(q) ||
          item.evidenceId.toLowerCase().includes(q) ||
          item.evidenceTitle.toLowerCase().includes(q) ||
          item.fromOrg.toLowerCase().includes(q) ||
          item.toOrg.toLowerCase().includes(q)
        );
      }
      return true;
    });
  },

  async initiateTransfer(payload) {
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.post('/transfers', payload);
        return response.data;
      }
    } catch (err) {
      console.warn('[TransferService] API request failed, falling back to local transfers store:', err);
    }

    const newTransfer = {
      id: `TR-00${transfersState.length + 1}`,
      evidenceId: payload.evidenceId || 'EV-001',
      evidenceTitle: payload.evidenceTitle || 'Digital Forensic Specimen',
      evidenceType: payload.evidenceType || 'Disk Image',
      fromOrg: payload.fromOrg || 'Organization A (CERT-Alpha)',
      fromActor: payload.fromActor || 'ops-transport@org-a.gov',
      toOrg: payload.toOrg || 'Organization B (Cyber Lab)',
      toActor: payload.toActor || 'analyst@org-b.lab',
      status: 'TRANSFERRING',
      transferProtocol: 'mTLS Encrypted Transport + Signed Manifest',
      manifestHash: payload.manifestHash || '8f3a91bc72f4cd2a4e9b671a5c28e930f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
      initiatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      completedAt: null,
      blockchainTx: '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
      steps: [
        { step: "MANIFEST_SIGN", org: payload.fromOrg || "Organization A", timestamp: new Date().toLocaleTimeString(), status: "COMPLETED" },
        { step: "SECURE_DISPATCH", org: payload.fromOrg || "Organization A", timestamp: new Date().toLocaleTimeString(), status: "IN_PROGRESS" },
        { step: "PAYLOAD_RECEIVE", org: payload.toOrg || "Organization B", timestamp: null, status: "PENDING" },
        { step: "INTEGRITY_VERIFY", org: payload.toOrg || "Organization B", timestamp: null, status: "PENDING" }
      ],
      notes: payload.notes || 'Cross-agency chain-of-custody transfer dispatched.'
    };

    transfersState.unshift(newTransfer);
    return newTransfer;
  },

  async verifyAndAcceptTransfer(transferId) {
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.post(`/transfers/${transferId}/accept`);
        return response.data;
      }
    } catch (err) {
      console.warn('[TransferService] API request failed, falling back to local transfers store:', err);
    }

    transfersState = transfersState.map((t) => {
      if (t.id === transferId) {
        return {
          ...t,
          status: 'VERIFIED',
          completedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          steps: t.steps.map((s) => ({
            ...s,
            status: 'COMPLETED',
            timestamp: s.timestamp || new Date().toLocaleTimeString()
          }))
        };
      }
      return t;
    });

    return transfersState.find((t) => t.id === transferId);
  }
};

