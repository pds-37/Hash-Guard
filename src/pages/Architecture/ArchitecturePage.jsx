import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogoIcon } from '../../components/common/Logo';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { useApp, ROLES } from '../../context/AppContext';
import { ArchitectureHero } from '../../components/architecture/ArchitectureHero';
import { InteractiveArchitectureDiagram } from '../../components/architecture/InteractiveArchitectureDiagram';
import { ArchitectureDetailDrawer } from '../../components/architecture/ArchitectureDetailDrawer';
import { DataFlowExplorer } from '../../components/architecture/DataFlowExplorer';
import { TrustBoundariesSection } from '../../components/architecture/TrustBoundariesSection';
import { SecurityPrinciplesSection } from '../../components/architecture/SecurityPrinciplesSection';
import { TechStackSection } from '../../components/architecture/TechStackSection';
import { ContractDetailsCard } from '../../components/architecture/ContractDetailsCard';
import { HowHashGuardWorks } from '../../components/architecture/HowHashGuardWorks';
import { ARCHITECTURE_NODES } from '../../components/architecture/architectureData';
import {
  ArrowLeft,
  Layers,
  Activity,
  ShieldCheck,
  Cpu,
  Boxes,
  Lock,
  Zap,
  LogIn,
  Menu,
  X,
  ExternalLink,
  GitBranch,
  ChevronRight
} from 'lucide-react';

