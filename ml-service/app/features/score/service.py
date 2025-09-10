from .schemas import ScoreResponse

# Replace this with your real model logic later.
def compute_score(patient_id: str | None) -> ScoreResponse:
    return ScoreResponse(
        band="yellow",
        score=0.42,
        reasons=["demo-stub"],
        model_version="0.0.1",
    )
