import React, { createContext, useContext, useState, useEffect } from 'react';
import { evidenceService } from '../services/evidenceService';

const AppContext = createContext();

// ==========================================
// 1. PARTICIPATING ORGANIZATIONS (WHERE THE USER BELONGS)
// ==========================================
export const ORGANIZATIONS = {
  ORG_A: {
    id: 'ORG_A',
    code: 'ORG_A',
    name: 'Organization A — CERT-Alpha',
    shortName: 'CERT-Alpha',
    function: 'First Responder / incident intake',
    description: 'Initial seizure, SHA-256 bitstream acquisition, HSM signing, and mTLS dispatch.',
    defaultRoleId: 'FIRST_RESPONDER',
    did: 'did:ethr:0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    walletAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
  },
  ORG_B: {
    id: 'ORG_B',
    code: 'ORG_B',
    name: 'Organization B — Cyber Defense Lab',
    shortName: 'Cyber Defense Lab',
    function: 'Digital forensics / investigation',
    description: 'Dynamic sandbox analysis, artifact derivation, hash verification, reverse engineering.',
    defaultRoleId: 'FORENSIC_ANALYST',
    did: 'did:ethr:0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    walletAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
  },
  ORG_C: {
    id: 'ORG_C',
    code: 'ORG_C',
    name: 'Organization C — Judicial Court Registry',
    shortName: 'Judicial Court Registry',
    function: 'Legal / court evidence handling',
    description: 'Court exhibit vault custody, Section 65B forensic certificate admissibility, legal hold governance.',
    defaultRoleId: 'EVIDENCE_CUSTODIAN',
    did: 'did:ethr:0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    walletAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
  },
  ORG_D: {
    id: 'ORG_D',
    code: 'ORG_D',
    name: 'Organization D — Cyber Crime Police (LEA)',
    shortName: 'Cyber Crime Police',
    function: 'Law-enforcement investigation',
    description: 'Physical device raid seizure, FIR crime scene exhibit logging, cross-agency transfer authorization.',
    defaultRoleId: 'INVESTIGATOR',
    did: 'did:ethr:0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    walletAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
  },
  ORG_AUDIT: {
    id: 'ORG_AUDIT',
    code: 'ORG_AUDIT',
    name: 'Audit Board — Independent Oversight',
    shortName: 'Audit Board',
    function: 'Independent auditing / oversight',
    description: 'Independent zero-trust oversight of custody chains, hash verification roots, retention actions, and audit ledgers.',
    defaultRoleId: 'AUDITOR',
    did: 'did:ethr:0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    walletAddress: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
  }
};

