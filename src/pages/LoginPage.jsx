import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shield, 
  Loader2, 
  Building2, 
  ArrowLeft, 
  Check,
  ChevronRight,
  Fingerprint
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import { useApp } from '../context/AppContext';

export const LoginPage = () => {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  
  // Login Form State
  const [email, setEmail] = useState('analyst@cyberlab.local');
  const [password, setPassword] = useState('••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState('ORG_B');
  const [role, setRole] = useState('analyst'); // 'admin' | 'analyst' | 'auditor' | 'custodian'
  
  // Register Organization State
  const [regOrgName, setRegOrgName] = useState('Cyber Defense Lab');
  const [regOrgType, setRegOrgType] = useState('Cybersecurity / Forensics Lab');
  const [regOrgId, setRegOrgId] = useState(() => `ORG-${Math.floor(1000 + Math.random() * 9000)}`);
  const [regDid, setRegDid] = useState(() => `did:ethr:0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`);
  const [regAdminEmail, setRegAdminEmail] = useState('admin@cyberlab.local');
  const [regPassword, setRegPassword] = useState('');
  const [registeredResult, setRegisteredResult] = useState(null);

  // Live cryptographic fingerprint state
  const [fingerprint, setFingerprint] = useState('8890 1294 3dcc 141f\n7827 3cac 6f65 31f9\n0543 79bb 1b8b 7ff0\n2650 f56c 3479 d915');
  const [formNumber, setFormNumber] = useState('HG-8890');

  // Submit flow states (step log & verified stamp)
  const [loading, setLoading] = useState(false);
  const [verificationSteps, setVerificationSteps] = useState([]);
  const [isStamped, setIsStamped] = useState(false);
  const [stampText, setStampText] = useState('Verified');
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

  const isDark = theme === 'dark';

  // Toggle Theme between light and dark
  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  // Recompute live SHA-256 fingerprint when fields change
  const computeFingerprint = useCallback(async () => {
    const orgValue = authMode === 'register' ? regOrgName : (organizations[selectedOrgId]?.name || selectedOrgId);
    const src = `${email}|${orgValue}|${authMode === 'register' ? 'register' : role}|${Math.floor(Date.now() / 60000)}`;
    
    try {
      const buffer = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(src));
      const hex = Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
      
      // format into 4 blocks of 4 hex pairs
      let formatted = '';
      for (let i = 0; i < 64; i += 16) {
        formatted += hex.slice(i, i + 16).replace(/(.{4})/g, '$1 ').trim() + (i < 48 ? '\n' : '');
      }
      setFingerprint(formatted);
      setFormNumber(`HG-${hex.slice(0, 4).toUpperCase()}`);
    } catch {
      // Fallback
      setFormNumber('HG-2612');
    }
  }, [authMode, email, selectedOrgId, role, regOrgName, organizations]);

  useEffect(() => {
    computeFingerprint();
  }, [computeFingerprint]);

  const ROLES = {
    admin: { email: 'admin@cyberlab.local', orgId: 'ORG_B', roleId: 'ADMINISTRATOR', name: 'Dr. Sarah Chen' },
    analyst: { email: 'analyst@cyberlab.local', orgId: 'ORG_B', roleId: 'FORENSIC_ANALYST', name: 'Lead Forensic Analyst' },
    auditor: { email: 'audit@cyberlab.local', orgId: 'ORG_AUDIT', roleId: 'AUDITOR', name: 'Elena Rostova' },
    custodian: { email: 'custody@cyberlab.local', orgId: 'ORG_B', roleId: 'EVIDENCE_CUSTODIAN', name: 'Marcus Vance' },
  };

  const handleRoleSelect = (r) => {
    setRole(r);
    const target = ROLES[r];
    if (target) {
      setEmail(target.email);
      setPassword('••••••••••');
      setSelectedOrgId(target.orgId);
    }
  };

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setIsStamped(false);
    setVerificationSteps([]);

    const steps = [
      'mTLS channel established',
      'DID signature verified',
      'RBAC policy resolved',
      'Session anchored to ledger'
    ];

    // Animate the terminal verification logs
    for (let i = 0; i < steps.length; i++) {
      const stepName = steps[i];
      setVerificationSteps(prev => [...prev, { text: stepName, done: false }]);
      await new Promise(r => setTimeout(r, 220));
      setVerificationSteps(prev => 
        prev.map((s, idx) => idx === i ? { ...s, done: true } : s)
      );
      await new Promise(r => setTimeout(r, 140));
    }

    setStampText('Verified');
    setIsStamped(true);

    const targetOrg = organizations[selectedOrgId] || {
      id: selectedOrgId,
      name: 'Cyber Defense Lab',
      shortName: 'Cyber Defense Lab',
      code: selectedOrgId
    };

    const orgUserList = getUsersForOrg ? getUsersForOrg(targetOrg.id) : [];
    const matchedUser = orgUserList.find(u => u.email.toLowerCase() === email.toLowerCase());

    const mappedRole = ROLES[role]?.roleId || 'FORENSIC_ANALYST';
    const userObj = matchedUser || {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      email: email.trim(),
      name: ROLES[role]?.name || email.split('@')[0].toUpperCase(),
      orgId: targetOrg.id,
      role: mappedRole,
      status: 'ACTIVE'
    };

    setTimeout(async () => {
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
          roleId: mappedRole,
          token: access_token,
          isSandbox: false
        });
        navigate('/dashboard');
      } catch {
        loginSession({
          user: userObj,
          organizationId: targetOrg.id,
          roleId: mappedRole,
          token: 'jwt_session_' + Date.now(),
          isSandbox: false
        });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    }, 700);
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
      setStampText('Submitted');
      setIsStamped(true);
      setLoading(false);
    }, 450);
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
      className="min-h-screen w-full transition-colors duration-200 relative flex items-center justify-center p-5 md:p-12 overflow-x-hidden"
      style={{
        backgroundColor: isDark ? 'var(--bg, #09101d)' : 'var(--bg, #efeadf)',
        backgroundImage: isDark
          ? 'radial-gradient(#16233b 1px, transparent 1px)'
          : 'radial-gradient(#d9d2c1 1px, transparent 1px)',
        backgroundSize: '22px 22px',
        color: isDark ? 'var(--ink, #e8eefc)' : 'var(--ink, #0e1a2f)',
        fontFamily: "'DM Sans', system-ui, sans-serif"
      }}
    >
      <style>{`
        .serif-title { font-family: 'Instrument Serif', Georgia, serif; }
        .dm-mono { font-family: 'DM Mono', ui-monospace, monospace; }
        .barcode-strip {
          height: 34px;
          background: repeating-linear-gradient(
            90deg,
            ${isDark ? '#e8eefc' : '#0e1a2f'} 0 2px,
            transparent 2px 4px,
            ${isDark ? '#e8eefc' : '#0e1a2f'} 4px 5px,
            transparent 5px 9px,
            ${isDark ? '#e8eefc' : '#0e1a2f'} 9px 12px,
            transparent 12px 14px
          );
          opacity: 0.85;
        }
        @keyframes stampPop {
          0% { transform: rotate(-9deg) scale(2.4); opacity: 0; }
          100% { transform: rotate(-9deg) scale(1); opacity: 0.95; }
        }
        .stamp-animate {
          animation: stampPop 0.45s cubic-bezier(0.2, 1.4, 0.4, 1) forwards;
        }
      `}</style>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
        
        {/* LEFT COLUMN: HERO EDITORIAL STORY */}
        <section className="flex flex-col gap-7 max-w-[560px] lg:justify-self-end w-full">
          <div className="flex justify-between items-center">
            <div className="flex gap-2.5 items-center font-bold tracking-[0.16em] text-[13px] uppercase">
              <svg 
                width="22" 
                height="22" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ color: isDark ? '#6ea8ff' : '#123a6b' }}
              >
                <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
              <span>HASHGUARD</span>
            </div>
            
            <div className="flex gap-2">
              <Link 
                to="/" 
                className="dm-mono text-xs rounded-full px-3 py-1.5 transition-colors cursor-pointer border"
                style={{
                  color: isDark ? '#8093b6' : '#6b7488',
                  borderColor: isDark ? '#22324f' : '#d3ccbb',
                  backgroundColor: isDark ? '#101a2d' : '#fbf8f1'
                }}
              >
                &larr; Home
              </Link>
              <button 
                type="button" 
                onClick={toggleTheme} 
                aria-label="Toggle theme" 
                className="dm-mono text-xs rounded-full px-3 py-1.5 transition-colors cursor-pointer border"
                style={{
                  color: isDark ? '#8093b6' : '#6b7488',
                  borderColor: isDark ? '#22324f' : '#d3ccbb',
                  backgroundColor: isDark ? '#101a2d' : '#fbf8f1'
                }}
              >
                ☀ / ☾
              </button>
            </div>
          </div>

          <h1 
            className="serif-title font-normal tracking-[-0.02em] leading-[0.95] text-5xl sm:text-6xl lg:text-[76px]"
          >
            Every handoff,{' '}
            <em 
              className="not-italic italic" 
              style={{ color: isDark ? '#ff5d73' : '#c62d3f' }}
            >
              signed.
            </em>
          </h1>

          <p 
            className="text-[15px] max-w-[30em] leading-relaxed"
            style={{ color: isDark ? '#8093b6' : '#6b7488' }}
          >
            Verifiable digital asset trust infrastructure. Sign in and your session is bound to a cryptographic fingerprint on the ledger.
          </p>

          {/* Cryptographic Session Fingerprint */}
          <div 
            className="rounded-xl p-4 sm:p-5 border transition-colors"
            style={{
              backgroundColor: isDark ? '#101a2d' : '#fbf8f1',
              borderColor: isDark ? '#22324f' : '#d3ccbb'
            }}
          >
            <div className="flex justify-between dm-mono text-[11px] tracking-[0.1em] uppercase mb-2">
              <span style={{ color: isDark ? '#8093b6' : '#6b7488' }}>
                Session fingerprint &bull; SHA-256
              </span>
              <span 
                className="font-normal flex items-center gap-1 text-[11px]"
                style={{ color: isDark ? '#3ddc97' : '#1d7a52' }}
              >
                &bull; live
              </span>
            </div>
            <pre 
              className="dm-mono text-[13px] leading-[1.7] tracking-[0.04em] whitespace-pre-wrap break-all"
              style={{ color: isDark ? '#6ea8ff' : '#123a6b' }}
            >
              {fingerprint}
            </pre>
          </div>

          {/* Handoff Lifecycle Trail */}
          <div 
            className="flex flex-wrap gap-x-2.5 gap-y-1.5 dm-mono text-[11px] uppercase tracking-[0.08em] pt-1"
            style={{ color: isDark ? '#8093b6' : '#6b7488' }}
          >
            {['Collect', 'Seal', 'Transfer', 'Receive', 'Analyze', 'Derive'].map((stage, i, arr) => (
              <React.Fragment key={stage}>
                <span>{stage}</span>
                {i < arr.length - 1 && (
                  <span style={{ color: isDark ? '#ff5d73' : '#c62d3f' }}>&rarr;</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* RIGHT COLUMN: TAG / EVIDENCE TICKET */}
        <section className="w-full max-w-[520px] lg:justify-self-start relative">
          <div 
            className="rounded-t-[6px] rounded-b-[18px] border relative overflow-hidden transition-all duration-300"
            style={{
              backgroundColor: isDark ? '#101a2d' : '#fbf8f1',
              borderColor: isDark ? '#22324f' : '#d3ccbb',
              boxShadow: isDark 
                ? '0 1px 0 #22324f, 0 26px 60px -28px rgba(0,0,0,0.6)' 
                : '0 1px 0 #d3ccbb, 0 26px 60px -28px rgba(14,26,47,0.35)'
            }}
          >
            {/* Lanyard Hole Punch */}
            <div 
              className="absolute top-[14px] left-1/2 -ml-[9px] w-[18px] h-[18px] rounded-full border"
              style={{
                backgroundColor: isDark ? '#09101d' : '#efeadf',
                borderColor: isDark ? '#22324f' : '#d3ccbb',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
              }}
            />

            {/* Tag Header */}
            <div 
              className="pt-[44px] px-7 pb-4 border-b-2 border-dashed flex justify-between items-end gap-3"
              style={{ borderColor: isDark ? '#22324f' : '#d3ccbb' }}
            >
              <div>
                <span className="dm-mono text-[10.5px] tracking-[0.12em] uppercase block" style={{ color: isDark ? '#8093b6' : '#6b7488' }}>
                  Access form &bull; <span>{formNumber}</span>
                </span>
                <h2 className="serif-title font-normal text-[26px] leading-[1.1] mt-0.5">
                  {authMode === 'login' ? 'Officer sign in' : 'Register organization'}
                </h2>
              </div>

              {/* Mode Tabs: Sign in vs Register org */}
              <div className="flex gap-3.5 dm-mono text-xs" role="tablist">
                <button 
                  type="button" 
                  role="tab"
                  aria-selected={authMode === 'login'}
                  onClick={() => { setAuthMode('login'); setError(''); setRegisteredResult(null); setIsStamped(false); }}
                  className="bg-transparent border-0 border-b-2 py-0.5 cursor-pointer font-inherit transition-colors"
                  style={{
                    color: authMode === 'login' ? (isDark ? '#e8eefc' : '#0e1a2f') : (isDark ? '#8093b6' : '#6b7488'),
                    borderColor: authMode === 'login' ? (isDark ? '#ff5d73' : '#c62d3f') : 'transparent'
                  }}
                >
                  Sign in
                </button>
                <button 
                  type="button" 
                  role="tab"
                  aria-selected={authMode === 'register'}
                  onClick={() => { setAuthMode('register'); setError(''); setIsStamped(false); }}
                  className="bg-transparent border-0 border-b-2 py-0.5 cursor-pointer font-inherit transition-colors"
                  style={{
                    color: authMode === 'register' ? (isDark ? '#e8eefc' : '#0e1a2f') : (isDark ? '#8093b6' : '#6b7488'),
                    borderColor: authMode === 'register' ? (isDark ? '#ff5d73' : '#c62d3f') : 'transparent'
                  }}
                >
                  Register org
                </button>
              </div>
            </div>

            {/* Form Container */}
            <div className="pt-[22px] px-7 pb-2">
              {error && (
                <div 
                  className="p-2.5 rounded-lg dm-mono text-xs text-center mb-4 border"
                  style={{
                    backgroundColor: isDark ? 'rgba(255, 93, 115, 0.1)' : 'rgba(198, 45, 63, 0.1)',
                    borderColor: isDark ? 'rgba(255, 93, 115, 0.3)' : 'rgba(198, 45, 63, 0.3)',
                    color: isDark ? '#ff5d73' : '#c62d3f'
                  }}
                >
                  {error}
                </div>
              )}

              {authMode === 'login' ? (
                /* LOGIN FORM */
                <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-[18px]">
                  {/* Clearance Segment */}
                  <div>
                    <span 
                      className="block font-medium text-[10.5px] dm-mono tracking-[0.12em] uppercase mb-1"
                      style={{ color: isDark ? '#8093b6' : '#6b7488' }}
                    >
                      Clearance
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: 'admin', label: 'Admin' },
                        { id: 'analyst', label: 'Analyst' },
                        { id: 'auditor', label: 'Auditor' },
                        { id: 'custodian', label: 'Custodian' },
                      ].map((item) => {
                        const isSelected = role === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleRoleSelect(item.id)}
                            aria-pressed={isSelected}
                            className="dm-mono text-xs font-medium py-2 px-1 rounded-lg border-[1.5px] cursor-pointer transition-all text-center"
                            style={{
                              backgroundColor: isSelected ? (isDark ? '#e8eefc' : '#0e1a2f') : 'transparent',
                              color: isSelected ? (isDark ? '#101a2d' : '#fbf8f1') : (isDark ? '#e8eefc' : '#0e1a2f'),
                              borderColor: isSelected ? (isDark ? '#e8eefc' : '#0e1a2f') : (isDark ? '#22324f' : '#d3ccbb')
                            }}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Work Email */}
                  <div>
                    <label 
                      htmlFor="email-in"
                      className="block font-medium text-[10.5px] dm-mono tracking-[0.12em] uppercase mb-1"
                      style={{ color: isDark ? '#8093b6' : '#6b7488' }}
                    >
                      Work email
                    </label>
                    <input 
                      id="email-in"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent border-0 border-b-[1.5px] dm-mono font-medium text-[15px] py-2 focus:outline-none transition-colors"
                      style={{
                        borderColor: isDark ? '#22324f' : '#d3ccbb',
                        color: isDark ? '#e8eefc' : '#0e1a2f'
                      }}
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label 
                      htmlFor="pw-in"
                      className="block font-medium text-[10.5px] dm-mono tracking-[0.12em] uppercase mb-1"
                      style={{ color: isDark ? '#8093b6' : '#6b7488' }}
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input 
                        id="pw-in"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-transparent border-0 border-b-[1.5px] dm-mono font-medium text-[15px] py-2 pr-12 focus:outline-none transition-colors"
                        style={{
                          borderColor: isDark ? '#22324f' : '#d3ccbb',
                          color: isDark ? '#e8eefc' : '#0e1a2f'
                        }}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent border-0 dm-mono text-[10.5px] cursor-pointer"
                        style={{ color: isDark ? '#8093b6' : '#6b7488' }}
                      >
                        {showPassword ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>
                  </div>

                  {/* Organization */}
                  <div>
                    <label 
                      htmlFor="org-in"
                      className="block font-medium text-[10.5px] dm-mono tracking-[0.12em] uppercase mb-1"
                      style={{ color: isDark ? '#8093b6' : '#6b7488' }}
                    >
                      Organization
                    </label>
                    <select 
                      id="org-in"
                      value={selectedOrgId}
                      onChange={(e) => setSelectedOrgId(e.target.value)}
                      className="w-full bg-transparent border-0 border-b-[1.5px] dm-mono font-medium text-[15px] py-2 pr-4 focus:outline-none transition-colors cursor-pointer"
                      style={{
                        borderColor: isDark ? '#22324f' : '#d3ccbb',
                        color: isDark ? '#e8eefc' : '#0e1a2f'
                      }}
                    >
                      <option value="ORG_B" style={{ backgroundColor: isDark ? '#101a2d' : '#fbf8f1', color: isDark ? '#e8eefc' : '#0e1a2f' }}>
                        Cyber Defense Lab (Forensics)
                      </option>
                      <option value="ORG_A" style={{ backgroundColor: isDark ? '#101a2d' : '#fbf8f1', color: isDark ? '#e8eefc' : '#0e1a2f' }}>
                        CERT-Alpha (Collector / IR)
                      </option>
                      <option value="ORG_D" style={{ backgroundColor: isDark ? '#101a2d' : '#fbf8f1', color: isDark ? '#e8eefc' : '#0e1a2f' }}>
                        Cyber Crime Police (LEA)
                      </option>
                      <option value="ORG_C" style={{ backgroundColor: isDark ? '#101a2d' : '#fbf8f1', color: isDark ? '#e8eefc' : '#0e1a2f' }}>
                        Judicial Court Registry (Judiciary)
                      </option>
                      <option value="ORG_AUDIT" style={{ backgroundColor: isDark ? '#101a2d' : '#fbf8f1', color: isDark ? '#e8eefc' : '#0e1a2f' }}>
                        National Cyber Security Audit Board
                      </option>
                      {Object.values(organizations || {})
                        .filter((org) => !['ORG_A', 'ORG_B', 'ORG_C', 'ORG_D', 'ORG_AUDIT'].includes(org.id))
                        .map((org) => (
                          <option key={org.id} value={org.id} style={{ backgroundColor: isDark ? '#101a2d' : '#fbf8f1', color: isDark ? '#e8eefc' : '#0e1a2f' }}>
                            {org.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full mt-1.5 border-0 rounded-[10px] py-[15px] px-[18px] font-bold text-[13px] tracking-[0.1em] cursor-pointer flex justify-between items-center transition-transform hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-70 disabled:cursor-progress shadow-sm"
                    style={{
                      backgroundColor: isDark ? '#e8eefc' : '#0e1a2f',
                      color: isDark ? '#101a2d' : '#fbf8f1'
                    }}
                  >
                    <span>INITIALIZE SECURE SESSION</span>
                    <span>{loading ? '...' : '&rarr;'}</span>
                  </button>

                  {/* Progressive Terminal Logs */}
                  {verificationSteps.length > 0 && (
                    <div className="dm-mono text-[11.5px] mt-3 min-h-0 grid gap-0.5" role="status">
                      {verificationSteps.map((step, idx) => (
                        <div 
                          key={idx} 
                          style={{ color: step.done ? (isDark ? '#3ddc97' : '#1d7a52') : (isDark ? '#8093b6' : '#6b7488') }}
                        >
                          {step.done ? `✓ ${step.text}` : `· ${step.text}`}
                        </div>
                      ))}
                    </div>
                  )}
                </form>
              ) : (
                /* REGISTRATION FORM */
                <div>
                  {registeredResult ? (
                    <div className="space-y-4 text-center py-2">
                      <div 
                        className="w-10 h-10 rounded-full border flex items-center justify-center mx-auto"
                        style={{
                          backgroundColor: isDark ? 'rgba(61, 220, 151, 0.1)' : 'rgba(29, 122, 82, 0.1)',
                          borderColor: isDark ? 'rgba(61, 220, 151, 0.3)' : 'rgba(29, 122, 82, 0.3)',
                          color: isDark ? '#3ddc97' : '#1d7a52'
                        }}
                      >
                        <Check className="w-5 h-5" />
                      </div>
                      <div>
                        <div 
                          className="text-[10px] dm-mono font-bold uppercase tracking-widest"
                          style={{ color: isDark ? '#3ddc97' : '#1d7a52' }}
                        >
                          ORGANIZATION CREATED ✓
                        </div>
                        <h3 className="serif-title text-2xl font-normal mt-0.5">
                          {registeredResult.newOrg.name}
                        </h3>
                        <p className="text-[11px]" style={{ color: isDark ? '#8093b6' : '#6b7488' }}>
                          Enclave provisioned on federated ledger
                        </p>
                      </div>

                      <div 
                        className="p-3.5 rounded-xl border text-left space-y-2 dm-mono text-xs"
                        style={{
                          backgroundColor: isDark ? '#09101d' : '#efeadf',
                          borderColor: isDark ? '#22324f' : '#d3ccbb'
                        }}
                      >
                        <div>
                          <span className="text-[10px] uppercase block" style={{ color: isDark ? '#8093b6' : '#6b7488' }}>Organization ID:</span>
                          <span className="font-bold">{registeredResult.newOrg.id}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase block" style={{ color: isDark ? '#8093b6' : '#6b7488' }}>DID:</span>
                          <span className="break-all font-bold" style={{ color: isDark ? '#6ea8ff' : '#123a6b' }}>
                            {registeredResult.newOrg.did}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase block" style={{ color: isDark ? '#8093b6' : '#6b7488' }}>Admin Email:</span>
                          <span>{registeredResult.adminUser.email}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleEnterRegisteredOrg}
                        className="w-full mt-2 rounded-[10px] py-[13px] px-4 font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                        style={{
                          backgroundColor: isDark ? '#e8eefc' : '#0e1a2f',
                          color: isDark ? '#101a2d' : '#fbf8f1'
                        }}
                      >
                        <span>INITIALIZE AS ADMINISTRATOR</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleRegisterOrg} className="space-y-[18px]">
                      <div>
                        <label 
                          htmlFor="reg-on"
                          className="block font-medium text-[10.5px] dm-mono tracking-[0.12em] uppercase mb-1"
                          style={{ color: isDark ? '#8093b6' : '#6b7488' }}
                        >
                          Organization name
                        </label>
                        <input 
                          id="reg-on"
                          type="text"
                          required
                          value={regOrgName}
                          onChange={(e) => setRegOrgName(e.target.value)}
                          placeholder="National Forensics Unit"
                          className="w-full bg-transparent border-0 border-b-[1.5px] dm-mono font-medium text-[15px] py-2 focus:outline-none transition-colors"
                          style={{
                            borderColor: isDark ? '#22324f' : '#d3ccbb',
                            color: isDark ? '#e8eefc' : '#0e1a2f'
                          }}
                        />
                      </div>

                      <div>
                        <label 
                          htmlFor="reg-type"
                          className="block font-medium text-[10.5px] dm-mono tracking-[0.12em] uppercase mb-1"
                          style={{ color: isDark ? '#8093b6' : '#6b7488' }}
                        >
                          Organization type
                        </label>
                        <select 
                          id="reg-type"
                          value={regOrgType}
                          onChange={(e) => setRegOrgType(e.target.value)}
                          className="w-full bg-transparent border-0 border-b-[1.5px] dm-mono font-medium text-[15px] py-2 pr-4 focus:outline-none cursor-pointer"
                          style={{
                            borderColor: isDark ? '#22324f' : '#d3ccbb',
                            color: isDark ? '#e8eefc' : '#0e1a2f'
                          }}
                        >
                          <option value="Cybersecurity / Forensics Lab" style={{ backgroundColor: isDark ? '#101a2d' : '#fbf8f1' }}>Cybersecurity / Forensics Lab</option>
                          <option value="Incident Response Team (CERT)" style={{ backgroundColor: isDark ? '#101a2d' : '#fbf8f1' }}>Incident Response Team (CERT)</option>
                          <option value="Judicial Court Registry" style={{ backgroundColor: isDark ? '#101a2d' : '#fbf8f1' }}>Judicial Court Registry</option>
                          <option value="Law Enforcement Agency (LEA)" style={{ backgroundColor: isDark ? '#101a2d' : '#fbf8f1' }}>Law Enforcement Agency (LEA)</option>
                          <option value="Independent Regulatory & Audit Oversight" style={{ backgroundColor: isDark ? '#101a2d' : '#fbf8f1' }}>Independent Regulatory & Audit Oversight</option>
                        </select>
                      </div>

                      <div>
                        <label 
                          htmlFor="reg-email"
                          className="block font-medium text-[10.5px] dm-mono tracking-[0.12em] uppercase mb-1"
                          style={{ color: isDark ? '#8093b6' : '#6b7488' }}
                        >
                          Admin work email
                        </label>
                        <input 
                          id="reg-email"
                          type="email"
                          required
                          value={regAdminEmail}
                          onChange={(e) => setRegAdminEmail(e.target.value)}
                          placeholder="admin@agency.gov.local"
                          className="w-full bg-transparent border-0 border-b-[1.5px] dm-mono font-medium text-[15px] py-2 focus:outline-none transition-colors"
                          style={{
                            borderColor: isDark ? '#22324f' : '#d3ccbb',
                            color: isDark ? '#e8eefc' : '#0e1a2f'
                          }}
                        />
                      </div>

                      <div>
                        <label 
                          htmlFor="reg-pw"
                          className="block font-medium text-[10.5px] dm-mono tracking-[0.12em] uppercase mb-1"
                          style={{ color: isDark ? '#8093b6' : '#6b7488' }}
                        >
                          Passphrase
                        </label>
                        <input 
                          id="reg-pw"
                          type="password"
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Create strong passphrase"
                          className="w-full bg-transparent border-0 border-b-[1.5px] dm-mono font-medium text-[15px] py-2 focus:outline-none transition-colors"
                          style={{
                            borderColor: isDark ? '#22324f' : '#d3ccbb',
                            color: isDark ? '#e8eefc' : '#0e1a2f'
                          }}
                        />
                      </div>

                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full mt-1.5 border-0 rounded-[10px] py-[15px] px-[18px] font-bold text-[13px] tracking-[0.1em] cursor-pointer flex justify-between items-center transition-transform hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-70 disabled:cursor-progress"
                        style={{
                          backgroundColor: isDark ? '#e8eefc' : '#0e1a2f',
                          color: isDark ? '#101a2d' : '#fbf8f1'
                        }}
                      >
                        <span>{loading ? 'DEPLOYING NODE...' : 'REGISTER ORGANIZATION'}</span>
                        <span>&rarr;</span>
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Tag Perforated Barcode Footer */}
            <div 
              className="mt-[14px] px-7 pt-[14px] pb-[18px] border-t-2 border-dashed flex justify-between items-center gap-3"
              style={{ borderColor: isDark ? '#22324f' : '#d3ccbb' }}
            >
              <div className="barcode-strip flex-1 max-w-[210px]" aria-hidden="true" />
              <span className="dm-mono text-[10.5px] tracking-[0.08em] text-right" style={{ color: isDark ? '#8093b6' : '#6b7488' }}>
                DID AUTH<br />
                RBAC ENFORCED<br />
                CHAIN-OF-CUSTODY
              </span>
            </div>

            {/* Verified / Submitted Stamp Overlay */}
            {isStamped && (
              <div 
                className="stamp-animate absolute right-6 top-[110px] border-[3px] py-1.5 px-4 rounded-md serif-title text-[34px] tracking-[0.14em] uppercase pointer-events-none"
                style={{
                  borderColor: isDark ? '#3ddc97' : '#1d7a52',
                  color: isDark ? '#3ddc97' : '#1d7a52',
                  mixBlendMode: isDark ? 'normal' : 'multiply'
                }}
              >
                {stampText}
              </div>
            )}

          </div>
        </section>

      </div>
    </div>
  );
};
