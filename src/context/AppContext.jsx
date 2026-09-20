import React, { createContext, useContext, useState, useEffect } from 'react';
import { evidenceService } from '../services/evidenceService';

const AppContext = createContext();

export const ROLES = {
  ORG_A: {
    id: 'ORG_A',
    orgName: 'Organization A (CERT-Alpha)',
    roleName: 'Evidence Collector / Originator',
    description: 'Initial seizure, SHA-256 hashing, HSM signing, and mTLS dispatch.',
    allowedPages: ['dashboard', 'evidence', 'evidence-details', 'transfers', 'custody', 'audit', 'retention', 'settings'],
    actions: ['Collect Evidence', 'Hash & Sign Manifest', 'Initiate Secure Transfer']
  },
  ORG_B: {
    id: 'ORG_B',
    orgName: 'Organization B (Cyber Defense Lab)',
    roleName: 'Receiver / Forensic Analyst',
    description: 'Receipt verification, air-gapped sandboxing, artifact derivation & reporting.',
    allowedPages: ['dashboard', 'evidence', 'evidence-details', 'transfers', 'custody', 'lineage', 'verification', 'audit', 'retention', 'settings'],
    actions: ['Receive & Verify Transfer', 'Dynamic Sandbox Run', 'Derive Forensic Artifact', 'Generate Lineage']
  },
  AUDITOR: {
    id: 'AUDITOR',
    orgName: 'National Cyber Security Audit Board',
    roleName: 'Independent Auditor',
    description: 'Zero-trust cryptographic verification of custody ledger and artifact lineage without file access.',
    allowedPages: ['verification', 'lineage', 'custody', 'audit', 'settings'],
    actions: ['Run Cryptographic Audit', 'Verify Hash Consensus', 'Export Attestation Certificate']
  }
};

export const AppProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(ROLES.ORG_B);
  const [walletAddress, setWalletAddress] = useState(null);
  const [did, setDid] = useState(null);
  const [isTamperSimulated, setIsTamperSimulated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [notifications, setNotifications] = useState([
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
          setWalletAddress(accounts[0]);
          setDid(`did:ethr:${accounts[0]}`);
          setNotifications((prev) => [
            {
              id: `wallet-${Date.now()}`,
              title: 'Wallet Connected',
              desc: `DID Identity Active: did:ethr:${accounts[0].substring(0,6)}...`,
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
    }
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
        isTamperSimulated,
        toggleTamperSimulation,
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
