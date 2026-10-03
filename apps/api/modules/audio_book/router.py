"""HTTP routes for the audio book feature."""

from typing import Annotated

from fastapi import APIRouter, Form, HTTPException

from common.chapter_separator.chapter_extractor import extract_chapters
from .service import create_audio_book as run_audio_book_creation
from .schemas import CreateAudioBookSchema

router = APIRouter(prefix="/converter", tags=["Audio Book Converter"])


@router.post("/")
async def create_audio_book(
    form_data: Annotated[CreateAudioBookSchema, Form()],
):
    chapters = await extract_chapters(form_data.file)
    if not chapters:
        raise HTTPException(
            status_code=422,
            detail="Could not find a table of contents or chapters in this book.",
        )

    await run_audio_book_creation(
        chapters=chapters,
        language=form_data.language.value,
        storytelling_style=form_data.style.value,
        pacing=form_data.pacing.value,
    )
    return {"message": "Welcome to the Audio Book Converter"}
