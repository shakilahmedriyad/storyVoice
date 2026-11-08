from typing import Annotated

from fastapi import APIRouter, Depends, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession


from db.database import get_db
from utils.schema.Ctx import Ctx
from utils.get_user import get_user
from common.chapter_separator.chapter_extractor import extract_chapters
from .service import (
    create_audio_book as run_audio_book_creation,
    save_audio_book,
    save_chapters_to_db,
)
from .schemas import CreateAudioBookSchema
from .models.model import Book

router = APIRouter(prefix="/converter", tags=["Audio Book Converter"])


@router.post("/")
async def create_audio_book(
    form_data: Annotated[CreateAudioBookSchema, Form()],
    ctx: Ctx = Depends(get_user),
    db: AsyncSession = Depends(get_db),
):
    user = ctx.user
    chapters = await extract_chapters(form_data.file)
    if not chapters:
        raise HTTPException(
            status_code=422,
            detail="Could not find a table of contents or chapters in this book.",
        )

    book = await save_audio_book(form_data, user, chapters, db)

    chapters = await save_chapters_to_db(chapters, book, db)
    data = {
        "book_name": form_data.file.filename,
        "book_id": book.id,
        "total_chapters": len(chapters),
        "language": form_data.language,
        "storytelling_style": form_data.style,
        "pacing": form_data.pacing,
        "chapters": [
            {"title": chapter.title, "id": chapter.id} for chapter in chapters
        ],
    }

    return {
        "message": "success",
        "code": 200,
        "data": data,
    }
