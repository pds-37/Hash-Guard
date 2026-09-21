import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { EvidencePage } from './pages/Evidence/EvidencePage';
import { EvidenceDetailsPage } from './pages/EvidenceDetails/EvidenceDetailsPage';
import { TransfersPage } from './pages/Transfers/TransfersPage';
import { CustodyPage } from './pages/Custody/CustodyPage';
import { LineagePage } from './pages/Lineage/LineagePage';
import { VerificationPage } from './pages/Verification/VerificationPage';
import { AuditPage } from './pages/Audit/AuditPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { RetentionPage } from './pages/Retention/RetentionPage';
import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/Landing/LandingPage';
import { BootSequence } from './components/layout/BootSequence';
import { useApp } from './context/AppContext';

const ProtectedRoute = ({ element, pathId }) => {
  const { currentRole } = useApp();
  
  // Basic Auth Check
  const token = localStorage.getItem('cee_auth_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!currentRole.allowedPages.includes(pathId)) {
    return <Navigate to={`/${currentRole.allowedPages[0]}`} replace />;
  }
  return element;
};

// Automatic sandbox activation route for PPT reviewers
const SandboxRoute = () => {
  const { switchRole, setSandbox } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    switchRole('ORG_B');
    setSandbox(true);
    const mockUser = {
      id: 'USR-001',
      email: 'analyst-lead@cyberlab.local',
      name: 'Lead Forensics Investigator',
      organization_id: 'ORG_B',
      role: 'ADMIN'
    };
    localStorage.setItem('cee_auth_token', 'mock_jwt_session_' + Date.now());
    localStorage.setItem('cee_is_sandbox', 'true');
    localStorage.setItem('cee_user', JSON.stringify(mockUser));
    navigate('/dashboard', { replace: true });
  }, []);

  return null;
};

export function App() {
  const [hasBooted, setHasBooted] = useState(false);
  const { currentRole } = useApp();
  const location = useLocation();

  const isLandingPage = location.pathname === '/' || location.pathname === '/landing' || location.pathname === '/sandbox';

  return (
    <>
      {!hasBooted && !isLandingPage && <BootSequence onComplete={() => setHasBooted(true)} />}
      <div className={!hasBooted && !isLandingPage ? 'opacity-0' : 'opacity-100 transition-opacity duration-700'}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/sandbox" element={<SandboxRoute />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} pathId="dashboard" />} />
            <Route path="/evidence" element={<ProtectedRoute element={<EvidencePage />} pathId="evidence" />} />
            <Route path="/evidence/:id" element={<ProtectedRoute element={<EvidenceDetailsPage />} pathId="evidence-details" />} />
            <Route path="/transfers" element={<ProtectedRoute element={<TransfersPage />} pathId="transfers" />} />
            <Route path="/custody" element={<ProtectedRoute element={<CustodyPage />} pathId="custody" />} />
            <Route path="/lineage" element={<ProtectedRoute element={<LineagePage />} pathId="lineage" />} />
            <Route path="/verification" element={<ProtectedRoute element={<VerificationPage />} pathId="verification" />} />
            <Route path="/audit" element={<ProtectedRoute element={<AuditPage />} pathId="audit" />} />
            <Route path="/retention" element={<ProtectedRoute element={<RetentionPage />} pathId="retention" />} />
            <Route path="/settings" element={<ProtectedRoute element={<SettingsPage />} pathId="settings" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
