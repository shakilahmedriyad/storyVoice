from fastapi import APIRouter, UploadFile, File
from common.ai.gemini_client import client
from google.genai import types
from feature.edgetts.audio_converter import generate_story

router = APIRouter(prefix="/converter", tags=["Audio Book Converter"])


@router.post("/")
async def audio_book_converter(file: UploadFile = File(...)):
    session = client.chats.create(model="gemini-3.8-flash")
    pdf_bytes = await file.read()

    pdf_part = types.Part.from_bytes(data=pdf_bytes, mime_type="application/pdf")
    response = session.send_message(
        [
            "can you read this pdf and then seperate the chapters , I want just two chapters only nothing else and their title only",
            pdf_part,
        ]
    )

    print(response.text)

    return {
        "message": "Welcome to the Audio Book Converter",
        "filename": file.filename,
        "content_type": file.content_type,
    }
