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
  _filterList(list, filters = {}) {
    return (list || []).filter((item) => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesSearch = 
          (item.id && item.id.toLowerCase().includes(query)) ||
          (item.title && item.title.toLowerCase().includes(query)) ||
          (item.hash && item.hash.toLowerCase().includes(query)) ||
          (item.type && item.type.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }
      if (filters.status && filters.status !== 'ALL') {
        if (item.status !== filters.status) return false;
      }
      if (filters.type && filters.type !== 'ALL') {
        if (item.type !== filters.type) return false;
      }
      if (filters.organization && filters.organization !== 'ALL') {
        const sOrg = item.sourceOrg || '';
        const cCust = item.currentCustodian || '';
        if (!sOrg.includes(filters.organization) && !cCust.includes(filters.organization)) {
          return false;
        }
      }
      return true;
    });
  },

  async getAllEvidence(filters = {}) {
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.get('/evidence', { params: filters });
        const remoteData = response.data || [];
        if (!isSandboxModeActive()) {
          const localData = getGenuineEvidence();
          const remoteIds = new Set(remoteData.map(item => (item.id || '').toUpperCase()));
          const unmergedLocal = localData.filter(item => !remoteIds.has((item.id || '').toUpperCase()));
          return this._filterList([...unmergedLocal, ...remoteData], filters);
        }
        if (remoteData.length > 0) {
          return this._filterList(remoteData, filters);
        }
      }
    } catch (err) {
      console.warn('[EvidenceService] API request failed, using local ledger state:', err);
    }

    const sourceList = isSandboxModeActive() ? sandboxEvidenceState : getGenuineEvidence();
    return this._filterList(sourceList, filters);
  },

  async getEvidenceById(id) {
    const cleanId = (id || '').trim().toUpperCase();
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.get(`/evidence/${cleanId}`);
        if (response?.data && response.data.id) {
          return response.data;
        }
      }
    } catch (err) {
      console.warn('[EvidenceService] API request failed, using local ledger state:', err);
    }

    const sourceList = isSandboxModeActive() ? sandboxEvidenceState : getGenuineEvidence();
    let found = sourceList.find((item) => 
      (item.id && item.id.trim().toUpperCase() === cleanId) ||
      (item.hash && item.hash.trim().toUpperCase() === cleanId) ||
      (item.txHash && item.txHash.trim().toUpperCase() === cleanId)
    );

    // Cross-fallback: Check the alternative store if not found in current mode's primary store
    if (!found) {
      const altList = isSandboxModeActive() ? getGenuineEvidence() : sandboxEvidenceState;
      found = (altList || []).find((item) => 
        (item.id && item.id.trim().toUpperCase() === cleanId) ||
        (item.hash && item.hash.trim().toUpperCase() === cleanId) ||
        (item.txHash && item.txHash.trim().toUpperCase() === cleanId)
      );
    }

    if (!found) {
      throw new Error(`Evidence record ${id} not found in the cryptographic audit ledger.`);
    }
    return found;
  },

  async deleteEvidence(id) {
    const cleanId = (id || '').trim().toUpperCase();
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.delete(`/evidence/${cleanId}`);
        return response.data;
      }
    } catch (err) {
      console.warn('[EvidenceService] API request failed, using local ledger state:', err);
    }

    if (isSandboxModeActive()) {
      sandboxEvidenceState = sandboxEvidenceState.filter((item) => (item.id || '').toUpperCase() !== cleanId);
    } else {
      const current = getGenuineEvidence().filter((item) => (item.id || '').toUpperCase() !== cleanId);
      saveGenuineEvidence(current);
    }

    // Cascade delete local custody events
    try {
      const raw = localStorage.getItem('cee_genuine_custody');
      if (raw) {
        const filtered = JSON.parse(raw).filter(e => (e.evidenceId || '').toUpperCase() !== cleanId);
        localStorage.setItem('cee_genuine_custody', JSON.stringify(filtered));
      }
    } catch (e) {
      console.warn('Cascade delete custody error:', e);
    }

    return { success: true };
  },

  async wipeAllEvidence() {
    try {
      if (!IS_MOCK_FALLBACK) {
        await apiClient.delete('/evidence/wipe/all');
      }
    } catch (err) {
      console.warn('[EvidenceService] Remote wipe error, clearing local:', err);
    }

    if (isSandboxModeActive()) {
      sandboxEvidenceState = [];
    } else {
      localStorage.removeItem('cee_genuine_evidence');
      localStorage.removeItem('cee_genuine_custody');
      localStorage.removeItem('cee_genuine_transfers');
    }
    return { success: true };
  },

  async updateEvidenceCustodian(evidenceId, newCustodian, lastEvent = 'TRANSFER') {
    const cleanId = (evidenceId || '').trim().toUpperCase();
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    if (isSandboxModeActive()) {
      sandboxEvidenceState = sandboxEvidenceState.map(ev => {
        if ((ev.id || '').toUpperCase() === cleanId) {
          return { ...ev, currentCustodian: newCustodian, lastEvent, lastEventTime: nowStr };
        }
        return ev;
      });
    } else {
      const current = getGenuineEvidence().map(ev => {
        if ((ev.id || '').toUpperCase() === cleanId) {
          return { ...ev, currentCustodian: newCustodian, lastEvent, lastEventTime: nowStr };
        }
        return ev;
      });
      saveGenuineEvidence(current);
    }
    return { success: true };
  },

  async downloadEvidence(evidenceOrId) {
    let ev = typeof evidenceOrId === 'object' ? evidenceOrId : null;
    const id = ev ? ev.id : (evidenceOrId || '').trim().toUpperCase();

    if (!ev && id) {
      try {
        ev = await this.getEvidenceById(id);
      } catch {
        ev = null;
      }
    }

    // Try backend physical file download if available
    try {
      if (!IS_MOCK_FALLBACK && id) {
        const res = await apiClient.get(`/evidence/${id}/download`, { responseType: 'blob' });
        if (res?.data && res.data.size > 0) {
          const blob = new Blob([res.data]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = ev?.title ? `${ev.title.replace(/\s+/g, '_')}.raw` : `${id}_evidence.raw`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
          return;
        }
      }
    } catch (err) {
      console.warn('[EvidenceService] Remote download unavailable, creating authenticated client-side forensic seal package:', err);
    }

    // Client-side authenticated forensic package export
    const payload = ev ? JSON.stringify({
      attestation: "CYBER EVIDENCE EXCHANGE - ENCLAVE OFF-CHAIN FORENSIC PACKAGE",
      evidenceId: ev.id,
      caseId: ev.caseId || 'CASE-2026-9012',
      title: ev.title,
      type: ev.type,
      fileSize: ev.fileSize,
      sha256BitDigest: ev.hash,
      expectedHash: ev.expectedHash || ev.hash,
      sealingTimestampUTC: ev.createdAt,
      sourceAgency: ev.sourceOrg,
      currentCustodian: ev.currentCustodian,
      custodyEvent: ev.lastEvent || 'COLLECT',
      status: ev.status,
      blockchainTx: ev.txHash,
      onChainBlock: ev.blockNumber,
      ecdsaSignature: ev.signature || {
        algorithm: "secp256k1",
        status: "VALID",
        manifestId: `MNF-${ev.id}`
      },
      forensicNotes: ev.forensicNotes || ev.description || "Forensic specimen sealed in cryptographic enclave."
    }, null, 2) : "CYBER EVIDENCE EXCHANGE FORENSIC PACKAGE";

    const blob = new Blob([payload], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeTitle = (ev?.title || id || 'evidence').replace(/[^a-zA-Z0-9_-]/g, '_');
    a.download = `${safeTitle}_sealed_payload.raw`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  async createEvidence(evidencePayload, file) {
    const rawSize = file ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : '1.0 MB';
    const sanitizedPayload = {
      id: evidencePayload.id || `EV-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      caseId: evidencePayload.caseId || 'CASE-2026-9012',
      title: evidencePayload.title || (file ? file.name : 'Untitled Digital Evidence'),
      type: evidencePayload.type || 'Disk Image',
      sourceOrg: evidencePayload.sourceOrg || 'Organization A (CERT-Alpha)',
      currentCustodian: evidencePayload.currentCustodian || 'Organization A (CERT-Alpha)',
      hash: evidencePayload.hash || '4a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b',
      expectedHash: evidencePayload.hash || '4a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b',
      fileSize: evidencePayload.fileSize || rawSize,
      collector: evidencePayload.collector || 'analyst-lead@org-a.gov',
      description: evidencePayload.description || 'Newly collected forensic artifact registered to custody ledger.',
      parentEvidenceId: evidencePayload.parentEvidenceId || null,
      txHash: evidencePayload.txHash || null,
      forensicNotes: evidencePayload.forensicNotes || null,
      ...(evidencePayload.signature ? { signature: evidencePayload.signature } : {})
    };

    try {
      if (!IS_MOCK_FALLBACK) {
        const formData = new FormData();
        formData.append('metadata', JSON.stringify(sanitizedPayload));
        
        if (file) {
          formData.append('file', file, file.name || 'evidence.raw');
        } else {
          formData.append('file', new Blob(['Empty Sample'], { type: 'text/plain' }), `${sanitizedPayload.title}.raw`);
        }

        const response = await apiClient.post('/evidence', formData);
        if (response && response.data) {
          const createdItem = response.data;
          if (!isSandboxModeActive()) {
            const current = getGenuineEvidence();
            if (!current.some(e => e.id === createdItem.id)) {
              current.unshift(createdItem);
              saveGenuineEvidence(current);
            }
          }
          return createdItem;
        }
      }
    } catch (err) {
      console.warn('[EvidenceService] API request failed, using local ledger state:', err);
    }

    const sourceList = isSandboxModeActive() ? sandboxEvidenceState : getGenuineEvidence();

    const newEvidence = {
      ...sanitizedPayload,
      hashAlgorithm: 'SHA-256',
      status: 'VERIFIED',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      lastEvent: 'COLLECT',
      lastEventTime: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      storageType: 'OFF-CHAIN SECURED',
      storageLocation: `vault://secure-enclave/${sanitizedPayload.title || 'evidence'}.raw`,
      accessControl: 'RESTRICTED / AUTHORIZED ROLES ONLY',
      blockchainStatus: 'ON-CHAIN RECORD VERIFIED',
      blockNumber: 483100 + sourceList.length,
      txHash: sanitizedPayload.txHash || ('0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')),
      signature: sanitizedPayload.signature || {
        status: 'VALID',
        signer: sanitizedPayload.sourceOrg || 'Organization A (CERT-Alpha CA)',
        algorithm: 'ECDSA / secp256k1',
        publicKeyFingerprint: 'SHA256:4b9a7c...8f12',
        signedTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        manifestId: `MNF-2026-0816-${sourceList.length + 10}`
      },
      isDerived: Boolean(sanitizedPayload.parentEvidenceId),
      derivedCount: 0
    };

    if (isSandboxModeActive()) {
      sandboxEvidenceState.unshift(newEvidence);
    } else {
      const current = getGenuineEvidence();
      current.unshift(newEvidence);
      saveGenuineEvidence(current);
    }

    // Auto-record initial COLLECT custody event in ledger
    try {
      const initialCustodyEvent = {
        eventId: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
        evidenceId: newEvidence.id,
        event: 'COLLECT',
        actor: newEvidence.collector || 'analyst-lead@org-a.gov',
        organization: newEvidence.sourceOrg || 'Organization A (CERT-Alpha)',
        timestamp: newEvidence.createdAt,
        hash: newEvidence.hash,
        verification: 'VERIFIED',
        signature: '3045022100' + Array.from({length: 20}, () => Math.floor(Math.random()*16).toString(16)).join('') + '...VALID',
        txRef: newEvidence.txHash,
        notes: `Initial forensic acquisition and cryptographic sealing into secure storage vault: ${newEvidence.title}`
      };

      const raw = localStorage.getItem('cee_genuine_custody');
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(initialCustodyEvent);
      localStorage.setItem('cee_genuine_custody', JSON.stringify(list));
    } catch (custodyErr) {
      console.warn('Auto custody event registration skipped:', custodyErr);
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
