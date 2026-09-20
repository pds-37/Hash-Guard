from pydantic import BaseModel
from typing import Optional

class AuditLogResponse(BaseModel):
    id: str
    timestamp: str
    event: str
    actor: str
    organization: str
    evidenceId: Optional[str]
    eventId: Optional[str]
    verification: Optional[str]
    reference: Optional[str]
    details: Optional[str]
