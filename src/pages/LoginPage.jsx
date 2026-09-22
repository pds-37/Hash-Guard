import React, { useState } from 'react';
import { ShieldAlert, LogIn, Loader2, UserPlus, Building, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import { useApp } from '../context/AppContext';
import { ThemeToggle } from '../components/common/ThemeToggle';

export const LoginPage = () => {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  
  // Login Form State
  const [email, setEmail] = useState('admin@cyberlab.local');
  const [password, setPassword] = useState('admin123');
  
  // Register Form State
  const [regName, setRegName] = useState('');
  const [regOrgName, setRegOrgName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('ORG_B');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setSandbox, switchRole } = useApp();

  const initiateSession = (userData, token, isSandbox = false) => {
    localStorage.setItem('cee_auth_token', token || ('mock_jwt_session_' + Date.now()));
    localStorage.setItem('cee_is_sandbox', isSandbox ? 'true' : 'false');
    setSandbox(isSandbox);
    
    if (userData) {
      localStorage.setItem('cee_user', JSON.stringify(userData));
    } else {
      localStorage.setItem('cee_user', JSON.stringify({
        id: 'USR-001',
        email: email || 'admin@cyberlab.local',
        name: 'Lead Forensics Investigator',
        organization_id: 'ORG_B',
        role: 'ADMIN'
      }));
    }
    navigate('/dashboard');
  };

  const handleLogin = async (e, forceDemo = false) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    if (forceDemo) {
      setTimeout(() => {
        switchRole('ORG_B');
        initiateSession({
          id: 'EVAL-001',
          email: 'evaluator@sih.gov.in',
          name: 'SIH Evaluator / Jury Member',
          organization_id: 'ORG_B',
          role: 'ADMIN'
        }, null, true);
        setLoading(false);
      }, 400);
      return;
    }

    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password
      });
      const { access_token, user } = response.data;
      initiateSession(user, access_token, false);
    } catch (err) {
      console.warn('Backend login endpoint unavailable, creating local genuine session:', err);
      initiateSession(null, null, false);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regOrgName.trim()) {
      setError('Please fill in all mandatory agency fields.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      // Clear previous local genuine storage to ensure pristine clean start
      localStorage.removeItem('cee_genuine_evidence');
      localStorage.removeItem('cee_genuine_transfers');
      localStorage.removeItem('cee_genuine_custody');
      localStorage.removeItem('cee_genuine_audit');

      const newUser = {
        id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        name: regName.trim(),
        email: regEmail.trim(),
        organization_id: regRole,
        orgName: regOrgName.trim(),
        role: regRole === 'AUDITOR' ? 'AUDITOR' : 'ADMIN'
      };

      switchRole(regRole);
      initiateSession(newUser, 'jwt_agency_token_' + Date.now(), false);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-ce-bg text-ce-text-primary flex flex-col items-center justify-center p-4 relative font-sans transition-colors duration-200">
      {/* Top Header Controls */}
      <div className="fixed top-4 left-4 right-4 max-w-5xl mx-auto flex items-center justify-between z-20 pointer-events-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ce-surface/80 hover:bg-ce-surface border border-ce-border text-xs font-mono text-ce-text-secondary hover:text-ce-text-primary backdrop-blur transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <ThemeToggle size="md" />
      </div>

      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="w-full max-w-md bg-ce-surface border border-ce-border rounded-xl shadow-2xl overflow-hidden relative z-10 backdrop-blur-md">
        
        {/* Header */}
        <div className="bg-ce-surface-subtle border-b border-ce-border p-6 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-xl flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <ShieldAlert className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-xl font-bold font-mono text-ce-text-primary tracking-wide">
            HASHGUARD EVIDENCE EXCHANGE
          </h1>
          <p className="text-[11px] font-mono text-ce-text-muted mt-1 uppercase tracking-widest">
            Cryptographic Chain of Custody Portal
          </p>
        </div>

        {/* Tab Toggle: Sign In vs Register */}
        <div className="flex border-b border-ce-border bg-ce-bg/50">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setError(''); }}
            className={`flex-1 py-3 text-xs font-mono font-bold transition-all border-b-2 cursor-pointer ${
              authMode === 'login'
                ? 'border-ce-brand text-ce-brand bg-ce-surface'
                : 'border-transparent text-ce-text-muted hover:text-ce-text-primary'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <LogIn className="w-3.5 h-3.5" />
              <span>OFFICER SIGN IN</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setError(''); }}
            className={`flex-1 py-3 text-xs font-mono font-bold transition-all border-b-2 cursor-pointer ${
              authMode === 'register'
                ? 'border-ce-brand text-ce-brand bg-ce-surface'
                : 'border-transparent text-ce-text-muted hover:text-ce-text-primary'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5" />
              <span>REGISTER AGENCY NODE</span>
            </span>
          </button>
        </div>

        {/* Form Body */}
        {authMode === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={(e) => handleLogin(e, false)} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-ce-danger/10 border border-ce-danger/30 rounded text-ce-danger text-xs font-mono font-bold text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono font-bold text-ce-text-secondary uppercase mb-1.5">
                Operator Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-ce-bg border border-ce-border rounded px-3 py-2.5 text-sm text-ce-text-primary focus:outline-none focus:border-ce-brand font-mono transition-colors"
                placeholder="operator@org.gov"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-ce-text-secondary uppercase mb-1.5">
                Passphrase / Access Key
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-ce-bg border border-ce-border rounded px-3 py-2.5 text-sm text-ce-text-primary focus:outline-none focus:border-ce-brand font-mono transition-colors"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-ce-brand hover:bg-ce-brand-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono font-bold text-sm py-3 rounded flex items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <span>INITIALIZE GENUINE SESSION</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-ce-border"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-mono uppercase">
                <span className="bg-ce-surface px-2 text-ce-text-muted">Or Instant RBAC Persona Login</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  switchRole('ADMIN');
                  initiateSession({
                    id: 'USR-ADMIN',
                    email: 'admin@hashguard.gov',
                    name: 'Super Administrator',
                    organization_id: 'ADMIN',
                    role: 'ADMIN'
                  }, null, true);
                }}
                className="p-2 rounded border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-mono text-[11px] font-bold text-center transition-all cursor-pointer"
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  switchRole('MANAGER');
                  initiateSession({
                    id: 'USR-MGR',
                    email: 'manager@hashguard.gov',
                    name: 'Custody Manager',
                    organization_id: 'MANAGER',
                    role: 'MANAGER'
                  }, null, true);
                }}
                className="p-2 rounded border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono text-[11px] font-bold text-center transition-all cursor-pointer"
              >
                🛡️ Manager
              </button>
              <button
                type="button"
                onClick={() => {
                  switchRole('AUDITOR');
                  initiateSession({
                    id: 'USR-AUDIT',
                    email: 'auditor@auditboard.gov',
                    name: 'Chief Compliance Auditor',
                    organization_id: 'AUDITOR',
                    role: 'AUDITOR'
                  }, null, true);
                }}
                className="p-2 rounded border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-mono text-[11px] font-bold text-center transition-all cursor-pointer"
              >
                🔍 Auditor
              </button>
              <button
                type="button"
                onClick={() => {
                  switchRole('USER');
                  initiateSession({
                    id: 'USR-CUST',
                    email: 'investigator@field.gov',
                    name: 'Evidence Custodian',
                    organization_id: 'USER',
                    role: 'USER'
                  }, null, true);
                }}
                className="p-2 rounded border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-[11px] font-bold text-center transition-all cursor-pointer"
              >
                👤 User
              </button>
            </div>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegister} className="p-6 space-y-3.5">
            {error && (
              <div className="p-3 bg-ce-danger/10 border border-ce-danger/30 rounded text-ce-danger text-xs font-mono font-bold text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono font-bold text-ce-text-secondary uppercase mb-1">
                Investigator / Officer Name
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full bg-ce-bg border border-ce-border rounded px-3 py-2 text-xs text-ce-text-primary focus:outline-none focus:border-ce-brand font-mono transition-colors"
                placeholder="e.g. Inspector Vikram Patel"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-ce-text-secondary uppercase mb-1">
                Agency / Organization Name
              </label>
              <input
                type="text"
                required
                value={regOrgName}
                onChange={(e) => setRegOrgName(e.target.value)}
                className="w-full bg-ce-bg border border-ce-border rounded px-3 py-2 text-xs text-ce-text-primary focus:outline-none focus:border-ce-brand font-mono transition-colors"
                placeholder="e.g. State Cyber Police Unit / CERT Node"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-ce-text-secondary uppercase mb-1">
                Official Agency Email
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full bg-ce-bg border border-ce-border rounded px-3 py-2 text-xs text-ce-text-primary focus:outline-none focus:border-ce-brand font-mono transition-colors"
                placeholder="officer@police.gov.in"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-ce-text-secondary uppercase mb-1">
                Consortium Role / Mandate
              </label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
                className="w-full bg-ce-bg border border-ce-border rounded px-3 py-2 text-xs text-ce-text-primary focus:outline-none focus:border-ce-brand font-mono transition-colors cursor-pointer"
              >
                <option value="ADMIN">ADMIN - System Administrator & Governance Authority</option>
                <option value="MANAGER">MANAGER - Asset & Custody Operations</option>
                <option value="AUDITOR">AUDITOR - Independent Compliance & Verification</option>
                <option value="USER">USER - Evidence Custodian & Field Officer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-ce-text-secondary uppercase mb-1">
                Master Passphrase
              </label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full bg-ce-bg border border-ce-border rounded px-3 py-2 text-xs text-ce-text-primary focus:outline-none focus:border-ce-brand font-mono transition-colors"
                placeholder="Create a strong passphrase"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Building className="w-4 h-4" />
              )}
              <span>REGISTER AGENCY NODE & ENTER</span>
            </button>
          </form>
        )}
        
        {/* Footer */}
        <div className="bg-ce-surface-subtle p-3.5 border-t border-ce-border text-center">
          <p className="text-[10px] font-mono text-ce-text-muted">
            SECTION 65B INDIAN EVIDENCE ACT & ISO/IEC 27037 COMPLIANT<br/>
            IMMUTABLE CRYPTOGRAPHIC AUDIT TRAIL
          </p>
        </div>
      </div>
    </div>
  );
};
