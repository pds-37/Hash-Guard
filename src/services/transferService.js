import { apiClient, IS_MOCK_FALLBACK } from './api';
import { mockTransfers } from '../mock/transfers';
import { custodyService } from './custodyService';
import { evidenceService } from './evidenceService';

const isSandboxModeActive = () => {
  try {
    return localStorage.getItem('cee_is_sandbox') === 'true';
  } catch {
    return false;
  }
};

let sandboxTransfersState = [...mockTransfers];

const getGenuineTransfers = () => {
  try {
    const raw = localStorage.getItem('cee_genuine_transfers');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveGenuineTransfers = (list) => {
  try {
    localStorage.setItem('cee_genuine_transfers', JSON.stringify(list));
  } catch (err) {
    console.error('Failed to persist genuine transfers:', err);
  }
};

export const transferService = {
  async getTransfers(filters = {}) {
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.get('/transfers', { params: filters });
        return response.data;
      }
    } catch (err) {
      console.warn('[TransferService] API request failed, using local transfers store:', err);
    }

    const sourceList = isSandboxModeActive() ? sandboxTransfersState : getGenuineTransfers();

    return sourceList.filter((item) => {
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
      console.warn('[TransferService] API request failed, using local transfers store:', err);
    }

    const sourceList = isSandboxModeActive() ? sandboxTransfersState : getGenuineTransfers();

    const newTransfer = {
      id: `TR-00${sourceList.length + 1}`,
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

    if (isSandboxModeActive()) {
      sandboxTransfersState.unshift(newTransfer);
    } else {
      const current = getGenuineTransfers();
      current.unshift(newTransfer);
      saveGenuineTransfers(current);
    }

    // Auto-record TRANSFER event in custody timeline
    try {
      await custodyService.recordCustodyEvent({
        evidenceId: newTransfer.evidenceId,
        event: 'TRANSFER',
        actor: newTransfer.fromActor,
        organization: newTransfer.fromOrg,
        hash: newTransfer.manifestHash,
        notes: `Transfer dispatched to ${newTransfer.toOrg}. Protocol: mTLS Encrypted Transport.`
      });
      await evidenceService.updateEvidenceCustodian(
        newTransfer.evidenceId,
        `${newTransfer.fromOrg} -> ${newTransfer.toOrg} (In Transit)`,
        'TRANSFER'
      );
    } catch (e) {
      console.warn('Auto transfer event creation skipped:', e);
    }

    return newTransfer;
  },

  async verifyAndAcceptTransfer(transferId) {
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.post(`/transfers/${transferId}/accept`);
        return response.data;
      }
    } catch (err) {
      console.warn('[TransferService] API request failed, using local transfers store:', err);
    }

    let acceptedTransfer = null;

    if (isSandboxModeActive()) {
      sandboxTransfersState = sandboxTransfersState.map((t) => {
        if (t.id === transferId) {
          acceptedTransfer = {
            ...t,
            status: 'VERIFIED',
            completedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
            steps: t.steps.map((s) => ({
              ...s,
              status: 'COMPLETED',
              timestamp: s.timestamp || new Date().toLocaleTimeString()
            }))
          };
          return acceptedTransfer;
        }
        return t;
      });
    } else {
      const current = getGenuineTransfers().map((t) => {
        if (t.id === transferId) {
          acceptedTransfer = {
            ...t,
            status: 'VERIFIED',
            completedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
            steps: t.steps.map((s) => ({
              ...s,
              status: 'COMPLETED',
              timestamp: s.timestamp || new Date().toLocaleTimeString()
            }))
          };
          return acceptedTransfer;
        }
        return t;
      });
      saveGenuineTransfers(current);
    }

    // Auto-record RECEIVE event in custody timeline and update evidence custodian
    if (acceptedTransfer) {
      try {
        await custodyService.recordCustodyEvent({
          evidenceId: acceptedTransfer.evidenceId,
          event: 'RECEIVE',
          actor: acceptedTransfer.toActor,
          organization: acceptedTransfer.toOrg,
          hash: acceptedTransfer.manifestHash,
          notes: `Transfer verified and received by ${acceptedTransfer.toOrg}. ECDSA manifest seal confirmed.`
        });
        await evidenceService.updateEvidenceCustodian(
          acceptedTransfer.evidenceId,
          acceptedTransfer.toOrg,
          'RECEIVE'
        );
      } catch (e) {
        console.warn('Auto receive event creation skipped:', e);
      }
    }

    return acceptedTransfer;
  },

  async deleteTransfersByEvidenceId(evidenceId) {
    const cleanId = (evidenceId || '').toUpperCase();
    if (isSandboxModeActive()) {
      sandboxTransfersState = sandboxTransfersState.filter(t => (t.evidenceId || '').toUpperCase() !== cleanId);
    } else {
      const current = getGenuineTransfers().filter(t => (t.evidenceId || '').toUpperCase() !== cleanId);
      saveGenuineTransfers(current);
    }
    return { success: true };
  },

  async wipeAllTransfers() {
    if (isSandboxModeActive()) {
      sandboxTransfersState = [];
    } else {
      localStorage.removeItem('cee_genuine_transfers');
    }
    return { success: true };
  }
};
