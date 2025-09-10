from fastapi import FastAPI
from app.features.score import router as score_router

app = FastAPI(title="ML Service", version="0.0.1")

@app.get("/v1/health")
def health():
    return {"ok": True, "service": "ml-service"}

# mount features
app.include_router(score_router, prefix="/v1")
