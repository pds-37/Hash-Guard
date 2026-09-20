import { apiClient, IS_MOCK_FALLBACK } from './api';
import { mockLineageGraph, mockLineageVerification } from '../mock/lineage';

let lineageState = JSON.parse(JSON.stringify(mockLineageGraph));

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

    return lineageState;
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

    const newNodeId = `node-${lineageState.nodes.length + 1}`;
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
      source: lineageState.nodes.find(n => n.data.id === parentArtifactId)?.id || lineageState.nodes[0].id,
      target: newNodeId,
      label: 'DERIVED FROM',
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 2 }
    };

    lineageState.nodes.push(nodeObj);
    lineageState.edges.push(edgeObj);

    return { node: nodeObj, edge: edgeObj };
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

    // Simulate async cryptographic validation delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return mockLineageVerification;
  }
};
