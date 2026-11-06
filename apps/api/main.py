"""FastAPI application entry point."""

from dotenv import load_dotenv

load_dotenv()


from contextlib import asynccontextmanager


from db.database import Base, engine


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(title="Audio Book API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health Check"])
def health_check():
    return {"Hello": "World"}


app.include_router(api_router)
