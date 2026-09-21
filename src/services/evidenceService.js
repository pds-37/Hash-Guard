import { apiClient, IS_MOCK_FALLBACK } from './api';
import { mockEvidenceList } from '../mock/evidence';

// In-memory state for runtime mutations during demo
let evidenceState = [...mockEvidenceList];

export const evidenceService = {
  async getAllEvidence(filters = {}) {
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.get('/evidence', { params: filters });
        return response.data;
      }
    } catch (err) {
      console.warn('[EvidenceService] API request failed, falling back to local audit ledger state:', err);
    }

    // Filter local mock data
    return evidenceState.filter((item) => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesSearch = 
          item.id.toLowerCase().includes(query) ||
          item.title.toLowerCase().includes(query) ||
          item.hash.toLowerCase().includes(query) ||
          item.type.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      if (filters.status && filters.status !== 'ALL') {
        if (item.status !== filters.status) return false;
      }
      if (filters.type && filters.type !== 'ALL') {
        if (item.type !== filters.type) return false;
      }
      if (filters.organization && filters.organization !== 'ALL') {
        if (!item.sourceOrg.includes(filters.organization) && !item.currentCustodian.includes(filters.organization)) {
          return false;
        }
      }
      return true;
    });
  },

  async getEvidenceById(id) {
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.get(`/evidence/${id}`);
        return response.data;
      }
    } catch (err) {
      console.warn('[EvidenceService] API request failed, falling back to local audit ledger state:', err);
    }

    const found = evidenceState.find((item) => item.id.toUpperCase() === id.toUpperCase());
    if (!found) {
      throw new Error(`Evidence record ${id} not found.`);
    }
    return found;
  },

  async deleteEvidence(id) {
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.delete(`/evidence/${id}`);
        return response.data;
      }
    } catch (err) {
      console.warn('[EvidenceService] API request failed, falling back to local audit ledger state:', err);
    }

    evidenceState = evidenceState.filter((item) => item.id.toUpperCase() !== id.toUpperCase());
    return { success: true };
  },

  async createEvidence(evidencePayload, file) {
    try {
      if (!IS_MOCK_FALLBACK) {
        const formData = new FormData();
        formData.append('metadata', JSON.stringify(evidencePayload));
        
        // If no file is provided, send a dummy blob so the backend File(...) doesn't complain
        if (file) {
          formData.append('file', file);
        } else {
          formData.append('file', new Blob(['Empty Sample'], { type: 'text/plain' }), 'empty.txt');
        }

        const response = await apiClient.post('/evidence', formData);
        return response.data;
      }
    } catch (err) {
      console.warn('[EvidenceService] API request failed, falling back to local audit ledger state:', err);
    }

    const newEvidence = {
      id: evidencePayload.id || `EV-0${evidenceState.length + 10}`,
      caseId: evidencePayload.caseId || 'CASE-2026-9012',
      title: evidencePayload.title || 'Untitled Digital Evidence',
      type: evidencePayload.type || 'Disk Image',
      sourceOrg: evidencePayload.sourceOrg || 'Organization A (CERT-Alpha)',
      currentCustodian: evidencePayload.currentCustodian || 'Organization A (CERT-Alpha)',
      hash: evidencePayload.hash || '4a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b',
      expectedHash: evidencePayload.hash || '4a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b',
      hashAlgorithm: 'SHA-256',
      status: 'VERIFIED',
      fileSize: evidencePayload.fileSize || '12.4 MB',
      collector: evidencePayload.collector || 'forensics-agent@org-a.gov',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      lastEvent: 'COLLECT',
      lastEventTime: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      storageType: 'OFF-CHAIN SECURED',
      storageLocation: `vault://secure-enclave/${evidencePayload.title || 'evidence'}.raw`,
      accessControl: 'RESTRICTED / AUTHORIZED ROLES ONLY',
      blockchainStatus: 'ON-CHAIN RECORD VERIFIED',
      blockNumber: 483100 + evidenceState.length,
      txHash: '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
      signature: {
        status: 'VALID',
        signer: 'Organization A (CERT-Alpha CA)',
        algorithm: 'ECDSA / secp256k1',
        publicKeyFingerprint: 'SHA256:4b9a7c...8f12',
        signedTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        manifestId: `MNF-2026-0816-${evidenceState.length + 10}`
      },
      parentEvidenceId: evidencePayload.parentEvidenceId || null,
      isDerived: Boolean(evidencePayload.parentEvidenceId),
      derivedCount: 0,
      description: evidencePayload.description || 'Newly collected forensic artifact registered to custody ledger.'
    };

    evidenceState.unshift(newEvidence);
    return newEvidence;
  },

  // SIH DEMO SIMULATION HELPER
  toggleTamperSimulation(targetId = 'EV-001', shouldTamper = true) {
    evidenceState = evidenceState.map((ev) => {
      if (ev.id === targetId) {
        if (shouldTamper) {
          return {
            ...ev,
            status: 'COMPROMISED',
            hash: '7a21f9c82e04192b47e301293840192830192840192830192830192830192830',
            blockchainStatus: 'INTEGRITY MISMATCH DETECTED',
            signature: {
              ...ev.signature,
              status: 'INVALID_MISMATCH'
            }
          };
        } else {
          return {
            ...ev,
            status: 'VERIFIED',
            hash: ev.expectedHash,
            blockchainStatus: 'ON-CHAIN RECORD VERIFIED',
            signature: {
              ...ev.signature,
              status: 'VALID'
            }
          };
        }
      }
      return ev;
    });
    return evidenceState;
  },

  resetMockData() {
    evidenceState = [...mockEvidenceList];
  }
};

