import React, { createContext, useContext, useState, useEffect } from 'react';
import { evidenceService } from '../services/evidenceService';

const AppContext = createContext();

export const ROLES = {
  ADMIN: {
    id: 'ADMIN',
    orgName: 'Platform Governance & Admin Authority',
    roleName: 'System Administrator (ROLE_ADMIN)',
    description: 'Full governance authority: defines RBAC roles, assigns user permissions, mints NFTs, and allocates digital assets.',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    allowedPages: ['dashboard', 'evidence', 'evidence-details', 'transfers', 'custody', 'lineage', 'verification', 'audit', 'retention', 'settings'],
    actions: ['Define Roles', 'Assign Access Rights', 'Mint Asset NFT', 'Allocate Assets', 'Manage Retention']
  },
  MANAGER: {
    id: 'MANAGER',
    orgName: 'Operations & Asset Custody Management',
    roleName: 'Asset & Operations Manager (ROLE_MANAGER)',
    description: 'Asset lifecycle governance: orchestrates custody transitions, approves cross-party transfers, and enforces retention.',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    allowedPages: ['dashboard', 'evidence', 'evidence-details', 'transfers', 'custody', 'lineage', 'audit', 'retention', 'settings'],
    actions: ['Allocate Assets', 'Approve Transfers', 'Enforce Retention', 'Audit Custody Log']
  },
  AUDITOR: {
    id: 'AUDITOR',
    orgName: 'National Cyber Security Audit Board',
    roleName: 'Independent Auditor (ROLE_AUDITOR)',
    description: 'Zero-trust cryptographic verification of asset hashes, custody proofs, and auditor credentials without raw file access.',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    allowedPages: ['verification', 'lineage', 'custody', 'audit', 'settings'],
    actions: ['Verify Hash Integrity', 'Verify Cryptographic Credentials', 'Export Attestation Certificate']
  },
  USER: {
    id: 'USER',
    orgName: 'Registered Evidence Custodian / Partner',
    roleName: 'Decentralized User (ROLE_USER)',
    description: 'Self-sovereign identity holder: verifies decentralized identifier (DID), holds allocated NFTs, and accepts custody.',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    allowedPages: ['dashboard', 'evidence', 'evidence-details', 'transfers', 'custody', 'settings'],
    actions: ['Register DID Identity', 'Accept Custody', 'Request Asset Transfer']
  },
  // Backward compatibility mappings
  ORG_A: {
    id: 'ORG_A',
    orgName: 'Organization A (CERT-Alpha)',
    roleName: 'Evidence Collector / Originator',
    description: 'Initial seizure, SHA-256 hashing, HSM signing, and mTLS dispatch.',
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    allowedPages: ['dashboard', 'evidence', 'evidence-details', 'transfers', 'custody', 'audit', 'retention', 'settings'],
    actions: ['Collect Evidence', 'Hash & Sign Manifest', 'Initiate Secure Transfer']
  },
  ORG_B: {
    id: 'ORG_B',
    orgName: 'Organization B (Cyber Defense Lab)',
    roleName: 'Receiver / Forensic Analyst',
    description: 'Receipt verification, air-gapped sandboxing, artifact derivation & reporting.',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    allowedPages: ['dashboard', 'evidence', 'evidence-details', 'transfers', 'custody', 'lineage', 'verification', 'audit', 'retention', 'settings'],
    actions: ['Receive & Verify Transfer', 'Dynamic Sandbox Run', 'Derive Forensic Artifact', 'Generate Lineage']
  }
};

const DEFAULT_IDENTITIES = [
  {
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    didURI: 'did:ethr:0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    name: 'Super Admin Authority',
    role: 'ADMIN',
    didDocumentHash: '0xa4b19c23945ef13a89bc4123547890123456789abcdef0123456789abcdef012',
    registeredAt: '2026-03-01 09:00:00 UTC',
    status: 'ACTIVE'
  },
  {
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    didURI: 'did:ethr:0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    name: 'Forensics Operations Unit',
    role: 'MANAGER',
    didDocumentHash: '0x7b629ef1945ef13a89bc4123547890123456789abcdef0123456789abcdef013',
    registeredAt: '2026-03-02 11:30:00 UTC',
    status: 'ACTIVE'
  },
  {
    address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    didURI: 'did:ethr:0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    name: 'National Cyber Security Audit Board',
    role: 'AUDITOR',
    didDocumentHash: '0x9c314de1945ef13a89bc4123547890123456789abcdef0123456789abcdef014',
    registeredAt: '2026-03-05 14:15:00 UTC',
    status: 'ACTIVE'
  },
  {
    address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    didURI: 'did:ethr:0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    name: 'Field Investigator Unit Alpha',
    role: 'USER',
    didDocumentHash: '0x12f45ea1945ef13a89bc4123547890123456789abcdef0123456789abcdef015',
    registeredAt: '2026-03-10 16:40:00 UTC',
    status: 'ACTIVE'
  }
];

export const AppProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(ROLES.ADMIN);
  const [walletAddress, setWalletAddress] = useState('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
  const [did, setDid] = useState('did:ethr:0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
  const [isTamperSimulated, setIsTamperSimulated] = useState(false);
  const [isSandboxMode, setIsSandboxMode] = useState(() => localStorage.getItem('cee_is_sandbox') === 'true');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Registered DIDs list in state
  const [registeredIdentities, setRegisteredIdentities] = useState(() => {
    const saved = localStorage.getItem('cee_registered_identities');
    return saved ? JSON.parse(saved) : DEFAULT_IDENTITIES;
  });

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-did',
      title: 'Decentralized Identity Active',
      desc: 'DID: did:ethr:0xf39F...2266 authenticated via secp256k1 proof',
      time: '5m ago',
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

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          const addr = accounts[0];
          const newDid = `did:ethr:${addr}`;
          setWalletAddress(addr);
          setDid(newDid);

          // Check if identity already exists or register it
          setRegisteredIdentities((prev) => {
            const exists = prev.some((id) => id.address.toLowerCase() === addr.toLowerCase());
            if (!exists) {
              const updated = [
                ...prev,
                {
                  address: addr,
                  didURI: newDid,
                  name: `User ${addr.substring(0, 6)}`,
                  role: 'USER',
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

  // Register DID identity (self or admin)
  const registerDIDIdentity = (address, didURI, name, role = 'USER') => {
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

  // Assign RBAC role to an address
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

  const switchRole = (roleKey) => {
    if (ROLES[roleKey]) {
      setCurrentRole(ROLES[roleKey]);
      const matched = registeredIdentities.find((id) => id.role === roleKey);
      if (matched) {
        setWalletAddress(matched.address);
        setDid(matched.didURI);
      }
    }
  };

  const setSandbox = (enabled) => {
    setIsSandboxMode(enabled);
    localStorage.setItem('cee_is_sandbox', enabled ? 'true' : 'false');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        switchRole,
        roles: ROLES,
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
