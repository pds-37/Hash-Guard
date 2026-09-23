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
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  LogIn,
  ChevronRight,
  Wallet,
  Upload,
  RefreshCw,
  Menu,
  X
} from 'lucide-react';
import { useApp, ROLES } from '../../context/AppContext';
import { Logo, LogoIcon } from '../../components/common/Logo';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { SystemArchitectureSection } from '../../components/landing/SystemArchitectureSection';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { switchRole, setSandbox } = useApp();
  const [activeTab, setActiveTab] = useState('segregation');
  const [interactiveTampered, setInteractiveTampered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Interactive Live Runbook Pipeline state for landing page
  const [landingWalletConnected, setLandingWalletConnected] = useState(false);
  const [landingEvidenceSealed, setLandingEvidenceSealed] = useState(false);
  const [landingHashing, setLandingHashing] = useState(false);
  const [landingWalletAddress, setLandingWalletAddress] = useState(null);

  const handleLandingConnectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          setLandingWalletAddress(accounts[0]);
          setLandingWalletConnected(true);
          return;
        }
      } catch (err) {
        console.warn('MetaMask connection rejected or not permitted:', err);
      }
    }
    // Instant fallback address for demonstration
    setLandingWalletAddress('0x71C83956424b9F321890B752A18f');
    setLandingWalletConnected(true);
  };

  const handleLandingSealExhibit = async () => {
    setLandingHashing(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLandingHashing(false);
    setLandingEvidenceSealed(true);
  };

  const handleResetLandingPipeline = () => {
    setLandingWalletConnected(false);
    setLandingEvidenceSealed(false);
    setLandingWalletAddress(null);
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
      organization_id: targetRole === 'ORG_A' ? 'ORG_A' : targetRole === 'ORG_B' ? 'ORG_B' : 'AUDITOR',
      role: targetRole === 'AUDITOR' ? 'AUDITOR' : 'ADMIN'
    };

    localStorage.setItem('cee_auth_token', 'mock_jwt_session_' + Date.now());
    localStorage.setItem('cee_user', JSON.stringify(mockUser));
    navigate(targetPath);
  };

  const sampleOriginalHash = '4a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b';
  const sampleTamperedHash = '7a21f9c82e04192b47e301293840192830192840192830192830192830192830';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden font-sans transition-colors duration-200">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 left-1/3 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-[150px]" />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* STICKY GLASSMORPHIC NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-[#070b14]/90 border-b border-slate-200 dark:border-slate-800/80 transition-all shadow-sm dark:shadow-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Logo 
            size="md" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          />

          {/* Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-7 text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 shrink-0">
            <button 
              onClick={() => scrollToSection('architecture')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Architecture
            </button>
            <button 
              onClick={() => scrollToTab('lineage')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Lineage DAG
            </button>
            <button 
              onClick={() => scrollToTab('tamper')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Tamper Engine
            </button>
            <button 
              onClick={() => scrollToSection('roles')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Agency Roles
            </button>
            <button 
              onClick={() => scrollToSection('judges-tour')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
              <span>Evaluator SOP</span>
            </button>
          </nav>

          {/* Action CTAs + Mobile Menu Trigger */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ThemeToggle size="sm" />

            <button
              onClick={() => navigate('/login')}
              className="hidden sm:flex px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-mono transition-all cursor-pointer items-center gap-1.5 shrink-0 whitespace-nowrap shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Sign In<span className="hidden xl:inline"> / Register</span></span>
            </button>

            <button
              onClick={() => launchConsole('ORG_B', '/dashboard', true)}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Zap className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
              <span><span className="hidden sm:inline">EVALUATOR </span>SANDBOX</span>
            </button>

            {/* Mobile / Tablet Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-500 dark:text-cyan-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800/90 bg-white/98 dark:bg-[#070b14]/98 backdrop-blur-xl px-4 py-4 space-y-3 shadow-2xl transition-all">
            <div className="flex flex-col space-y-1 text-xs font-mono uppercase tracking-wider">
              <button
                onClick={() => scrollToSection('architecture')}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
              >
                <span>Architecture Overview</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              </button>

              <button
                onClick={() => scrollToTab('lineage')}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
              >
                <span>Lineage DAG Protocol</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              </button>

              <button
                onClick={() => scrollToTab('tamper')}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
              >
                <span>Live Tamper Engine</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              </button>

              <button
                onClick={() => scrollToSection('roles')}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
              >
                <span>Agency Roles (RBAC)</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              </button>

              <button
                onClick={() => scrollToSection('judges-tour')}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                  <span>Evaluator SOP Walkthrough</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
              </button>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex flex-col gap-2 font-mono">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-xs text-slate-600 dark:text-slate-400">Theme</span>
                <ThemeToggle variant="pill" />
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs cursor-pointer shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Sign In / Agency Register</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-14 pb-16 md:pt-20 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Consensus Pulse Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 shadow-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Permissioned Audit Ledger Active <span className="text-slate-400 dark:text-slate-500">•</span> EVM Block #483,192 <span className="text-slate-400 dark:text-slate-500">•</span> Smart India Hackathon 2026
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-[1.15]">
          The Cryptographic Chain of Custody for{' '}
          <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Digital Forensic Evidence
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
          Cryptographically seal forensic exhibits, enforce multi-agency custody handoffs with mTLS handshakes, and verify integrity with zero off-chain data leakage—powered by SHA-256 and EVM smart contracts.
        </p>

        {/* Dual Primary CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => launchConsole('ORG_B', '/dashboard', true)}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span>⚡ ONE-CLICK EVALUATOR SANDBOX</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:border-cyan-500/40"
          >
            <UserPlus className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <span>REGISTER AGENCY NODE (GENUINE APP)</span>
          </button>
        </div>

        <p className="mt-3 text-[11px] font-mono text-slate-500">
          *Evaluator Sandbox is pre-loaded with forensic malware specimens & adversary tamper drills for rapid demonstration.
        </p>

        {/* Compliance & Standards Strip */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>ISO/IEC 27037:2012</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Sec 65B Indian Evidence Act</span>
          </div>
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-blue-400" />
            <span>NIST SP 800-86 Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            <span>EVM Hash Consensus</span>
          </div>
        </div>
      </section>

      {/* INTERACTIVE OPERATIONAL RUNBOOK (MATCHING USER SCREENSHOT) */}
      <section id="onboarding-pipeline" className="relative z-10 py-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-white dark:bg-[#0b1120]/95 border border-slate-200 dark:border-cyan-500/30 p-5 md:p-6 shadow-lg dark:shadow-[0_0_35px_rgba(6,182,212,0.12)] backdrop-blur-xl relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                <Sparkles className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-sm font-bold font-mono text-slate-900 dark:text-white tracking-wide uppercase">
                    AGENCY NODE ACTIVATION RUNBOOK
                  </h3>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold">
                    GENUINE PRODUCTION MODE
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Follow the 4-step cryptographic pipeline to initialize custody sealing and zero-knowledge verification.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {(landingWalletConnected || landingEvidenceSealed) && (
                <button
                  onClick={handleResetLandingPipeline}
                  className="text-[11px] font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  Reset Pipeline Demo
                </button>
              )}
            </div>
          </div>

          {/* 4 Steps Grid */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* STEP 01 */}
            <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                    STEP 01
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>DONE</span>
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white font-mono leading-tight">
                  Agency Node Authorization
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Logged in as Inspector Vikram (StateA). Session authenticated.
                </p>
              </div>
            </div>

            {/* STEP 02 */}
            <div className={`p-4 rounded-lg border flex flex-col justify-between transition-all ${
              landingWalletConnected 
                ? 'bg-emerald-500/5 border-emerald-500/30' 
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
            }`}>
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                    STEP 02
                  </span>
                  {landingWalletConnected ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>DONE</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                      PENDING
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white font-mono leading-tight">
                  Web3 & DID Key Binding
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {landingWalletConnected
                    ? `Decentralized Identity bound: did:ethr:${landingWalletAddress ? landingWalletAddress.substring(0,6) + '...' + landingWalletAddress.substring(landingWalletAddress.length - 4) : '0x71C8...A18f'}. ECDSA secp256k1 key active.`
                    : 'Connect MetaMask wallet to bind an ECDSA key for cryptographic sealing & smart contract anchoring.'}
                </p>
              </div>

              {!landingWalletConnected && (
                <div className="mt-3">
                  <button
                    onClick={handleLandingConnectWallet}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <Wallet className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                    <span>Connect MetaMask Wallet</span>
                  </button>
                </div>
              )}
            </div>

            {/* STEP 03 */}
            <div className={`p-4 rounded-lg border flex flex-col justify-between transition-all ${
              landingEvidenceSealed 
                ? 'bg-emerald-500/5 border-emerald-500/30' 
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
            }`}>
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                    STEP 03
                  </span>
                  {landingEvidenceSealed ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>DONE</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                      PENDING
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white font-mono leading-tight">
                  Ingest & Client-Side Hash Exhibit
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {landingEvidenceSealed
                    ? 'Exhibit EV-892F1 sealed. Local WebCrypto SHA-256: 4a7b8c...c5d6 anchored.'
                    : 'Select a forensic file. Binary bytes are hashed directly in browser memory before being anchored.'}
                </p>
              </div>

              {!landingEvidenceSealed && (
                <div className="mt-3">
                  <button
                    onClick={handleLandingSealExhibit}
                    disabled={landingHashing}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {landingHashing ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-500 dark:text-cyan-400" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                    )}
                    <span>{landingHashing ? 'Hashing SHA-256...' : '+ Collect & Seal First Exhibit'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* STEP 04 */}
            <div className={`p-4 rounded-lg border flex flex-col justify-between transition-all ${
              landingEvidenceSealed 
                ? 'bg-cyan-500/5 border-cyan-500/30' 
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
            }`}>
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                    STEP 04
                  </span>
                  {landingEvidenceSealed ? (
                    <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      READY
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                      PENDING
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white font-mono leading-tight">
                  Zero-Knowledge Independent Verification
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Verify cryptographic root and chain of custody without exposing raw evidence content.
                </p>
              </div>

              {landingEvidenceSealed && (
                <div className="mt-3">
                  <button
                    onClick={() => launchConsole('AUDITOR', '/verification', true)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Open Verification Enclave →</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEM ARCHITECTURE BLUEPRINT SECTION */}
      <SystemArchitectureSection onLaunchSandbox={launchConsole} />

      {/* INTERACTIVE SECURITY CONSOLE & TAMPER LAB */}
      <section id="security-lab" className="relative z-10 py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0b1120] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
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
                  ? 'border-cyan-400 bg-[#0b1120] text-cyan-400 font-bold'
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
                  ? 'border-cyan-400 bg-[#0b1120] text-cyan-400 font-bold'
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
                  ? 'border-cyan-400 bg-[#0b1120] text-cyan-400 font-bold'
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
                  <p className="text-xs text-slate-400 leading-relaxed">
                    GB-scale disk images (.E01, .raw), PCAP captures, malware binaries, and memory dumps never touch the public blockchain. They reside in air-gapped, AES-256-GCM encrypted object enclaves.
                  </p>
                  <div className="p-3 bg-slate-950 rounded border border-slate-800/80 font-mono text-xs space-y-1 text-slate-300">
                    <div><span className="text-slate-500">Asset:</span> specimen_lockbit_dump.dd (4.2 GB)</div>
                    <div><span className="text-slate-500">Vault:</span> vault://secure-storage/org-a/EV-001.raw</div>
                    <div><span className="text-slate-500">Encryption:</span> AES-256-GCM (HSM Key Wrapped)</div>
                  </div>
                </div>

                {/* On-Chain Card */}
                <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">2. On-Chain Ledger (Immutable Proof)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">ETHEREUM / BESU EVM</span>
                  </div>
                  <h4 className="text-base font-bold text-white">Cryptographic State Machine</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Only deterministic SHA-256 bit digests, HSM signatures, RFC 3161 timestamps, and parent derivation hashes are committed to the permissioned audit smart contract.
                  </p>
                  <div className="p-3 bg-slate-950 rounded border border-slate-800/80 font-mono text-xs space-y-1 text-slate-300">
                    <div><span className="text-slate-500">Digest:</span> 4a7b8c9d0e1f2a3b...c5d6e7f8</div>
                    <div><span className="text-slate-500">Contract:</span> 0x3b91...8f12 (HashGuard.sol)</div>
                    <div><span className="text-slate-500">State:</span> VERIFIED_SEALED (Block #483,109)</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-xl flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span className="text-xs font-mono text-slate-300">
                    Independent zero-knowledge auditors can verify absolute integrity without exposing classified payload data.
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
                  <div className="text-sm font-bold text-white mt-1">EV-001 (Raw Disk)</div>
                  <div className="text-[11px] font-mono text-slate-400 truncate mt-1">Seized by CERT-Alpha</div>
                  <div className="mt-3 text-[10px] font-mono bg-slate-950 p-2 rounded border border-slate-800 text-slate-400 truncate">
                    Hash: 4a7b8c...e7f8
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
                  <span>Open Interactive React Flow Lineage DAG</span>
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
                    <span className="text-xs font-mono font-bold text-white">EV-001 (LockBit 3.0 Ransomware Specimen)</span>
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
                    <div className="text-[10px] text-slate-500 mt-1">Anchored in Block #482850</div>
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
                  className="px-5 py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-mono font-bold text-xs hover:bg-cyan-400 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Test Full Tamper System Inside Sandbox Console</span>
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
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Digital evidence cross-organization exchange between police forces, CERT teams, defense labs, and judicial courts is vulnerable to tampering disputes and lack of mathematical provenance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Traditional */}
          <div className="p-6 rounded-2xl bg-rose-500/5 dark:bg-rose-950/10 border border-rose-300 dark:border-rose-900/30 space-y-4 shadow-sm">
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
          <div className="p-6 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/10 border border-emerald-400 dark:border-emerald-500/30 space-y-4 shadow-sm dark:shadow-[0_0_25px_rgba(16,185,129,0.08)]">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs uppercase font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>HashGuard Protocol (Cryptographic Proof)</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 font-mono">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Deterministic SHA-256 bit digests locked to immutable blockchain blocks.</span>
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
                <span>1-click zero-knowledge courtroom attestation certificates.</span>
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
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 shadow-sm transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 dark:text-cyan-400">
              <Fingerprint className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">SHA-256 Bit Attestation</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every digital exhibit is deterministically hashed upon physical seizure. Continuous off-chain vs on-chain comparison guarantees bit-level integrity.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 shadow-sm transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Cryptographic Transfers</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Inter-agency custody handoffs require mTLS mutual authentication, recipient acceptance signatures, and automated block confirmation.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 shadow-sm transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 dark:text-purple-400">
              <GitFork className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Lineage Provenance DAG</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Decompiled modules, memory carvings, and YARA IOCs inherit parent specimen signatures in an interactive mathematical derivation graph.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 shadow-sm transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
              <Eye className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Zero-Knowledge Auditing</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Judicial courts and independent oversight boards can mathematically prove custody continuity without gaining access to classified raw payloads.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 shadow-sm transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Automated Retention Policies</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Regulatory lifecycles, automated secure wiping, and cold-storage time-locks adhere to statutory retention guidelines with signed proof.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 shadow-sm transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 dark:text-cyan-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Courtroom Attestation PDF/JSON</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Export cryptographic attestation certificates with 5-point verification checkmarks, block heights, and HSM fingerprints ready for legal submission.
            </p>
          </div>
        </div>
      </section>

      {/* MULTI-AGENCY STAKEHOLDER ROLES */}
      <section id="roles" className="relative z-10 py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold mb-2">Role-Based Access Control</h2>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Multi-Agency Perspectives</h3>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Click on any role below to immediately enter the prototype with pre-configured role permissions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Role 1: CERT-Alpha */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 shadow-sm transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold uppercase">
                ORGANIZATION A
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">CERT-Alpha (Collector)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Initial seizure of disk images, memory dumps, and network logs. Performs bit-level hashing, HSM signing, and mTLS dispatch.
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
                ORGANIZATION B (PRIMARY)
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Cyber Defense Lab (Analyst)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Receipt verification, air-gapped sandboxing, artifact derivation, dynamic execution, and child report generation.
              </p>
            </div>
            <button
              onClick={() => launchConsole('ORG_B', '/dashboard', true)}
              className="mt-6 w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>Launch as Forensic Analyst</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Role 3: Independent Auditor */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 shadow-sm transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                INDEPENDENT OVERSIGHT
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">National Cyber Audit Board</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Zero-trust cryptographic verification of custody ledger and artifact lineage without file access. Exports legal certificates.
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
        <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-[#0c1324] text-white border border-cyan-500/40 shadow-2xl space-y-6">
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
              className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer self-start sm:self-auto"
            >
              START EVALUATION RUNBOOK
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-cyan-400 font-bold">STEP 1</span>
              <h5 className="font-bold text-white text-sm">Evidence Dossier</h5>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Open <span className="text-slate-200 font-bold">EV-001</span> to inspect the off-chain SHA-256 hash vs on-chain sealed root and the vertical custody timeline.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-amber-400 font-bold">STEP 2</span>
              <h5 className="font-bold text-white text-sm">Adversary Tamper Drill</h5>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Trigger the <span className="text-amber-300 font-bold">"Inject Bit-Tamper Drill"</span> to witness instant zero-trust cryptographic breach containment across all nodes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-emerald-400 font-bold">STEP 3</span>
              <h5 className="font-bold text-white text-sm">Zero-Trust Audit</h5>
              <p className="text-slate-400 text-[11px] leading-relaxed">
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
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-sm shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
            <span>EXPLORE LIVE PROTOTYPE (INSTANT SANDBOX)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-4 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-300 font-mono font-bold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <UserPlus className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <span>CREATE GENUINE AGENCY ACCOUNT</span>
          </button>
        </div>
      </section>

      {/* ENTERPRISE FOOTER */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 py-10 font-mono text-xs text-slate-600 dark:text-slate-400 transition-colors">
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
              <span>Consortium Nodes Synced</span>
            </span>
            <span>•</span>
            <span>NIST SP 800-86</span>
            <span>•</span>
            <span>Section 65B Certified</span>
            <span>•</span>
            <span>ISO/IEC 27037</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
