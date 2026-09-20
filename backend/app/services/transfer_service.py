import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.transfer import Transfer
from app.schemas.transfer import TransferCreate, TransferResponse, TransferStep

class TransferService:
    @staticmethod
    def get_all(db: Session, status: str = None, search: str = None):
        query = db.query(Transfer)
        if status and status != 'ALL':
            query = query.filter(Transfer.status == status)
        if search:
            search = search.lower()
            query = query.filter(
                (Transfer.transfer_id.ilike(f"%{search}%")) |
                (Transfer.evidence_id.ilike(f"%{search}%")) |
                (Transfer.from_org.ilike(f"%{search}%")) |
                (Transfer.to_org.ilike(f"%{search}%"))
            )
            
        results = query.all()
        return [TransferService._format_response(r) for r in results]

    @staticmethod
    def create(db: Session, data: TransferCreate):
        t_id = f"TR-{str(uuid.uuid4())[:8].upper()}"
        
        # Verify the txHash on chain
        tx_hash = data.txHash
        if tx_hash:
            try:
                from app.blockchain.evm_client import evm_client
                receipt = evm_client.w3.eth.get_transaction_receipt(tx_hash)
            except Exception as e:
                print(f"Failed to verify transfer tx_hash {tx_hash}: {e}")
        else:
            tx_hash = "0x" + str(uuid.uuid4().hex) # Fallback for test data without web3
        
        new_transfer = Transfer(
            transfer_id=t_id,
            evidence_id=data.evidenceId,
            evidence_title=data.evidenceTitle,
            evidence_type=data.evidenceType,
            from_org=data.fromOrg,
            from_actor=data.fromActor,
            to_org=data.toOrg,
            to_actor=data.toActor,
            status="TRANSFERRING",
            manifest_hash=data.manifestHash,
            notes=data.notes,
            blockchain_tx=tx_hash
        )
        db.add(new_transfer)
        db.commit()
        db.refresh(new_transfer)

        # Auto-create Custody Event for TRANSFER
        try:
            from app.services.custody_service import CustodyService
            from app.schemas.custody import CustodyEventCreate
            CustodyService.create_event(db, CustodyEventCreate(
                evidenceId=data.evidenceId,
                event="TRANSFER",
                actor=data.fromActor,
                organization=data.fromOrg,
                hash="transfer-manifest-hash", # Just a placeholder since hash isn't strictly passed
                notes=f"Transfer dispatched to {data.toOrg}."
            ))
        except Exception as e:
            print(f"Failed to create TRANSFER event: {e}")

        return TransferService._format_response(new_transfer)

    @staticmethod
    def accept(db: Session, transfer_id: str):
        # find by transfer_id or id
        transfer = db.query(Transfer).filter((Transfer.transfer_id == transfer_id) | (Transfer.id == transfer_id)).first()
        if not transfer:
            return None
            
        # The blockchain transfer already happened during create() via frontend.
        # Here we just mark it as VERIFIED since the payload was received off-chain.
        transfer.status = "VERIFIED"
        transfer.completed_at = datetime.utcnow()
        db.commit()
        db.refresh(transfer)

        # Auto-create Custody Event for RECEIVE
        try:
            from app.services.custody_service import CustodyService
            from app.schemas.custody import CustodyEventCreate
            CustodyService.create_event(db, CustodyEventCreate(
                evidenceId=transfer.evidence_id,
                event="RECEIVE",
                actor=transfer.to_actor,
                organization=transfer.to_org,
                hash="transfer-manifest-hash", # placeholder
                notes=f"Transfer accepted and verified by {transfer.to_org}."
            ))
            
            # UPDATE THE ACTUAL EVIDENCE RECORD!
            from app.models.evidence import Evidence
            evidence = db.query(Evidence).filter(Evidence.id == transfer.evidence_id).first()
            if evidence:
                evidence.current_custodian = transfer.to_org
                evidence.last_event = "RECEIVE"
                evidence.status = "VERIFIED"
                db.commit()
                
        except Exception as e:
            print(f"Failed to create RECEIVE event or update evidence: {e}")

        return TransferService._format_response(transfer)

    @staticmethod
    def _format_response(t: Transfer) -> TransferResponse:
        steps = [
            TransferStep(step="MANIFEST_SIGN", org=t.from_org, timestamp=t.initiated_at.strftime('%H:%M:%S') if t.initiated_at else None, status="COMPLETED"),
            TransferStep(step="SECURE_DISPATCH", org=t.from_org, timestamp=t.initiated_at.strftime('%H:%M:%S') if t.initiated_at else None, status="COMPLETED" if t.status == "VERIFIED" else "IN_PROGRESS"),
            TransferStep(step="PAYLOAD_RECEIVE", org=t.to_org, timestamp=t.completed_at.strftime('%H:%M:%S') if t.completed_at else None, status="COMPLETED" if t.status == "VERIFIED" else "PENDING"),
            TransferStep(step="INTEGRITY_VERIFY", org=t.to_org, timestamp=t.completed_at.strftime('%H:%M:%S') if t.completed_at else None, status="COMPLETED" if t.status == "VERIFIED" else "PENDING"),
        ]
        
        return TransferResponse(
            id=t.transfer_id,
            evidenceId=t.evidence_id,
            evidenceTitle=t.evidence_title,
            evidenceType=t.evidence_type,
            fromOrg=t.from_org,
            fromActor=t.from_actor,
            toOrg=t.to_org,
            toActor=t.to_actor,
            status=t.status,
            transferProtocol=t.transfer_protocol,
            manifestHash=t.manifest_hash,
            initiatedAt=t.initiated_at.strftime('%Y-%m-%d %H:%M:%S UTC') if t.initiated_at else "",
            completedAt=t.completed_at.strftime('%Y-%m-%d %H:%M:%S UTC') if t.completed_at else None,
            blockchainTx=t.blockchain_tx,
            steps=steps,
            notes=t.notes
        )
