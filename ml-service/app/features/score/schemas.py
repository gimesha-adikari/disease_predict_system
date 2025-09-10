from pydantic import BaseModel
from typing import Optional, List

class ScoreRequest(BaseModel):
    patient_id: Optional[str] = None

class ScoreResponse(BaseModel):
    band: str
    score: float
    reasons: List[str]
    model_version: str
