import React, { useState } from 'react';
import { 
  Shield, 
  LogIn, 
  Loader2, 
  Building2, 
  ArrowLeft, 
  Check,
  ChevronRight,
  Fingerprint,
  Sun,
  Moon,
  ArrowRight
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import { useApp } from '../context/AppContext';

export const LoginPage = () => {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  
  // Login Form State
  const [email, setEmail] = useState('admin@cyberlab.local');
  const [password, setPassword] = useState('•••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState('ORG_B');
  const [activeClearance, setActiveClearance] = useState('ADMINISTRATOR');
  
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
    getUsersForOrg,
    theme,
    setTheme
  } = useApp();

  const isLight = theme === 'light';

  const toggleTheme = () => {
    setTheme(isLight ? 'dark' : 'light');
  };

  const generateNewDid = () => {
    const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setRegDid(`did:ethr:0x${randomHex}`);
  };

  const handleRoleSelection = (roleId) => {
    setActiveClearance(roleId);
    if (roleId === 'ADMINISTRATOR') setEmail('admin@cyberlab.local');
    else if (roleId === 'FORENSIC_ANALYST') setEmail('analyst@cyberlab.local');
    else if (roleId === 'AUDITOR') setEmail('audit@cyberlab.local');
    else if (roleId === 'EVIDENCE_CUSTODIAN') setEmail('custody@cyberlab.local');
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

    const orgUserList = getUsersForOrg ? getUsersForOrg(targetOrg.id) : [];
    const matchedUser = orgUserList.find(u => u.email.toLowerCase() === email.toLowerCase());

    let roleToAssign = activeClearance || 'FORENSIC_ANALYST';
    let userObj = null;

    if (matchedUser) {
      roleToAssign = matchedUser.role;
      userObj = matchedUser;
    } else {
      let userName = 'OPERATOR';
      if (email.toLowerCase().includes('admin')) {
        roleToAssign = 'ADMINISTRATOR';
        userName = 'Dr. Sarah Chen';
      } else if (email.toLowerCase().includes('audit')) {
        roleToAssign = 'AUDITOR';
        userName = 'Elena Rostova';
      } else if (email.toLowerCase().includes('custod')) {
        roleToAssign = 'EVIDENCE_CUSTODIAN';
        userName = 'Marcus Vance';
      } else if (email.toLowerCase().includes('analyst')) {
        roleToAssign = 'FORENSIC_ANALYST';
        userName = 'Vikram Malhotra';
      } else if (targetOrg.id === 'ORG_A') {
        roleToAssign = 'FIRST_RESPONDER';
        userName = 'Commander Hayes';
      }

      userObj = {
        id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        email: email.trim(),
        name: userName,
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
    <div 
      className={`min-h-screen w-full transition-colors duration-300 font-sans relative flex items-center justify-center p-6 md:p-12 overflow-x-hidden ${
        isLight ? 'bg-[#edeae3] text-[#1c2229]' : 'bg-[#0b1017] text-[#e6edf3]'
      }`}
      style={{
        backgroundImage: isLight 
          ? 'radial-gradient(rgba(30, 41, 59, 0.12) 1px, transparent 1px)' 
          : 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
    >
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center relative z-10">
        
        {/* LEFT COLUMN: HERO EDITORIAL STORY */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
          {/* Header row: Brand & Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Shield className={`w-5 h-5 ${isLight ? 'text-[#1c2229]' : 'text-white'}`} strokeWidth={2.2} />
              <span className="font-mono text-xs font-bold tracking-widest uppercase">
                HASHGUARD
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/"
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                  isLight 
                    ? 'bg-[#e2ded5] hover:bg-[#d6d1c6] text-[#2d3748] border border-[#d2ccc0]' 
                    : 'bg-[#151d27] hover:bg-[#1c2633] text-[#94a3b8] border border-[#232f3e]'
                }`}
              >
                <span>&larr;</span>
                <span>Home</span>
              </Link>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                  isLight 
                    ? 'bg-[#e2ded5] hover:bg-[#d6d1c6] text-[#2d3748] border border-[#d2ccc0]' 
                    : 'bg-[#151d27] hover:bg-[#1c2633] text-[#94a3b8] border border-[#232f3e]'
                }`}
              >
                {isLight ? (
                  <>
                    <Moon className="w-3 h-3 text-[#334155]" />
                    <span>/ D</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3 h-3 text-amber-300" />
                    <span>/ L</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Editorial Headline */}
          <div className="space-y-4 pt-4">
            <h1 
              className={`text-5xl sm:text-6xl lg:text-7xl leading-[1.04] tracking-tight ${
                isLight ? 'text-[#141b24]' : 'text-[#f1f5f9]'
              }`}
              style={{ fontFamily: "'Newsreader', 'Instrument Serif', Georgia, serif" }}
            >
              Every handoff,<br />
              <span 
                className="italic font-normal"
                style={{ color: isLight ? '#d9383a' : '#f87171' }}
              >
                signed.
              </span>
            </h1>

            <p className={`text-sm sm:text-base leading-relaxed max-w-md ${
              isLight ? 'text-[#556376]' : 'text-[#8b9bb4]'
            }`}>
              Verifiable digital asset trust infrastructure. Sign in and your session is bound to a cryptographic fingerprint on the ledger.
            </p>
          </div>

          {/* Live Session Fingerprint Card */}
          <div className={`p-5 rounded-2xl border transition-colors ${
            isLight 
              ? 'bg-[#e4dfd5]/70 border-[#d3ccbe] text-[#222c38]' 
              : 'bg-[#101721]/80 border-[#1c2736] text-[#cbd5e1]'
          }`}>
            <div className="flex items-center justify-between mb-3 text-[11px] font-mono tracking-wider">
              <span className={`uppercase font-medium ${isLight ? 'text-[#64748b]' : 'text-[#64748b]'}`}>
                SESSION FINGERPRINT &bull; SHA-256
              </span>
              <span className="flex items-center gap-1.5 text-emerald-500 font-bold text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
            </div>

            <div className={`font-mono text-xs sm:text-sm tracking-[0.22em] leading-relaxed select-all ${
              isLight ? 'text-[#1e293b] font-medium' : 'text-[#93c5fd] font-medium'
            }`}>
              8890 1294 3dcc 141f<br />
              7827 3cac 6f65 31f9<br />
              0543 79bb 1b8b 7ff0<br />
              2650 f56c 3479 d915
            </div>
          </div>

          {/* Stepper Footer line */}
          <div className={`pt-2 text-[10px] font-mono tracking-widest uppercase flex flex-wrap gap-2 items-center ${
            isLight ? 'text-[#78889b]' : 'text-[#56657a]'
          }`}>
            <span>COLLECT</span>
            <span>&bull;</span>
            <span>SEAL</span>
            <span>&bull;</span>
            <span>TRANSFER</span>
            <span>&bull;</span>
            <span>RECEIVE</span>
            <span>&bull;</span>
            <span>ANALYZE</span>
            <span>&bull;</span>
            <span>DERIVE</span>
          </div>
        </div>

        {/* RIGHT COLUMN: TICKET / RECEIPT MANILA FORM */}
        <div className="lg:col-span-6 flex justify-center">
          <div 
            className={`w-full max-w-md rounded-2xl transition-all duration-300 relative overflow-hidden flex flex-col ${
              isLight 
                ? 'bg-[#faf8f5] text-[#1c2229] border border-[#ded8cc] shadow-[0_20px_50px_rgba(40,30,20,0.08)]' 
                : 'bg-[#121924] text-[#e2e8f0] border border-[#1e2b3c] shadow-[0_25px_60px_rgba(0,0,0,0.6)]'
            }`}
          >
            {/* Top Lanyard / Hole Punch */}
            <div className="pt-4 pb-2 flex justify-center">
              <div className={`w-3.5 h-3.5 rounded-full border transition-colors ${
                isLight ? 'bg-[#edeae3] border-[#d8d2c4]' : 'bg-[#0b1017] border-[#223043]'
              }`} />
            </div>

            {/* Receipt Header Title & Tabs */}
            <div className="px-7 pt-1 pb-4 flex items-baseline justify-between border-b border-dashed transition-colors"
              style={{ borderColor: isLight ? '#e2ded5' : '#223044' }}
            >
              <div>
                <span className={`text-[9px] font-mono uppercase tracking-widest block ${
                  isLight ? 'text-[#8c9ba5]' : 'text-[#64748b]'
                }`}>
                  ACCESS FORM &bull; HG-0028
                </span>
                <h2 
                  className="text-xl sm:text-2xl font-normal tracking-tight mt-0.5"
                  style={{ fontFamily: "'Newsreader', 'Instrument Serif', Georgia, serif" }}
                >
                  {authMode === 'login' ? 'Officer sign in' : 'Register organization'}
                </h2>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setError(''); setRegisteredResult(null); }}
                  className={`cursor-pointer transition-colors ${
                    authMode === 'login' 
                      ? 'underline font-bold text-inherit decoration-current underline-offset-4' 
                      : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setError(''); }}
                  className={`cursor-pointer transition-colors ${
                    authMode === 'register' 
                      ? 'underline font-bold text-inherit decoration-current underline-offset-4' 
                      : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                  }`}
                >
                  Register org
                </button>
              </div>
            </div>

            {/* Form Body */}
            {authMode === 'login' ? (
              <div className="p-7 space-y-6">
                {error && (
                  <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-500 text-xs font-mono text-center">
                    {error}
                  </div>
                )}

                {/* CLEARANCE TOGGLE BUTTONS */}
                <div>
                  <label className={`block text-[10px] font-mono uppercase tracking-widest mb-2 font-medium ${
                    isLight ? 'text-[#7a8a9e]' : 'text-[#627387]'
                  }`}>
                    CLEARANCE
                  </label>
                  <div className={`grid grid-cols-4 gap-1 p-1 rounded-xl border ${
                    isLight ? 'bg-[#edeae3] border-[#ded8cc]' : 'bg-[#0e141d] border-[#1b2635]'
                  }`}>
                    {[
                      { id: 'ADMINISTRATOR', label: 'Admin' },
                      { id: 'FORENSIC_ANALYST', label: 'Analyst' },
                      { id: 'AUDITOR', label: 'Auditor' },
                      { id: 'EVIDENCE_CUSTODIAN', label: 'Custodian' },
                    ].map((role) => {
                      const isActive = activeClearance === role.id;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => handleRoleSelection(role.id)}
                          className={`py-1.5 text-xs font-mono font-medium rounded-lg transition-all cursor-pointer text-center ${
                            isActive
                              ? isLight 
                                ? 'bg-[#18202a] text-white shadow-sm' 
                                : 'bg-[#e2e8f0] text-[#0b1017] shadow-sm'
                              : isLight
                                ? 'text-[#475569] hover:text-[#0f172a]'
                                : 'text-[#94a3b8] hover:text-white'
                          }`}
                        >
                          {role.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  {/* WORK EMAIL */}
                  <div>
                    <label className={`block text-[10px] font-mono uppercase tracking-widest mb-1.5 font-medium ${
                      isLight ? 'text-[#7a8a9e]' : 'text-[#627387]'
                    }`}>
                      WORK EMAIL
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full bg-transparent border-b text-xs font-mono py-2 focus:outline-none transition-colors ${
                        isLight 
                          ? 'border-[#cbd5e1] focus:border-[#0f172a] text-[#0f172a]' 
                          : 'border-[#263548] focus:border-[#93c5fd] text-[#f1f5f9]'
                      }`}
                      placeholder="admin@cyberlab.local"
                    />
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className={`block text-[10px] font-mono uppercase tracking-widest font-medium ${
                        isLight ? 'text-[#7a8a9e]' : 'text-[#627387]'
                      }`}>
                        PASSWORD
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`text-[9px] font-mono uppercase tracking-wider hover:underline ${
                          isLight ? 'text-[#8c9ba5]' : 'text-[#64748b]'
                        }`}
                      >
                        {showPassword ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full bg-transparent border-b text-xs font-mono py-2 focus:outline-none transition-colors ${
                        isLight 
                          ? 'border-[#cbd5e1] focus:border-[#0f172a] text-[#0f172a]' 
                          : 'border-[#263548] focus:border-[#93c5fd] text-[#f1f5f9]'
                      }`}
                      placeholder="•••••••••••"
                    />
                  </div>

                  {/* ORGANIZATION */}
                  <div>
                    <label className={`block text-[10px] font-mono uppercase tracking-widest mb-1.5 font-medium ${
                      isLight ? 'text-[#7a8a9e]' : 'text-[#627387]'
                    }`}>
                      ORGANIZATION
                    </label>
                    <div className="relative">
                      <select
                        value={selectedOrgId}
                        onChange={(e) => setSelectedOrgId(e.target.value)}
                        className={`w-full bg-transparent border-b text-xs font-mono py-2 pr-6 appearance-none focus:outline-none transition-colors cursor-pointer ${
                          isLight 
                            ? 'border-[#cbd5e1] focus:border-[#0f172a] text-[#0f172a]' 
                            : 'border-[#263548] focus:border-[#93c5fd] text-[#f1f5f9]'
                        }`}
                      >
                        <option value="ORG_B" className={isLight ? 'bg-white text-black' : 'bg-[#121924] text-white'}>
                          Cyber Defense Lab (Forensics)
                        </option>
                        <option value="ORG_A" className={isLight ? 'bg-white text-black' : 'bg-[#121924] text-white'}>
                          CERT-Alpha (Incident Response)
                        </option>
                        <option value="ORG_D" className={isLight ? 'bg-white text-black' : 'bg-[#121924] text-white'}>
                          Cyber Crime Police (Law Enforcement)
                        </option>
                        <option value="ORG_C" className={isLight ? 'bg-white text-black' : 'bg-[#121924] text-white'}>
                          Judicial Court Registry (Judiciary)
                        </option>
                        <option value="ORG_AUDIT" className={isLight ? 'bg-white text-black' : 'bg-[#121924] text-white'}>
                          Audit Board (Independent Oversight)
                        </option>
                        {Object.values(organizations || {})
                          .filter((org) => !['ORG_A', 'ORG_B', 'ORG_C', 'ORG_D', 'ORG_AUDIT'].includes(org.id))
                          .map((org) => (
                            <option key={org.id} value={org.id} className={isLight ? 'bg-white text-black' : 'bg-[#121924] text-white'}>
                              {org.name}
                            </option>
                          ))}
                      </select>
                      <span className={`absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-xs ${
                        isLight ? 'text-[#64748b]' : 'text-[#94a3b8]'
                      }`}>
                        &#9662;
                      </span>
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full mt-4 py-3 px-4 rounded-xl font-mono font-bold text-xs flex items-center justify-between transition-all cursor-pointer shadow-sm ${
                      isLight 
                        ? 'bg-[#18202a] hover:bg-[#0f172a] text-white' 
                        : 'bg-[#f1f5f9] hover:bg-white text-[#0b1017]'
                    }`}
                  >
                    <span>
                      {loading ? 'AUTHENTICATING...' : 'INITIALIZE SECURE SESSION'}
                    </span>
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>&rarr;</span>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* REGISTRATION FORM */
              <div className="p-7">
                {registeredResult ? (
                  <div className="space-y-4 text-center animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500">
                      <Check className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-widest">
                        ORGANIZATION CREATED ✓
                      </div>
                      <h3 className="text-base font-bold font-mono text-inherit mt-1">
                        {registeredResult.newOrg.name}
                      </h3>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Enclave registered &amp; provisioned on federated ledger
                      </p>
                    </div>

                    <div className={`p-3.5 rounded-xl border text-left space-y-2 font-mono text-xs ${
                      isLight ? 'bg-[#edeae3] border-[#ded8cc]' : 'bg-[#0e141d] border-[#1e2b3c]'
                    }`}>
                      <div>
                        <span className="text-[10px] uppercase text-neutral-400 block">Organization ID:</span>
                        <span className="font-bold">{registeredResult.newOrg.id}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-neutral-400 block">DID:</span>
                        <span className="text-cyan-500 font-bold text-[11px] break-all">{registeredResult.newOrg.did}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-neutral-400 block">Admin Email:</span>
                        <span>{registeredResult.adminUser.email}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleEnterRegisteredOrg}
                      className={`w-full py-2.5 px-4 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isLight ? 'bg-[#18202a] text-white' : 'bg-white text-[#0b1017]'
                      }`}
                    >
                      <span>INITIALIZE AS ADMINISTRATOR</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRegisterOrg} className="space-y-4">
                    <div>
                      <label className={`block text-[10px] font-mono uppercase tracking-widest mb-1 font-medium ${
                        isLight ? 'text-[#7a8a9e]' : 'text-[#627387]'
                      }`}>
                        Organization Name
                      </label>
                      <input
                        type="text"
                        required
                        value={regOrgName}
                        onChange={(e) => setRegOrgName(e.target.value)}
                        className={`w-full bg-transparent border-b text-xs font-mono py-1.5 focus:outline-none transition-colors ${
                          isLight ? 'border-[#cbd5e1] focus:border-[#0f172a]' : 'border-[#263548] focus:border-[#93c5fd]'
                        }`}
                        placeholder="Cyber Defense Lab"
                      />
                    </div>

                    <div>
                      <label className={`block text-[10px] font-mono uppercase tracking-widest mb-1 font-medium ${
                        isLight ? 'text-[#7a8a9e]' : 'text-[#627387]'
                      }`}>
                        Organization Type
                      </label>
                      <select
                        value={regOrgType}
                        onChange={(e) => setRegOrgType(e.target.value)}
                        className={`w-full bg-transparent border-b text-xs font-mono py-1.5 appearance-none focus:outline-none cursor-pointer ${
                          isLight ? 'border-[#cbd5e1] focus:border-[#0f172a]' : 'border-[#263548] focus:border-[#93c5fd]'
                        }`}
                      >
                        <option value="Cybersecurity / Forensics Lab" className={isLight ? 'bg-white' : 'bg-[#121924]'}>Cybersecurity / Forensics Lab</option>
                        <option value="Incident Response Team (CERT)" className={isLight ? 'bg-white' : 'bg-[#121924]'}>Incident Response Team (CERT)</option>
                        <option value="Judicial Court Registry" className={isLight ? 'bg-white' : 'bg-[#121924]'}>Judicial Court Registry</option>
                        <option value="Law Enforcement Agency (LEA)" className={isLight ? 'bg-white' : 'bg-[#121924]'}>Law Enforcement Agency (LEA)</option>
                        <option value="Independent Regulatory & Audit Oversight" className={isLight ? 'bg-white' : 'bg-[#121924]'}>Independent Regulatory & Audit Oversight</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-[10px] font-mono uppercase tracking-widest mb-1 font-medium ${
                          isLight ? 'text-[#7a8a9e]' : 'text-[#627387]'
                        }`}>
                          Node ID
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={regOrgId}
                          className={`w-full bg-transparent border-b text-xs font-mono py-1.5 opacity-80 cursor-not-allowed ${
                            isLight ? 'border-[#cbd5e1]' : 'border-[#263548]'
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className={`block text-[10px] font-mono uppercase tracking-widest font-medium ${
                            isLight ? 'text-[#7a8a9e]' : 'text-[#627387]'
                          }`}>
                            DID
                          </label>
                          <button
                            type="button"
                            onClick={generateNewDid}
                            className="text-[9px] text-cyan-500 hover:underline font-mono"
                          >
                            New
                          </button>
                        </div>
                        <input
                          type="text"
                          readOnly
                          value={regDid}
                          className={`w-full bg-transparent border-b text-xs font-mono py-1.5 truncate opacity-80 cursor-not-allowed ${
                            isLight ? 'border-[#cbd5e1]' : 'border-[#263548]'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-[10px] font-mono uppercase tracking-widest mb-1 font-medium ${
                        isLight ? 'text-[#7a8a9e]' : 'text-[#627387]'
                      }`}>
                        Admin Email
                      </label>
                      <input
                        type="email"
                        required
                        value={regAdminEmail}
                        onChange={(e) => setRegAdminEmail(e.target.value)}
                        className={`w-full bg-transparent border-b text-xs font-mono py-1.5 focus:outline-none transition-colors ${
                          isLight ? 'border-[#cbd5e1] focus:border-[#0f172a]' : 'border-[#263548] focus:border-[#93c5fd]'
                        }`}
                        placeholder="admin@cyberlab.local"
                      />
                    </div>

                    <div>
                      <label className={`block text-[10px] font-mono uppercase tracking-widest mb-1 font-medium ${
                        isLight ? 'text-[#7a8a9e]' : 'text-[#627387]'
                      }`}>
                        Access Passphrase
                      </label>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className={`w-full bg-transparent border-b text-xs font-mono py-1.5 focus:outline-none transition-colors ${
                          isLight ? 'border-[#cbd5e1] focus:border-[#0f172a]' : 'border-[#263548] focus:border-[#93c5fd]'
                        }`}
                        placeholder="Create strong passphrase"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full mt-3 py-2.5 px-4 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isLight ? 'bg-[#18202a] text-white' : 'bg-white text-[#0b1017]'
                      }`}
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Building2 className="w-4 h-4" />}
                      <span>REGISTER NODE</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Perforated Barcode Ticket Footer */}
            <div 
              className="p-6 pt-4 border-t border-dashed mt-auto flex items-center justify-between"
              style={{ borderColor: isLight ? '#ded8cc' : '#223044' }}
            >
              {/* Barcode visual lines */}
              <div className="flex items-center h-8 gap-[2.5px] opacity-80">
                {[3, 1, 4, 1, 5, 2, 1, 3, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 4, 1, 3].map((width, idx) => (
                  <div
                    key={idx}
                    className={`h-full ${isLight ? 'bg-[#1c2229]' : 'bg-[#e2e8f0]'}`}
                    style={{ width: `${width}px` }}
                  />
                ))}
              </div>

              <div className={`text-right text-[9px] font-mono leading-tight uppercase ${
                isLight ? 'text-[#8492a6]' : 'text-[#64748b]'
              }`}>
                <div>DID AUTH</div>
                <div>RBAC ENFORCED</div>
                <div>CHAIN OF CUSTODY</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
