from typing import Annotated

from fastapi import APIRouter, Depends, Form, HTTPException

from db.database import get_db
from utils.schema.Ctx import Ctx
from utils.get_user import get_user
from common.chapter_separator.chapter_extractor import extract_chapters
from .service import create_audio_book as run_audio_book_creation
from .schemas import CreateAudioBookSchema
from .models.model import Book
from sqlalchemy.ext.asyncio import AsyncSession

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

    book = Book(
        name=form_data.file.filename,
        user_id=user.id,
        total_chapters=len(chapters),
    )
    db.add(book)
    # saving book to the database
    book = await db.commit()

    print(book)

    titles = [chapter["title"] for chapter in chapters]

    return {
        "message": "success",
    }
