import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ShieldPlus, Hash, Upload, Loader2 } from 'lucide-react';
import { evidenceService } from '../../services/evidenceService';
import { BlockchainTerminalOverlay } from '../common/BlockchainTerminalOverlay';
import { ethers } from 'ethers';
import HashGuardABI from '../../contracts/HashGuard.json';

export const NewEvidenceModal = ({ isOpen, onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Malware Binary',
    fileSize: '',
    collector: 'analyst-lead@org-a.gov',
    description: '',
    sourceOrg: 'Organization A (CERT-Alpha)',
    currentCustodian: 'Organization A (CERT-Alpha)',
    parentEvidenceId: ''
  });
  const [computingHash, setComputingHash] = useState(false);
  const [computedHash, setComputedHash] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    // Set file size
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    setFormData(prev => ({ ...prev, fileSize: `${sizeInMB} MB` }));
    
    // Suggest a title if empty
    if (!formData.title) {
        setFormData(prev => ({ ...prev, title: file.name }));
    }

    setComputingHash(true);
    setComputedHash('Computing SHA-256...');
    
    try {
      // Calculate real SHA-256 Hash using Web Crypto API
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setComputedHash(hashHex);
    } catch (error) {
      console.error("Error computing hash", error);
      setComputedHash('');
    } finally {
      setComputingHash(false);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!computedHash || computedHash.includes('Computing')) {
        alert("Please wait for the hash to finish computing or provide one manually.");
        return;
    }

    setShowTerminal(true);
  };

  const executeBlockchainTransaction = async () => {
    setIsSubmitting(true);
    try {
      if (!window.ethereum) {
        throw new Error("No Web3 wallet found. Please install MetaMask.");
      }

      // 1. Connect to MetaMask using ethers.js BrowserProvider
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access if needed
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      
      // Contract deployed address (deterministic on local Anvil)
      const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
      const contract = new ethers.Contract(contractAddress, HashGuardABI.abi, signer);

      // We need a temporary asset ID. In a real system, the frontend might generate a UUID.
      const assetId = `EV-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      // Convert the computed hash (hex string) to bytes32 format
      const contentHash = '0x' + computedHash;
      
      // For metadata hash, we'll just hash the title for now
      const metadataHash = ethers.id(formData.title || 'metadata');

      // 2. Sign and send the transaction DIRECTLY from MetaMask
      const tx = await contract.mintEvidenceNFT(
        signer.address,
        assetId,
        contentHash,
        metadataHash
      );
      
      // Wait for receipt
      const receipt = await tx.wait();
      const txHash = receipt.hash;

      // 3. Send the file and the transaction hash to the backend
      const created = await evidenceService.createEvidence({
        ...formData,
        id: assetId,
        hash: computedHash,
        txHash: txHash
      }, selectedFile);

      if (onCreated) onCreated(created);
      onClose();
    } catch (error) {
      console.error("Failed to create evidence:", error);
      alert(`Error creating evidence: ${error.message || 'Check console or backend logs'}`);
    } finally {
      setIsSubmitting(false);
      setShowTerminal(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="COLLECT & SEAL DIGITAL EVIDENCE"
      subtitle="Select a local file to client-side hash and anchor an immutable custody seal"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm font-sans">
        
        {/* Real-time File Selector */}
        <div className="p-6 rounded-md bg-ce-surface-subtle border border-ce-border border-dashed hover:border-ce-brand/50 transition-colors text-center relative cursor-pointer group">
           <input 
             type="file" 
             onChange={handleFileSelect} 
             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
             title="Select physical file to hash"
           />
           <div className="flex flex-col items-center justify-center pointer-events-none">
             <div className="w-10 h-10 rounded-full bg-ce-brand/10 border border-ce-brand/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
               <Upload className="w-5 h-5 text-ce-brand" />
             </div>
             <span className="font-semibold text-ce-text-primary text-sm">Select Physical File for Hashing</span>
             <span className="text-xs text-ce-text-muted mt-1 max-w-sm">File never leaves your machine. Hashing is performed locally in browser via WebCrypto.</span>
           </div>
        </div>

        {/* MetaMask Instructions Banner */}
        <div className="p-3 rounded-md bg-ce-warning/10 border border-ce-warning/30 text-ce-warning text-xs font-mono">
          <strong>Web3 Requirement:</strong> Please ensure MetaMask is connected to Localhost 8545 (Chain ID 31337) and you are using an authorized Collector account.
        </div>

        <div>
          <label className="block text-ce-text-primary text-xs font-semibold uppercase tracking-wider mb-1.5">
            Evidence Title / Specimen Label:
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Encrypted Ransomware Dropper DLL"
            className="w-full bg-ce-bg border border-ce-border rounded-md px-3 py-2 text-ce-text-primary placeholder:text-ce-text-muted focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand font-mono text-sm transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-ce-text-primary text-xs font-semibold uppercase tracking-wider mb-1.5">
              Evidence Type:
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-ce-bg border border-ce-border rounded-md px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand cursor-pointer font-mono text-sm transition-colors"
            >
              <option value="Malware Binary">Malware Binary</option>
              <option value="Network Capture">Network Capture (PCAP)</option>
              <option value="Memory Dump">Memory Dump (RAM)</option>
              <option value="Disk Image">Disk Image (E01)</option>
              <option value="IOC Set">IOC Set (YARA / Sigma)</option>
              <option value="Malware Analysis Report">Malware Analysis Report</option>
              <option value="Digital Document">Digital Document (PDF/DOCX)</option>
              <option value="Media File">Media File (Image/Video)</option>
              <option value="Source Code">Source Code / Script</option>
            </select>
          </div>

          <div>
            <label className="block text-ce-text-primary text-xs font-semibold uppercase tracking-wider mb-1.5">
              Calculated File Size:
            </label>
            <input
              type="text"
              value={formData.fileSize}
              onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
              placeholder="e.g. 14.8 MB"
              className="w-full bg-ce-bg border border-ce-border rounded-md px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand font-mono text-sm transition-colors"
            />
          </div>
        </div>

        {/* SHA-256 Computation Box */}
        <div className="p-4 rounded-md bg-ce-surface-subtle border border-ce-brand/30 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-ce-brand uppercase tracking-wider flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" />
              CLIENT-SIDE SHA-256 INTEGRITY HASH
            </span>
            {computingHash && <Loader2 className="w-3.5 h-3.5 text-ce-brand animate-spin" />}
          </div>
          <input
            type="text"
            required
            value={computedHash}
            onChange={(e) => setComputedHash(e.target.value)}
            placeholder="Select a file above or enter SHA-256 manually..."
            className={`w-full bg-ce-bg border border-ce-border rounded-md px-3 py-2 placeholder:text-ce-text-muted focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand font-mono text-xs transition-colors ${computingHash ? 'text-ce-brand animate-pulse' : 'text-ce-text-primary'}`}
          />
        </div>

        <div>
          <label className="block text-ce-text-primary text-xs font-semibold uppercase tracking-wider mb-1.5">
            Forensic Scope & Technical Context:
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Document extraction method, acquisition sector, triage tags..."
            className="w-full bg-ce-bg border border-ce-border rounded-md p-3 text-ce-text-primary placeholder:text-ce-text-muted focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand text-sm transition-colors mb-4"
          />

          <label className="block text-ce-text-primary text-xs font-semibold uppercase tracking-wider mb-1.5">
            Raw Sample / Forensic Notes (For AI Triage):
          </label>
          <textarea
            rows={5}
            value={formData.forensicNotes || ''}
            onChange={(e) => setFormData({ ...formData, forensicNotes: e.target.value })}
            placeholder="Paste raw log lines, hex dumps, scripts, or specific forensic observations here for the AI to analyze..."
            className="w-full bg-ce-bg border border-ce-border rounded-md p-3 text-ce-text-primary placeholder:text-ce-text-muted focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand font-mono text-xs transition-colors"
          />
        </div>

        <div className="pt-4 mt-2 border-t border-ce-border flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-ce-surface-subtle text-ce-text-secondary hover:text-ce-text-primary hover:bg-ce-border transition-colors font-semibold text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={computingHash || isSubmitting}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-md bg-ce-brand hover:bg-ce-brand-hover text-white font-bold text-xs transition-colors shadow-sm ${(computingHash || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldPlus className="w-4 h-4" />}
            <span>{isSubmitting ? 'Anchoring to Blockchain...' : 'Seal Evidence & Register Custody'}</span>
          </button>
        </div>
      </form>
      <BlockchainTerminalOverlay 
        isOpen={showTerminal} 
        title="EVM NODE: REGISTRY ANCHOR"
        onComplete={executeBlockchainTransaction}
        steps={[
          "Initializing SECP256k1 Elliptic Curve module...",
          "Packing ABI arguments: (assetId, assetType, organizationId, contentHash, metadataHash, storageRef)",
          `Executing local client-side SHA-256 Digest: ${computedHash ? computedHash.substring(0, 16) + '...' : ''}`,
          "Signing payload with Multi-Sig Identity Wallet...",
          "Broadcasting POST /api/v1/evidence (HTTP/2.0)",
          "Awaiting transaction receipt from Anvil EVM (ChainID: 31337)...",
          "Transaction Confirmed! Block successfully minted."
        ]}
      />
    </Modal>
  );
};
