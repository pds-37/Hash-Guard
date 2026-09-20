import sys
import os
from datetime import datetime, timedelta

# Add backend directory to path so we can import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.database import SessionLocal
from app.models.audit_log import AuditLog
import uuid

def seed():
    db = SessionLocal()
    
    # Check if there are already logs
    if db.query(AuditLog).count() > 0:
        print("Audit logs already exist. Skipping seed.")
        db.close()
        return

    print("Seeding audit logs...")
    now = datetime.utcnow()

    logs = [
        AuditLog(
            id=f"AUD-{str(uuid.uuid4())[:8].upper()}",
            timestamp=now - timedelta(hours=24),
            event="USER_LOGIN",
            actor="admin@cert-alpha.gov",
            organization="CERT-Alpha",
            evidence_id="N/A",
            event_id=f"EVT-{str(uuid.uuid4())[:8].upper()}",
            verification="SUCCESS",
            reference="Auth-Gateway-1",
            details="User successfully authenticated via Multi-Factor Authentication."
        ),
        AuditLog(
            id=f"AUD-{str(uuid.uuid4())[:8].upper()}",
            timestamp=now - timedelta(hours=23),
            event="EVIDENCE_SEALED",
            actor="analyst-1@cert-alpha.gov",
            organization="CERT-Alpha",
            evidence_id="EV-C17CE47C",
            event_id=f"EVT-{str(uuid.uuid4())[:8].upper()}",
            verification="VERIFIED",
            reference="SmartContract-0x8f3a",
            details="Cryptographic hash of evidence binary sealed on the blockchain ledger."
        ),
        AuditLog(
            id=f"AUD-{str(uuid.uuid4())[:8].upper()}",
            timestamp=now - timedelta(hours=22),
            event="AI_TRIAGE_RUN",
            actor="system@ai-engine",
            organization="CERT-Alpha",
            evidence_id="EV-C17CE47C",
            event_id=f"EVT-{str(uuid.uuid4())[:8].upper()}",
            verification="VERIFIED",
            reference="Gemini-1.5-Flash",
            details="Automated LLM forensic analysis performed. Threat level classified as CRITICAL."
        ),
        AuditLog(
            id=f"AUD-{str(uuid.uuid4())[:8].upper()}",
            timestamp=now - timedelta(hours=1),
            event="CROSS_ORG_TRANSFER",
            actor="ops-transport@cert-alpha.gov",
            organization="CERT-Alpha",
            evidence_id="EV-C17CE47C",
            event_id=f"EVT-{str(uuid.uuid4())[:8].upper()}",
            verification="PENDING",
            reference="mTLS-Dispatch",
            details="Secure evidence transfer initiated to Organization B (Cyber Defense Lab)."
        )
    ]

    for log in logs:
        db.add(log)
    
    db.commit()
    print("Seeded 4 realistic audit logs successfully!")
    db.close()

if __name__ == "__main__":
    seed()
