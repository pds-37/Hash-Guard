const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8001;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// Initialize DB
async function initDb() {
  try {
    await fs.access(DB_FILE);
  } catch (err) {
    const initialData = {
      evidence: [],
      audit_logs: [],
      transfers: []
    };
    await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Read DB
async function readDb() {
  const data = await fs.readFile(DB_FILE, 'utf8');
  return JSON.parse(data);
}

// Write DB
async function writeDb(data) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

// --- ROUTES ---

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', engine: 'Node.js Express JSON DB' });
});

// Evidence Routes
app.get('/api/v1/evidence', async (req, res) => {
  const db = await readDb();
  res.json(db.evidence);
});

app.post('/api/v1/evidence', async (req, res) => {
  const db = await readDb();
  const payload = req.body;
  
  const newEvidence = {
    id: `EV-${uuidv4().substring(0,8).toUpperCase()}`,
    title: payload.title || 'Untitled Evidence',
    type: payload.type || 'Generic Artifact',
    sourceOrg: payload.sourceOrg || 'Organization A',
    currentCustodian: payload.currentCustodian || 'Organization A',
    hash: payload.hash || require('crypto').createHash('sha256').update(Date.now().toString()).digest('hex'),
    expectedHash: payload.hash || require('crypto').createHash('sha256').update(Date.now().toString()).digest('hex'),
    hashAlgorithm: 'SHA-256',
    status: 'VERIFIED',
    fileSize: payload.fileSize || 'N/A',
    collector: payload.collector || 'system',
    createdAt: new Date().toISOString(),
    lastEvent: 'COLLECT',
    lastEventTime: new Date().toISOString(),
    storageType: 'OFF-CHAIN',
    blockchainStatus: 'ON-CHAIN VERIFIED',
    blockNumber: Math.floor(Math.random() * 500000),
    txHash: '0x' + require('crypto').randomBytes(32).toString('hex'),
    isDerived: false,
    derivedCount: 0,
    signature: {
        status: 'VALID',
        signer: 'Organization A',
        algorithm: 'ECDSA',
        signedTimestamp: new Date().toISOString()
    }
  };

  db.evidence.unshift(newEvidence);
  
  // Log event
  db.audit_logs.unshift({
    id: `AUD-${uuidv4().substring(0,8).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    event: 'EVIDENCE_SEALED',
    actor: payload.collector || 'system',
    organization: payload.sourceOrg || 'Organization A',
    evidence_id: newEvidence.id,
    event_id: `EVT-${uuidv4().substring(0,8).toUpperCase()}`,
    verification: 'VERIFIED',
    reference: 'SmartContract',
    details: 'Cryptographic hash of evidence binary sealed on ledger.'
  });

  await writeDb(db);
  res.json(newEvidence);
});

app.get('/api/v1/evidence/:id', async (req, res) => {
  const db = await readDb();
  const item = db.evidence.find(e => e.id === req.params.id);
  if (item) res.json(item);
  else res.status(404).json({ error: 'Not found' });
});

// Audit Routes
app.get('/api/v1/audit', async (req, res) => {
  const db = await readDb();
  res.json(db.audit_logs);
});

// Seed Initial Data
app.post('/api/v1/admin/seed', async (req, res) => {
  const db = await readDb();
  if (db.evidence.length === 0) {
    db.evidence.push({
      id: "EV-001",
      title: "Ransomware Payload Sample",
      type: "Binary / Malware",
      sourceOrg: "CERT-Alpha",
      currentCustodian: "CERT-Alpha",
      hash: "8f3a91bc7d92e40f1c29e618174520bc9318fa5d2a912bc20141a4574929db19",
      expectedHash: "8f3a91bc7d92e40f1c29e618174520bc9318fa5d2a912bc20141a4574929db19",
      hashAlgorithm: "SHA-256",
      status: "VERIFIED",
      fileSize: "1.2 MB",
      collector: "john.doe@cert-alpha.gov",
      createdAt: new Date().toISOString(),
      lastEvent: "SEALED",
      lastEventTime: new Date().toISOString(),
      storageType: "OFF-CHAIN SECURED",
      blockchainStatus: "ON-CHAIN RECORD VERIFIED",
      blockNumber: 482931,
      txHash: "0x7f23c91a0b32...",
      isDerived: false,
      derivedCount: 1,
      signature: {
          status: "VALID",
          signer: "CERT-Alpha",
          algorithm: "ECDSA",
          signedTimestamp: new Date().toISOString()
      }
    });
    db.audit_logs.push({
        id: `AUD-99238A`,
        timestamp: new Date().toISOString(),
        event: "USER_LOGIN",
        actor: "admin@cert-alpha.gov",
        organization: "CERT-Alpha",
        evidence_id: "N/A",
        event_id: "EVT-19283A",
        verification: "SUCCESS",
        reference: "Auth-Gateway",
        details: "User successfully authenticated."
    });
    await writeDb(db);
    res.json({ message: "Seeded data" });
  } else {
    res.json({ message: "Already seeded" });
  }
});


initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Node backend running on http://localhost:${PORT}`);
  });
});
