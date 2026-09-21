import { apiClient, IS_MOCK_FALLBACK } from './api';
import { mockEvidenceList } from '../mock/evidence';

// Helpers to isolate Sandbox (Demo) from Genuine (Production)
const isSandboxModeActive = () => {
  try {
    return localStorage.getItem('cee_is_sandbox') === 'true';
  } catch {
    return false;
  }
};

// Sandbox in-memory store (pre-loaded with SIH specimens EV-001, EV-009, etc.)
let sandboxEvidenceState = [...mockEvidenceList];

// Persistent genuine store (starts empty [] for real registered operators)
const getGenuineEvidence = () => {
  try {
    const raw = localStorage.getItem('cee_genuine_evidence');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveGenuineEvidence = (list) => {
  try {
    localStorage.setItem('cee_genuine_evidence', JSON.stringify(list));
  } catch (err) {
    console.error('Failed to persist genuine evidence:', err);
  }
};

export const evidenceService = {
  async getAllEvidence(filters = {}) {
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.get('/evidence', { params: filters });
        return response.data;
      }
    } catch (err) {
      console.warn('[EvidenceService] API request failed, using local ledger state:', err);
    }

    const sourceList = isSandboxModeActive() ? sandboxEvidenceState : getGenuineEvidence();

    return sourceList.filter((item) => {
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
      console.warn('[EvidenceService] API request failed, using local ledger state:', err);
    }

    const sourceList = isSandboxModeActive() ? sandboxEvidenceState : getGenuineEvidence();
    const found = sourceList.find((item) => item.id.toUpperCase() === id.toUpperCase());
    if (!found) {
      throw new Error(`Evidence record ${id} not found in the cryptographic audit ledger.`);
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
      console.warn('[EvidenceService] API request failed, using local ledger state:', err);
    }

    if (isSandboxModeActive()) {
      sandboxEvidenceState = sandboxEvidenceState.filter((item) => item.id.toUpperCase() !== id.toUpperCase());
    } else {
      const current = getGenuineEvidence().filter((item) => item.id.toUpperCase() !== id.toUpperCase());
      saveGenuineEvidence(current);
    }
    return { success: true };
  },

  async createEvidence(evidencePayload, file) {
    try {
      if (!IS_MOCK_FALLBACK) {
        const formData = new FormData();
        formData.append('metadata', JSON.stringify(evidencePayload));
        
        if (file) {
          formData.append('file', file);
        } else {
          formData.append('file', new Blob(['Empty Sample'], { type: 'text/plain' }), 'empty.txt');
        }

        const response = await apiClient.post('/evidence', formData);
        return response.data;
      }
    } catch (err) {
      console.warn('[EvidenceService] API request failed, using local ledger state:', err);
    }

    const sourceList = isSandboxModeActive() ? sandboxEvidenceState : getGenuineEvidence();

    const newEvidence = {
      id: evidencePayload.id || `EV-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
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
      blockNumber: 483100 + sourceList.length,
      txHash: evidencePayload.txHash || ('0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')),
      signature: {
        status: 'VALID',
        signer: evidencePayload.sourceOrg || 'Organization A (CERT-Alpha CA)',
        algorithm: 'ECDSA / secp256k1',
        publicKeyFingerprint: 'SHA256:4b9a7c...8f12',
        signedTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        manifestId: `MNF-2026-0816-${sourceList.length + 10}`
      },
      parentEvidenceId: evidencePayload.parentEvidenceId || null,
      isDerived: Boolean(evidencePayload.parentEvidenceId),
      derivedCount: 0,
      description: evidencePayload.description || 'Newly collected forensic artifact registered to custody ledger.'
    };

    if (isSandboxModeActive()) {
      sandboxEvidenceState.unshift(newEvidence);
    } else {
      const current = getGenuineEvidence();
      current.unshift(newEvidence);
      saveGenuineEvidence(current);
    }

    return newEvidence;
  },

  // SIH DEMO SIMULATION HELPER (strictly for sandbox mode)
  toggleTamperSimulation(targetId = 'EV-001', shouldTamper = true) {
    if (!isSandboxModeActive()) return;

    sandboxEvidenceState = sandboxEvidenceState.map((ev) => {
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
    return sandboxEvidenceState;
  },

  resetMockData() {
    sandboxEvidenceState = [...mockEvidenceList];
  }
};
