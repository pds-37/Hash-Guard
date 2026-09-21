from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class EvidenceCreate(BaseModel):
    id: Optional[str] = None
    caseId: Optional[str] = "CASE-2026-9012"
    title: str
    type: str
    sourceOrg: str
    currentCustodian: str
    hash: str
    fileSize: str
    collector: str
    parentEvidenceId: Optional[str] = None
    description: str
    forensicNotes: Optional[str] = None
    txHash: Optional[str] = None

class SignatureSchema(BaseModel):
    status: str
    signer: str
    algorithm: str
    publicKeyFingerprint: str
    signedTimestamp: str
    manifestId: str

class EvidenceResponse(BaseModel):
    id: str
    caseId: Optional[str] = "CASE-2026-9012"
    title: str
    type: str
    sourceOrg: str
    currentCustodian: str
    hash: str
    expectedHash: str
    hashAlgorithm: str
    status: str
    fileSize: Optional[str]
    collector: Optional[str]
    createdAt: str
    lastEvent: str
    lastEventTime: str
    storageType: str
    storageLocation: Optional[str]
    accessControl: str
    blockchainStatus: str
    blockNumber: Optional[int]
    txHash: Optional[str]
    signature: SignatureSchema
    parentEvidenceId: Optional[str]
    isDerived: bool
    derivedCount: int
    description: Optional[str]
    forensicNotes: Optional[str] = None
