import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useApp } from '../../context/AppContext';
import { Building2, ShieldCheck, Blocks, CheckCircle2 } from 'lucide-react';

export const SettingsPage = () => {
  const { currentRole, switchRole, roles } = useApp();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & System Configuration"
        subtitle="Configure organization settings and nodes."
        breadcrumbs={['Dashboard', 'Settings']}
      />

      {/* Organization Section */}
      <div className="rounded-lg bg-ce-surface border border-ce-border p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-ce-border">
          <Building2 className="w-4 h-4 text-ce-brand" />
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-ce-text-primary">
            Organization Identity
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-4 rounded-md bg-ce-bg border border-ce-border shadow-sm">
            <span className="text-[10px] uppercase text-ce-text-muted block font-bold tracking-wider">
              Configured Organization:
            </span>
            <span className="text-ce-text-primary font-bold text-sm mt-1.5 block">
              {currentRole.orgName}
            </span>
          </div>

          <div className="p-4 rounded-md bg-ce-bg border border-ce-border shadow-sm">
            <span className="text-[10px] uppercase text-ce-text-muted block font-bold tracking-wider">
              Assigned Role:
            </span>
            <span className="text-ce-brand font-bold text-sm mt-1.5 block">
              {currentRole.roleName}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-md bg-ce-surface-subtle border border-ce-border/60">
          <label className="text-[10px] uppercase font-mono text-ce-text-muted block mb-2 font-bold tracking-wider">
            Change Perspective / Active Organization:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.keys(roles).map((key) => {
              const r = roles[key];
              const isCurrent = r.id === currentRole.id;
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
                  <div className="text-[11px] truncate">{r.orgName.split('(')[0]}</div>
                  <div className="text-[10px] opacity-75 mt-1">{r.roleName.split('/')[0]}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="rounded-lg bg-ce-surface border border-ce-border p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-ce-border">
          <ShieldCheck className="w-4 h-4 text-ce-success" />
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-ce-text-primary">
            Security & Cryptographic Access Control
          </h3>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-4 rounded-md bg-ce-bg border border-ce-border flex items-center justify-between shadow-sm">
            <div>
              <div className="font-bold text-ce-text-primary">Authentication Protocol</div>
              <div className="text-ce-text-muted text-[11px] font-sans mt-1">
                Mutual TLS (mTLS) + Hardware Security Module (HSM) Keypair
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-ce-success/10 text-ce-success border border-ce-success/30 font-bold tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>✓ Enabled</span>
            </span>
          </div>

          <div className="p-4 rounded-md bg-ce-bg border border-ce-border flex items-center justify-between shadow-sm">
            <div>
              <div className="font-bold text-ce-text-primary">Role-Based Access Control (RBAC)</div>
              <div className="text-ce-text-muted text-[11px] font-sans mt-1">
                Strict segregation between Collector, Receiver/Analyst, and Independent Auditor roles
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-ce-success/10 text-ce-success border border-ce-success/30 font-bold tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>✓ Enabled</span>
            </span>
          </div>
        </div>
      </div>

      {/* Network Section */}
      <div className="rounded-lg bg-ce-surface border border-ce-border p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-ce-border">
          <Blocks className="w-4 h-4 text-ce-blockchain" />
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-ce-text-primary">
            Audit Ledger Network
          </h3>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-4 rounded-md bg-ce-bg border border-ce-border flex items-center justify-between shadow-sm">
            <div>
              <div className="font-bold text-ce-text-primary">Audit Network Architecture</div>
              <div className="text-ce-text-muted text-[11px] font-sans mt-1">
                Federated Enterprise Consortium Consensus
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-sm bg-ce-blockchain/10 text-ce-blockchain border border-ce-blockchain/30 font-bold tracking-wider">
              Permissioned
            </span>
          </div>

          <div className="p-4 rounded-md bg-ce-bg border border-ce-border flex items-center justify-between shadow-sm">
            <div>
              <div className="font-bold text-ce-text-primary">Consensus & Node Synchronization</div>
              <div className="text-ce-text-muted text-[11px] font-sans mt-1">
                Block Height #482975 • 12 Active Validator Orgs
              </div>
            </div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-ce-success/10 text-ce-success border border-ce-success/30 font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-ce-success animate-pulse" />
              <span>Connected / Mock</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
