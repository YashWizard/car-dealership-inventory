"""Application entry point."""
from fastapi import FastAPI

app = FastAPI(title="Car Dealership Inventory API")


@app.get("/api/health")
def health():
    return {"status": "ok"}
