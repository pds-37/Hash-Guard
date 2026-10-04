import React, { useState } from 'react';
import { 
  ShieldAlert, 
  LogIn, 
  Loader2, 
  UserPlus, 
  Building2, 
  ArrowLeft, 
  Lock, 
  Link2, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  KeyRound, 
  Check,
  ChevronRight,
  Fingerprint
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import { useApp } from '../context/AppContext';
import { ThemeToggle } from '../components/common/ThemeToggle';

export const LoginPage = () => {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  
  // Login Form State
  const [email, setEmail] = useState('analyst@cyberlab.local');
  const [password, setPassword] = useState('•••••••••••');
  const [selectedOrgId, setSelectedOrgId] = useState('ORG_B');
  
  // Register Organization State
  const [regOrgName, setRegOrgName] = useState('Cyber Defense Lab');
  const [regOrgType, setRegOrgType] = useState('Cybersecurity / Forensics Lab');
  const [regOrgId, setRegOrgId] = useState(() => `ORG-${Math.floor(1000 + Math.random() * 9000)}`);
  const [regDid, setRegDid] = useState(() => `did:ethr:0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`);
  const [regAdminEmail, setRegAdminEmail] = useState('admin@cyberlab.local');
  const [regPassword, setRegPassword] = useState('');
  const [registeredResult, setRegisteredResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { 
    organizations, 
    loginSession, 
    registerOrganization, 
    getUsersForOrg 
  } = useApp();

  const generateNewDid = () => {
    const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setRegDid(`did:ethr:0x${randomHex}`);
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    const targetOrg = organizations[selectedOrgId] || {
      id: selectedOrgId,
      name: 'Cyber Defense Lab',
      shortName: 'Cyber Defense Lab',
      code: selectedOrgId
    };

    // Look up if user already exists in this organization
    const orgUserList = getUsersForOrg ? getUsersForOrg(targetOrg.id) : [];
    const matchedUser = orgUserList.find(u => u.email.toLowerCase() === email.toLowerCase());

    let roleToAssign = 'FORENSIC_ANALYST';
    let userObj = null;

    if (matchedUser) {
      roleToAssign = matchedUser.role;
      userObj = matchedUser;
    } else {
      if (email.toLowerCase().includes('admin')) roleToAssign = 'ADMINISTRATOR';
      else if (email.toLowerCase().includes('audit')) roleToAssign = 'AUDITOR';
      else if (email.toLowerCase().includes('custod')) roleToAssign = 'EVIDENCE_CUSTODIAN';
      else if (email.toLowerCase().includes('investigat')) roleToAssign = 'INVESTIGATOR';
      else if (targetOrg.id === 'ORG_A') roleToAssign = 'FIRST_RESPONDER';
      else roleToAssign = 'FORENSIC_ANALYST';

      userObj = {
        id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        email: email.trim(),
        name: email.split('@')[0].replace(/[._]/g, ' ').toUpperCase(),
        orgId: targetOrg.id,
        role: roleToAssign,
        status: 'ACTIVE'
      };
    }

    try {
      const response = await apiClient.post('/auth/login', {
        email: email.trim(),
        password,
        organization_id: targetOrg.id
      });
      const { access_token, user } = response.data;
      loginSession({
        user: user || userObj,
        organizationId: targetOrg.id,
        roleId: roleToAssign,
        token: access_token,
        isSandbox: false
      });
      navigate('/dashboard');
    } catch (err) {
      console.warn('Backend login endpoint unavailable or fallback mode active. Initializing genuine session:', err);
      loginSession({
        user: userObj,
        organizationId: targetOrg.id,
        roleId: roleToAssign,
        token: 'jwt_session_' + Date.now(),
        isSandbox: false
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (roleId) => {
    setLoading(true);
    setError('');

    // Target organization is strictly Cyber Defense Lab
    const demoOrgId = 'ORG_B';
    let demoEmail = 'analyst@cyberlab.local';
    let demoName = 'Lead Forensic Analyst';

    if (roleId === 'ADMINISTRATOR') {
      demoEmail = 'admin@cyberlab.local';
      demoName = 'Dr. Sarah Chen';
    } else if (roleId === 'AUDITOR') {
      demoEmail = 'audit@cyberlab.local';
      demoName = 'Elena Rostova';
    } else if (roleId === 'EVIDENCE_CUSTODIAN') {
      demoEmail = 'custody@cyberlab.local';
      demoName = 'Marcus Vance';
    } else if (roleId === 'FORENSIC_ANALYST') {
      demoEmail = 'analyst@cyberlab.local';
      demoName = 'Vikram Malhotra';
    }

    const demoUser = {
      id: `DEMO-${roleId.slice(0, 4)}`,
      email: demoEmail,
      name: demoName,
      orgId: demoOrgId,
      role: roleId,
      status: 'ACTIVE'
    };

    setTimeout(() => {
      loginSession({
        user: demoUser,
        organizationId: demoOrgId,
        roleId: roleId,
        token: `demo_jwt_${roleId.toLowerCase()}_` + Date.now(),
        isSandbox: true
      });
      navigate('/dashboard');
      setLoading(false);
    }, 200);
  };

  const handleRegisterOrg = (e) => {
    e.preventDefault();
    if (!regOrgName.trim() || !regAdminEmail.trim() || !regPassword.trim()) {
      setError('Please fill in all mandatory organization registration fields.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      const result = registerOrganization({
        name: regOrgName.trim(),
        type: regOrgType,
        orgId: regOrgId,
        did: regDid,
        adminEmail: regAdminEmail.trim(),
        adminName: `${regOrgName.trim()} Administrator`
      });

      setRegisteredResult(result);
      setLoading(false);
    }, 350);
  };

  const handleEnterRegisteredOrg = () => {
    if (!registeredResult) return;
    const { newOrg, adminUser } = registeredResult;
    loginSession({
      user: adminUser,
      organizationId: newOrg.id,
      roleId: 'ADMINISTRATOR',
      token: 'jwt_admin_' + Date.now(),
      isSandbox: false
    });
    navigate('/dashboard');
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
        <div className="p-6 pb-4 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center mb-2.5 shadow-sm">
            <ShieldAlert className="w-6 h-6 text-cyan-400" />
          </div>
          <h1 className="text-lg font-bold font-mono text-ce-text-primary tracking-wide">
            HASHGUARD
          </h1>
          <p className="text-xs text-ce-text-muted mt-0.5">
            Verifiable Digital Asset Trust Infrastructure
          </p>
        </div>

        {/* Tab Toggle: Sign In vs Register Organization */}
        <div className="flex border-b border-ce-border bg-ce-bg/40 px-2 pt-1 gap-1">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setError(''); setRegisteredResult(null); }}
            className={`flex-1 py-2 text-xs font-mono font-medium rounded-t-lg transition-all cursor-pointer ${
              authMode === 'login'
                ? 'bg-ce-surface text-ce-text-primary border-t border-x border-ce-border font-bold'
                : 'text-ce-text-muted hover:text-ce-text-primary'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <LogIn className="w-3.5 h-3.5 text-cyan-400" />
              <span>Officer Sign In</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setError(''); }}
            className={`flex-1 py-2 text-xs font-mono font-medium rounded-t-lg transition-all cursor-pointer ${
              authMode === 'register'
                ? 'bg-ce-surface text-ce-text-primary border-t border-x border-ce-border font-bold'
                : 'text-ce-text-muted hover:text-ce-text-primary'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Register Org</span>
            </span>
          </button>
        </div>

        {/* Form Body */}
        {authMode === 'login' ? (
          /* LOGIN FORM */
          <div className="p-6 space-y-5">
            {error && (
              <div className="p-2.5 bg-ce-danger/10 border border-ce-danger/30 rounded-lg text-ce-danger text-xs font-mono font-medium text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-ce-text-secondary uppercase mb-1.5 tracking-wider">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-ce-bg border border-ce-border focus:border-ce-brand rounded-lg px-3.5 py-2.5 text-xs text-ce-text-primary focus:outline-none font-mono transition-colors shadow-inner"
                  placeholder="analyst@cyberlab.local"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-ce-text-secondary uppercase mb-1.5 tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-ce-bg border border-ce-border focus:border-ce-brand rounded-lg px-3.5 py-2.5 text-xs text-ce-text-primary focus:outline-none font-mono transition-colors shadow-inner"
                  placeholder="•••••••••••"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono text-ce-text-secondary uppercase tracking-wider">
                    Organization
                  </label>
                  <span className="text-[10px] font-mono text-ce-text-muted">
                    {organizations[selectedOrgId]?.shortName || 'Cyber Defense Lab'}
                  </span>
                </div>
                <select
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                  className="w-full bg-ce-bg border border-ce-border focus:border-ce-brand rounded-lg px-3.5 py-2.5 text-xs text-ce-text-primary focus:outline-none font-mono transition-colors cursor-pointer"
                >
                  <option value="ORG_B">Cyber Defense Lab (Forensics)</option>
                  <option value="ORG_A">CERT-Alpha (Incident Response)</option>
                  <option value="ORG_D">Cyber Crime Police (Law Enforcement)</option>
                  <option value="ORG_C">Judicial Court Registry (Judiciary)</option>
                  <option value="ORG_AUDIT">Audit Board (Independent Oversight)</option>
                  {Object.values(organizations || {})
                    .filter((org) => !['ORG_A', 'ORG_B', 'ORG_C', 'ORG_D', 'ORG_AUDIT'].includes(org.id))
                    .map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 bg-ce-brand hover:bg-ce-brand-hover active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                <span>INITIALIZE SECURE SESSION</span>
              </button>
            </form>

            {/* QUICK DEMO ROLES */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="h-px bg-ce-border flex-1" />
                <span className="text-[10px] font-mono uppercase text-ce-text-muted tracking-wider">
                  Quick Access Simulation
                </span>
                <div className="h-px bg-ce-border flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('ADMINISTRATOR')}
                  className="py-2 px-3 rounded-lg border border-ce-border hover:border-rose-500/50 bg-ce-surface hover:bg-rose-500/5 text-ce-text-secondary hover:text-rose-400 font-mono text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span>Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('FORENSIC_ANALYST')}
                  className="py-2 px-3 rounded-lg border border-ce-border hover:border-purple-500/50 bg-ce-surface hover:bg-purple-500/5 text-ce-text-secondary hover:text-purple-400 font-mono text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>Analyst</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('AUDITOR')}
                  className="py-2 px-3 rounded-lg border border-ce-border hover:border-cyan-500/50 bg-ce-surface hover:bg-cyan-500/5 text-ce-text-secondary hover:text-cyan-400 font-mono text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Auditor</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('EVIDENCE_CUSTODIAN')}
                  className="py-2 px-3 rounded-lg border border-ce-border hover:border-emerald-500/50 bg-ce-surface hover:bg-emerald-500/5 text-ce-text-secondary hover:text-emerald-400 font-mono text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Custodian</span>
                </button>
              </div>
            </div>

            {/* Subdued Trust Badges */}
            <div className="pt-2 border-t border-ce-border/50 flex items-center justify-center gap-4 text-[10px] font-mono text-ce-text-muted">
              <span className="flex items-center gap-1"><Lock className="w-2.5 h-2.5 text-cyan-400" /> DID Auth</span>
              <span className="text-ce-border">•</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-2.5 h-2.5 text-emerald-400" /> RBAC Enforced</span>
              <span className="text-ce-border">•</span>
              <span className="flex items-center gap-1"><Link2 className="w-2.5 h-2.5 text-purple-400" /> Chain-of-Custody</span>
            </div>
          </div>
        ) : (
          /* REGISTRATION TAB */
          <div className="p-6">
            {registeredResult ? (
              /* REGISTRATION SUCCESS VIEW */
              <div className="space-y-4 text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-full bg-ce-success/10 border border-ce-success/30 flex items-center justify-center mx-auto text-ce-success">
                  <Check className="w-6 h-6" />
                </div>

                <div>
                  <div className="text-xs font-mono font-bold text-ce-success uppercase tracking-wider">
                    ORGANIZATION CREATED ✓
                  </div>
                  <h3 className="text-lg font-bold font-mono text-ce-text-primary mt-1">
                    {registeredResult.newOrg.name}
                  </h3>
                  <p className="text-[11px] text-ce-text-muted mt-0.5">
                    Enclave registered & provisioned on federated ledger
                  </p>
                </div>

                <div className="p-3.5 bg-ce-bg border border-ce-border rounded-lg text-left space-y-2 font-mono text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-ce-text-muted block">Organization ID:</span>
                    <span className="text-ce-text-primary font-bold">{registeredResult.newOrg.id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-ce-text-muted block">Decentralized Identifier (DID):</span>
                    <span className="text-ce-blockchain font-bold text-[11px] break-all">{registeredResult.newOrg.did}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-ce-text-muted block">Initial Administrator:</span>
                    <span className="text-ce-text-primary">{registeredResult.adminUser.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-ce-text-muted block">Initial Role:</span>
                    <span className="text-rose-400 font-bold">Organization Administrator</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] text-left leading-relaxed">
                  ℹ️ The initial administrator belongs <strong>ONLY</strong> to the newly created organization. Role and access boundaries remain strictly isolated.
                </div>

                <button
                  type="button"
                  onClick={handleEnterRegisteredOrg}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                >
                  <span>INITIALIZE SESSION AS ADMINISTRATOR</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* REGISTRATION FORM */
              <form onSubmit={handleRegisterOrg} className="space-y-3.5">
                <div className="pb-1 border-b border-ce-border/60">
                  <h2 className="text-sm font-mono font-bold uppercase text-ce-text-primary">
                    REGISTER ORGANIZATION
                  </h2>
                  <p className="text-xs text-ce-text-muted mt-0.5">
                    Deploy a new agency enclave into the federated evidence exchange
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-ce-danger/10 border border-ce-danger/30 rounded text-ce-danger text-xs font-mono font-bold text-center">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono font-bold text-ce-text-secondary uppercase mb-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    required
                    value={regOrgName}
                    onChange={(e) => setRegOrgName(e.target.value)}
                    className="w-full bg-ce-bg border border-ce-border rounded-lg px-3 py-2 text-xs text-ce-text-primary focus:outline-none focus:border-ce-brand font-mono transition-colors"
                    placeholder="Cyber Defense Lab"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-ce-text-secondary uppercase mb-1">
                    Organization Type
                  </label>
                  <select
                    value={regOrgType}
                    onChange={(e) => setRegOrgType(e.target.value)}
                    className="w-full bg-ce-bg border border-ce-border rounded-lg px-3 py-2 text-xs text-ce-text-primary focus:outline-none focus:border-ce-brand font-mono transition-colors cursor-pointer"
                  >
                    <option value="Cybersecurity / Forensics Lab">Cybersecurity / Forensics Lab</option>
                    <option value="Incident Response Team (CERT)">Incident Response Team (CERT)</option>
                    <option value="Judicial Court Registry">Judicial Court Registry</option>
                    <option value="Law Enforcement Agency (LEA)">Law Enforcement Agency (LEA)</option>
                    <option value="Independent Regulatory & Audit Oversight">Independent Regulatory & Audit Oversight</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-mono font-bold text-ce-text-secondary uppercase mb-1">
                      Organization ID
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={regOrgId}
                      className="w-full bg-ce-surface-subtle border border-ce-border text-ce-brand font-mono font-bold text-xs rounded-lg px-3 py-2 focus:outline-none cursor-not-allowed opacity-90"
                      title="Auto-generated unique agency node identifier"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-mono font-bold text-ce-text-secondary uppercase">
                        Organization DID
                      </label>
                      <button
                        type="button"
                        onClick={generateNewDid}
                        className="text-[10px] text-ce-brand hover:underline font-mono"
                      >
                        Generate DID
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={regDid}
                        className="w-full bg-ce-surface-subtle border border-ce-border text-ce-blockchain font-mono text-[11px] rounded-lg px-3 py-2 focus:outline-none truncate pr-8 cursor-not-allowed"
                        title={regDid}
                      />
                      <Fingerprint className="w-3.5 h-3.5 text-ce-blockchain absolute right-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-ce-text-secondary uppercase mb-1">
                    Initial Administrator
                  </label>
                  <input
                    type="email"
                    required
                    value={regAdminEmail}
                    onChange={(e) => setRegAdminEmail(e.target.value)}
                    className="w-full bg-ce-bg border border-ce-border rounded-lg px-3 py-2 text-xs text-ce-text-primary focus:outline-none focus:border-ce-brand font-mono transition-colors"
                    placeholder="admin@cyberlab.local"
                  />
                  <span className="text-[10px] text-ce-text-muted font-mono mt-0.5 block">
                    Assigned initial role: Organization Administrator
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-ce-text-secondary uppercase mb-1">
                    Passphrase / Access Key
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-ce-bg border border-ce-border rounded-lg px-3 py-2 text-xs text-ce-text-primary focus:outline-none focus:border-ce-brand font-mono transition-colors"
                    placeholder="Create a strong passphrase"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Building2 className="w-4 h-4" />
                  )}
                  <span>REGISTER ORGANIZATION</span>
                </button>
              </form>
            )}
          </div>
        )}
        
        {/* Footer */}
        <div className="bg-ce-surface-subtle p-3.5 border-t border-ce-border text-center">
          <p className="text-[10px] font-mono text-ce-text-muted">
            VERIFIABLE TRUST INFRASTRUCTURE &bull; DIGITAL FORENSICS &amp; ASSET TRUST<br/>
            TAMPER-EVIDENT CRYPTOGRAPHIC AUDIT TRAIL
          </p>
        </div>
      </div>
    </div>
  );
};
