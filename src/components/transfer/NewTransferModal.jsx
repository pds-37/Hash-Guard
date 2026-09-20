import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { ArrowLeftRight, Building2, Shield, Send } from 'lucide-react';
import { transferService } from '../../services/transferService';

export const NewTransferModal = ({ isOpen, onClose, onCreated, evidenceList = [] }) => {
  const [formData, setFormData] = useState({
    evidenceId: evidenceList[0]?.id || 'EV-001',
    fromOrg: 'Organization A (CERT-Alpha)',
    fromActor: 'ops-transport@org-a.gov',
    toOrg: 'Organization B (Cyber Lab)',
    toActor: 'analyst@org-b.lab',
    notes: 'Transferred for secondary forensic triage and reverse engineering analysis.'
  });

  useEffect(() => {
    if (evidenceList.length > 0 && !evidenceList.find(e => e.id === formData.evidenceId)) {
      setFormData(prev => ({ ...prev, evidenceId: evidenceList[0].id }));
    }
  }, [evidenceList]);

  const selectedEvidence = evidenceList.find((e) => e.id === formData.evidenceId) || evidenceList[0];

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!evidenceList || evidenceList.length === 0) {
      setErrorMsg('Cannot initiate transfer. No evidence items exist to transfer.');
      return;
    }
    setErrorMsg('');
    try {
      if (!window.ethereum) {
        throw new Error("No Web3 wallet found. Please install MetaMask.");
      }

      // 1. Connect to MetaMask
      const { ethers } = await import('ethers');
      const HashGuardABI = (await import('../../contracts/HashGuard.json')).default;
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      
      const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
      const contract = new ethers.Contract(contractAddress, HashGuardABI.abi, signer);

      // 2. Look up the Token ID for the selected Evidence ID
      const assetId = formData.evidenceId;
      const tokenId = await contract.assetIdToTokenId(assetId);

      if (tokenId === 0n && assetId !== "EV-0") {
        throw new Error("Evidence not found on-chain. Cannot transfer.");
      }

      // 3. For the demo, we'll transfer custody to Anvil Account #1 
      // (In production, this would be the actual address of the recipient org)
      const recipientAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

      // 4. Send transaction
      const tx = await contract.transferCustody(tokenId, recipientAddress);
      const receipt = await tx.wait();
      
      // 5. Send to backend
      const result = await transferService.initiateTransfer({
        ...formData,
        evidenceTitle: selectedEvidence?.title || 'Forensic Exhibit',
        evidenceType: selectedEvidence?.type || 'Malware Binary',
        manifestHash: selectedEvidence?.hash || '8f3a91bc72f4cd2a4e9b671a5c28e930f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
        txHash: receipt.hash
      });
      if (onCreated) onCreated(result);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg(`Failed to transfer: ${err.message || 'Check console'}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="DISPATCH EVIDENCE TRANSFER"
      subtitle="Establish mTLS transfer channel with recipient organization & sign on-chain manifest"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
        {errorMsg && (
          <div className="bg-ce-danger/10 border border-ce-danger/50 text-ce-danger px-4 py-2 rounded-md font-bold">
            {errorMsg}
          </div>
        )}
        <div>
          <label className="block text-ce-text-secondary font-semibold mb-1">
            Select Evidence Exhibit:
          </label>
          {evidenceList.length === 0 ? (
            <div className="w-full bg-ce-danger/10 border border-ce-danger/30 rounded-md px-3 py-2 text-ce-danger italic">
              No evidence records found in the database. Please Seal New Evidence first.
            </div>
          ) : (
            <select
              value={formData.evidenceId}
              onChange={(e) => setFormData({ ...formData, evidenceId: e.target.value })}
              className="w-full bg-ce-bg border border-ce-border rounded-md px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand cursor-pointer"
            >
              {evidenceList.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.id} — {e.title} ({e.type})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-ce-text-secondary font-semibold mb-1">
              Originating Entity (From):
            </label>
            <input
              type="text"
              disabled
              value={formData.fromOrg}
              className="w-full bg-ce-surface-subtle border border-ce-border rounded-md px-3 py-2 text-ce-text-muted"
            />
          </div>

          <div>
            <label className="block text-ce-text-secondary font-semibold mb-1">
              Destination Entity (To):
            </label>
            <select
              value={formData.toOrg}
              onChange={(e) => setFormData({ ...formData, toOrg: e.target.value })}
              className="w-full bg-ce-bg border border-ce-border rounded-md px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand cursor-pointer"
            >
              <option value="Organization B (Cyber Lab)">Organization B (Cyber Defense Lab)</option>
              <option value="Organization C (FinSec Ops)">Organization C (FinSec Ops)</option>
              <option value="Independent Auditor">Independent Auditor</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-ce-text-secondary font-semibold mb-1">
            Transfer Purpose & Case Referral Notes:
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full bg-ce-bg border border-ce-border rounded-md p-3 text-ce-text-primary focus:outline-none focus:border-ce-brand font-sans text-xs"
          />
        </div>

        <div className="p-3 rounded-md bg-ce-surface-subtle border border-ce-border text-ce-text-secondary text-[11px] flex items-center gap-2">
          <Shield className="w-4 h-4 text-ce-brand shrink-0" />
          <span>
            Transfer manifest will be hashed & signed with HSM. Off-chain file delivered via encrypted channel.
          </span>
        </div>

        <div className="pt-4 border-t border-ce-border flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-ce-surface-subtle border border-ce-border text-ce-text-secondary hover:text-ce-text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-ce-brand hover:bg-ce-brand-hover text-white font-bold transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>Initiate Transfer</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
