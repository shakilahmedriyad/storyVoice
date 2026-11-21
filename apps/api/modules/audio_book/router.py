from typing import Annotated

from fastapi import APIRouter, Depends, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from db.database import get_db
from utils.schema.Ctx import Ctx
from utils.get_user import get_user
from common.chapter_separator.chapter_extractor import extract_chapters
from .service import (
    create_audio_book as run_audio_book_creation,
    get_book_from_db,
    save_audio_book,
    save_chapters_to_db,
)
from .schemas import CreateAudioBookSchema
from .models.model import Book, Chapter

router = APIRouter(prefix="/converter", tags=["Audio Book Converter"])


@router.get("/{book_id}")
async def get_audio_book(
    book_id: int,
    ctx: Ctx = Depends(get_user),
    db: AsyncSession = Depends(get_db),
):

    user = ctx.user

    book = await get_book_from_db(book_id, user, db)

    if not book:
        raise HTTPException(
            status_code=404,
            detail="Book not found.",
        )
    chapters = book.chapters

    data = {
        "book_name": book.name,
        "book_id": book.id,
        "total_chapters": len(chapters),
        "storytelling_style": book.style,
        "pacing": book.pacing,
        "chapters": [
            {"title": chapter.title, "id": chapter.id} for chapter in chapters
        ],
    }

    return {
        "message": "success",
        "code": 200,
        "data": data,
    }


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


@router.post("/start")
async def start_audio_book_creation(
    book_id: int,
    selected_chapters: list[int] | None = None,
    ctx: Ctx = Depends(get_user),
    db: AsyncSession = Depends(get_db),
):
    print(f"Selected chapters: {selected_chapters}")
    user = ctx.user
    # book = await get_book_from_db(book_id, user, db)

    # await run_audio_book_creation(
    #     chapters=chapters,
    #     language=book.language,
    #     storytelling_style=book.style,
    #     pacing=book.pacing,
    # )

    return {
        "message": "Audio book creation started successfully.",
        "code": 200,
        "data": {"book_id": book.id},
    }
