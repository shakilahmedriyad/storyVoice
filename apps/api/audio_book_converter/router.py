from fastapi import APIRouter, UploadFile, File
from common.ai.gemini_client import client
from google.genai import types
from common.chunk.create_chunk import creat_chunk
from feature.edgetts.audio_converter import generate_story

router = APIRouter(prefix="/converter", tags=["Audio Book Converter"])


@router.post("/")
async def audio_book_converter(file: UploadFile = File(...)):
    # session = client.chats.create(model="gemini-3.8-flash")
    pdf_bytes = await file.read()
    creat_chunk(pdf_bytes)

    return {
        "message": "Welcome to the Audio Book Converter",
        "filename": file.filename,
        "content_type": file.content_type,
    }
