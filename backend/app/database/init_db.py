from app.database.database import SessionLocal
from app.models.organization import Organization
from app.models.user import User
from app.models.audit_log import AuditLog
from app.core.security import get_password_hash
from datetime import datetime, timedelta
import uuid

def init_db():
    db = SessionLocal()
    try:
        # Seed Organizations
        org_b = db.query(Organization).filter(Organization.id == "ORG-B").first()
        if not org_b:
            org_b = Organization(
                id="ORG-B",
                organization_code="ORG-B",
                name="Cyber Defense & Forensics Lab B",
                description="Forensic analysis laboratory node",
                status="ACTIVE"
            )
            db.add(org_b)

        org_a = db.query(Organization).filter(Organization.id == "ORG-A").first()
        if not org_a:
            org_a = Organization(
                id="ORG-A",
                organization_code="ORG-A",
                name="CERT-Alpha",
                description="Evidence originator and national response node",
                status="ACTIVE"
            )
            db.add(org_a)
        db.commit()

        # Seed Admin User
        user = db.query(User).filter(User.email == "admin@cyberlab.local").first()
        if not user:
            user = User(
                id="USR-001",
                email="admin@cyberlab.local",
                password_hash=get_password_hash("admin123"),
                organization_id="ORG-B",
                role="ADMIN",
                status="ACTIVE"
            )
            db.add(user)

        user_a = db.query(User).filter(User.email == "admin@cert-alpha.gov").first()
        if not user_a:
            user_a = User(
                id="USR-002",
                email="admin@cert-alpha.gov",
                password_hash=get_password_hash("admin123"),
                organization_id="ORG-A",
                role="ADMIN",
                status="ACTIVE"
            )
            db.add(user_a)
        db.commit()

        # Seed initial audit logs if empty
        if db.query(AuditLog).count() == 0:
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
            print("[Database] Initial audit logs and seed data successfully initialized.")

    except Exception as e:
        db.rollback()
        print(f"[Database] Error during initial database seeding: {e}")
    finally:
        db.close()
