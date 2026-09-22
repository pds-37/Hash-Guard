import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Building2, 
  ShieldCheck, 
  Blocks, 
  CheckCircle2, 
  KeyRound, 
  UserCheck, 
  PlusCircle, 
  Fingerprint, 
  Lock, 
  ArrowRightLeft, 
  Eye, 
  FileCheck,
  Sun,
  Moon,
  Palette
} from 'lucide-react';

export const SettingsPage = () => {
  const { theme, isDark, setTheme } = useTheme();
  const { 
    currentRole, 
    switchRole, 
    roles, 
    walletAddress, 
    did, 
    connectWallet,
    registeredIdentities, 
    registerDIDIdentity, 
    assignRoleToAddress 
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserAddress, setNewUserAddress] = useState('');
  const [newUserRole, setNewUserRole] = useState('USER');

  const handleRegisterNewUser = (e) => {
    e.preventDefault();
    if (!newUserAddress.trim()) return;
    registerDIDIdentity(
      newUserAddress.trim(),
      `did:ethr:${newUserAddress.trim()}`,
      newUserName.trim() || `Identity ${newUserAddress.substring(0, 6)}`,
      newUserRole
    );
    setNewUserName('');
    setNewUserAddress('');
    setShowAddModal(false);
  };

  const rbacMatrix = [
    {
      action: 'Mint Digital Asset NFTs',
      description: 'Create unique ERC-721 tokens with SHA-256 digests anchored on-chain',
      ADMIN: true,
      MANAGER: true,
      AUDITOR: false,
      USER: false
    },
    {
      action: 'Assign & Revoke RBAC Roles',
      description: 'Define roles, assign permissions to DIDs via AccessControl',
      ADMIN: true,
      MANAGER: false,
      AUDITOR: false,
      USER: false
    },
    {
      action: 'Allocate Assets to User Identities',
      description: 'Directly assign or re-assign asset ownership to specific DIDs',
      ADMIN: true,
      MANAGER: true,
      AUDITOR: false,
      USER: false
    },
    {
      action: 'Cryptographic Credential Verification',
      description: 'Execute zero-trust auditor proof check via verifyCredential',
      ADMIN: false,
      MANAGER: false,
      AUDITOR: true,
      USER: false
    },
    {
      action: 'Zero-Trust Bitstream Hash Audit',
      description: 'Cryptographically verify observed hash vs on-chain root',
      ADMIN: true,
      MANAGER: true,
      AUDITOR: true,
      USER: false
    },
    {
      action: 'Transfer Custody',
      description: 'Sign and execute monotonic custody transfer between parties',
      ADMIN: true,
      MANAGER: true,
      AUDITOR: false,
      USER: true
    },
    {
      action: 'Enforce Retention & Auto-Expiry',
      description: 'Mark asset lifecycle status (archived, extended, purged)',
      ADMIN: true,
      MANAGER: true,
      AUDITOR: false,
      USER: false
    },
    {
      action: 'Read Ledger & Lineage DAG',
      description: 'Inspect immutable blockchain event streams and derivation provenance',
      ADMIN: true,
      MANAGER: true,
      AUDITOR: true,
      USER: true
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & RBAC Governance"
        subtitle="Manage Decentralized Identifiers (DIDs), Role-Based Access Control, and Smart Contract Permissions."
        breadcrumbs={['Dashboard', 'Settings & Governance']}
      />

      {/* Active Identity & Perspective Switcher */}
      <div className="rounded-lg bg-ce-surface border border-ce-border p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-ce-border">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-ce-brand" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-ce-text-primary">
              Active Decentralized Identity & Perspective
            </h3>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-ce-brand/10 border border-ce-brand/30 text-ce-brand font-semibold">
            W3C Compliant DID
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 rounded-md bg-ce-bg border border-ce-border shadow-sm">
            <span className="text-[10px] uppercase text-ce-text-muted block font-bold tracking-wider">
              Active Organization:
            </span>
            <span className="text-ce-text-primary font-bold text-sm mt-1.5 block">
              {currentRole.orgName}
            </span>
          </div>

          <div className="p-4 rounded-md bg-ce-bg border border-ce-border shadow-sm">
            <span className="text-[10px] uppercase text-ce-text-muted block font-bold tracking-wider">
              Assigned Role (RBAC):
            </span>
            <span className="text-ce-brand font-bold text-sm mt-1.5 block">
              {currentRole.roleName}
            </span>
          </div>

          <div className="p-4 rounded-md bg-ce-bg border border-ce-border shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase text-ce-text-muted block font-bold tracking-wider">
                Decentralized Identifier (DID):
              </span>
              <span className="text-ce-blockchain font-bold text-xs mt-1.5 block truncate" title={did || `did:ethr:${walletAddress}`}>
                {did || `did:ethr:${walletAddress || '0x...'}`}
              </span>
            </div>
            <button
              onClick={connectWallet}
              className="mt-2 text-[10px] font-sans font-bold text-ce-brand hover:underline self-start flex items-center gap-1"
            >
              <KeyRound className="w-3 h-3" />
              <span>Connect / Re-authenticate Wallet</span>
            </button>
          </div>
        </div>

        <div className="p-4 rounded-md bg-ce-surface-subtle border border-ce-border/60">
          <label className="text-[10px] uppercase font-mono text-ce-text-muted block mb-2 font-bold tracking-wider">
            Switch Perspective Role (Role-Based Access Simulation):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['ADMIN', 'MANAGER', 'AUDITOR', 'USER'].map((key) => {
              const r = roles[key];
              if (!r) return null;
              const isCurrent = currentRole.id === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => switchRole(r.id)}
                  className={`p-3 rounded-md border text-left text-xs font-mono transition-colors shadow-sm ${
                    isCurrent
                      ? 'bg-ce-brand/10 border-ce-brand text-ce-brand font-bold'
                      : 'bg-ce-bg border-ce-border text-ce-text-secondary hover:text-ce-text-primary hover:border-ce-brand/50'
                  }`}
                >
                  <div className="text-[11px] font-bold truncate">{r.roleName.split('(')[0]}</div>
                  <div className="text-[10px] opacity-75 mt-1">{r.id}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Appearance & Theme Mode Switcher */}
      <div className="rounded-lg bg-ce-surface border border-ce-border p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-ce-border">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-ce-brand" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-ce-text-primary">
              Appearance & Interface Theme
            </h3>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-ce-surface-subtle border border-ce-border text-ce-text-secondary font-semibold">
            {theme === 'dark' ? 'Dark SOC Mode Active' : 'Light Forensic Mode Active'}
          </span>
        </div>

        <p className="text-xs text-ce-text-secondary leading-relaxed">
          Select your preferred display theme. The selected mode is automatically stored locally and applies to the entire forensics and chain-of-custody dashboard.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Light Theme Option Card */}
          <div
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
              !isDark
                ? 'bg-amber-500/5 border-amber-500/50 shadow-sm ring-1 ring-amber-500/30'
                : 'bg-ce-bg border-ce-border hover:border-ce-text-muted/60 opacity-80 hover:opacity-100'
            }`}
          >
            <div className={`p-2.5 rounded-lg border shrink-0 ${
              !isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-600' : 'bg-ce-surface-subtle border-ce-border text-ce-text-muted'
            }`}>
              <Sun className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-ce-text-primary uppercase tracking-wide">
                  Light Theme
                </span>
                {!isDark && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-ce-text-secondary mt-1 leading-relaxed">
                Crisp off-white surfaces with deep navy typography. Ideal for daylight analysis, courtroom projection, and audit documentation.
              </p>
            </div>
          </div>

          {/* Dark Theme Option Card */}
          <div
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
              isDark
                ? 'bg-ce-brand/5 border-ce-brand/50 shadow-sm ring-1 ring-ce-brand/30'
                : 'bg-ce-bg border-ce-border hover:border-ce-text-muted/60 opacity-80 hover:opacity-100'
            }`}
          >
            <div className={`p-2.5 rounded-lg border shrink-0 ${
              isDark ? 'bg-ce-brand/10 border-ce-brand/30 text-ce-brand' : 'bg-ce-surface-subtle border-ce-border text-ce-text-muted'
            }`}>
              <Moon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-ce-text-primary uppercase tracking-wide">
                  Dark Theme
                </span>
                {isDark && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-ce-brand/15 text-ce-brand font-bold border border-ce-brand/30">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-ce-text-secondary mt-1 leading-relaxed">
                Deep cybersecurity SOC mode with high-contrast neon telemetry accents. Ideal for low-light command centers and security operations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DID Registry & Smart Contract RBAC Manager */}
      <div className="rounded-lg bg-ce-surface border border-ce-border p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-ce-border">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-ce-blockchain" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-ce-text-primary">
              Decentralized Identity (DID) & Smart Contract RBAC Registry
            </h3>
          </div>
          {currentRole.id === 'ADMIN' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-ce-brand text-ce-bg font-mono text-xs font-bold hover:bg-ce-brand/90 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Register New Identity</span>
            </button>
          )}
        </div>

        <p className="text-xs text-ce-text-muted">
          Each identity represents a cryptographically verifiable participant authenticated via public-key cryptography.
          Administrators govern role assignments on the smart contract to restrict minting, allocation, and verification.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border border-ce-border rounded-md overflow-hidden">
            <thead className="bg-ce-surface-subtle text-ce-text-muted uppercase text-[10px] tracking-wider border-b border-ce-border">
              <tr>
                <th className="p-3">Identity Name / Agency</th>
                <th className="p-3">Decentralized Identifier (DID)</th>
                <th className="p-3">EVM Wallet Address</th>
                <th className="p-3">Smart Contract Role</th>
                <th className="p-3">On-Chain Status</th>
                {currentRole.id === 'ADMIN' && <th className="p-3 text-right">Admin Role Control</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-ce-border bg-ce-bg">
              {registeredIdentities.map((item, idx) => (
                <tr key={idx} className="hover:bg-ce-surface-subtle/50 transition-colors">
                  <td className="p-3 font-semibold text-ce-text-primary">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-ce-brand" />
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-ce-blockchain text-[11px] truncate max-w-[200px]" title={item.didURI}>
                    {item.didURI}
                  </td>
                  <td className="p-3 text-ce-text-muted text-[11px]">
                    {item.address.substring(0, 8)}...{item.address.substring(item.address.length - 6)}
                  </td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                      item.role === 'ADMIN'
                        ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                        : item.role === 'MANAGER'
                        ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                        : item.role === 'AUDITOR'
                        ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
                        : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                    }`}>
                      {item.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-[10px] text-ce-success font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>VERIFIED</span>
                    </span>
                  </td>
                  {currentRole.id === 'ADMIN' && (
                    <td className="p-3 text-right">
                      <select
                        value={item.role}
                        onChange={(e) => assignRoleToAddress(item.address, e.target.value)}
                        className="bg-ce-surface border border-ce-border rounded px-2 py-1 text-[11px] text-ce-text-primary focus:outline-none focus:border-ce-brand"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="AUDITOR">AUDITOR</option>
                        <option value="USER">USER</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC Governance Matrix */}
      <div className="rounded-lg bg-ce-surface border border-ce-border p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-ce-border">
          <Lock className="w-4 h-4 text-ce-warning" />
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-ce-text-primary">
            Smart Contract Role Permissions Matrix (OpenZeppelin AccessControl)
          </h3>
        </div>

        <p className="text-xs text-ce-text-muted">
          All operations are enforced by bytecode-level modifiers (e.g. <code>onlyRole(ROLE_ADMIN)</code>, <code>onlyRole(ROLE_AUDITOR)</code>).
          Unauthorized invocations trigger EVM reverts, preserving tamper-proof access boundaries.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border border-ce-border rounded-md overflow-hidden">
            <thead className="bg-ce-surface-subtle text-ce-text-muted uppercase text-[10px] tracking-wider border-b border-ce-border">
              <tr>
                <th className="p-3">Operation / Capability</th>
                <th className="p-3">Smart Contract Governance Rule</th>
                <th className="p-3 text-center text-rose-400 font-bold">Admin</th>
                <th className="p-3 text-center text-amber-400 font-bold">Manager</th>
                <th className="p-3 text-center text-cyan-400 font-bold">Auditor</th>
                <th className="p-3 text-center text-emerald-400 font-bold">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ce-border bg-ce-bg">
              {rbacMatrix.map((m, idx) => (
                <tr key={idx} className="hover:bg-ce-surface-subtle/50 transition-colors">
                  <td className="p-3 font-semibold text-ce-text-primary">{m.action}</td>
                  <td className="p-3 text-ce-text-muted text-[11px]">{m.description}</td>
                  <td className="p-3 text-center">
                    {m.ADMIN ? <span className="text-ce-success font-bold">✓ ALLOWED</span> : <span className="text-ce-text-muted opacity-40">✕ DENIED</span>}
                  </td>
                  <td className="p-3 text-center">
                    {m.MANAGER ? <span className="text-ce-success font-bold">✓ ALLOWED</span> : <span className="text-ce-text-muted opacity-40">✕ DENIED</span>}
                  </td>
                  <td className="p-3 text-center">
                    {m.AUDITOR ? <span className="text-ce-success font-bold">✓ ALLOWED</span> : <span className="text-ce-text-muted opacity-40">✕ DENIED</span>}
                  </td>
                  <td className="p-3 text-center">
                    {m.USER ? <span className="text-ce-success font-bold">✓ ALLOWED</span> : <span className="text-ce-text-muted opacity-40">✕ DENIED</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Network & Consensus Section */}
      <div className="rounded-lg bg-ce-surface border border-ce-border p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-ce-border">
          <Blocks className="w-4 h-4 text-ce-blockchain" />
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-ce-text-primary">
            Blockchain Ledger & Smart Contract Deployment Status
          </h3>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-4 rounded-md bg-ce-bg border border-ce-border flex items-center justify-between shadow-sm">
            <div>
              <div className="font-bold text-ce-text-primary">Smart Contract Standard</div>
              <div className="text-ce-text-muted text-[11px] font-sans mt-1">
                ERC-721 (Unique NFT Asset Tokens) + OpenZeppelin AccessControl (RBAC) + DID Registry
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-sm bg-ce-blockchain/10 text-ce-blockchain border border-ce-blockchain/30 font-bold tracking-wider">
              HASHGUARD.sol v2.0
            </span>
          </div>

          <div className="p-4 rounded-md bg-ce-bg border border-ce-border flex items-center justify-between shadow-sm">
            <div>
              <div className="font-bold text-ce-text-primary">Contract Deployment Address</div>
              <div className="text-ce-text-muted text-[11px] font-sans mt-1">
                Local Anvil / Hardhat Node (Chain ID: 31337 / 1337)
              </div>
            </div>
            <span className="font-mono text-xs text-ce-brand font-bold bg-ce-brand/10 px-2.5 py-1 rounded border border-ce-brand/20">
              0x5FbDB2315678afecb367f032d93F642f64180aa3
            </span>
          </div>

          <div className="p-4 rounded-md bg-ce-bg border border-ce-border flex items-center justify-between shadow-sm">
            <div>
              <div className="font-bold text-ce-text-primary">Audit Trail Immutability</div>
              <div className="text-ce-text-muted text-[11px] font-sans mt-1">
                Cryptographic hashing (SHA-256) + ECDSA secp256k1 signatures anchored to block receipts
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-ce-success/10 text-ce-success border border-ce-success/30 font-bold tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tamper-Evident Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* Add New Identity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ce-surface border border-ce-border rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ce-border">
              <h4 className="text-sm font-mono font-bold uppercase text-ce-text-primary flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-ce-brand" />
                <span>Register User DID Identity</span>
              </h4>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-ce-text-muted hover:text-ce-text-primary font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterNewUser} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[11px] text-ce-text-muted uppercase mb-1 font-bold">
                  User / Agency Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyber Crime Unit 4"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-ce-bg border border-ce-border rounded px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand"
                />
              </div>

              <div>
                <label className="block text-[11px] text-ce-text-muted uppercase mb-1 font-bold">
                  EVM Wallet Address (0x...):
                </label>
                <input
                  type="text"
                  required
                  placeholder="0x1234567890abcdef..."
                  value={newUserAddress}
                  onChange={(e) => setNewUserAddress(e.target.value)}
                  className="w-full bg-ce-bg border border-ce-border rounded px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand"
                />
              </div>

              <div>
                <label className="block text-[11px] text-ce-text-muted uppercase mb-1 font-bold">
                  Initial RBAC Role:
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full bg-ce-bg border border-ce-border rounded px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand"
                >
                  <option value="USER">USER (General Custodian)</option>
                  <option value="AUDITOR">AUDITOR (Independent Verifier)</option>
                  <option value="MANAGER">MANAGER (Operations Manager)</option>
                  <option value="ADMIN">ADMIN (System Administrator)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded bg-ce-surface-subtle border border-ce-border text-ce-text-secondary hover:text-ce-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-ce-brand text-ce-bg font-bold hover:bg-ce-brand/90 shadow-sm"
                >
                  Anchor DID on Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
