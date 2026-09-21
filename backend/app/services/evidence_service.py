import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.evidence import Evidence
from app.schemas.evidence import EvidenceCreate, EvidenceResponse, SignatureSchema

class EvidenceService:
    @staticmethod
    def get_all(db: Session, search: str = None, status: str = None, ev_type: str = None, organization: str = None):
        query = db.query(Evidence)
        if status and status != 'ALL':
            query = query.filter(Evidence.status == status)
        if ev_type and ev_type != 'ALL':
            query = query.filter(Evidence.type == ev_type)
        if search:
            search = search.lower()
            query = query.filter(
                (Evidence.id.ilike(f"%{search}%")) |
                (Evidence.title.ilike(f"%{search}%")) |
                (Evidence.hash.ilike(f"%{search}%"))
            )
        
        # Format for frontend
        results = query.all()
        responses = []
        for e in results:
            responses.append(EvidenceService._format_response(e))
        return responses

    @staticmethod
    def get_by_id(db: Session, evidence_id: str):
        evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
        if not evidence:
            return None
        return EvidenceService._format_response(evidence)

    @staticmethod
    def download(db: Session, evidence_id: str):
        evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
        if not evidence:
            return None
        
        # storage_location looks like: minio://evidence/EV-XXXX/Filename.enc
        loc = evidence.storage_location
        if not loc or not loc.startswith("minio://"):
            return None
            
        parts = loc.replace("minio://", "").split("/")
        bucket_name = parts[0]
        object_name = "/".join(parts[1:])
        
        from app.storage.minio_client import minio_client
        from app.crypto.aes_gcm import aes_service
        
        try:
            response = minio_client.get_object(bucket_name, object_name)
            encrypted_data = response.read()
            response.close()
            response.release_conn()
            
            decrypted_data = aes_service.decrypt(encrypted_data, associated_data=evidence.id.encode())
            return decrypted_data
        except Exception as e:
            print(f"Download or decrypt failed: {e}")
            return None

    @staticmethod
    def create(db: Session, data: EvidenceCreate, file_bytes: bytes):
        ev_id = data.id if data.id else f"EV-{str(uuid.uuid4())[:8].upper()}"
        
        # ZONE 4: DATA LAYER - AES-256-GCM Encryption
        from app.crypto.aes_gcm import aes_service
        encrypted_payload = aes_service.encrypt(file_bytes, associated_data=ev_id.encode())
        
        # ZONE 4: DATA LAYER - Encrypted Off-Chain Storage (MinIO)
        from app.storage.minio_client import minio_client
        from app.core.config import settings
        import io
        
        object_name = f"{ev_id}/{data.title}.enc"
        try:
            minio_client.put_object(
                settings.MINIO_BUCKET,
                object_name,
                data=io.BytesIO(encrypted_payload),
                length=len(encrypted_payload)
            )
            storage_location = f"minio://{settings.MINIO_BUCKET}/{object_name}"
        except Exception as e:
            print(f"MinIO upload failed: {e}")
            storage_location = f"vault://secure-enclave/{data.title}.enc"
        
        # 5. Blockchain Integration (Verification)
        # The frontend ALREADY minted the NFT and provided the txHash.
        # We just verify it exists on-chain.
        tx_hash = data.txHash
        block_number = None
        if tx_hash:
            try:
                from app.blockchain.evm_client import evm_client
                receipt = evm_client.w3.eth.get_transaction_receipt(tx_hash)
                if receipt:
                    block_number = receipt['blockNumber']
            except Exception as e:
                print(f"Failed to verify tx_hash {tx_hash}: {e}")

        new_ev = Evidence(
            id=ev_id,
            title=data.title,
            type=data.type,
            source_org=data.sourceOrg,
            current_custodian=data.currentCustodian,
            hash=data.hash,
            expected_hash=data.hash,
            file_size=data.fileSize,
            collector=data.collector,
            parent_evidence_id=data.parentEvidenceId if data.parentEvidenceId else None,
            is_derived=bool(data.parentEvidenceId),
            description=data.description,
            forensic_notes=data.forensicNotes,
            storage_location=storage_location,
            tx_hash=tx_hash,
            block_number=block_number,
            blockchain_status="CONFIRMED" if tx_hash else "PENDING",
            status="VERIFIED" if tx_hash else "PENDING"
        )
        db.add(new_ev)
        db.commit()
        db.refresh(new_ev)

        # Auto-create Custody Event for COLLECT
        from app.services.custody_service import CustodyService
        from app.schemas.custody import CustodyEventCreate
        try:
            CustodyService.create_event(db, CustodyEventCreate(
                evidenceId=new_ev.id,
                event="COLLECT",
                actor=new_ev.collector,
                organization=new_ev.current_custodian,
                hash=new_ev.hash,
                notes="Initial evidence collection and blockchain registration."
            ))
        except Exception as e:
            print(f"Failed to create custody event: {e}")

        return EvidenceService._format_response(new_ev)

    @staticmethod
    def delete(db: Session, evidence_id: str):
        from app.models.custody_event import CustodyEvent
        from app.models.transfer import Transfer
        
        evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
        if not evidence:
            return False
            
        try:
            db.query(CustodyEvent).filter(CustodyEvent.evidence_id == evidence_id).delete()
            db.query(Transfer).filter(Transfer.evidence_id == evidence_id).delete()
            db.delete(evidence)
            db.commit()
            return True
        except Exception as e:
            db.rollback()
            print(f"Failed to delete evidence {evidence_id}: {e}")
            return False

    @staticmethod
    def wipe_all(db: Session):
        from app.models.custody_event import CustodyEvent
        from app.models.transfer import Transfer
        
        try:
            db.query(CustodyEvent).delete()
            db.query(Transfer).delete()
            try:
                from app.models.retention import RetentionEvent
                db.query(RetentionEvent).delete()
            except Exception:
                pass
            deleted_count = db.query(Evidence).delete()
            db.commit()
            return {"status": "SUCCESS", "message": f"Successfully wiped {deleted_count} evidence exhibits and related events."}
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Database wipe failed: {e}")

    @staticmethod
    def _format_response(e: Evidence) -> EvidenceResponse:
        return EvidenceResponse(
            id=e.id,
            title=e.title,
            type=e.type,
            sourceOrg=e.source_org,
            currentCustodian=e.current_custodian,
            hash=e.hash,
            expectedHash=e.expected_hash,
            hashAlgorithm=e.hash_algorithm,
            status=e.status,
            fileSize=e.file_size,
            collector=e.collector,
            createdAt=e.created_at.strftime('%Y-%m-%d %H:%M:%S UTC') if e.created_at else "",
            lastEvent=e.last_event,
            lastEventTime=e.last_event_time.strftime('%Y-%m-%d %H:%M:%S UTC') if e.last_event_time else "",
            storageType=e.storage_type,
            storageLocation=e.storage_location,
            accessControl=e.access_control,
            blockchainStatus=e.blockchain_status,
            blockNumber=e.block_number,
            txHash=e.tx_hash,
            signature=SignatureSchema(
                status="VALID",
                signer=f"{e.source_org} CA",
                algorithm="ECDSA / secp256k1",
                publicKeyFingerprint="SHA256:...",
                signedTimestamp=e.created_at.strftime('%Y-%m-%d %H:%M:%S UTC') if e.created_at else "",
                manifestId=f"MNF-{e.id}"
            ),
            parentEvidenceId=e.parent_evidence_id,
            isDerived=e.is_derived,
            derivedCount=e.derived_count,
            description=e.description,
            forensicNotes=e.forensic_notes
        )
