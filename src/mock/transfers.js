export const mockTransfers = [
  {
    id: "TR-001",
    evidenceId: "EV-001",
    evidenceTitle: "LockBit 3.0 Ransomware Encryptor Payload",
    evidenceType: "Malware Binary",
    fromOrg: "Organization A (CERT-Alpha)",
    fromActor: "ops-transport@org-a.gov",
    toOrg: "Organization B (Cyber Lab)",
    toActor: "analyst@org-b.lab",
    status: "VERIFIED",
    transferProtocol: "mTLS Encrypted Transport + Signed Manifest",
    manifestHash: "8f3a91bc72f4cd2a4e9b671a5c28e930f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
    initiatedAt: "2026-08-16 09:15:30 UTC",
    completedAt: "2026-08-16 10:42:17 UTC",
    blockchainTx: "0x3e18a94c05f2b7d81a94b2e619c054f281e7d9a3b04c81f2e5a6d7c8b9a0e1f2",
    steps: [
      { step: "MANIFEST_SIGN", org: "Organization A", timestamp: "09:15:30", status: "COMPLETED" },
      { step: "SECURE_DISPATCH", org: "Organization A", timestamp: "09:20:10", status: "COMPLETED" },
      { step: "PAYLOAD_RECEIVE", org: "Organization B", timestamp: "10:40:02", status: "COMPLETED" },
      { step: "INTEGRITY_VERIFY", org: "Organization B", timestamp: "10:42:17", status: "COMPLETED" }
    ],
    notes: "Urgent forensic request from CERT-Alpha for reverse engineering decompilation."
  },
  {
    id: "TR-002",
    evidenceId: "EV-002",
    evidenceTitle: "CobaltStrike C2 Traffic Capture (pcapng)",
    evidenceType: "Network Capture",
    fromOrg: "Organization A (CERT-Alpha)",
    fromActor: "soc-sensor-04@org-a.gov",
    toOrg: "Organization B (Cyber Lab)",
    toActor: "analyst@org-b.lab",
    status: "VERIFIED",
    transferProtocol: "mTLS Encrypted Transport + Signed Manifest",
    manifestHash: "91bd3e81a4b98c37d0421e5f88410291ba4c9d0e1f2a3b4c5d6e7f8a9b0c1d2e",
    initiatedAt: "2026-08-16 09:30:00 UTC",
    completedAt: "2026-08-16 10:55:20 UTC",
    blockchainTx: "0x12a4b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7",
    steps: [
      { step: "MANIFEST_SIGN", org: "Organization A", timestamp: "09:30:00", status: "COMPLETED" },
      { step: "SECURE_DISPATCH", org: "Organization A", timestamp: "09:35:12", status: "COMPLETED" },
      { step: "PAYLOAD_RECEIVE", org: "Organization B", timestamp: "10:50:00", status: "COMPLETED" },
      { step: "INTEGRITY_VERIFY", org: "Organization B", timestamp: "10:55:20", status: "COMPLETED" }
    ],
    notes: "Correlated network dump for timeline synchronization."
  },
  {
    id: "TR-003",
    evidenceId: "EV-003",
    evidenceTitle: "Domain Controller Host Memory Acquisition",
    evidenceType: "Memory Dump",
    fromOrg: "Organization C (FinSec Ops)",
    fromActor: "incident-resp@org-c.bank",
    toOrg: "Organization B (Cyber Lab)",
    toActor: "analyst-lead@org-b.lab",
    status: "TRANSFERRING",
    transferProtocol: "Encrypted Dedicated Tunnel + S3 Chunking",
    manifestHash: "73af9284cb9183472091ea284918230491820491820394810293840192830192",
    initiatedAt: "2026-08-16 11:30:40 UTC",
    completedAt: null,
    blockchainTx: "0x8924b1029e847c5d6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f",
    steps: [
      { step: "MANIFEST_SIGN", org: "Organization C", timestamp: "11:30:40", status: "COMPLETED" },
      { step: "SECURE_DISPATCH", org: "Organization C", timestamp: "11:32:00", status: "IN_PROGRESS" },
      { step: "PAYLOAD_RECEIVE", org: "Organization B", timestamp: null, status: "PENDING" },
      { step: "INTEGRITY_VERIFY", org: "Organization B", timestamp: null, status: "PENDING" }
    ],
    notes: "Large 32GB memory capture stream. 68% synchronized off-chain."
  },
  {
    id: "TR-004",
    evidenceId: "EV-004",
    evidenceTitle: "Endpoint WS-104 BitLocker Encrypted Disk Image",
    evidenceType: "Disk Image",
    fromOrg: "Organization A (CERT-Alpha)",
    fromActor: "forensics-unit@org-a.gov",
    toOrg: "Organization B (Cyber Lab)",
    toActor: "analyst@org-b.lab",
    status: "REQUESTED",
    transferProtocol: "Hardware Escrow Courier + Pre-signed Manifest",
    manifestHash: "e4d9b231804f9812736184910283019283019284019283019283019283019283",
    initiatedAt: "2026-08-16 12:10:00 UTC",
    completedAt: null,
    blockchainTx: "0x9812736184910283019283019284019283019283019283019283019283019283",
    steps: [
      { step: "MANIFEST_SIGN", org: "Organization A", timestamp: "12:10:00", status: "COMPLETED" },
      { step: "SECURE_DISPATCH", org: "Organization A", timestamp: null, status: "PENDING" },
      { step: "PAYLOAD_RECEIVE", org: "Organization B", timestamp: null, status: "PENDING" },
      { step: "INTEGRITY_VERIFY", org: "Organization B", timestamp: null, status: "PENDING" }
    ],
    notes: "Awaiting receiver organization cryptographic authorization approval."
  },
  {
    id: "TR-009",
    evidenceId: "EV-009",
    evidenceTitle: "Suspicious Ransomware Artifact",
    evidenceType: "Malware Binary",
    fromOrg: "Organization C (FinSec Ops)",
    fromActor: "analyst-temp@org-c.bank",
    toOrg: "Organization B (Cyber Lab)",
    toActor: "qa-auditor@org-b.lab",
    status: "FAILED",
    transferProtocol: "Direct Vault Pull",
    manifestHash: "8f3a91bc72f4cd2a4e9b671a5c28e930f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
    initiatedAt: "2026-08-16 09:35:00 UTC",
    completedAt: "2026-08-16 09:40:11 UTC",
    blockchainTx: "0x9918230491820491820394810293840192830192830192840192830192830192",
    steps: [
      { step: "MANIFEST_SIGN", org: "Organization C", timestamp: "09:35:00", status: "COMPLETED" },
      { step: "SECURE_DISPATCH", org: "Organization C", timestamp: "09:37:00", status: "COMPLETED" },
      { step: "PAYLOAD_RECEIVE", org: "Organization B", timestamp: "09:39:10", status: "COMPLETED" },
      { step: "INTEGRITY_VERIFY", org: "Organization B", timestamp: "09:40:11", status: "FAILED" }
    ],
    notes: "TRANSFER REJECTED: Hash verification failed upon receipt. Off-chain payload compromised."
  }
];
