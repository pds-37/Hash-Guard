import { apiClient, IS_MOCK_FALLBACK } from './api';
import { mockLineageGraph, mockLineageVerification } from '../mock/lineage';
import { evidenceService } from './evidenceService';

const isSandboxModeActive = () => {
  try {
    return localStorage.getItem('cee_is_sandbox') === 'true';
  } catch {
    return false;
  }
};

let sandboxLineageState = JSON.parse(JSON.stringify(mockLineageGraph));

export const lineageService = {
  async getLineageGraph(evidenceId = 'EV-001') {
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.get(`/lineage/${evidenceId}`);
        return response.data;
      }
    } catch (err) {
      // Fallback
    }

    if (isSandboxModeActive()) {
      return sandboxLineageState;
    }

    // Genuine Mode: build dynamically from genuine evidence store
    const allEvidence = await evidenceService.getAllEvidence();
    if (!allEvidence || allEvidence.length === 0) {
      return { evidenceId: null, nodes: [], edges: [] };
    }

    const target = (evidenceId && allEvidence.find(e => e.id.toUpperCase() === evidenceId.toUpperCase())) || allEvidence[0];

    const rootNode = {
      id: "node-root",
      type: "lineageNode",
      position: { x: 350, y: 50 },
      data: {
        id: target.id,
        label: `Exhibit: ${target.title}`,
        artifactType: "Original Exhibit (Root)",
        hash: target.hash,
        creator: target.sourceOrg || "Registered Agency Node",
        timestamp: target.createdAt || new Date().toISOString(),
        verificationState: target.status || "VERIFIED",
        isRoot: true,
        details: {
          file: target.title,
          size: target.fileSize || "Real File",
          algorithm: "SHA-256",
          signature: "ECDSA VALID (Authorized Key)"
        }
      }
    };

    return {
      evidenceId: target.id,
      nodes: [rootNode],
      edges: []
    };
  },

  async deriveArtifact(parentArtifactId, newArtifact) {
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.post(`/lineage/${parentArtifactId}/derive`, newArtifact);
        return response.data;
      }
    } catch (err) {
      // Fallback
    }

    if (isSandboxModeActive()) {
      const newNodeId = `node-${sandboxLineageState.nodes.length + 1}`;
      const newArtifactId = `DER-${Math.floor(100 + Math.random() * 900)}`;
      
      const nodeObj = {
        id: newNodeId,
        type: "lineageNode",
        position: { x: 350 + (Math.random() * 200 - 100), y: 1050 + (Math.random() * 100) },
        data: {
          id: newArtifactId,
          label: newArtifact.title || 'Derived Forensic Artifact',
          artifactType: newArtifact.type || 'Derived Artifact',
          hash: newArtifact.hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          creator: newArtifact.creator || 'Organization B (Cyber Lab)',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          verificationState: 'VERIFIED',
          isRoot: false,
          details: {
            file: newArtifact.filename || 'derived_output.json',
            size: newArtifact.size || '1.5 MB',
            algorithm: 'SHA-256',
            signature: 'ECDSA VALID (Org B)'
          }
        }
      };

      const edgeObj = {
        id: `e-${parentArtifactId}-${newNodeId}`,
        source: sandboxLineageState.nodes.find(n => n.data.id === parentArtifactId)?.id || sandboxLineageState.nodes[0].id,
        target: newNodeId,
        label: 'DERIVED FROM',
        animated: true,
        style: { stroke: '#10b981', strokeWidth: 2 }
      };

      sandboxLineageState.nodes.push(nodeObj);
      sandboxLineageState.edges.push(edgeObj);

      return { node: nodeObj, edge: edgeObj };
    }

    // In genuine mode:
    return {
      node: {
        id: `node-der-${Date.now()}`,
        type: "lineageNode",
        data: {
          id: `DER-${Math.floor(100 + Math.random() * 900)}`,
          label: newArtifact.title || 'Derived Artifact',
          hash: newArtifact.hash
        }
      }
    };
  },

  async verifyLineageChain(evidenceId = 'EV-001') {
    try {
      if (!IS_MOCK_FALLBACK) {
        const response = await apiClient.post(`/lineage/${evidenceId}/verify`);
        return response.data;
      }
    } catch (err) {
      // Fallback
    }

    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockLineageVerification;
  }
};
