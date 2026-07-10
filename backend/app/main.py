"""
Hospital Dashboard — FastAPI Application Entry Point.

Three-layer architecture:
  Router → Service → Repository → assets.json

Ping Engine start/stop is managed via FastAPI lifespan events.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.core.config import CORS_ORIGINS, DEBUG
from app.schemas.common import ErrorResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: launch ping engine. Shutdown: stop ping engine gracefully."""
    # Startup
    from app.services.ping_engine import ping_engine
    ping_engine.start()

    yield

    # Shutdown
    ping_engine.stop()


app = FastAPI(
    title="Hospital Dashboard API",
    description="Backend API for hospital network operations platform",
    version="2.9.0",
    docs_url="/docs" if DEBUG else None,
    redoc_url="/redoc" if DEBUG else None,
    lifespan=lifespan,
)

# ── CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Global error handler ──
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            message="Internal server error",
            detail=str(exc) if DEBUG else None,
        ).model_dump(),
    )

# ── Routers ──
app.include_router(api_router)


@app.get("/")
async def root():
    return {"app": "Hospital Dashboard API", "version": "2.9.0", "docs": "/docs"}
