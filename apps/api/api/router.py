"""Top-level HTTP router composition."""

from fastapi import APIRouter

from modules.audio_book.router import router as audio_book_router

api_router = APIRouter(prefix="/api")
api_router.include_router(audio_book_router)
