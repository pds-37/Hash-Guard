import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  ArrowLeftRight,
  History,
  GitFork,
  ShieldCheck,
  FileSpreadsheet,
  Settings,
  Building2,
  Lock,
  ChevronLeft,
  ChevronRight,
  Menu,
  Wallet,
  LogOut,
  Clock,
  FileTerminal
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar = ({ isMobileOpen, setMobileOpen }) => {
  const { currentRole, switchRole, isTamperSimulated, walletAddress, did, connectWallet } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationGroups = [
    {
      label: 'Overview',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      label: 'Evidence',
      items: [
        { name: 'Evidence', path: '/evidence', icon: ShieldAlert },
        // Evidence Details is omitted from sidebar to avoid clutter, accessed via list
      ]
    },
    {
      label: 'Chain of Custody',
      items: [
        { name: 'Transfers', path: '/transfers', icon: ArrowLeftRight },
        { name: 'Custody', path: '/custody', icon: History },
        { name: 'Lineage', path: '/lineage', icon: GitFork },
      ]
    },
    {
      label: 'Trust & Verification',
      items: [
        { name: 'Verification', path: '/verification', icon: ShieldCheck, alert: isTamperSimulated },
        { name: 'Audit Logs', path: '/audit', icon: FileSpreadsheet },
      ]
    },
    {
      label: 'Administration',
      items: [
        { name: 'Audit Logs', icon: FileTerminal, path: '/audit' },
        { name: 'Retention', icon: Clock, path: '/retention' },
        { name: 'Settings', icon: Settings, path: '/settings' }
      ]
    }
  ];

  const sidebarClass = `
    fixed inset-y-0 left-0 z-40 flex flex-col bg-ce-surface border-r border-ce-border transition-all duration-300 ease-in-out
    ${isCollapsed ? 'w-20' : 'w-64'}
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    lg:static lg:h-screen
  `;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={sidebarClass}>
        {/* Header / Logo Area */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-ce-border shrink-0">
          {!isCollapsed && (
            <div className="flex items-center gap-2 font-semibold text-ce-text-primary truncate">
              <ShieldCheck className="w-5 h-5 text-ce-brand" />
              <span className="tracking-tight">CYBER EVIDENCE</span>
            </div>
          )}
          {isCollapsed && (
            <ShieldCheck className="w-6 h-6 text-ce-brand mx-auto" />
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-md hover:bg-ce-surface-subtle text-ce-text-muted transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Organization / Role Info */}
        <div className={`p-3 border-b border-ce-border ${isCollapsed ? 'px-2' : ''}`}>
          {!isCollapsed ? (
            <div className="bg-ce-surface-subtle rounded-md p-3 border border-ce-border-strong">
              <div className="flex items-center justify-between text-[10px] font-mono text-ce-text-muted mb-1.5 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3 h-3 text-ce-brand" />
                  Active Context
                </span>
                <span className="w-2 h-2 rounded-full bg-ce-success animate-pulse" title="Network Connected" />
              </div>
              <div className="text-xs font-semibold text-ce-text-primary truncate" title={currentRole.orgName}>
                {currentRole.orgName}
              </div>
              
              <div className="mt-3 pt-3 border-t border-ce-border">
                <select
                  value={currentRole.id}
                  onChange={(e) => switchRole(e.target.value)}
                  className="w-full bg-ce-surface border border-ce-border text-[11px] text-ce-text-primary rounded px-2 py-1.5 font-mono focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand cursor-pointer"
                >
                  <option value="ORG_B">Org B: Receiver / Analyst</option>
                  <option value="ORG_A">Org A: Evidence Collector</option>
                  <option value="AUDITOR">Audit Board</option>
                </select>
              </div>

              <div className="mt-2">
                {walletAddress ? (
                  <div className="text-[10px] font-mono text-ce-blockchain bg-ce-blockchain/10 border border-ce-blockchain/20 rounded p-1.5 truncate flex items-center gap-1.5" title={did}>
                    <Wallet className="w-3 h-3" />
                    {did}
                  </div>
                ) : (
                  <button 
                    onClick={connectWallet}
                    className="w-full flex items-center justify-center gap-1.5 bg-ce-brand/10 hover:bg-ce-brand/20 text-ce-brand border border-ce-brand/30 text-xs font-medium py-1.5 rounded transition-colors"
                  >
                    <Wallet className="w-3 h-3" />
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="w-8 h-8 rounded-md bg-ce-surface-subtle border border-ce-border-strong flex items-center justify-center relative">
                <Building2 className="w-4 h-4 text-ce-brand" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-ce-success border-2 border-ce-surface" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navigationGroups.map((group, idx) => {
            const allowedItems = group.items.filter(item => 
              currentRole.allowedPages.includes(item.path.replace('/', ''))
            );
            
            if (allowedItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1">
                {!isCollapsed && (
                  <div className="text-[10px] font-mono uppercase tracking-widest text-ce-text-muted px-3 pb-2 font-semibold">
                    {group.label}
                  </div>
                )}
                {allowedItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      title={isCollapsed ? item.name : undefined}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all relative group
                        ${isActive 
                          ? 'bg-ce-surface-subtle text-ce-text-primary' 
                          : 'text-ce-text-secondary hover:bg-ce-surface-subtle/50 hover:text-ce-text-primary'}
                        ${isCollapsed ? 'justify-center px-0' : ''}
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <div className="absolute left-0 top-1 bottom-1 w-1 bg-ce-brand rounded-r-full" />
                          )}
                          <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-ce-brand' : 'text-ce-text-muted group-hover:text-ce-text-primary'}`} />
                          
                          {!isCollapsed && (
                            <span className="truncate flex-1">{item.name}</span>
                          )}

                          {!isCollapsed && item.alert && (
                            <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-ce-danger/10 text-ce-danger border border-ce-danger/20 animate-pulse">
                              ALERT
                            </span>
                          )}
                          
                          {/* Alert dot for collapsed state */}
                          {isCollapsed && item.alert && (
                            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-ce-danger animate-pulse" />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-ce-border bg-ce-surface shrink-0 space-y-3">
          {!isCollapsed ? (
            <div className="flex items-center justify-between text-[11px] font-mono text-ce-text-secondary">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-ce-success" />
                <span>Audit Ledger</span>
              </div>
              <span className="text-ce-success">SYNCED</span>
            </div>
          ) : (
            <Lock className="w-4 h-4 text-ce-success mx-auto" title="Ledger Synced" />
          )}

          <button
            onClick={() => {
              localStorage.removeItem('cee_auth_token');
              localStorage.removeItem('cee_user');
              window.location.href = '#/login';
            }}
            className={`w-full flex items-center justify-center gap-2 bg-ce-surface-subtle hover:bg-ce-danger/10 text-ce-text-secondary hover:text-ce-danger border border-ce-border py-1.5 rounded transition-colors text-xs font-mono ${isCollapsed ? 'px-0' : ''}`}
            title="Disconnect & Terminate Session"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Terminate Session</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