export const ArchitecturePage = () => {
  const navigate = useNavigate();
  const { switchRole, setSandbox } = useApp();
  const [selectedNode, setSelectedNode] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('diagram');

  const token = localStorage.getItem('cee_auth_token');
  const isLoggedIn = Boolean(token);

  const launchSandbox = () => {
    if (switchRole) switchRole('FORENSIC_ANALYST');
    if (setSandbox) setSandbox(true);
    localStorage.setItem('cee_is_sandbox', 'true');
    const mockUser = {
      id: 'EVAL-001',
      email: 'analyst-lead@cyberlab.local',
      name: 'Lead Forensic Evaluator',
      organization_id: 'ORG_B',
      role: 'FORENSIC_ANALYST'
    };
    localStorage.setItem('cee_auth_token', 'mock_jwt_session_' + Date.now());
    localStorage.setItem('cee_user', JSON.stringify(mockUser));
    navigate('/dashboard');
  };

  const handleSelectNode = (node) => {
    setSelectedNode(node);
    setDrawerOpen(true);
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'diagram', label: 'Architecture', icon: Layers },
    { id: 'data-flow', label: 'Data Flow', icon: Activity },
    { id: 'trust-boundaries', label: 'Trust Boundaries', icon: ShieldCheck },
    { id: 'tech-stack', label: 'Tech Stack', icon: Cpu },
    { id: 'smart-contract', label: 'Smart Contract', icon: Boxes },
  ];

  return (
    <div className="min-h-screen bg-[#040812] text-slate-100 font-sans relative overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-cyan-500/6 rounded-full blur-[130px]" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-blue-600/6 rounded-full blur-[160px]" />
        <div className="absolute bottom-20 left-1/3 w-[500px] h-[300px] bg-purple-500/5 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:28px_28px]" />
      </div>

      {/* ─── STICKY NAVBAR ─── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#040812]/93 border-b border-slate-800 shadow-lg shadow-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Left: Back + Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate(isLoggedIn ? '/dashboard' : '/')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">
                {isLoggedIn ? '← Dashboard' : '← HashGuard'}
              </span>
              <span className="sm:hidden">Back</span>
            </button>

            <div className="hidden sm:block h-5 w-px bg-slate-800" />

            <Link to="/" className="flex items-center gap-2 group">
              <div className="rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 p-1.5 shadow-[0_0_15px_rgba(6,182,212,0.25)] group-hover:border-cyan-400/80 transition-all">
                <LogoIcon className="w-5 h-5" />
              </div>
              <div className="hidden md:block leading-none">
                <span className="font-mono font-bold text-sm text-white tracking-wider">
                  HASH<span className="text-cyan-400">GUARD</span>
                </span>
                <span className="block font-mono text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">
                  System Architecture
                </span>
              </div>
            </Link>
          </div>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle size="sm" />
            {isLoggedIn ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs shadow-[0_0_18px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Open Console</span>
              </button>
            ) : (
              <button
                onClick={launchSandbox}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-mono font-bold text-xs shadow-[0_0_18px_rgba(6,182,212,0.35)] transition-all cursor-pointer group"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950 group-hover:scale-110 transition-transform" />
                <span>Launch App</span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-cyan-400" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-[#040812]/98 px-4 py-3 space-y-1 font-mono text-xs">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5 text-cyan-400" />
                  {link.label}
                </button>
              );
            })}
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={isLoggedIn ? () => navigate('/dashboard') : launchSandbox}
                className="w-full py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-center"
              >
                {isLoggedIn ? 'Open Console' : 'Launch Live App'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="relative z-10">
        {/* HERO */}
        <ArchitectureHero />

        {/* TWO-COLUMN LAYOUT: DIAGRAM + DETAIL DRAWER */}
        <section id="diagram" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
              INTERACTIVE SYSTEM MAP
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-mono font-black text-white mb-2">
            ARCHITECTURE DIAGRAM
          </h2>
          <p className="text-sm text-slate-400 font-sans mb-6">
            Click any block to open the detail inspector panel. Each node reveals flow specifications, technology stack, and code artifacts.
          </p>

          {/* Responsive: side-by-side on desktop, stacked on mobile */}
          <div className={`grid gap-6 transition-all duration-300 ${drawerOpen ? 'lg:grid-cols-[1fr_380px]' : 'lg:grid-cols-1'}`}>
            {/* Left: Diagram */}
            <div>
              <InteractiveArchitectureDiagram
                selectedNodeId={selectedNode?.id}
                onSelectNode={handleSelectNode}
              />
            </div>

            {/* Right: Detail Drawer (pinned on desktop, stacked below on mobile) */}
            <div className={`${drawerOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="sticky top-20">
                <ArchitectureDetailDrawer
                  selectedNode={selectedNode}
                  onClose={() => {
                    setDrawerOpen(false);
                    setSelectedNode(null);
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* HOW HASHGUARD WORKS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-800/60">
          <HowHashGuardWorks />
        </section>

        {/* DATA FLOW */}
        <section id="data-flow" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-800/60">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">TRACE</span>
          </div>
          <DataFlowExplorer />
        </section>

        {/* TRUST BOUNDARIES */}
        <section id="trust-boundaries" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-800/60">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">ISOLATION ZONES</span>
          </div>
          <TrustBoundariesSection />
        </section>

        {/* SECURITY PRINCIPLES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-800/60">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">CORE GUARANTEES</span>
          </div>
          <SecurityPrinciplesSection />
        </section>

        {/* SMART CONTRACT */}
        <section id="smart-contract" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-800/60">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">HASHGUARD.sol</span>
          </div>
          <ContractDetailsCard />
        </section>

        {/* TECH STACK */}
        <section id="tech-stack" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-800/60">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">VERIFIED STACK</span>
          </div>
          <TechStackSection />
        </section>

        {/* FOOTER CTA */}
        <section className="py-14 text-center max-w-3xl mx-auto px-4 border-t border-slate-800/60">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-mono mb-3">
            Inspect the Live Evidence Ledger
          </h3>
          <p className="text-sm text-slate-400 font-mono mb-8">
            All features are live. Zero installation required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={launchSandbox}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-mono font-bold text-sm shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>Launch Evaluation Sandbox</span>
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-cyan-400" />
              <span>Sign In / Register Agency</span>
            </button>
          </div>
        </section>

        {/* PAGE FOOTER */}
        <footer className="border-t border-slate-800/80 bg-[#03060e]/90 py-10 font-mono text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <LogoIcon className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-bold tracking-wider">
                HASH<span className="text-cyan-400">GUARD</span>
              </span>
              <span className="text-slate-600">|</span>
              <span>Cyber Evidence Exchange</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] flex-wrap justify-center">
              <button
                onClick={() => scrollTo('diagram')}
                className="hover:text-cyan-300 transition-colors cursor-pointer"
              >
                System Architecture
              </button>
              <span>•</span>
              <button
                onClick={launchSandbox}
                className="hover:text-cyan-300 transition-colors cursor-pointer"
              >
                Live Prototype
              </button>
              <span>•</span>
              <a
                href="https://sepolia.etherscan.io/address/0x3592925Cf64E7C3c68d4911b2ebC722c2Ea67052"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-300 transition-colors flex items-center gap-1"
              >
                <span>Etherscan</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span>•</span>
              <button
                onClick={() => navigate(isLoggedIn ? '/dashboard' : '/')}
                className="hover:text-cyan-300 transition-colors cursor-pointer"
              >
                ← Return to HashGuard
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};
