from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog
from app.schemas.audit import AuditLogResponse

class AuditService:
    @staticmethod
    def get_logs(db: Session, event: str = None, organization: str = None, search: str = None):
        query = db.query(AuditLog)
        if event and event != 'ALL':
            query = query.filter(AuditLog.event == event)
        if organization and organization != 'ALL':
            query = query.filter(AuditLog.organization.ilike(f"%{organization}%"))
        if search:
            search = search.lower()
            query = query.filter(
                (AuditLog.id.ilike(f"%{search}%")) |
                (AuditLog.evidence_id.ilike(f"%{search}%")) |
                (AuditLog.actor.ilike(f"%{search}%")) |
                (AuditLog.event.ilike(f"%{search}%")) |
                (AuditLog.details.ilike(f"%{search}%"))
            )
            
        results = query.order_by(AuditLog.timestamp.desc()).all()
        return [AuditService._format_response(r) for r in results]

    @staticmethod
    def _format_response(a: AuditLog) -> AuditLogResponse:
        return AuditLogResponse(
            id=a.id,
            timestamp=a.timestamp.strftime('%Y-%m-%d %H:%M:%S UTC') if a.timestamp else "",
            event=a.event,
            actor=a.actor,
            organization=a.organization,
            evidenceId=a.evidence_id,
            eventId=a.event_id,
            verification=a.verification,
            reference=a.reference,
            details=a.details
        )
