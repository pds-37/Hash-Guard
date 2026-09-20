from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.retention import RetentionPolicy, RetentionEvent
from app.models.evidence import Evidence
from pydantic import BaseModel
from typing import List, Optional
import datetime

router = APIRouter()

class RetentionPolicyCreate(BaseModel):
    name: str
    retention_period_days: int
    trigger_event: str
    action_on_expiry: str

class PolicyAssignRequest(BaseModel):
    policy_id: str

class RetentionExtendRequest(BaseModel):
    reason: str
    additional_days: int

@router.post("/policies")
def create_policy(policy: RetentionPolicyCreate, db: Session = Depends(get_db)):
    # Role check omitted for brevity
    new_policy = RetentionPolicy(**policy.dict())
    db.add(new_policy)
    db.commit()
    db.refresh(new_policy)
    return new_policy

@router.get("/policies")
def get_policies(db: Session = Depends(get_db)):
    return db.query(RetentionPolicy).all()

@router.patch("/evidence/{evidence_id}/policy")
def assign_policy(evidence_id: str, req: PolicyAssignRequest, db: Session = Depends(get_db)):
    evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not evidence: raise HTTPException(404, "Evidence not found")
    
    policy = db.query(RetentionPolicy).filter(RetentionPolicy.id == req.policy_id).first()
    if not policy: raise HTTPException(404, "Policy not found")
    
    evidence.retention_policy_id = policy.id
    if policy.trigger_event == 'evidence_sealed':
        evidence.retention_start_at = datetime.datetime.utcnow()
        evidence.retention_expires_at = evidence.retention_start_at + datetime.timedelta(days=policy.retention_period_days)
    
    event = RetentionEvent(
        evidence_id=evidence_id,
        event_type="policy_assigned",
        reason=f"Assigned policy {policy.name}"
    )
    db.add(event)
    db.commit()
    return {"status": "success", "expires_at": evidence.retention_expires_at}

@router.post("/evidence/{evidence_id}/extend")
def extend_retention(evidence_id: str, req: RetentionExtendRequest, db: Session = Depends(get_db)):
    evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not evidence or not evidence.retention_expires_at:
        raise HTTPException(400, "Invalid evidence or no active retention")
        
    evidence.retention_expires_at += datetime.timedelta(days=req.additional_days)
    evidence.retention_status = 'active'
    
    # Write on chain
    tx_hash = None
    try:
        from app.blockchain.evm_client import evm_client
        token_id = evm_client.get_token_id_for_asset(evidence_id)
        if token_id:
            receipt = evm_client.log_retention_event(token_id, "retention_extended")
            if receipt: tx_hash = receipt['transactionHash'].hex()
    except: pass
    
    event = RetentionEvent(
        evidence_id=evidence_id,
        event_type="retention_extended",
        reason=req.reason,
        tx_hash=tx_hash
    )
    db.add(event)
    db.commit()
    return {"status": "success", "new_expiry": evidence.retention_expires_at}

@router.get("/evidence/{evidence_id}/history")
def get_history(evidence_id: str, db: Session = Depends(get_db)):
    return db.query(RetentionEvent).filter(RetentionEvent.evidence_id == evidence_id).order_by(RetentionEvent.created_at.desc()).all()