// ==========================================
// 2. RBAC ROLES (WHAT THE USER IS ALLOWED TO DO)
// ==========================================
export const RBAC_ROLES = {
  FIRST_RESPONDER: {
    id: 'FIRST_RESPONDER',
    name: 'First Responder',
    roleName: 'First Responder',
    description: 'Initial evidence intake, bitstream acquisition, SHA-256 hash sealing, and transfer dispatch.',
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    allowedPages: ['dashboard', 'evidence', 'evidence-details', 'transfers', 'custody', 'lineage', 'verification', 'audit', 'settings'],
    actions: ['Collect Evidence', 'Generate SHA-256 Hash', 'Seal Evidence Manifest', 'Initiate Secure Transfer'],
    permissions: {
      canCollectEvidence: true,
      canGenerateHash: true,
      canSealEvidence: true,
      canTransferEvidence: true,
      canModifyEvidence: false,
      canDeleteEvidence: false,
      canManageRetention: false,
      canApplyLegalHold: false,
      canReleaseLegalHold: false,
      isAdministrator: false,
      isAuditor: false
    }
  },
  FORENSIC_ANALYST: {
    id: 'FORENSIC_ANALYST',
    name: 'Forensic Analyst',
    roleName: 'Forensic Analyst',
    description: 'Air-gapped sandboxing, reverse engineering, derived forensic artifact generation, and integrity verification.',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    allowedPages: ['dashboard', 'evidence', 'evidence-details', 'transfers', 'custody', 'lineage', 'verification', 'audit', 'settings'],
    actions: ['View Evidence', 'Verify Hash Integrity', 'Analyze Evidence in Sandbox', 'Create Derived Artifact'],
    permissions: {
      canCollectEvidence: false,
      canGenerateHash: true,
      canSealEvidence: false,
      canTransferEvidence: true,
      canModifyEvidence: false,
      canDeleteEvidence: false,
      canManageRetention: false,
      canApplyLegalHold: false,
      canReleaseLegalHold: false,
      isAdministrator: false,
      isAuditor: false
    }
  },
  EVIDENCE_CUSTODIAN: {
    id: 'EVIDENCE_CUSTODIAN',
    name: 'Evidence Custodian',
    roleName: 'Evidence Custodian',
    description: 'Court exhibit vault custody, transfer consensus, legal hold preservation orders, and Section 65B certificates.',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    allowedPages: ['dashboard', 'evidence', 'evidence-details', 'transfers', 'custody', 'lineage', 'verification', 'audit', 'retention', 'settings'],
    actions: ['Admit Court Exhibit', 'Accept Custody', 'Apply Legal Hold', 'Release Legal Hold', 'Inspect Lineage Tree'],
    permissions: {
      canCollectEvidence: false,
      canGenerateHash: true,
      canSealEvidence: true,
      canTransferEvidence: true,
      canModifyEvidence: false,
      canDeleteEvidence: false,
      canManageRetention: true,
      canApplyLegalHold: true,
      canReleaseLegalHold: true,
      isAdministrator: false,
      isAuditor: false
    }
  },
  INVESTIGATOR: {
    id: 'INVESTIGATOR',
    name: 'Investigator',
    roleName: 'Investigator',
    description: 'Crime scene device raid seizure, FIR evidence logging, legal hold preservation requests, case dispatch.',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    allowedPages: ['dashboard', 'evidence', 'evidence-details', 'transfers', 'custody', 'lineage', 'verification', 'audit', 'retention', 'settings'],
    actions: ['Seize Crime Scene Device', 'Register FIR Exhibit', 'Request Legal Hold', 'Track Custody Chain'],
    permissions: {
      canCollectEvidence: true,
      canGenerateHash: true,
      canSealEvidence: true,
      canTransferEvidence: true,
      canModifyEvidence: false,
      canDeleteEvidence: false,
      canManageRetention: false,
      canApplyLegalHold: true,
      canReleaseLegalHold: false,
      isAdministrator: false,
      isAuditor: false
    }
  },
  AUDITOR: {
    id: 'AUDITOR',
    name: 'Auditor',
    roleName: 'Auditor',
    description: 'Zero-trust cryptographic verification of hashes, custody proofs, retention status, and audit ledgers without admin privileges.',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    allowedPages: ['dashboard', 'evidence', 'evidence-details', 'verification', 'lineage', 'custody', 'audit', 'retention', 'settings'],
    actions: ['Verify Hash Integrity', 'Inspect Chain of Custody', 'Verify Retention & Legal Hold', 'Export Attestation'],
    permissions: {
      canCollectEvidence: false,
      canGenerateHash: true,
      canSealEvidence: false,
      canTransferEvidence: false,
      canModifyEvidence: false,
      canDeleteEvidence: false,
      canManageRetention: false,
      canApplyLegalHold: false,
      canReleaseLegalHold: false,
      isAdministrator: false,
      isAuditor: true
    }
  },
  ADMINISTRATOR: {
    id: 'ADMINISTRATOR',
    name: 'Organization Administrator',
    roleName: 'Organization Administrator',
    description: 'Full governance authority: defines retention policies, assigns RBAC roles, manages organization users, and configures platform settings.',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    allowedPages: ['dashboard', 'evidence', 'evidence-details', 'transfers', 'custody', 'lineage', 'verification', 'audit', 'retention', 'settings'],
    actions: ['Manage Users & Roles', 'Define Retention Policies', 'Assign RBAC Roles', 'Delete Evidence (Unprotected)', 'Organization Configuration'],
    permissions: {
      canCollectEvidence: true,
      canGenerateHash: true,
      canSealEvidence: true,
      canTransferEvidence: true,
      canModifyEvidence: false,
      canDeleteEvidence: true,
      canManageRetention: true,
      canApplyLegalHold: true,
      canReleaseLegalHold: true,
      isAdministrator: true,
      isAuditor: false
    }
  }
};

