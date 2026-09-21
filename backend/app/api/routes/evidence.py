from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form, Request
from sqlalchemy.orm import Session
from typing import List, Optional
import json

from app.database.database import get_db
from app.schemas.evidence import EvidenceCreate, EvidenceResponse
from app.services.evidence_service import EvidenceService

router = APIRouter()

@router.get("", response_model=List[EvidenceResponse])
def get_all_evidence(
    search: Optional[str] = None,
    status: Optional[str] = None,
    type: Optional[str] = None,
    organization: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return EvidenceService.get_all(db, search, status, type, organization)

@router.get("/{evidence_id}", response_model=EvidenceResponse)
def get_evidence(evidence_id: str, db: Session = Depends(get_db)):
    evidence = EvidenceService.get_by_id(db, evidence_id)
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
    return evidence

from fastapi.responses import Response

@router.get("/{evidence_id}/download")
def download_evidence(evidence_id: str, db: Session = Depends(get_db)):
    evidence = EvidenceService.get_by_id(db, evidence_id)
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
        
    decrypted_bytes = EvidenceService.download(db, evidence_id)
    if not decrypted_bytes:
        raise HTTPException(status_code=404, detail="File could not be retrieved or decrypted.")
        
    return Response(
        content=decrypted_bytes,
        headers={
            "Content-Disposition": f'attachment; filename="{evidence.title}"',
            "Content-Type": "application/octet-stream"
        }
    )

@router.post("", response_model=EvidenceResponse)
async def create_evidence(
    request: Request,
    db: Session = Depends(get_db)
):
    content_type = request.headers.get("content-type", "")
    
    if "multipart/form-data" in content_type:
        form = await request.form()
        metadata_val = form.get("metadata")
        file_val = form.get("file")
        
        if not metadata_val:
            raise HTTPException(status_code=422, detail="Missing 'metadata' form field")
            
        try:
            ev_data = EvidenceCreate.model_validate_json(metadata_val)
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"Invalid metadata JSON: {e}")
            
        if file_val and hasattr(file_val, "read"):
            file_bytes = await file_val.read()
        else:
            file_bytes = b"EMPTY_EVIDENCE_SAMPLE"
    else:
        # Direct JSON payload
        try:
            body_json = await request.json()
            ev_data = EvidenceCreate.model_validate(body_json)
            file_bytes = b"EMPTY_EVIDENCE_SAMPLE"
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"Invalid evidence JSON: {e}")
            
    return EvidenceService.create(db, ev_data, file_bytes)
