import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Topbar = ({ setMobileOpen }) => {
  const {
    currentRole,
    searchQuery,
    setSearchQuery,
    notifications
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <header className="h-16 bg-ce-surface/90 backdrop-blur border-b border-ce-border px-4 lg:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shrink-0">
      <div className="flex items-center gap-3 flex-1">
        <button 
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 -ml-2 rounded-md hover:bg-ce-surface-subtle text-ce-text-secondary"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 max-w-md relative hidden sm:block">
          <Search className="w-4 h-4 text-ce-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Evidence ID, Hash..."
            className="w-full bg-ce-bg border border-ce-border rounded-md pl-9 pr-4 py-1.5 text-sm text-ce-text-primary placeholder:text-ce-text-muted focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-ce-surface-subtle text-ce-text-secondary hover:text-ce-text-primary transition-colors"
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-md hover:bg-ce-surface-subtle text-ce-text-secondary hover:text-ce-text-primary transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-ce-danger ring-2 ring-ce-surface" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg bg-ce-surface border border-ce-border shadow-lg p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-ce-border mb-2">
                <span className="text-xs font-semibold text-ce-text-primary uppercase tracking-wider">Live Feeds</span>
                <span className="text-[10px] text-ce-success font-mono">P2P Synced</span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <div className="text-xs text-ce-text-muted text-center py-4">No recent notifications.</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-md text-xs border ${
                        n.type === 'danger'
                          ? 'bg-ce-danger/5 border-ce-danger/20 text-ce-danger'
                          : 'bg-ce-bg border-ce-border text-ce-text-primary'
                      }`}
                    >
                      <div className="font-semibold flex items-center justify-between mb-1">
                        <span>{n.title}</span>
                        <span className="text-[10px] opacity-70 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] opacity-80 leading-relaxed">{n.desc}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-ce-border">
          <div className="w-8 h-8 rounded-md bg-ce-brand/10 border border-ce-brand/20 flex items-center justify-center font-bold text-xs text-ce-brand">
            {currentRole.id.charAt(0)}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-ce-text-primary truncate max-w-[140px]">
              {currentRole.roleName.split('/')[0]}
            </div>
            <div className="text-[10px] text-ce-text-muted font-mono">
              Auth: Multi-Sig
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
