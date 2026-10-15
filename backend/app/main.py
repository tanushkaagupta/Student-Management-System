from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import students
from .database import engine, Base

app = FastAPI(title="StudentHub API", description="Backend for StudentHub student management", version="1.0.0")

# Create tables
Base.metadata.create_all(bind=engine)

# CORS configuration - adjust origins as needed
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", summary="API root")
async def root():
    return {"message": "StudentHub API is running"}

@app.get("/health", summary="Health check")
async def health():
    return {"status": "ok"}

# Include routers
app.include_router(students.router)
