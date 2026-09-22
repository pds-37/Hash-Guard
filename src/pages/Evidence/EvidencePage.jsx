import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { EvidenceFilterBar } from '../../components/evidence/EvidenceFilterBar';
import { EvidenceTable } from '../../components/evidence/EvidenceTable';
import { NewEvidenceModal } from '../../components/evidence/NewEvidenceModal';
import { EmptyState, LoadingState, ErrorState } from '../../components/common/StateViews';
import { evidenceService } from '../../services/evidenceService';
import { useApp } from '../../context/AppContext';
import { Plus } from 'lucide-react';

export const EvidencePage = () => {
  const { searchQuery, isTamperSimulated, refreshTrigger, triggerRefresh } = useApp();
  const [evidenceList, setEvidenceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState(searchQuery || '');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [orgFilter, setOrgFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      setSearch(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const data = await evidenceService.getAllEvidence({
          search,
          status: statusFilter,
          type: typeFilter,
          organization: orgFilter
        });
        setEvidenceList(data);
      } catch (err) {
        setError(err.message || 'Failed to query evidence repository');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [search, statusFilter, typeFilter, orgFilter, refreshTrigger, isTamperSimulated]);

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setTypeFilter('ALL');
    setOrgFilter('ALL');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evidence Repository"
        subtitle="Manage and track digital evidence exhibits."
        breadcrumbs={['Dashboard', 'Evidence']}
        actionButton={
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-ce-brand hover:bg-ce-brand-hover text-white text-xs font-mono font-bold transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Collect & Seal Evidence</span>
          </button>
        }
      />

      {/* Filter Bar */}
      <EvidenceFilterBar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        orgFilter={orgFilter}
        setOrgFilter={setOrgFilter}
        onReset={handleResetFilters}
      />

      {/* Main Views */}
      {loading ? (
        <LoadingState message="Fetching cryptographic evidence records from audit layer..." />
      ) : error ? (
        <ErrorState title="Error Loading Evidence" description={error} onRetry={() => triggerRefresh()} />
      ) : evidenceList.length === 0 ? (
        <EmptyState
          title="No Evidence Found"
          description="Evidence collected or transferred to this organization will appear here."
          actionButton={
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-ce-brand hover:bg-ce-brand-hover text-white text-xs font-mono font-bold transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Collect Initial Evidence</span>
            </button>
          }
        />
      ) : (
        <EvidenceTable evidenceList={evidenceList} />
      )}

      {/* New Evidence Registration Modal */}
      <NewEvidenceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={() => triggerRefresh()}
      />
    </div>
  );
};
