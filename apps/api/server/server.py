from fastapi import APIRouter
from audio_book_converter.router import router as audio_book_converter_router



server = APIRouter(
    prefix="/api",
)

server.include_router(audio_book_converter_router)