// Backward-compatible alias for existing code
export const ROLES = {
  ...RBAC_ROLES,
  ADMIN: RBAC_ROLES.ADMINISTRATOR,
  MANAGER: RBAC_ROLES.EVIDENCE_CUSTODIAN,
  USER: RBAC_ROLES.FIRST_RESPONDER,
  // Org mapping aliases
  ORG_A: ORGANIZATIONS.ORG_A,
  ORG_B: ORGANIZATIONS.ORG_B,
  ORG_C: ORGANIZATIONS.ORG_C,
  ORG_D: ORGANIZATIONS.ORG_D,
  AUDIT_BOARD: ORGANIZATIONS.ORG_AUDIT
};

const DEFAULT_IDENTITIES = [
  {
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    didURI: 'did:ethr:0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    name: 'Organization A (CERT-Alpha)',
    orgCode: 'ORG_A',
    role: 'FIRST_RESPONDER',
    didDocumentHash: '0xa4b19c23945ef13a89bc4123547890123456789abcdef0123456789abcdef012',
    registeredAt: '2026-03-01 09:00:00 UTC',
    status: 'ACTIVE'
  },
  {
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    didURI: 'did:ethr:0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    name: 'Organization B (Cyber Defense Lab)',
    orgCode: 'ORG_B',
    role: 'FORENSIC_ANALYST',
    didDocumentHash: '0x7b629ef1945ef13a89bc4123547890123456789abcdef0123456789abcdef013',
    registeredAt: '2026-03-02 11:30:00 UTC',
    status: 'ACTIVE'
  },
  {
    address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    didURI: 'did:ethr:0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    name: 'Organization C (Judicial Court Registry)',
    orgCode: 'ORG_C',
    role: 'EVIDENCE_CUSTODIAN',
    didDocumentHash: '0x9c314de1945ef13a89bc4123547890123456789abcdef0123456789abcdef014',
    registeredAt: '2026-03-05 14:15:00 UTC',
    status: 'ACTIVE'
  },
  {
    address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    didURI: 'did:ethr:0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    name: 'Organization D (Cyber Crime Police LEA)',
    orgCode: 'ORG_D',
    role: 'INVESTIGATOR',
    didDocumentHash: '0x12f45ea1945ef13a89bc4123547890123456789abcdef0123456789abcdef015',
    registeredAt: '2026-03-10 16:40:00 UTC',
    status: 'ACTIVE'
  },
  {
    address: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    didURI: 'did:ethr:0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    name: 'Audit Board (Independent Oversight)',
    orgCode: 'ORG_AUDIT',
    role: 'AUDITOR',
    didDocumentHash: '0x33e891c2945ef13a89bc4123547890123456789abcdef0123456789abcdef016',
    registeredAt: '2026-03-12 10:00:00 UTC',
    status: 'ACTIVE'
  }
];

