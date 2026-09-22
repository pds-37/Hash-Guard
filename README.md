<div align="center">
  <img src="public/cyber_evidence_logo.jpg" alt="HashGuard Cyber Evidence Exchange Logo" width="260" style="border-radius: 12px; margin-bottom: 12px;" />

  # Cyber Evidence Exchange
  ### HASHGUARD • Immutable Forensic Custody & Integrity Ledger

  **Production-Quality Platform for Cross-Organization Digital Forensic Evidence Verification**
</div>

> **Core Value Proposition**: Secure, independently verifiable cross-organization cyber-evidence exchange with tamper-evident custody history and derived-evidence lineage.

---

## 🔒 Security Architecture Highlights

1. **Off-Chain vs On-Chain Segregation**:
   - **Actual Evidence (Off-Chain)**: Sensitive malware binaries, memory dumps, PCAP captures, and disk images are stored securely in encrypted object vaults / off-chain enclaves.
   - **Audit Record (On-Chain)**: Deterministic SHA-256 bit digests, HSM-backed ECDSA digital signatures, monotonic custody timestamps, and parent-child derivation links are anchored immutably in the permissioned audit ledger.
2. **Deterministic Custody State Machine**:
   - `COLLECT` → `SEAL` → `TRANSFER` → `RECEIVE` → `ANALYZE` → `DERIVE` → `ARCHIVE`
3. **Mathematical Derivation Lineage DAG**:
   - Interactive React Flow graph demonstrating provenance from raw seized payloads to decompilations, YARA/Sigma IOC sets, and final executive reports.
4. **Independent Zero-Knowledge Verification**:
   - Dedicated auditor portal to prove bit-level integrity, signer validity, and unbroken custody history without accessing sensitive underlying raw files.
5. **Live Tamper Demonstration Mode**:
   - Live one-click toggle in topbar simulating bit-level tamper on specimen exhibits, immediately triggering `✕ INTEGRITY COMPROMISED` across the entire platform.

---

## 🚀 Quickstart Guide

### 1. Installation
```bash
cd cyber-evidence-exchange
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The application will be accessible at: `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
npm run preview
```

---

## 🧭 Implemented Routes

| Route | Page | Key Capabilities |
|---|---|---|
| `/dashboard` | **Forensic SOC Dashboard** | KPI metrics, recent evidence table, custody activity pipeline, prominent tamper alerts, and quick actions. |
| `/evidence` | **Evidence Repository** | Multi-attribute search & filters (status, organization, artifact type), SHA-256 hash copy, and evidence registration modal. |
| `/evidence/:id` | **Evidence Dossier Details** | Bit-level SHA-256 comparison, HSM ECDSA signature breakdown, off-chain isolation badge, and full vertical custody timeline. |
| `/transfers` | **Cross-Org Transfers** | Transfer queue, mTLS handshake pipeline visualizer, initiate transfer dialog, and verify-on-receipt ingestion actions. |
| `/custody` | **Global Custody Explorer** | Append-only audit explorer recording all state transitions, actor emails, signatures, and transaction roots. |
| `/lineage` | **Evidence Lineage DAG** | Interactive React Flow graph, artifact inspection drawer, child derivation modal, and 4-point cryptographic proof attestation. |
| `/verification` | **Independent Verification** | Dedicated zero-trust audit interface with 5-point verification checklist (`HASH`, `SIGNATURE`, `CUSTODY`, `SEQUENCE`, `LINEAGE`) and JSON report export. |
| `/audit` | **Audit Logs Ledger** | Filterable raw on-chain event stream with block height references and CSV export. |
| `/settings` | **System Configuration** | Organization switching, RBAC settings, and permissioned ledger consensus status. |

---

## 🔌 FastAPI Backend Integration

The frontend architecture strictly abstracts all network and data mutations inside `src/services/`.

- **Base URL Configuration**: Defined in `.env` via `VITE_API_BASE_URL=http://localhost:8000/api/v1`
- **Fallback Switch**: `VITE_ENABLE_MOCK_FALLBACK=true` allows full offline evaluation with realistic cybersecurity datasets. Setting it to `false` routes all requests directly to the FastAPI endpoints.

---

## 👥 Role Perspectives

- **Organization A (CERT-Alpha)**: Evidence Collector / Originator
- **Organization B (Cyber Defense Lab)**: Receiver / Forensic Analyst
- **Independent Auditor**: National Cyber Security Audit Board
