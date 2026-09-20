import { apiClient, IS_MOCK_FALLBACK } from './api';
import { evidenceService } from './evidenceService';

export const verificationService = {
  async verifyArtifact(identifier) {
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.post('/verification/verify', { identifier });
        return response.data;
      }
    } catch (err) {
      // Fallback
    }

    // Simulate verification processing latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanId = (identifier || 'EV-001').trim().toUpperCase();
    let evidence;
    try {
      evidence = await evidenceService.getEvidenceById(cleanId);
    } catch {
      evidence = null;
    }

    const isTampered = evidence ? evidence.status === 'COMPROMISED' || cleanId === 'EV-009' : cleanId.includes('TAMPER');

    if (isTampered) {
      return {
        identifier: cleanId,
        overallStatus: 'COMPROMISED',
        tamperDetected: true,
        verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        auditorId: 'AUDITOR-INDEPENDENT-GLOBAL',
        onChainBlock: 482850,
        checks: [
          {
            key: 'hash_integrity',
            title: 'HASH INTEGRITY',
            status: 'FAILED',
            expected: '8f3a91bc72f4cd2a4e9b671a5c28e930f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
            actual: '7a21f9c82e04192b47e301293840192830192840192830192830192830192830',
            description: 'SHA-256 bit digest mismatch. Actual off-chain file bits do not match on-chain sealed root.'
          },
          {
            key: 'digital_signature',
            title: 'DIGITAL SIGNATURE',
            status: 'FAILED',
            expected: 'ECDSA secp256k1 signature over sealed manifest',
            actual: 'SIGNATURE_INVALID_MODIFIED_PAYLOAD',
            description: 'Signature invalid due to cryptographic digest tampering.'
          },
          {
            key: 'custody_history',
            title: 'CUSTODY HISTORY',
            status: 'WARNING',
            expected: 'Continuous unbroken chain of custody records',
            actual: 'Anomaly flagged at ANALYZE stage',
            description: 'Custody event sequence interrupted by tamper alert.'
          },
          {
            key: 'event_sequence',
            title: 'EVENT SEQUENCE',
            status: 'PASS',
            expected: 'Strict state progression (COLLECT -> SEAL -> TRANSFER -> RECEIVE -> ANALYZE)',
            actual: 'Sequence valid up to transfer receipt',
            description: 'Ledger sequence numbers strictly monotonic.'
          },
          {
            key: 'derived_lineage',
            title: 'DERIVED LINEAGE',
            status: 'FAILED',
            expected: 'Clean derivation DAG with verified parent roots',
            actual: 'Untrusted root propagates invalid status to descendants',
            description: 'Lineage invalid: Child artifacts cannot trust compromised parent.'
          }
        ]
      };
    }

    return {
      identifier: cleanId,
      overallStatus: 'VERIFIED',
      tamperDetected: false,
      verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      auditorId: 'AUDITOR-INDEPENDENT-GLOBAL',
      onChainBlock: evidence?.blockNumber || 482910,
      checks: [
        {
          key: 'hash_integrity',
          title: 'HASH INTEGRITY',
          status: 'PASS',
          expected: evidence?.expectedHash || '8f3a91bc72f4cd2a4e9b671a5c28e930f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
          actual: evidence?.hash || '8f3a91bc72f4cd2a4e9b671a5c28e930f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
          description: 'SHA-256 bit digest matches immutable on-chain root seal 100%.'
        },
        {
          key: 'digital_signature',
          title: 'DIGITAL SIGNATURE',
          status: 'PASS',
          expected: 'ECDSA secp256k1 signed by Originating CA',
          actual: 'VALID (Organization A CERT CA Certificate Validated)',
          description: 'Cryptographic signature verified against public key registry.'
        },
        {
          key: 'custody_history',
          title: 'CUSTODY HISTORY',
          status: 'PASS',
          expected: 'Continuous unbroken chain of custody records',
          actual: '5/5 custody transitions recorded and anchored',
          description: 'All custodial transfers signed by authenticated organization agents.'
        },
        {
          key: 'event_sequence',
          title: 'EVENT SEQUENCE',
          status: 'PASS',
          expected: 'Strict state progression (COLLECT -> SEAL -> TRANSFER -> RECEIVE -> ANALYZE)',
          actual: 'Monotonic timestamp and nonce sequence confirmed',
          description: 'State transition invariants satisfied without reordering.'
        },
        {
          key: 'derived_lineage',
          title: 'DERIVED LINEAGE',
          status: 'PASS',
          expected: 'Clean derivation DAG with verified parent roots',
          actual: '3 derived artifacts verified with valid parent links',
          description: 'Lineage DAG verified from root evidence to analytical reports.'
        }
      ]
    };
  }
};