export const DEFAULT_ORG_USERS = [
  // Organization B — Cyber Defense Lab
  {
    id: 'USR-B-01',
    email: 'admin@cyberlab.local',
    name: 'Dr. Sarah Chen',
    orgId: 'ORG_B',
    role: 'ADMINISTRATOR',
    status: 'ACTIVE',
    did: 'did:ethr:0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
  },
  {
    id: 'USR-B-02',
    email: 'analyst@cyberlab.local',
    name: 'Lead Forensic Analyst',
    orgId: 'ORG_B',
    role: 'FORENSIC_ANALYST',
    status: 'ACTIVE',
    did: 'did:ethr:0x70997970C51812dc3A010C7d01b50e0d17dc79B1'
  },
  {
    id: 'USR-B-03',
    email: 'audit@cyberlab.local',
    name: 'Forensic Compliance Auditor',
    orgId: 'ORG_B',
    role: 'AUDITOR',
    status: 'ACTIVE',
    did: 'did:ethr:0x70997970C51812dc3A010C7d01b50e0d17dc79A2'
  },
  {
    id: 'USR-B-04',
    email: 'custody@cyberlab.local',
    name: 'Senior Evidence Custodian',
    orgId: 'ORG_B',
    role: 'EVIDENCE_CUSTODIAN',
    status: 'ACTIVE',
    did: 'did:ethr:0x70997970C51812dc3A010C7d01b50e0d17dc79C3'
  },
  {
    id: 'USR-B-05',
    email: 'investigator@cyberlab.local',
    name: 'Lead Case Investigator',
    orgId: 'ORG_B',
    role: 'INVESTIGATOR',
    status: 'ACTIVE',
    did: 'did:ethr:0x70997970C51812dc3A010C7d01b50e0d17dc79D4'
  },

  // Organization A — CERT-Alpha
  {
    id: 'USR-A-01',
    email: 'admin@cert-alpha.gov',
    name: 'Cmdr. Rajesh Kumar',
    orgId: 'ORG_A',
    role: 'ADMINISTRATOR',
    status: 'ACTIVE',
    did: 'did:ethr:0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  },
  {
    id: 'USR-A-02',
    email: 'responder@cert-alpha.gov',
    name: 'First Response Officer',
    orgId: 'ORG_A',
    role: 'FIRST_RESPONDER',
    status: 'ACTIVE',
    did: 'did:ethr:0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92267'
  },
  {
    id: 'USR-A-03',
    email: 'audit@cert-alpha.gov',
    name: 'CERT Oversight Auditor',
    orgId: 'ORG_A',
    role: 'AUDITOR',
    status: 'ACTIVE',
    did: 'did:ethr:0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92268'
  },

  // Organization C — Judicial Court Registry
  {
    id: 'USR-C-01',
    email: 'admin@court-registry.gov',
    name: 'Hon. Registrar Joshi',
    orgId: 'ORG_C',
    role: 'ADMINISTRATOR',
    status: 'ACTIVE',
    did: 'did:ethr:0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
  },
  {
    id: 'USR-C-02',
    email: 'custodian@court-registry.gov',
    name: 'Court Vault Custodian',
    orgId: 'ORG_C',
    role: 'EVIDENCE_CUSTODIAN',
    status: 'ACTIVE',
    did: 'did:ethr:0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BD'
  },
  {
    id: 'USR-C-03',
    email: 'audit@court-registry.gov',
    name: 'Judicial Process Auditor',
    orgId: 'ORG_C',
    role: 'AUDITOR',
    status: 'ACTIVE',
    did: 'did:ethr:0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BE'
  },

  // Organization D — Cyber Crime Police (LEA)
  {
    id: 'USR-D-01',
    email: 'admin@police.gov.in',
    name: 'ACP Devendra Singhania',
    orgId: 'ORG_D',
    role: 'ADMINISTRATOR',
    status: 'ACTIVE',
    did: 'did:ethr:0x90F79bf6EB2c4f870365E785982E1f101E93b906'
  },
  {
    id: 'USR-D-02',
    email: 'investigator@police.gov.in',
    name: 'Insp. Neha Deshmukh',
    orgId: 'ORG_D',
    role: 'INVESTIGATOR',
    status: 'ACTIVE',
    did: 'did:ethr:0x90F79bf6EB2c4f870365E785982E1f101E93b907'
  },
  {
    id: 'USR-D-03',
    email: 'audit@police.gov.in',
    name: 'LEA Vigilance Auditor',
    orgId: 'ORG_D',
    role: 'AUDITOR',
    status: 'ACTIVE',
    did: 'did:ethr:0x90F79bf6EB2c4f870365E785982E1f101E93b908'
  },

  // Audit Board — Independent Oversight
  {
    id: 'USR-AUD-01',
    email: 'admin@auditboard.gov',
    name: 'Chief Director Thorne',
    orgId: 'ORG_AUDIT',
    role: 'ADMINISTRATOR',
    status: 'ACTIVE',
    did: 'did:ethr:0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65'
  },
  {
    id: 'USR-AUD-02',
    email: 'auditor@auditboard.gov',
    name: 'Lead Independent Auditor',
    orgId: 'ORG_AUDIT',
    role: 'AUDITOR',
    status: 'ACTIVE',
    did: 'did:ethr:0x15d34AAf54267DB7D7c367839AAf71A00a2C6A66'
  },
  {
    id: 'USR-AUD-03',
    email: 'investigator@auditboard.gov',
    name: 'Triage Oversight Officer',
    orgId: 'ORG_AUDIT',
    role: 'INVESTIGATOR',
    status: 'ACTIVE',
    did: 'did:ethr:0x15d34AAf54267DB7D7c367839AAf71A00a2C6A67'
  }
];

export const AppProvider = ({ children }) => {
  // Organizations state (built-in + user-registered custom organizations)
  const [organizations, setOrganizations] = useState(() => {
    const saved = localStorage.getItem('cee_custom_organizations');
    if (saved) {
      try {
        return { ...ORGANIZATIONS, ...JSON.parse(saved) };
      } catch (e) {
        return ORGANIZATIONS;
      }
    }
    return ORGANIZATIONS;
  });

  // Separate Organization (WHERE) and Role (WHAT)
  const [currentOrg, setCurrentOrg] = useState(() => {
    const saved = localStorage.getItem('cee_current_org');
    return (saved && ORGANIZATIONS[saved]) ? ORGANIZATIONS[saved] : ORGANIZATIONS.ORG_B;
  });

  const [currentRole, setCurrentRole] = useState(() => {
    const saved = localStorage.getItem('cee_current_role');
    return (saved && RBAC_ROLES[saved]) ? RBAC_ROLES[saved] : RBAC_ROLES.FORENSIC_ANALYST;
  });

  const [walletAddress, setWalletAddress] = useState('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
  const [did, setDid] = useState('did:ethr:0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
  const [isTamperSimulated, setIsTamperSimulated] = useState(false);
  const [isSandboxMode, setIsSandboxMode] = useState(() => localStorage.getItem('cee_is_sandbox') === 'true');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Registered DIDs list in state
  const [registeredIdentities, setRegisteredIdentities] = useState(() => {
    const saved = localStorage.getItem('cee_registered_identities');
    return saved ? JSON.parse(saved) : DEFAULT_IDENTITIES;
  });

  // Organization Users state (persisted per tenant)
  const [orgUsers, setOrgUsers] = useState(() => {
    const saved = localStorage.getItem('cee_org_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_ORG_USERS;
      }
    }
    return DEFAULT_ORG_USERS;
  });

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-did',
      title: 'Decentralized Identity Active',
      desc: 'DID: did:ethr:0x7099...79C8 authenticated via secp256k1 proof',
      time: '2m ago',
      type: 'info'
    },
    {
      id: 'notif-1',
      title: 'Custody Event Recorded',
      desc: 'Derived report RPT-2026-0816-01 anchored to block #482975',
      time: '12m ago',
      type: 'info'
    },
    {
      id: 'notif-2',
      title: 'Transfer TR-001 Completed',
      desc: 'LockBit payload hash verified on receipt by Org B',
      time: '45m ago',
      type: 'success'
    }
  ]);

  // Keep wallet address synced with currentOrg initially
  useEffect(() => {
    if (currentOrg) {
      setWalletAddress(currentOrg.walletAddress);
      setDid(currentOrg.did);
    }
  }, [currentOrg]);

  // Switch Active Organization Context (WHERE the user belongs / tenant scope)
  // Changing organization does NOT arbitrarily change the user's role unless explicitly requested
  const switchOrg = (orgKey, explicitRoleId = null) => {
    let targetOrg = organizations[orgKey] || ORGANIZATIONS[orgKey];
    if (!targetOrg) {
      const match = Object.values(organizations || {}).find(
        (o) => o.id?.toUpperCase() === orgKey?.toUpperCase() || o.code?.toUpperCase() === orgKey?.toUpperCase()
      );
      if (match) targetOrg = match;
    }

    if (targetOrg) {
      setCurrentOrg(targetOrg);
      localStorage.setItem('cee_current_org', targetOrg.id);
      setWalletAddress(targetOrg.walletAddress);
      setDid(targetOrg.did);

      if (explicitRoleId && RBAC_ROLES[explicitRoleId]) {
        setCurrentRole(RBAC_ROLES[explicitRoleId]);
        localStorage.setItem('cee_current_role', explicitRoleId);
      }

      setNotifications((prev) => [
        {
          id: `org-switch-${Date.now()}`,
          title: 'Organization Switched',
          desc: `Active Node: ${targetOrg.name} (${targetOrg.code})`,
          time: 'Just now',
          type: 'info'
        },
        ...prev
      ]);

      triggerRefresh();
    }
  };

  // Register New Organization Enclave
  const registerOrganization = ({ name, type, orgId, did: initialDid, adminEmail, adminName }) => {
    const safeOrgId = (orgId || `ORG_${Date.now().toString().slice(-4)}`).toUpperCase();
    const newOrg = {
      id: safeOrgId,
      code: safeOrgId,
      name: name.trim(),
      shortName: name.trim().length > 25 ? name.trim().substring(0, 22) + '...' : name.trim(),
      function: type || 'Forensic / Cyber Evidence Node',
      description: `Registered organization: ${name.trim()} (${type})`,
      defaultRoleId: 'ADMINISTRATOR',
      did: initialDid || `did:ethr:0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      walletAddress: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
    };

    setOrganizations((prev) => {
      const updated = { ...prev, [safeOrgId]: newOrg };
      try {
        const custom = JSON.parse(localStorage.getItem('cee_custom_organizations') || '{}');
        custom[safeOrgId] = newOrg;
        localStorage.setItem('cee_custom_organizations', JSON.stringify(custom));
      } catch (e) {}
      return updated;
    });

    const adminUser = {
      id: `USR-${safeOrgId}-01`,
      email: adminEmail ? adminEmail.trim() : `admin@${safeOrgId.toLowerCase()}.local`,
      name: adminName || `${name.trim()} Administrator`,
      orgId: safeOrgId,
      role: 'ADMINISTRATOR',
      status: 'ACTIVE',
      did: newOrg.did
    };

    setOrgUsers((prev) => {
      const updated = [adminUser, ...prev];
      localStorage.setItem('cee_org_users', JSON.stringify(updated));
      return updated;
    });

    setNotifications((prev) => [
      {
        id: `org-reg-${Date.now()}`,
        title: 'New Organization Registered',
        desc: `${newOrg.name} (${newOrg.code}) registered with Initial Admin: ${adminUser.email}`,
        time: 'Just now',
        type: 'success'
      },
      ...prev
    ]);

    triggerRefresh();
    return { newOrg, adminUser };
  };

  // Add User to Organization
  const addOrgUser = ({ name, email, role, orgId }) => {
    const targetOrgId = orgId || currentOrg?.id || 'ORG_B';
    const newUser = {
      id: `USR-${targetOrgId}-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      email: email.trim(),
      orgId: targetOrgId,
      role: role || 'FORENSIC_ANALYST',
      status: 'ACTIVE',
      did: `did:ethr:0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
    };

    setOrgUsers((prev) => {
      const updated = [...prev, newUser];
      localStorage.setItem('cee_org_users', JSON.stringify(updated));
      return updated;
    });

    setNotifications((prev) => [
      {
        id: `user-add-${Date.now()}`,
        title: 'Organization User Added',
        desc: `Added ${newUser.name} (${newUser.email}) as ${RBAC_ROLES[newUser.role]?.name || newUser.role}`,
        time: 'Just now',
        type: 'success'
      },
      ...prev
    ]);

    triggerRefresh();
    return newUser;
  };

  const updateOrgUserRole = (userId, newRole) => {
    setOrgUsers((prev) => {
      const updated = prev.map((u) => u.id === userId ? { ...u, role: newRole } : u);
      localStorage.setItem('cee_org_users', JSON.stringify(updated));
      return updated;
    });
    triggerRefresh();
  };

  const toggleOrgUserStatus = (userId) => {
    setOrgUsers((prev) => {
      const updated = prev.map((u) => u.id === userId ? { ...u, status: u.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' } : u);
      localStorage.setItem('cee_org_users', JSON.stringify(updated));
      return updated;
    });
    triggerRefresh();
  };

  const getUsersForOrg = (orgId) => {
    return orgUsers.filter((u) => u.orgId === orgId || u.orgCode === orgId);
  };

  // Unified Session Login Method (Binds User + Organization + Role)
  const loginSession = ({ user, organizationId, roleId, token, isSandbox = false }) => {
    const targetOrg = organizations[organizationId] || ORGANIZATIONS[organizationId] || ORGANIZATIONS.ORG_B;
    const targetRole = RBAC_ROLES[roleId] || RBAC_ROLES.FORENSIC_ANALYST;

    setCurrentOrg(targetOrg);
    setCurrentRole(targetRole);
    setWalletAddress(user?.walletAddress || targetOrg.walletAddress);
    setDid(user?.did || targetOrg.did);
    setIsSandboxMode(isSandbox);

    localStorage.setItem('cee_auth_token', token || ('jwt_session_' + Date.now()));
    localStorage.setItem('cee_is_sandbox', isSandbox ? 'true' : 'false');
    localStorage.setItem('cee_current_org', targetOrg.id);
    localStorage.setItem('cee_current_role', targetRole.id);

    const sessionUser = {
      id: user?.id || `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: user?.name || (targetRole.id === 'ADMINISTRATOR' ? `${targetOrg.shortName} Admin` : targetRole.name),
      email: user?.email || (targetRole.id === 'ADMINISTRATOR' ? 'admin@cyberlab.local' : 'analyst@cyberlab.local'),
      orgId: targetOrg.id,
      organization_id: targetOrg.code || targetOrg.id,
      orgName: targetOrg.name,
      role: targetRole.id,
      roleName: targetRole.name
    };
    localStorage.setItem('cee_user', JSON.stringify(sessionUser));

    setNotifications((prev) => [
      {
        id: `auth-session-${Date.now()}`,
        title: 'Secure Session Initialized',
        desc: `Authenticated as ${sessionUser.name} (${targetRole.name}) in ${targetOrg.shortName}`,
        time: 'Just now',
        type: 'success'
      },
      ...prev
    ]);

    triggerRefresh();
    return sessionUser;
  };

  // Switch RBAC Role ONLY (Independent from Organization)
  const switchRole = (roleKey) => {
    // If an organization key was passed for legacy calls, delegate to switchOrg
    if (ORGANIZATIONS[roleKey]) {
      switchOrg(roleKey);
      return;
    }

    if (roleKey === 'ADMIN') roleKey = 'ADMINISTRATOR';
    if (roleKey === 'MANAGER') roleKey = 'EVIDENCE_CUSTODIAN';
    if (roleKey === 'USER') roleKey = 'FIRST_RESPONDER';

    if (RBAC_ROLES[roleKey]) {
      const nextRole = RBAC_ROLES[roleKey];
      setCurrentRole(nextRole);
      localStorage.setItem('cee_current_role', roleKey);

      setNotifications((prev) => [
        {
          id: `role-switch-${Date.now()}`,
          title: 'RBAC Role Changed',
          desc: `Role: ${nextRole.name} • Permissions updated`,
          time: 'Just now',
          type: 'info'
        },
        ...prev
      ]);

      triggerRefresh();
    }
  };

  const hasPermission = (perm) => {
    return Boolean(currentRole?.permissions?.[perm]);
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          const addr = accounts[0];
          const newDid = `did:ethr:${addr}`;
          setWalletAddress(addr);
          setDid(newDid);

          setRegisteredIdentities((prev) => {
            const exists = prev.some((id) => id.address.toLowerCase() === addr.toLowerCase());
            if (!exists) {
              const updated = [
                ...prev,
                {
                  address: addr,
                  didURI: newDid,
                  name: `User ${addr.substring(0, 6)}`,
                  role: currentRole.id,
                  didDocumentHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
                  registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
                  status: 'ACTIVE'
                }
              ];
              localStorage.setItem('cee_registered_identities', JSON.stringify(updated));
              return updated;
            }
            return prev;
          });

          setNotifications((prev) => [
            {
              id: `wallet-${Date.now()}`,
              title: 'Wallet Connected & DID Registered',
              desc: `DID Identity Active: did:ethr:${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`,
              time: 'Just now',
              type: 'success'
            },
            ...prev
          ]);
        }
      } catch (err) {
        console.error("Wallet connection failed", err);
        alert("Wallet connection failed. Please authorize in MetaMask.");
      }
    } else {
      alert("No Web3 provider detected! Please install MetaMask to interact with the blockchain.");
    }
  };

  const registerDIDIdentity = (address, didURI, name, role = 'FIRST_RESPONDER') => {
    const docHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newEntry = {
      address,
      didURI: didURI || `did:ethr:${address}`,
      name: name || `User ${address.substring(0, 6)}`,
      role,
      didDocumentHash: docHash,
      registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      status: 'ACTIVE'
    };

    setRegisteredIdentities((prev) => {
      const filtered = prev.filter((id) => id.address.toLowerCase() !== address.toLowerCase());
      const updated = [newEntry, ...filtered];
      localStorage.setItem('cee_registered_identities', JSON.stringify(updated));
      return updated;
    });

    setNotifications((prev) => [
      {
        id: `did-reg-${Date.now()}`,
        title: 'New DID Identity Registered',
        desc: `${name || address.substring(0, 8)} assigned ${role} role on-chain`,
        time: 'Just now',
        type: 'success'
      },
      ...prev
    ]);

    triggerRefresh();
  };

  const assignRoleToAddress = (address, newRole) => {
    setRegisteredIdentities((prev) => {
      const updated = prev.map((id) => {
        if (id.address.toLowerCase() === address.toLowerCase()) {
          return { ...id, role: newRole };
        }
        return id;
      });
      localStorage.setItem('cee_registered_identities', JSON.stringify(updated));
      return updated;
    });

    setNotifications((prev) => [
      {
        id: `role-upd-${Date.now()}`,
        title: 'RBAC Permission Updated',
        desc: `Address ${address.substring(0, 8)}... reassigned to ${newRole}`,
        time: 'Just now',
        type: 'info'
      },
      ...prev
    ]);

    triggerRefresh();
  };

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  const toggleTamperSimulation = (enable, targetId = 'EV-001') => {
    const newState = typeof enable === 'boolean' ? enable : !isTamperSimulated;
    setIsTamperSimulated(newState);
    evidenceService.toggleTamperSimulation(targetId, newState);
    
    if (newState) {
      setNotifications((prev) => [
        {
          id: `tamper-${Date.now()}`,
          title: '🚨 CRITICAL TAMPER DETECTED',
          desc: `Evidence ${targetId} off-chain hash does NOT match on-chain sealed root!`,
          time: 'Just now',
          type: 'danger'
        },
        ...prev
      ]);
    } else {
      setNotifications((prev) => [
        {
          id: `reset-${Date.now()}`,
          title: 'Tamper Simulation Reset',
          desc: `Evidence ${targetId} restored to verified cryptographic root.`,
          time: 'Just now',
          type: 'success'
        },
        ...prev
      ]);
    }
    triggerRefresh();
  };

  const setSandbox = (enabled) => {
    setIsSandboxMode(enabled);
    localStorage.setItem('cee_is_sandbox', enabled ? 'true' : 'false');
  };

  // Dynamically bridge currentRole.orgName to currentOrg.name for backward compatibility
  const roleWithContext = {
    ...currentRole,
    orgName: currentOrg?.name || 'Organization B — Cyber Defense Lab',
    organization: currentOrg
  };

  return (
    <AppContext.Provider
      value={{
        currentOrg,
        switchOrg,
        organizations,
        registerOrganization,
        orgUsers,
        addOrgUser,
        updateOrgUserRole,
        toggleOrgUserStatus,
        getUsersForOrg,
        loginSession,
        currentRole: roleWithContext,
        switchRole,
        roles: RBAC_ROLES,
        hasPermission,
        walletAddress,
        did,
        connectWallet,
        registeredIdentities,
        registerDIDIdentity,
        assignRoleToAddress,
        isTamperSimulated,
        toggleTamperSimulation,
        isSandboxMode,
        setSandbox,
        searchQuery,
        setSearchQuery,
        notifications,
        refreshTrigger,
        triggerRefresh
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
