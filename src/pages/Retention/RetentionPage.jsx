import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Clock, ShieldAlert, ArchiveX, CheckCircle2, Loader2, Save } from 'lucide-react';
import { apiClient } from '../../services/api';

export const RetentionPage = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [newPolicy, setNewPolicy] = useState({
    name: '',
    retention_period_days: 365,
    trigger_event: 'evidence_sealed',
    action_on_expiry: 'ARCHIVE_COLD'
  });

  const loadPolicies = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/retention/policies');
      setPolicies(res.data);
    } catch (err) {
      setError('Failed to load retention policies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  const handleCreatePolicy = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/admin/retention/policies', newPolicy);
      setNewPolicy({
        name: '',
        retention_period_days: 365,
        trigger_event: 'evidence_sealed',
        action_on_expiry: 'ARCHIVE_COLD'
      });
      loadPolicies();
    } catch (err) {
      alert('Failed to create policy.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Retention Policies"
        subtitle="Manage automated lifecycle policies for evidence archiving and deletion."
        breadcrumbs={['Dashboard', 'Admin', 'Retention']}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Policy Form */}
        <div className="lg:col-span-1 rounded-lg bg-ce-surface border border-ce-border shadow-sm flex flex-col">
          <div className="p-4 border-b border-ce-border bg-ce-surface-subtle">
            <h2 className="text-sm font-mono font-bold text-ce-text-primary flex items-center gap-2 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-ce-warning" />
              Define New Policy
            </h2>
          </div>
          
          <form onSubmit={handleCreatePolicy} className="p-4 space-y-4 font-mono text-xs flex-1">
            <div>
              <label className="block text-ce-text-secondary font-bold mb-1.5 uppercase">Policy Name</label>
              <input
                type="text"
                required
                value={newPolicy.name}
                onChange={(e) => setNewPolicy({...newPolicy, name: e.target.value})}
                placeholder="e.g. Malware Binaries (5 Yrs)"
                className="w-full bg-ce-bg border border-ce-border rounded p-2 text-ce-text-primary focus:border-ce-brand outline-none"
              />
            </div>
            
            <div>
              <label className="block text-ce-text-secondary font-bold mb-1.5 uppercase">Retention Period (Days)</label>
              <input
                type="number"
                required
                min="1"
                value={newPolicy.retention_period_days}
                onChange={(e) => setNewPolicy({...newPolicy, retention_period_days: parseInt(e.target.value)})}
                className="w-full bg-ce-bg border border-ce-border rounded p-2 text-ce-text-primary focus:border-ce-brand outline-none"
              />
            </div>

            <div>
              <label className="block text-ce-text-secondary font-bold mb-1.5 uppercase">Trigger Event</label>
              <select
                value={newPolicy.trigger_event}
                onChange={(e) => setNewPolicy({...newPolicy, trigger_event: e.target.value})}
                className="w-full bg-ce-bg border border-ce-border rounded p-2 text-ce-text-primary focus:border-ce-brand outline-none cursor-pointer"
              >
                <option value="evidence_sealed">Evidence Sealed (Creation)</option>
                <option value="case_closed">Case Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-ce-text-secondary font-bold mb-1.5 uppercase">Action on Expiry</label>
              <select
                value={newPolicy.action_on_expiry}
                onChange={(e) => setNewPolicy({...newPolicy, action_on_expiry: e.target.value})}
                className="w-full bg-ce-bg border border-ce-border rounded p-2 text-ce-text-primary focus:border-ce-brand outline-none cursor-pointer"
              >
                <option value="ARCHIVE_COLD">Archive to Cold Storage (MinIO Glacier)</option>
                <option value="SECURE_WIPE">Cryptographic Shred (Irreversible)</option>
              </select>
            </div>
            
            <div className="pt-4 mt-auto">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-ce-brand hover:bg-ce-brand-hover text-white py-2 rounded transition-colors font-bold shadow-sm"
              >
                <Save className="w-4 h-4" />
                CREATE POLICY
              </button>
            </div>
          </form>
        </div>

        {/* Existing Policies List */}
        <div className="lg:col-span-2 rounded-lg bg-ce-surface border border-ce-border shadow-sm flex flex-col">
          <div className="p-4 border-b border-ce-border bg-ce-surface-subtle">
            <h2 className="text-sm font-mono font-bold text-ce-text-primary flex items-center gap-2 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-ce-brand" />
              Active Policies
            </h2>
          </div>
          
          <div className="p-4 flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-32 text-ce-text-muted gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-xs font-mono">Loading Policies...</span>
              </div>
            ) : error ? (
              <div className="bg-ce-danger/10 text-ce-danger border border-ce-danger/30 p-3 rounded text-xs font-mono font-bold text-center">
                {error}
              </div>
            ) : policies.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-ce-text-muted gap-2 border border-dashed border-ce-border rounded">
                <ArchiveX className="w-6 h-6 opacity-50" />
                <span className="text-xs font-mono">No Retention Policies defined.</span>
              </div>
            ) : (
              <div className="grid gap-3">
                {policies.map(p => (
                  <div key={p.id} className="bg-ce-bg border border-ce-border rounded-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-ce-brand/30 transition-colors">
                    <div>
                      <div className="text-sm font-mono font-bold text-ce-text-primary mb-1">
                        {p.name}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-ce-text-muted uppercase tracking-wider">
                        <span className="bg-ce-surface-subtle px-2 py-0.5 rounded border border-ce-border">
                          {p.retention_period_days} Days
                        </span>
                        <span className="bg-ce-surface-subtle px-2 py-0.5 rounded border border-ce-border">
                          Trigger: {p.trigger_event}
                        </span>
                      </div>
                    </div>
                    
                    <div className="shrink-0 text-right">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider border
                        ${p.action_on_expiry === 'SECURE_WIPE' ? 'bg-ce-danger/10 text-ce-danger border-ce-danger/30' : 'bg-ce-brand/10 text-ce-brand border-ce-brand/30'}
                       `}>
                         {p.action_on_expiry === 'SECURE_WIPE' ? <ArchiveX className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                         {p.action_on_expiry.replace('_', ' ')}
                       </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
