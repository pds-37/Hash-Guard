import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Fingerprint, 
  GitFork, 
  ArrowRight, 
  ArrowLeftRight, 
  Database, 
  Sparkles, 
  Eye, 
  Zap,
  FileCheck2,
  Clock,
  AlertTriangle,
  UserPlus,
  LogIn,
  ChevronRight,
  PlayCircle,
  Menu,
  X
} from 'lucide-react';
import { useApp, ROLES } from '../../context/AppContext';
import { Logo, LogoIcon } from '../../components/common/Logo';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { SystemArchitectureSection } from '../../components/landing/SystemArchitectureSection';
import { HeroEvidenceDiagram } from '../../components/landing/HeroEvidenceDiagram';
import { OnChainProofModal } from '../../components/landing/OnChainProofModal';
import { TamperBreachModal } from '../../components/landing/TamperBreachModal';
import { DemoWalkthroughModal } from '../../components/landing/DemoWalkthroughModal';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { switchRole, setSandbox } = useApp();
  const [activeTab, setActiveTab] = useState('segregation');
  const [interactiveTampered, setInteractiveTampered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals state
  const [onChainModalOpen, setOnChainModalOpen] = useState(false);
  const [tamperModalOpen, setTamperModalOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const scrollToTab = (tabKey) => {
    setActiveTab(tabKey);
    const element = document.getElementById('security-lab');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Instant login helper for evaluators (Sandbox Mode)
  const launchConsole = (targetRole = 'ORG_B', targetPath = '/dashboard', isSandbox = true) => {
    const roleConfig = ROLES[targetRole] || ROLES.ORG_B;
    switchRole(targetRole);
    setSandbox(isSandbox);
    localStorage.setItem('cee_is_sandbox', isSandbox ? 'true' : 'false');

    const mockUser = {
      id: 'EVAL-001',
      email: targetRole === 'AUDITOR' ? 'auditor@cyber-audit.gov' : 'analyst-lead@cyberlab.local',
      name: isSandbox ? 'Lead Forensic Evaluator / Lead Auditor' : roleConfig.roleName,
      organization_id: targetRole || 'ORG_B',
      role: targetRole === 'AUDITOR' ? 'AUDITOR' : 'ADMIN'
    };

    localStorage.setItem('cee_auth_token', 'mock_jwt_session_' + Date.now());
    localStorage.setItem('cee_user', JSON.stringify(mockUser));
    navigate(targetPath);
  };

  const sampleOriginalHash = '8f3a91bc72f4cd2a4e9b671a5c28e930f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6';
  const sampleTamperedHash = '759eee0f9d4163fe5422020789d7034a17bb14b747f648c8390e03b25437afaf';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#040812] text-slate-900 dark:text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden font-sans transition-colors duration-200">
      {/* Background Glows & Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[700px] h-[550px] bg-cyan-500/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[170px]" />
        <div className="absolute bottom-10 left-1/3 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-[150px]" />
        {/* Fine grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* TOP NAVBAR (Exact design matching Image 2) */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-[#040812]/90 border-b border-slate-200 dark:border-slate-800/80 transition-all shadow-xs dark:shadow-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo Branding */}
          <Logo 
            size="md" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          />

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-8 text-xs font-mono tracking-wider text-slate-600 dark:text-slate-300 shrink-0">
            <button 
              onClick={() => scrollToSection('architecture')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer font-medium"
            >
              Architecture
            </button>
            <button 
              onClick={() => scrollToSection('evidence-flow')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer font-medium"
            >
              Evidence Flow
            </button>
            <button 
              onClick={() => scrollToTab('lineage')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer font-medium"
            >
              Lineage DAG
            </button>
            <button 
              onClick={() => scrollToTab('tamper')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer font-medium"
            >
              Tamper Detection
            </button>
            <button 
              onClick={() => scrollToSection('roles')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer font-medium"
            >
              Agency Roles
            </button>
          </nav>

          {/* Action CTAs + Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ThemeToggle size="sm" />

            <button
              onClick={() => navigate('/login')}
              className="hidden sm:flex px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-[#091122] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-mono transition-all cursor-pointer items-center gap-1.5 shrink-0 whitespace-nowrap shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Sign In / Register</span>
            </button>

            <button
              onClick={() => launchConsole('ORG_B', '/dashboard', true)}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-mono font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer shrink-0 whitespace-nowrap group"
            >
              <Zap className="w-3.5 h-3.5 text-slate-950 fill-slate-950 group-hover:scale-110 transition-transform" />
              <span>Launch Evaluation Sandbox</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-500 dark:text-cyan-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800/90 bg-white/98 dark:bg-[#040812]/98 backdrop-blur-xl px-4 py-4 space-y-3 shadow-2xl transition-all">
            <div className="flex flex-col space-y-1 text-xs font-mono uppercase tracking-wider">
              <button
                onClick={() => scrollToSection('architecture')}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
              >
                <span>Architecture</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              </button>

              <button
                onClick={() => scrollToSection('evidence-flow')}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
              >
                <span>Evidence Flow</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              </button>

              <button
                onClick={() => scrollToTab('lineage')}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
              >
                <span>Lineage DAG</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              </button>

              <button
                onClick={() => scrollToTab('tamper')}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
              >
                <span>Tamper Detection</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              </button>

              <button
                onClick={() => scrollToSection('roles')}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
              >
                <span>Agency Roles</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              </button>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex flex-col gap-2 font-mono">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs cursor-pointer shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Sign In / Register</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION (2-Column Grid matching Image 2) */}
      <section className="relative z-10 pt-10 pb-8 md:pt-16 md:pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Column: Headline, Description & CTAs */}
          <div className="lg:col-span-5 text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center p-0.5 rounded-full bg-[#071325]/90 border border-slate-800 text-xs font-mono mb-6 shadow-xs">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>EVALUATION MODE</span>
              </div>
              <span className="px-3 py-1 text-slate-300 font-medium">LOCAL EVM (CHAIN 31337)</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-[58px] xl:text-[64px] font-black tracking-tight leading-[1.05] text-slate-900 dark:text-white">
              Digital Evidence <br />
              <span className="text-[#00d2ff] dark:text-[#38bdf8]">
                That Stays True
              </span>
            </h1>

            {/* Subtitle Paragraph */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-normal">
              Register, track, and verify digital evidence with cryptographic integrity and a complete chain of custody across organizations.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => launchConsole('ORG_B', '/dashboard', true)}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-mono font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 cursor-pointer group"
              >
                <Zap className="w-4 h-4 text-slate-950 fill-slate-950 group-hover:scale-110 transition-transform" />
                <span>Launch Evaluation Sandbox</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setDemoModalOpen(true)}
                className="px-5 py-3 rounded-lg bg-white/80 dark:bg-[#091122]/90 hover:bg-slate-100 dark:hover:bg-[#111e38] border border-slate-300 dark:border-slate-700/80 text-slate-800 dark:text-white font-mono font-medium text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-xs group"
              >
                <PlayCircle className="w-4 h-4 text-slate-500 dark:text-slate-300 group-hover:text-cyan-400 transition-colors" />
                <span>Watch Demo (2 min)</span>
              </button>
            </div>
          </div>

          {/* Right Column: 3D Visual Diagram with Interactive Hotspots */}
          <div className="lg:col-span-7 flex justify-center">
            <HeroEvidenceDiagram 
              onOpenOnChainProof={() => setOnChainModalOpen(true)}
              onOpenTamperBreach={() => setTamperModalOpen(true)}
              onLaunchSandbox={launchConsole}
            />
          </div>
        </div>
      </section>

      {/* 4 PROCESS STEP CARDS (Section #evidence-flow matching Image 2 bottom row) */}
      <section id="evidence-flow" className="relative z-10 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          {/* CARD 01: Register Evidence */}
          <div 
            onClick={() => launchConsole('ORG_A', '/evidence', true)}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#070e1c]/80 hover:bg-white dark:hover:bg-[#0c162c] hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all cursor-pointer group flex flex-col justify-between h-full"
          >
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  01
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-sans group-hover:text-cyan-400 transition-colors">
                  Register Evidence
                </h4>
              </div>

              {/* 3D Pedestal Graphic */}
              <div className="my-3 flex items-center justify-center">
                <img 
                  src="/assets/step-01-register.png" 
                  alt="Register Evidence Pedestal" 
                  className="w-full h-24 object-contain filter drop-shadow-[0_0_12px_rgba(6,182,212,0.25)] group-hover:scale-105 transition-transform"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <span className="leading-snug">Upload & cryptographically seal forensic exhibits</span>
              <ChevronRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
            </div>
          </div>

          {/* CARD 02: Track Custody */}
          <div 
            onClick={() => launchConsole('ORG_B', '/transfers', true)}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#070e1c]/80 hover:bg-white dark:hover:bg-[#0c162c] hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all cursor-pointer group flex flex-col justify-between h-full"
          >
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  02
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-sans group-hover:text-cyan-400 transition-colors">
                  Track Custody
                </h4>
              </div>

              {/* 3D Pedestal Graphic */}
              <div className="my-3 flex items-center justify-center">
                <img 
                  src="/assets/step-02-custody.png" 
                  alt="Track Custody Pedestal" 
                  className="w-full h-24 object-contain filter drop-shadow-[0_0_12px_rgba(6,182,212,0.25)] group-hover:scale-105 transition-transform"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <span className="leading-snug">Monitor inter-agency transfers in real time</span>
              <ChevronRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
            </div>
          </div>

          {/* CARD 03: Verify Integrity */}
          <div 
            onClick={() => launchConsole('AUDITOR', '/verification', true)}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#070e1c]/80 hover:bg-white dark:hover:bg-[#0c162c] hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all cursor-pointer group flex flex-col justify-between h-full"
          >
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  03
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-sans group-hover:text-cyan-400 transition-colors">
                  Verify Integrity
                </h4>
              </div>

              {/* 3D Pedestal Graphic */}
              <div className="my-3 flex items-center justify-center">
                <img 
                  src="/assets/step-03-integrity.png" 
                  alt="Verify Integrity Pedestal" 
                  className="w-full h-24 object-contain filter drop-shadow-[0_0_12px_rgba(6,182,212,0.25)] group-hover:scale-105 transition-transform"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <span className="leading-snug">Detect tampering with cryptographic proofs</span>
              <ChevronRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
            </div>
          </div>

          {/* CARD 04: Maintain Trust */}
          <div 
            onClick={() => launchConsole('AUDITOR', '/audit', true)}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#070e1c]/80 hover:bg-white dark:hover:bg-[#0c162c] hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all cursor-pointer group flex flex-col justify-between h-full"
          >
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  04
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-sans group-hover:text-cyan-400 transition-colors">
                  Maintain Trust
                </h4>
              </div>

              {/* 3D Pedestal Graphic */}
              <div className="my-3 flex items-center justify-center">
                <img 
                  src="/assets/step-04-trust.png" 
                  alt="Maintain Trust Pedestal" 
                  className="w-full h-24 object-contain filter drop-shadow-[0_0_12px_rgba(6,182,212,0.25)] group-hover:scale-105 transition-transform"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <span className="leading-snug">Support legal, audit, and judicial oversight</span>
              <ChevronRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEM ARCHITECTURE BLUEPRINT SECTION */}
      <SystemArchitectureSection onLaunchSandbox={launchConsole} />

      {/* INTERACTIVE SECURITY CONSOLE & TAMPER LAB */}
      <section id="security-lab" className="relative z-10 py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#080e1c] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Simulated Terminal Window Header */}
          <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2">hashguard-soc-node01.enclave.gov</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-[11px] font-mono text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>LIVE EVIDENCE ENCLAVE</span>
            </div>
          </div>

          {/* Interactive Showcase Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 pt-2 gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('segregation')}
              className={`px-4 py-2.5 text-xs font-mono rounded-t-lg transition-all flex items-center gap-2 cursor-pointer border-t-2 ${
                activeTab === 'segregation'
                  ? 'border-cyan-400 bg-[#080e1c] text-cyan-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Off-Chain Vault vs On-Chain Proof</span>
            </button>
            <button
              onClick={() => setActiveTab('lineage')}
              className={`px-4 py-2.5 text-xs font-mono rounded-t-lg transition-all flex items-center gap-2 cursor-pointer border-t-2 ${
                activeTab === 'lineage'
                  ? 'border-cyan-400 bg-[#080e1c] text-cyan-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Interactive Lineage DAG</span>
            </button>
            <button
              onClick={() => setActiveTab('tamper')}
              className={`px-4 py-2.5 text-xs font-mono rounded-t-lg transition-all flex items-center gap-2 cursor-pointer border-t-2 ${
                activeTab === 'tamper'
                  ? 'border-cyan-400 bg-[#080e1c] text-cyan-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Live Bit Tamper Simulator</span>
            </button>
          </div>

          {/* TAB 1: OFF-CHAIN VS ON-CHAIN SEGREGATION */}
          {activeTab === 'segregation' && (
            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Off-Chain Card */}
                <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">1. Off-Chain Storage (Vault)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">ENCRYPTED ENCLAVE</span>
                  </div>
                  <h4 className="text-base font-bold text-white">Heavyweight Raw Artifacts</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    GB-scale disk images (.E01, .raw), PCAP captures, malware binaries, and memory dumps never touch the public blockchain. They reside in air-gapped, AES-256-GCM encrypted object enclaves.
                  </p>
                  <div className="p-3 bg-slate-950 rounded border border-slate-800/80 font-mono text-xs space-y-1 text-slate-300">
                    <div><span className="text-slate-500">Asset:</span> ev-001.bin.enc (4.8 MB LockBit Payload)</div>
                    <div><span className="text-slate-500">Vault:</span> s3-vault://org-b-forensics/vault/ev-001.bin.enc</div>
                    <div><span className="text-slate-500">Encryption:</span> AES-256-GCM (Enclave Wrapped Key)</div>
                  </div>
                </div>

                {/* On-Chain Card */}
                <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">2. On-Chain Ledger (Tamper-Evident Proof)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">LOCAL EVM / BESU CONSENSUS</span>
                  </div>
                  <h4 className="text-base font-bold text-white">Cryptographic State Machine</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Only deterministic SHA-256 bit digests, digital signatures, RFC 3161 timestamps, and parent derivation hashes are committed to the audit smart contract.
                  </p>
                  <div className="p-3 bg-slate-950 rounded border border-slate-800/80 font-mono text-xs space-y-1 text-slate-300">
                    <div><span className="text-slate-500">Digest:</span> 8f3a91bc72f4cd2a...c5d6</div>
                    <div><span className="text-slate-500">Contract:</span> 0x3592...7052 (HASHGUARD.sol)</div>
                    <div><span className="text-slate-500">State:</span> VERIFIED_SEALED (Block #1845201)</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-xl flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span className="text-xs font-mono text-slate-300">
                    Independent auditors can mathematically verify evidence integrity without exposing classified payload data.
                  </span>
                </div>
                <button
                  onClick={() => launchConsole('AUDITOR', '/verification', true)}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Launch Auditor Verification Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE LINEAGE DAG */}
          {activeTab === 'lineage' && (
            <div className="p-6 md:p-8 space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <h4 className="text-lg font-bold text-white">Mathematical Derivation Graph</h4>
                <p className="text-xs text-slate-400 font-mono">
                  Every forensic artifact mathematically commits to its parent source hash. Any alteration in a child report or parent dump breaks the entire cryptographic chain.
                </p>
              </div>

              {/* Graphical Lineage Flow */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 py-4">
                {/* Node 1 */}
                <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/40 relative">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">ROOT EXHIBIT</div>
                  <div className="text-sm font-bold text-white mt-1">EV-001 (Malware Binary)</div>
                  <div className="text-[11px] font-mono text-slate-400 truncate mt-1">Seized by CERT-Alpha</div>
                  <div className="mt-3 text-[10px] font-mono bg-slate-950 p-2 rounded border border-slate-800 text-slate-400 truncate">
                    Hash: 8f3a91...c5d6
                  </div>
                </div>

                {/* Node 2 */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 relative">
                  <div className="text-[10px] font-mono text-blue-400 uppercase font-semibold">DERIVATION #1</div>
                  <div className="text-sm font-bold text-white mt-1">DER-012 (Mem Dump)</div>
                  <div className="text-[11px] font-mono text-slate-400 truncate mt-1">Extracted RAM artifact</div>
                  <div className="mt-3 text-[10px] font-mono bg-slate-950 p-2 rounded border border-slate-800 text-slate-400 truncate">
                    Parent: EV-001
                  </div>
                </div>

                {/* Node 3 */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 relative">
                  <div className="text-[10px] font-mono text-purple-400 uppercase font-semibold">DERIVATION #2</div>
                  <div className="text-sm font-bold text-white mt-1">DER-045 (LockBit.bin)</div>
                  <div className="text-[11px] font-mono text-slate-400 truncate mt-1">Extracted Payload</div>
                  <div className="mt-3 text-[10px] font-mono bg-slate-950 p-2 rounded border border-slate-800 text-slate-400 truncate">
                    Parent: DER-012
                  </div>
                </div>

                {/* Node 4 */}
                <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 relative">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">FINAL ARTIFACT</div>
                  <div className="text-sm font-bold text-white mt-1">RPT-081 (YARA / IOCs)</div>
                  <div className="text-[11px] font-mono text-slate-400 truncate mt-1">Courtroom Evidence Dossier</div>
                  <div className="mt-3 text-[10px] font-mono bg-slate-950 p-2 rounded border border-slate-800 text-slate-400 truncate">
                    Parent: DER-045
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => launchConsole('ORG_B', '/lineage', true)}
                  className="px-5 py-2.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono transition-all flex items-center gap-2 cursor-pointer"
                >
                  <GitFork className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Explore Evidence Lineage in Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: LIVE BIT TAMPER SIMULATOR */}
          {activeTab === 'tamper' && (
            <div className="p-6 md:p-8 space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <h4 className="text-lg font-bold text-white">Live Tamper Demonstration Testbed</h4>
                <p className="text-xs text-slate-400 font-mono">
                  Toggle the specimen below to simulate an adversary modifying 1 single bit in off-chain evidence storage. Watch how on-chain verification immediately triggers a breach alert.
                </p>
              </div>

              {/* Interactive Specimen Box */}
              <div className={`p-5 rounded-xl border transition-all ${
                interactiveTampered 
                  ? 'bg-rose-950/20 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)]' 
                  : 'bg-slate-900/40 border-slate-800'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-mono text-slate-400">Specimen ID: </span>
                    <span className="text-xs font-mono font-bold text-white">EV-001 (LockBit 3.0 Ransomware Encryptor Payload - 4.2 GB)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setInteractiveTampered(!interactiveTampered)}
                      className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        interactiveTampered
                          ? 'bg-rose-500 text-white shadow-lg'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{interactiveTampered ? 'Reset to Clean State' : '🚨 Simulate Bit Tamper'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs font-mono">
                  {/* Expected Hash */}
                  <div className="p-3 bg-slate-950 rounded border border-slate-800">
                    <div className="text-slate-500 uppercase tracking-wider text-[10px]">On-Chain Sealed Cryptographic Root:</div>
                    <div className="text-emerald-400 font-bold break-all mt-1">{sampleOriginalHash}</div>
                    <div className="text-[10px] text-slate-500 mt-1">Anchored in Block #1845201</div>
                  </div>

                  {/* Off-Chain Computed Hash */}
                  <div className={`p-3 bg-slate-950 rounded border ${interactiveTampered ? 'border-rose-500/60' : 'border-slate-800'}`}>
                    <div className="text-slate-500 uppercase tracking-wider text-[10px]">Current Off-Chain Specimen Hash:</div>
                    <div className={`font-bold break-all mt-1 ${interactiveTampered ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                      {interactiveTampered ? sampleTamperedHash : sampleOriginalHash}
                    </div>
                    <div className={`text-[10px] mt-1 font-bold ${interactiveTampered ? 'text-rose-400' : 'text-slate-500'}`}>
                      {interactiveTampered ? '✕ INTEGRITY MISMATCH DETECTED' : '✓ 100% BIT-LEVEL MATCH'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => launchConsole('ORG_B', '/dashboard', true)}
                  className="px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-bold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-md"
                >
                  <span>Launch Evaluation Sandbox (Test Full Tamper System)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* THE PROBLEM VS THE SOLUTION SECTION */}
      <section className="relative z-10 py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold mb-2">The Forensic Challenge</h2>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Why Existing Chain-of-Custody Fails in Court</h3>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 font-sans">
            Digital evidence cross-organization exchange between police forces, CERT teams, defense labs, and judicial courts is vulnerable to tampering disputes and lack of mathematical provenance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Traditional */}
          <div className="p-6 rounded-2xl bg-rose-500/5 dark:bg-rose-950/10 border border-rose-300 dark:border-rose-900/30 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-mono text-xs uppercase font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>Legacy Custody Process (Vulnerable)</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 font-mono">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Paper forms and spreadsheets easily edited or forged post-seizure.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Derivative malware decompilations lack cryptographic parent linkage.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Transfers over insecure FTP or cloud shares risk MITM substitution.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Defense attorneys contest bit integrity due to lack of independent audit logs.</span>
              </li>
            </ul>
          </div>

          {/* HashGuard Solution */}
          <div className="p-6 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/10 border border-emerald-400 dark:border-emerald-500/30 space-y-4 shadow-xs dark:shadow-[0_0_25px_rgba(16,185,129,0.08)]">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs uppercase font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>HashGuard Protocol (Cryptographic Proof)</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 font-mono">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Deterministic SHA-256 bit digests locked to append-only blockchain blocks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Directed Acyclic Graph (DAG) records parent-to-child forensic lineage.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>mTLS encrypted transfers with dual-signed cryptographic transfer manifests.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>1-click courtroom attestation certificates with cryptographic verification proofs.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CORE ARCHITECTURE GRID */}
      <section id="features" className="relative z-10 py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold mb-2">Technical Capabilities</h2>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Engineered for Cross-Organization Trust</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 shadow-xs transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 dark:text-cyan-400">
              <Fingerprint className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">SHA-256 Bit Attestation</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Every digital exhibit is deterministically hashed upon physical seizure. Continuous off-chain vs on-chain comparison guarantees bit-level integrity.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 shadow-xs transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Cryptographic Transfers</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Inter-agency custody handoffs require mTLS mutual authentication, recipient acceptance signatures, and automated block confirmation.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 shadow-xs transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 dark:text-purple-400">
              <GitFork className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Lineage Provenance DAG</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Decompiled modules, memory carvings, and YARA IOCs inherit parent specimen signatures in an interactive mathematical derivation graph.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 shadow-xs transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
              <Eye className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Independent Cryptographic Auditing</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Independent auditors can mathematically verify evidence integrity using cryptographic proofs without gaining access to classified raw payloads.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 shadow-xs transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Automated Retention Policies</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Regulatory lifecycles, automated secure wiping, and cold-storage time-locks adhere to statutory retention guidelines with signed proof.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 shadow-xs transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 dark:text-cyan-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Courtroom Attestation PDF/JSON</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Export cryptographic attestation certificates with 5-point verification checkmarks, block heights, and ECDSA digital signatures designed for Section 65B legal submission.
            </p>
          </div>
        </div>
      </section>

      {/* MULTI-AGENCY STAKEHOLDER ROLES */}
      <section id="roles" className="relative z-10 py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold mb-2">Role-Based Access Control</h2>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Role-Based Evidence Governance</h3>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans">
            Distinct tenant boundaries isolate agency evidence stores, while on-chain smart contract roles govern operational permissions. Select a persona below to enter the evaluation sandbox with pre-configured credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Role 1: CERT-Alpha */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 shadow-xs transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold uppercase">
                ORGANIZATION A
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">CERT-Alpha (Collector)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                Initial seizure of disk images, memory dumps, and network logs. Performs bit-level hashing, cryptographic signing, and mTLS dispatch.
              </p>
            </div>
            <button
              onClick={() => launchConsole('ORG_A', '/evidence', true)}
              className="mt-6 w-full py-2.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-300 text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Launch as CERT-Alpha</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Role 2: Cyber Defense Lab */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.1)] flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-bold uppercase">
                ORGANIZATION B (RECOMMENDED ENTRY)
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Cyber Defense Lab (Analyst)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                Receipt verification, air-gapped sandboxing, artifact derivation, dynamic execution, and child report generation.
              </p>
            </div>
            <button
              onClick={() => launchConsole('ORG_B', '/dashboard', true)}
              className="mt-6 w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>Launch as Forensic Analyst (Recommended)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Role 3: Independent Auditor */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 shadow-xs transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                INDEPENDENT AUDITOR
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">National Cyber Audit Board</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                Independent cryptographic verification of custody ledger and artifact lineage without raw file exposure. Exports Section 65B legal certificates.
              </p>
            </div>
            <button
              onClick={() => launchConsole('AUDITOR', '/verification', true)}
              className="mt-6 w-full py-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Launch as Auditor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* EVALUATOR RUNBOOK */}
      <section id="judges-tour" className="relative z-10 py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-[#070e1c] to-[#0c1324] text-white border border-cyan-500/40 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Forensic Architecture SOP</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">Evaluator Runbook: Architecture Verification Protocol</h3>
            </div>
            <button
              onClick={() => launchConsole('ORG_B', '/dashboard', true)}
              className="px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-bold text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
            >
              <span>Launch Evaluation Sandbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-cyan-400 font-bold">STEP 1</span>
              <h5 className="font-bold text-white text-sm">Evidence Dossier</h5>
              <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
                Open <span className="text-slate-200 font-bold">EV-001</span> to inspect the off-chain SHA-256 hash vs on-chain sealed root and the vertical custody timeline.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-amber-400 font-bold">STEP 2</span>
              <h5 className="font-bold text-white text-sm">Adversary Tamper Drill</h5>
              <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
                Trigger the <span className="text-amber-300 font-bold">"Simulate Byte Tamper"</span> drill to witness instant cryptographic breach containment across all validator nodes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-emerald-400 font-bold">STEP 3</span>
              <h5 className="font-bold text-white text-sm">Independent Audit Verification</h5>
              <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
                Navigate to <span className="text-emerald-300 font-bold">/verification</span>, run the 5-point cryptographic check, and export the official attestation report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="relative z-10 py-16 text-center max-w-4xl mx-auto px-4">
        <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Ready to Inspect the Evidence Ledger?
        </h3>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 font-mono">
          Interactive evaluator sandbox configured. Zero installation required.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => launchConsole('ORG_B', '/dashboard', true)}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-mono font-bold text-sm shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
            <span>Launch Evaluation Sandbox</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-4 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-300 font-mono font-bold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <UserPlus className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <span>Sign In / Agency Register</span>
          </button>
        </div>
      </section>

      {/* ENTERPRISE FOOTER */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#03060e]/90 py-10 font-mono text-xs text-slate-600 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <LogoIcon className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
            <span className="text-slate-900 dark:text-white font-bold tracking-wider">HASH<span className="text-cyan-500 dark:text-cyan-400">GUARD</span></span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-slate-600 dark:text-slate-400">Cyber Evidence Exchange Platform</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Local EVM Nodes Synced</span>
            </span>
            <span>•</span>
            <span>NIST SP 800-86</span>
            <span>•</span>
            <span>Section 65B Admissibility</span>
            <span>•</span>
            <span>ISO/IEC 27037</span>
          </div>
        </div>
      </footer>

      {/* INTERACTIVE MODALS */}
      <OnChainProofModal 
        isOpen={onChainModalOpen} 
        onClose={() => setOnChainModalOpen(false)}
        onLaunchSandbox={launchConsole}
      />

      <TamperBreachModal 
        isOpen={tamperModalOpen} 
        onClose={() => setTamperModalOpen(false)}
        onLaunchSandbox={launchConsole}
        onScrollToTamperEngine={() => scrollToTab('tamper')}
      />

      <DemoWalkthroughModal 
        isOpen={demoModalOpen} 
        onClose={() => setDemoModalOpen(false)}
        onLaunchSandbox={launchConsole}
      />
    </div>
  );
};
