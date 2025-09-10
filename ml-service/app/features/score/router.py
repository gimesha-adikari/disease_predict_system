from fastapi import APIRouter
from .schemas import ScoreRequest, ScoreResponse
from .service import compute_score

router = APIRouter()

@router.post("/score", response_model=ScoreResponse)
def score(payload: ScoreRequest):
    return compute_score(payload.patient_id)
