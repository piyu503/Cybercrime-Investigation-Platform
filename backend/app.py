from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database.mongodb import connect_to_mongo, close_mongo_connection
from routes.cases import router as cases_router
from routes.upload import router as upload_router
from routes.process import router as process_router
from routes.reasoning import router as reasoning_router
from routes.intelligence import router as intelligence_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(
    title="Investigation Forensix API",
    description="Digital Evidence & Investigation Automation Backend",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cases_router, prefix="/cases", tags=["Cases"])
app.include_router(upload_router, prefix="/upload", tags=["Upload"])
app.include_router(process_router, prefix="/process", tags=["Process"])
app.include_router(reasoning_router, tags=["Reasoning"])
app.include_router(intelligence_router, tags=["Intelligence"])


@app.get("/", tags=["Health"])
async def root():
    return {
        "project": "Investigation Forensix",
        "status": "operational",
        "version": "1.0.0",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}
