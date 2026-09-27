import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Zap,
  LogIn,
  Layers,
  Activity,
  ShieldCheck,
  Cpu,
  Boxes,
  Menu,
  X,
  ExternalLink,
  Lock
} from 'lucide-react';
import { Logo, LogoIcon } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';
import { useApp, ROLES } from '../../context/AppContext';

export const ArchitectureNavbar = ({ onSelectSection, activeSection = 'diagram' }) => {
  const navigate = useNavigate();
  const { switchRole, setSandbox } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const token = localStorage.getItem('cee_auth_token');
  const isLoggedIn = Boolean(token);

  const launchSandbox = (targetRole = 'ORG_B', targetPath = '/dashboard') => {
    const roleConfig = ROLES[targetRole] || ROLES.ORG_B;
    if (switchRole) switchRole(targetRole);
    if (setSandbox) setSandbox(true);
    localStorage.setItem('cee_is_sandbox', 'true');

    const mockUser = {
      id: 'EVAL-001',
      email: 'analyst-lead@cyberlab.local',
      name: 'Lead Forensic Evaluator',
      organization_id: targetRole || 'ORG_B',
      role: 'FORENSIC_ANALYST'
    };

    localStorage.setItem('cee_auth_token', 'mock_jwt_session_' + Date.now());
    localStorage.setItem('cee_user', JSON.stringify(mockUser));
    navigate(targetPath);
  };

  const navLinks = [
    { id: 'diagram', label: 'Interactive Diagram', icon: Layers },
    { id: 'data-flow', label: 'Data Flow', icon: Activity },
    { id: 'trust-boundaries', label: 'Trust Boundaries', icon: ShieldCheck },
    { id: 'tech-stack', label: 'Tech Stack', icon: Cpu },
    { id: 'smart-contract', label: 'Smart Contract', icon: Boxes },
  ];

  const handleNavClick = (id) => {
    if (onSelectSection) {
      onSelectSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#040812]/92 dark:bg-[#040812]/92 border-b border-slate-800 transition-all shadow-lg shadow-cyan-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Return Action + Brand */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => navigate(isLoggedIn ? '/dashboard' : '/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer group"
            title={isLoggedIn ? "Return to Dashboard" : "Return to HashGuard Overview"}
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">{isLoggedIn ? '← Back to Dashboard' : '← Back to HashGuard'}</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="h-5 w-px bg-slate-800 hidden md:block" />

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 p-1.5 shadow-[0_0_15px_rgba(6,182,212,0.25)] group-hover:border-cyan-400/80 transition-all">
              <LogoIcon className="w-5 h-5" />
            </div>
            <div className="hidden lg:block leading-none">
              <span className="font-mono font-bold text-sm text-white tracking-wider">
                HASH<span className="text-cyan-400">GUARD</span>
              </span>
              <span className="block font-mono text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">
                Architecture Explorer
              </span>
            </div>
          </Link>
        </div>

        {/* Center: In-page navigation anchors */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-mono">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ThemeToggle size="sm" />

          {isLoggedIn ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs shadow-[0_0_18px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden sm:inline">Open Console</span>
              <span className="sm:hidden">App</span>
            </button>
          ) : (
            <button
              onClick={() => launchSandbox('ORG_B', '/dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-mono font-bold text-xs shadow-[0_0_18px_rgba(6,182,212,0.35)] transition-all cursor-pointer group"
            >
              <Zap className="w-3.5 h-3.5 text-slate-950 fill-slate-950 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Launch Live App</span>
              <span className="sm:hidden">Launch</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-cyan-400" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#040812]/98 backdrop-blur-xl px-4 py-3 space-y-2 font-mono text-xs shadow-2xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800/80 text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  {link.label}
                </span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate(isLoggedIn ? '/dashboard' : '/');
              }}
              className="w-full py-2 px-3 rounded-lg border border-slate-700 bg-slate-800/60 text-slate-200 text-center"
            >
              {isLoggedIn ? '← Return to Dashboard' : '← Return to HashGuard Overview'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
