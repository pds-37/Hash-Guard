import React, { useState } from 'react';
import { ShieldAlert, LogIn, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';

export const LoginPage = () => {
  const [email, setEmail] = useState('admin@cyberlab.local');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password
      });

      const { access_token, user } = response.data;
      
      // Store token
      localStorage.setItem('cee_auth_token', access_token);
      localStorage.setItem('cee_user', JSON.stringify(user));
      
      navigate('/evidence');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ce-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-ce-surface border border-ce-border rounded-lg shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-ce-surface-subtle border-b border-ce-border p-6 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-ce-brand/10 border border-ce-brand/20 rounded-xl flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8 text-ce-brand" />
          </div>
          <h1 className="text-xl font-bold font-mono text-ce-text-primary tracking-wide">
            CYBER EVIDENCE EXCHANGE
          </h1>
          <p className="text-xs font-mono text-ce-text-muted mt-2 uppercase tracking-widest">
            Authorized Personnel Only
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
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
            className="w-full mt-4 bg-ce-brand hover:bg-ce-brand-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono font-bold text-sm py-3 rounded flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            <span>INITIALIZE SESSION</span>
          </button>
        </form>
        
        {/* Footer */}
        <div className="bg-ce-surface-subtle p-4 border-t border-ce-border text-center">
          <p className="text-[10px] font-mono text-ce-text-muted">
            USE OF THIS SYSTEM IS MONITORED AND RECORDED.<br/>
            UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED.
          </p>
        </div>
      </div>
    </div>
  );
};
